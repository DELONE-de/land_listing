# Geospatial Search Extension

## Overview
Extended listings search with geospatial queries using the Haversine formula to find listings within a specified radius.

## Endpoint

```
GET /api/listings?lat=<latitude>&lng=<longitude>&radius=<meters>
```

## Parameters

### Geospatial Parameters
- **lat** (required for geo search): Latitude (-90 to 90)
- **lng** (required for geo search): Longitude (-180 to 180)
- **radius** (required for geo search): Search radius in meters

### Combined Filters
All standard filters work with geospatial search:
- **minPrice**: Minimum price
- **maxPrice**: Maximum price
- **landType**: RESIDENTIAL | COMMERCIAL | AGRICULTURAL | INDUSTRIAL | MIXED_USE
- **status**: AVAILABLE | SOLD | UNDER_OFFER
- **page**: Page number (default: 1)
- **limit**: Results per page (default: 20)

## Examples

### Basic Geospatial Search
```bash
# Find listings within 5km (5000m) of Lagos
curl "http://localhost:5000/api/listings?lat=6.5244&lng=3.3792&radius=5000"
```

### Geospatial + Price Filter
```bash
curl "http://localhost:5000/api/listings?lat=6.5244&lng=3.3792&radius=10000&minPrice=5000000&maxPrice=20000000"
```

### Geospatial + Land Type
```bash
curl "http://localhost:5000/api/listings?lat=6.5244&lng=3.3792&radius=3000&landType=RESIDENTIAL"
```

## Response Format

```json
{
  "success": true,
  "data": {
    "listings": [
      {
        "id": "listing-1",
        "title": "Prime Commercial Land",
        "price": "25000000",
        "lat": 6.4474,
        "lng": 3.5406,
        "distance": 2341.5,
        ...
      }
    ],
    "total": 12,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

**Note:** `distance` field (in meters) is included when using geospatial search.

## Frontend Integration

```javascript
const MapSearch = () => {
  const [center, setCenter] = useState({ lat: 6.5244, lng: 3.3792 });
  const [radius, setRadius] = useState(5000);
  const [listings, setListings] = useState([]);

  const searchNearby = async () => {
    const response = await fetch(
      `/api/listings?lat=${center.lat}&lng=${center.lng}&radius=${radius}`
    );
    const data = await response.json();
    setListings(data.data.listings);
  };

  return (
    <div>
      <input
        type="number"
        value={radius}
        onChange={(e) => setRadius(e.target.value)}
        placeholder="Radius (meters)"
      />
      <button onClick={searchNearby}>Search Nearby</button>
      
      {listings.map(listing => (
        <div key={listing.id}>
          <h3>{listing.title}</h3>
          <p>Distance: {(listing.distance / 1000).toFixed(2)} km</p>
        </div>
      ))}
    </div>
  );
};
```

## Distance Calculation

Uses **Haversine formula** for accurate great-circle distance:

```javascript
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};
```

## Common Radius Values

| Radius | Meters | Use Case |
|--------|--------|----------|
| 1 km | 1000 | Immediate neighborhood |
| 3 km | 3000 | Walking distance |
| 5 km | 5000 | Short drive |
| 10 km | 10000 | City area |
| 20 km | 20000 | Metropolitan area |

## Features

✓ Accurate distance calculation (Haversine formula)
✓ Combines with price/type filters
✓ Results sorted by distance (nearest first)
✓ Distance included in response (meters)
✓ Pagination support
✓ Works with existing PostgreSQL setup
