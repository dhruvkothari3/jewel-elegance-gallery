-- Fix: ensure pg_trgm extension exists before creating GIN trigram index
create extension if not exists pg_trgm with schema public;

-- Schema for Jewel Elegance Gallery on Supabase (Postgres)
-- 1) Enums
create type public.product_type as enum ('ring','necklace','earring','bracelet','bangle');
create type public.product_material as enum ('gold','diamond','platinum','rose-gold');
create type public.product_occasion as enum ('bridal','festive','daily-wear','gift');

-- 2) Roles enum and user_roles table
create type public.app_role as enum ('admin','customer');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- 3) Function to check roles (SECURITY DEFINER to avoid recursive RLS)
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = _user_id
      and ur.role = _role
  );
$$;

-- 4) Collections
create table public.collections (
  id uuid primary key default gen_random_uuid(),
  handle text not null unique,
  name text not null,
  description text,
  banner_image text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

alter table public.collections enable row level security;

-- 5) Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  images text[] not null default '{}',
  type public.product_type not null,
  material public.product_material not null,
  occasion public.product_occasion,
  collection_id uuid references public.collections(id) on delete set null,
  sku text,
  sizes text[] default '{}',
  stock integer not null default 0,
  featured boolean not null default false,
  most_loved boolean not null default false,
  new_arrival boolean not null default false,
  meta_title text,
  meta_description text,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_deleted boolean not null default false
);

alter table public.products enable row level security;

-- 6) Stores
create table public.stores (
  id uuid primary key default gen_random_uuid(),
  store_name text not null,
  city text,
  address text,
  phone text,
  hours text,
  map_link text,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

alter table public.stores enable row level security;

-- 7) Common timestamp trigger
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

create trigger trg_products_updated_at
before update on public.products
for each row execute function public.update_updated_at_column();

-- 8) Stock validation trigger (prevent stock < 0)
create or replace function public.validate_non_negative_stock()
returns trigger as $$
begin
  if new.stock < 0 then
    raise exception 'Stock cannot be negative';
  end if;
  return new;
end;
$$ language plpgsql set search_path = public;

create trigger trg_products_stock_check
before insert or update on public.products
for each row execute function public.validate_non_negative_stock();

-- 9) Indexes for filtering/sorting
create index idx_products_type on public.products(type);
create index idx_products_material on public.products(material);
create index idx_products_occasion on public.products(occasion);
create index idx_products_collection on public.products(collection_id);
create index idx_products_featured on public.products(featured);
create index idx_products_most_loved on public.products(most_loved);
create index idx_products_new_arrival on public.products(new_arrival);
create index idx_products_created_at on public.products(created_at desc);
create index idx_products_name_trgm on public.products using gin (name gin_trgm_ops);
create index idx_products_sku on public.products(sku);

-- 10) RLS Policies
-- user_roles
create policy "Users can view their own roles"
  on public.user_roles
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Admins can manage roles"
  on public.user_roles
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- collections
create policy "Collections are viewable by everyone"
  on public.collections
  for select
  to anon, authenticated
  using (true);

create policy "Admins can manage collections"
  on public.collections
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- products
create policy "Public can view non-deleted products"
  on public.products
  for select
  to anon, authenticated
  using (is_deleted = false);

create policy "Admins can view all products"
  on public.products
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can insert products"
  on public.products
  for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update products"
  on public.products
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- No delete policy for products to encourage soft delete; admins can update is_deleted

-- stores
create policy "Stores are viewable by everyone"
  on public.stores
  for select
  to anon, authenticated
  using (true);

create policy "Admins can manage stores"
  on public.stores
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 11) Storage buckets for images
insert into storage.buckets (id, name, public)
values ('product-images','product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('collection-banners','collection-banners', true)
on conflict (id) do nothing;

-- Storage policies: public read; admin write
create policy "Public can view product images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "Public can view collection banners"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'collection-banners');

create policy "Admins can manage product images"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage collection banners"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'collection-banners' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'collection-banners' and public.has_role(auth.uid(), 'admin'));
