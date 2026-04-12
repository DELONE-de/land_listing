# Quick API Testing Guide

## Setup

1. **Push database schema:**
```bash
npm run db:push
```

2. **Generate Prisma client:**
```bash
npm run db:generate
```

3. **Create admin user:**
```bash
npm run admin:create
```

4. **Seed sample listings (optional):**
```bash
npm run seed:listings
```

5. **Start server:**
```bash
npm run dev
```

## Test Endpoints

### 1. Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@landapp.com",
    "password": "admin123"
  }'
```

Save the token from response for next requests.

### 2. Create Listing (Admin)
```bash
curl -X POST http://localhost:5000/api/admin/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Beautiful Residential Land",
    "description": "Prime location with excellent amenities",
    "price": 15000000,
    "size": 500,
    "landType": "RESIDENTIAL",
    "address": "123 Estate Road",
    "state": "Lagos",
    "city": "Lekki",
    "lat": 6.4474,
    "lng": 3.5406,
    "amenities": ["Security", "Electricity", "Water"],
    "titleDocuments": ["C of O", "Survey Plan"],
    "photos": [
      {"url": "https://example.com/photo.jpg", "publicId": "photo1", "order": 0}
    ]
  }'
```

### 3. Get All Listings (Public)
```bash
# Basic
curl http://localhost:5000/api/listings

# With filters
curl "http://localhost:5000/api/listings?minPrice=5000000&maxPrice=30000000&landType=RESIDENTIAL&state=Lagos&page=1&limit=10&sortBy=price&sortOrder=asc"
```

### 4. Get Listing by ID (Public)
```bash
curl http://localhost:5000/api/listings/LISTING_ID_HERE
```

### 5. Get Listing by Slug (Public)
```bash
curl http://localhost:5000/api/listings/slug/beautiful-residential-land
```

### 6. Update Listing (Admin)
```bash
curl -X PATCH http://localhost:5000/api/admin/listings/LISTING_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "price": 18000000,
    "status": "UNDER_OFFER"
  }'
```

### 7. Track Click (Public)
```bash
curl -X POST http://localhost:5000/api/listings/LISTING_ID_HERE/track-click \
  -H "Content-Type: application/json" \
  -d '{"type": "whatsapp"}'
```

### 8. Delete Listing (Admin)
```bash
curl -X DELETE http://localhost:5000/api/admin/listings/LISTING_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 9. Get Admin Stats
```bash
curl http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Filter Examples

### By Price Range
```bash
curl "http://localhost:5000/api/listings?minPrice=10000000&maxPrice=50000000"
```

### By Land Type
```bash
curl "http://localhost:5000/api/listings?landType=COMMERCIAL"
```

### By Location
```bash
curl "http://localhost:5000/api/listings?state=Lagos&city=Lekki"
```

### By Status
```bash
curl "http://localhost:5000/api/listings?status=AVAILABLE"
```

### Combined Filters with Sorting
```bash
curl "http://localhost:5000/api/listings?landType=RESIDENTIAL&state=Lagos&minPrice=5000000&maxPrice=20000000&sortBy=price&sortOrder=asc&page=1&limit=5"
```

## Expected Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "price",
      "message": "Expected number, received string"
    }
  ]
}
```

## Testing Checklist

- [ ] Admin login works
- [ ] Create listing with valid data
- [ ] Create listing with invalid data (should fail validation)
- [ ] Get all listings
- [ ] Get listings with filters
- [ ] Get listing by ID (view count increments)
- [ ] Get listing by slug (view count increments)
- [ ] Update listing
- [ ] Track clicks (whatsapp, share, favorite)
- [ ] Delete listing
- [ ] Pagination works
- [ ] Sorting works
- [ ] Slug auto-generation works
- [ ] Duplicate slug handling works
