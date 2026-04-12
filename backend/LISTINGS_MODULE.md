# Listings Module Documentation

## Overview
Complete listings management system with admin and public endpoints, filtering, pagination, sorting, and click tracking.

## Database Schema

### Listing Model
```prisma
model Listing {
  id              String        @id @default(cuid())
  title           String
  slug            String        @unique (auto-generated)
  description     String
  price           Decimal
  size            Float
  landType        LandType      (RESIDENTIAL, COMMERCIAL, AGRICULTURAL, INDUSTRIAL, MIXED_USE)
  status          ListingStatus (AVAILABLE, SOLD, UNDER_OFFER)
  
  // Location
  address         String
  state           String
  city            String
  lat             Float?
  lng             Float?
  
  // Details
  amenities       String[]
  titleDocuments  String[]
  photos          Json[]        [{ url, publicId, order }]
  
  // Analytics
  views           Int           @default(0)
  whatsappClicks  Int           @default(0)
  shareClicks     Int           @default(0)
  favoriteClicks  Int           @default(0)
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

## API Endpoints

### Public Endpoints

#### Get All Listings
```
GET /api/listings

Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- minPrice: number
- maxPrice: number
- landType: RESIDENTIAL | COMMERCIAL | AGRICULTURAL | INDUSTRIAL | MIXED_USE
- status: AVAILABLE | SOLD | UNDER_OFFER
- state: string
- city: string
- sortBy: price | createdAt | views (default: createdAt)
- sortOrder: asc | desc (default: desc)

Response:
{
  "success": true,
  "data": {
    "listings": [...],
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  },
  "message": ""
}
```

#### Get Listing by ID
```
GET /api/listings/:id

Response:
{
  "success": true,
  "data": {
    "id": "...",
    "title": "Prime Commercial Land",
    "slug": "prime-commercial-land",
    "description": "...",
    "price": "5000000",
    "size": 1000,
    "landType": "COMMERCIAL",
    "status": "AVAILABLE",
    "address": "123 Main St",
    "state": "Lagos",
    "city": "Ikeja",
    "lat": 6.5244,
    "lng": 3.3792,
    "amenities": ["Water", "Electricity"],
    "titleDocuments": ["C of O", "Survey Plan"],
    "photos": [
      { "url": "https://...", "publicId": "...", "order": 0 }
    ],
    "views": 150,
    "whatsappClicks": 20,
    "shareClicks": 5,
    "favoriteClicks": 10,
    "createdAt": "2026-04-12T12:00:00.000Z",
    "updatedAt": "2026-04-12T12:00:00.000Z"
  },
  "message": ""
}

Note: Automatically increments view count
```

#### Get Listing by Slug
```
GET /api/listings/slug/:slug

Response: Same as Get by ID
Note: Automatically increments view count
```

#### Track Click
```
POST /api/listings/:id/track-click
Content-Type: application/json

{
  "type": "whatsapp" | "share" | "favorite"
}

Response:
{
  "success": true,
  "data": null,
  "message": "Click tracked"
}
```

### Admin Endpoints (Protected)

All admin endpoints require authentication:
```
Authorization: Bearer <admin_jwt_token>
```

#### Create Listing
```
POST /api/admin/listings
Content-Type: application/json

{
  "title": "Prime Commercial Land",
  "description": "Beautiful land in prime location",
  "price": 5000000,
  "size": 1000,
  "landType": "COMMERCIAL",
  "status": "AVAILABLE",
  "address": "123 Main St",
  "state": "Lagos",
  "city": "Ikeja",
  "lat": 6.5244,
  "lng": 3.3792,
  "amenities": ["Water", "Electricity"],
  "titleDocuments": ["C of O", "Survey Plan"],
  "photos": [
    { "url": "https://...", "publicId": "...", "order": 0 }
  ]
}

Response:
{
  "success": true,
  "data": { ... },
  "message": "Listing created successfully"
}

Note: Slug is auto-generated from title
```

#### Get All Listings (Admin)
```
GET /api/admin/listings

