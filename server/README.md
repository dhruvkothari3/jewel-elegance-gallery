# Jewel Elegance Gallery API

A Node.js + Express + MongoDB REST API for the Jewel Elegance Gallery (Tanishq-inspired) catalog. Provides endpoints for products, collections, and stores focused on browsing and discovery.

## Features
- Express REST API returning JSON
- MongoDB via Mongoose
- Input validation with express-validator
- CORS enabled for frontend access
- Seed script with example data

## Folder Structure
```
server/
  config/
    db.js
  controllers/
    collectionController.js
    productController.js
    storeController.js
  models/
    Collection.js
    Product.js
    Store.js
  routes/
    collectionRoutes.js
    productRoutes.js
    storeRoutes.js
  seed/
    data.js
    seed.js
  .env.example
  index.js
  package.json
```

## Getting Started
1. cd server
2. Copy .env example and edit if needed:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. (Optional) Seed the database with sample data:
   ```bash
   npm run seed
   ```
5. Start the API (dev):
   ```bash
   npm run dev
   ```
   or production:
   ```bash
   npm start
   ```

The API will run on http://localhost:${PORT:-4000}

## API Endpoints
- GET /api/products
- GET /api/products/:slug
- GET /api/products?type=ring&material=gold&occasion=bridal&collection=bridal-rivaah
- GET /api/collections
- GET /api/collections/:handle
- GET /api/stores
- GET /api/stores?city=Mumbai

## Notes
- Product schema supports fields: slug, name, description, images[], type, material, occasion, collection (ref), sku, sizes[], featured, mostLoved, newArrival.
- Collection schema: handle, title, intro, heroImage, tags[]
- Store schema: name, city, address, phone, hours, lat, lng

## Security
- Only GET endpoints are exposed (read-only). Add auth later if needed.

## License
MIT
