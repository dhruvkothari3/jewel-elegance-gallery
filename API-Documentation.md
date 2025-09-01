# Jewel Elegance Gallery - Backend API Documentation

A secure, scalable backend for a jewelry showcase website built with Supabase (PostgreSQL) and Edge Functions.

## 🏗 Tech Stack

- **Backend**: Supabase Edge Functions (Deno/TypeScript)
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with JWT tokens
- **File Storage**: Supabase Storage
- **Authorization**: Role-based access control (Admin/Customer)

## 🔐 Authentication & Authorization

### Roles
- **Admin**: Full CRUD access to products, collections, and stores
- **Customer**: Read-only access to public data

### Authentication Flow
1. Users sign up/login via Supabase Auth
2. JWT tokens are issued for authenticated requests
3. Role-based access is enforced via RLS policies

## 📊 Database Schema

### Products
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  type product_type NOT NULL, -- ring, necklace, earring, bracelet, bangle
  material product_material NOT NULL, -- gold, diamond, platinum, rose-gold
  occasion product_occasion, -- bridal, festive, daily-wear, gift
  collection_id UUID REFERENCES collections(id),
  sku TEXT,
  sizes TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  most_loved BOOLEAN DEFAULT false,
  new_arrival BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_deleted BOOLEAN DEFAULT false
);
```

### Collections
```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  banner_image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);
```

### Stores
```sql
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name TEXT NOT NULL,
  city TEXT,
  address TEXT,
  phone TEXT,
  hours TEXT,
  map_link TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### User Roles
```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL, -- admin, customer
  UNIQUE (user_id, role)
);
```

## 🚀 API Endpoints

### Products API (`/functions/products`)

#### Public Endpoints
- `GET /products` - List products with filtering and pagination
- `GET /products/:slug` - Get single product by slug

#### Admin Only
- `POST /products` - Create new product
- `PUT /products/:slug` - Update product
- `DELETE /products/:slug` - Soft delete product

#### Query Parameters
```
?type=ring&material=gold&occasion=bridal
?search=diamond earrings
?featured=true&most_loved=true
?sort=created_at&order=desc
?page=1&limit=20
```

### Collections API (`/functions/collections`)

#### Public Endpoints
- `GET /collections` - List all collections
- `GET /collections/:handle` - Get collection with products

#### Admin Only
- `POST /collections` - Create collection
- `PUT /collections/:handle` - Update collection
- `DELETE /collections/:handle` - Delete collection

### Stores API (`/functions/stores`)

#### Public Endpoints
- `GET /stores` - List all stores
- `GET /stores?city=Mumbai` - Filter by city

#### Admin Only
- `POST /stores` - Create store
- `PUT /stores/:id` - Update store
- `DELETE /stores/:id` - Delete store

### File Upload API (`/functions/upload-image`)

#### Admin Only
- `POST /upload-image` - Upload product/collection images

## 🔒 Security Features

### Row Level Security (RLS)
- **Products**: Public can view non-deleted products; admins have full access
- **Collections**: Public read access; admin full control
- **Stores**: Public read access; admin full control
- **User Roles**: Users can view own roles; admins manage all roles

### Data Validation
- Stock cannot be negative (database trigger)
- Required field validation
- File type and size validation for uploads
- SQL injection protection via parameterized queries

### Authentication
- JWT token validation for protected endpoints
- Role-based authorization via security definer functions
- Secure session management via Supabase Auth

## 🛠 Development Setup

### Prerequisites
- Supabase project with Edge Functions enabled
- Supabase CLI installed locally

### Database Setup
The database schema is already deployed via migrations. To verify:

```bash
# Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('products', 'collections', 'stores', 'user_roles');
```

### Edge Functions
Functions are automatically deployed when files are saved in `/supabase/functions/`.

### Environment Variables
No additional environment variables needed - Supabase provides:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 📝 Example Requests

### Create Product (Admin)
```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/products' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Diamond Engagement Ring",
    "description": "Elegant solitaire diamond ring",
    "type": "ring",
    "material": "diamond",
    "occasion": "bridal",
    "stock": 5,
    "featured": true
  }'
```

### Get Products with Filters
```bash
curl 'https://your-project.supabase.co/functions/v1/products?type=ring&material=diamond&featured=true'
```

### Upload Image (Admin)
```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/upload-image' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -F 'file=@ring-image.jpg' \
  -F 'bucket=product-images'
```

## 🎯 Key Features

### Product Management
- ✅ CRUD operations with validation
- ✅ Auto-generated slugs for SEO
- ✅ Soft delete with audit trail
- ✅ Stock management with validation
- ✅ Image upload and management
- ✅ Advanced filtering and search
- ✅ Pagination and sorting

### Collection Management
- ✅ CRUD operations
- ✅ Auto-generated handles
- ✅ Product relationship management
- ✅ Banner image support

### Store Locator
- ✅ Store CRUD operations
- ✅ Geographic coordinates support
- ✅ City-based filtering
- ✅ Contact information management

### Security & Performance
- ✅ Role-based access control
- ✅ Row Level Security policies
- ✅ SQL injection protection
- ✅ File upload validation
- ✅ Optimized database indexes
- ✅ Full-text search capabilities

### API Quality
- ✅ RESTful design
- ✅ Comprehensive error handling
- ✅ CORS support
- ✅ Request validation
- ✅ Consistent response format
- ✅ Audit trails

## 🔗 Frontend Integration

The API is designed to work seamlessly with the React frontend:

```typescript
// Example: Fetch products with filters
const response = await fetch('/functions/v1/products?type=ring&featured=true');
const data = await response.json();

// Example: Create product (admin)
const response = await fetch('/functions/v1/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(productData)
});
```

## 📚 Next Steps

1. **Authentication Setup**: Implement login/signup flow in frontend
2. **Admin Dashboard**: Build admin interface for product management
3. **Image Management**: Integrate file upload in admin forms
4. **Search Enhancement**: Add advanced search with filters
5. **Performance**: Add caching for frequently accessed data
6. **Analytics**: Add usage tracking and analytics
7. **Testing**: Add comprehensive API testing suite

## 🎉 Ready to Use!

Your jewelry showcase backend is fully functional with:
- ✅ Secure database with proper indexing
- ✅ Role-based authentication and authorization  
- ✅ RESTful API endpoints for all operations
- ✅ File upload capabilities
- ✅ Advanced filtering and search
- ✅ Production-ready security policies

Start building your admin dashboard and integrate with the frontend!