Query Parameters: Same as public endpoint

Response: Same as public endpoint
```

#### Update Listing
```
PATCH /api/admin/listings/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 6000000,
  "status": "SOLD"
}

Response:
{
  "success": true,
  "data": { ... },
  "message": "Listing updated successfully"
}

Note: If title changes, slug is auto-regenerated
```

#### Delete Listing
```
DELETE /api/admin/listings/:id

Response:
{
  "success": true,
  "data": null,
  "message": "Listing deleted successfully"
}
```

## Validation

All create/update requests are validated using Zod schemas:

### Create Listing Validation
- title: 3-200 characters (required)
- description: min 10 characters (required)
- price: positive number (required)
- size: positive number (required)
- landType: enum (required)
- status: enum (optional, default: AVAILABLE)
- address: min 5 characters (required)
- state: min 2 characters (required)
- city: min 2 characters (required)
- lat: -90 to 90 (optional)
- lng: -180 to 180 (optional)
- amenities: array of strings (optional)
- titleDocuments: array of strings (optional)
- photos: array of { url, publicId, order } (optional)

### Update Listing Validation
All fields are optional

### Query Validation
- page: numeric string
- limit: numeric string
- minPrice/maxPrice: numeric string
- landType: enum
- status: enum
- sortBy: price | createdAt | views
- sortOrder: asc | desc

## Features

### Auto-Generated Slug
- Slugs are automatically generated from titles
- Duplicate slugs are handled with numeric suffixes
- Slugs are regenerated when title changes

### Filtering
- Price range (minPrice, maxPrice)
- Land type
- Status
- Location (state, city)

### Pagination
- Default: 20 items per page
- Customizable via limit parameter
- Returns total count and page count

### Sorting
- Sort by: price, createdAt, views
- Sort order: ascending or descending

### Analytics Tracking
- View count (auto-incremented on GET)
- WhatsApp clicks
- Share clicks
- Favorite clicks

### Location Support
- Latitude/longitude coordinates
- Address, state, city fields
- Indexed for efficient queries

## File Structure

```
src/
├── controllers/
│   └── listing.controller.js    # Request handlers
├── services/
│   └── listing.service.js       # Business logic
├── routes/
│   ├── listing.routes.js        # Public routes
│   └── admin.routes.js          # Admin routes (includes listings)
├── validation/
│   └── listing.validation.js    # Zod schemas
└── middleware/
    └── errorHandler.js          # Handles Zod validation errors
```

## Setup

1. Update database schema:
```bash
npm run db:push
```

2. Generate Prisma client:
```bash
npm run db:generate
```

## Example Usage

### Create a Listing
```javascript
const response = await fetch('http://localhost:5000/api/admin/listings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
  },
  body: JSON.stringify({
    title: 'Luxury Residential Plot',
    description: 'Prime residential land in gated estate',
    price: 15000000,
    size: 500,
    landType: 'RESIDENTIAL',
    address: '45 Estate Road',
    state: 'Lagos',
    city: 'Lekki',
    lat: 6.4474,
    lng: 3.5406,
    amenities: ['24/7 Security', 'Good Road Network', 'Electricity'],
    titleDocuments: ['C of O', 'Survey Plan', 'Deed of Assignment'],
    photos: [
      { url: 'https://cloudinary.com/image1.jpg', publicId: 'img1', order: 0 },
      { url: 'https://cloudinary.com/image2.jpg', publicId: 'img2', order: 1 }
    ]
  })
});
```

### Filter Listings
```javascript
const response = await fetch(
  'http://localhost:5000/api/listings?' +
  'minPrice=1000000&maxPrice=10000000&' +
  'landType=RESIDENTIAL&' +
  'state=Lagos&' +
  'sortBy=price&sortOrder=asc&' +
  'page=1&limit=10'
);
```

### Track Click
```javascript
await fetch('http://localhost:5000/api/listings/listing-id/track-click', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'whatsapp' })
});
```
