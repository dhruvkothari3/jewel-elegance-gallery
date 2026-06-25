# Elegance Jewelry

A premium jewelry showcase platform with a customer-facing storefront and an admin dashboard for managing products, collections, stores, and stock. Built with React + Vite + Tailwind, backed by Supabase, and wrapped with Capacitor for Android.

## ✨ Features

### Customer
- Browse curated **collections** and **products** (static samples + live data from Supabase)
- Product detail pages with image galleries
- **Wishlist** (signed-in users)
- **Store locator** with maps, hours, phone, and directions
- **WhatsApp inquiry** button on every product (auto-fills name, description, image)
- **Schedule a viewing** form synced to Supabase
- Account / login / signup
- Fully responsive — works on desktop, Android, and iOS

### Admin (`/admin`, role-gated)
- Full **CRUD** for products, collections, and stores
- **Image uploads** to Supabase Storage (public URLs only stored in DB)
- **Stock management** with low-stock alerts
- **Bulk upload** of products via CSV/XLSX with filename-based image matching
- Dashboard with live stats

## 🧱 Tech Stack

- **Frontend:** React 18, Vite 5, TypeScript, Tailwind CSS, shadcn/ui, React Router
- **State:** TanStack Query, React Context
- **Backend:** Supabase (Postgres, Auth, Storage, Edge Functions)
- **Mobile:** Capacitor (Android)
- **Deploy:** GitHub Pages (via GitHub Actions) or Lovable

## 🚀 Getting Started

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env   # then fill in the values below

# 3. Run
npm run dev            # http://localhost:8080
```

### Required environment variables

```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-public-key>
VITE_SUPABASE_PROJECT_ID=<project-ref>
```

> The anon key is safe to ship to the browser. **Never** put `service_role` keys in `.env` or any frontend code.

## 📜 Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite dev server on port 8080 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

For Android, add the helper script to your local `package.json` and run:

```json
"build:mobile": "vite build && npx cap sync android"
```

Then: `npm run build:mobile` → open `android/` in Android Studio.

## 🌐 Deploying to GitHub Pages

This repo includes a ready-to-go workflow at `.github/workflows/deploy.yml`.

1. **Push** the repo to GitHub.
2. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually) — the action builds with the correct `base` path (`/<repo-name>/`) and publishes `dist/` to Pages.
4. The included `public/404.html` + redirect snippet in `index.html` make client-side routing (deep links, refresh) work on GitHub Pages.

Your site goes live at `https://<your-user>.github.io/<repo-name>/`.

> ⚠️ Capacitor / Android builds are **not** affected — they use the default `/` base.

## 🗄️ Supabase Setup

Tables used: `products`, `collections`, `stores`, `wishlists`, `viewing_requests`, `user_roles`.

Storage buckets: `product-images`, `collection-banners` (both public).

Edge function: `upload-image` — accepts a signed-in user's JWT, validates the file (JPEG/PNG/WebP, ≤ 5 MB), uploads to the requested bucket, and returns the public URL.

### Making yourself an admin

```sql
insert into public.user_roles (user_id, role)
values ('<your-auth-user-id>', 'admin');
```

After that, signing in unlocks `/admin`.

## 📁 Project Layout

```
src/
├── components/        UI + admin components (shadcn/ui based)
├── contexts/          AuthContext, JewelryContext
├── hooks/             useProducts, useCollections, useStores, useWishlist, ...
├── integrations/
│   └── supabase/      Generated client + types
├── lib/               whatsapp helpers, upload helper, utils
├── pages/             Route components
└── main.tsx
supabase/
└── functions/         Edge functions (upload-image, products, collections, stores)
android/               Capacitor Android project
```

## 🤝 Contributing

PRs welcome. Please run `npm run lint` before pushing.

## 📄 License

MIT
