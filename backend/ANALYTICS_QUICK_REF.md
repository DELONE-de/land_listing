# Analytics Tracking - Quick Reference

## Endpoints

### Track View
```bash
POST /api/listings/:id/view
```
Rate limit: 10/min per IP

### Track Click
```bash
POST /api/listings/:id/track-click
Content-Type: application/json

{ "type": "whatsapp" | "share" | "favorite" }
```
Rate limit: 20/min per IP

## Frontend Integration

### Track View (on page load)
```javascript
useEffect(() => {
  fetch(`/api/listings/${id}/view`, { method: 'POST' });
}, [id]);
```

### Track Clicks
```javascript
// WhatsApp
fetch(`/api/listings/${id}/track-click`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'whatsapp' })
});

// Share
fetch(`/api/listings/${id}/track-click`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'share' })
});

// Favorite
fetch(`/api/listings/${id}/track-click`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'favorite' })
});
```

## Testing
```bash
# Test view tracking
curl -X POST http://localhost:5000/api/listings/LISTING_ID/view

# Test click tracking
curl -X POST http://localhost:5000/api/listings/LISTING_ID/track-click \
  -H "Content-Type: application/json" \
  -d '{"type": "whatsapp"}'

# Run automated tests
./test-analytics.sh LISTING_ID
```

## Features
- ✓ Atomic updates (no race conditions)
- ✓ Rate limiting (prevent abuse)
- ✓ Validation (proper error handling)
- ✓ Fast (~10-20ms per request)

## Files
- `src/services/listing.service.js` - Service logic
- `src/controllers/listing.controller.js` - Controllers
- `src/middleware/analytics.middleware.js` - Rate limiters
- `ANALYTICS_TRACKING.md` - Full documentation
