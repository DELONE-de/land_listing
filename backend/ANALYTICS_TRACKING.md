# Analytics Tracking Module

## Overview
Atomic analytics tracking with rate limiting to prevent abuse. Separate endpoints for views and clicks with IP-based rate limiting.

## Endpoints

### 1. Track View
```
POST /api/listings/:id/view
```

**Purpose:** Track when a user views a listing detail page

**Rate Limit:** 10 requests per IP per minute

**Request:**
```bash
curl -X POST http://localhost:5000/api/listings/listing-id/view
```

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "View tracked"
}
```

**Error Responses:**
```json
// Listing not found
{
  "success": false,
  "message": "Listing not found"
}

// Rate limit exceeded
{
  "success": false,
  "message": "Too many view requests, please try again later"
}
```

### 2. Track Click
```
POST /api/listings/:id/track-click
Content-Type: application/json

{
  "type": "whatsapp" | "share" | "favorite"
}
```

**Purpose:** Track user interactions (WhatsApp clicks, shares, favorites)

**Rate Limit:** 20 requests per IP per minute

**Request:**
```bash
curl -X POST http://localhost:5000/api/listings/listing-id/track-click \
  -H "Content-Type: application/json" \
  -d '{"type": "whatsapp"}'
```

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Click tracked"
}
```

**Error Responses:**
```json
// Invalid type
{
  "success": false,
  "message": "Invalid click type"
}

// Missing type
{
  "success": false,
  "message": "Click type is required"
}

// Rate limit exceeded
{
  "success": false,
  "message": "Too many click requests, please try again later"
}
```

## Click Types

| Type | Field Updated | Use Case |
|------|---------------|----------|
| `whatsapp` | `whatsappClicks` | User clicks WhatsApp contact button |
| `share` | `shareClicks` | User shares listing |
| `favorite` | `favoriteClicks` | User favorites/saves listing |

## Database Updates

All updates are **atomic** using Prisma's `increment` operation:

```javascript
// Atomic increment - safe for concurrent requests
await prisma.listing.update({
  where: { id },
  data: { views: { increment: 1 } }
});
```

**Benefits:**
- No race conditions
- Accurate counts even with concurrent requests
- Database-level operation (fast)

## Rate Limiting

### View Tracking
- **Window:** 60 seconds
- **Max Requests:** 10 per IP
- **Purpose:** Prevent view count inflation

### Click Tracking
- **Window:** 60 seconds
- **Max Requests:** 20 per IP
- **Purpose:** Prevent click count manipulation

### Rate Limit Headers
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1712932442
```

## Frontend Integration

### Track View on Page Load
```javascript
useEffect(() => {
  const trackView = async () => {
    try {
      await fetch(`/api/listings/${listingId}/view`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to track view:', error);
    }
  };

  trackView();
}, [listingId]);
```

### Track WhatsApp Click
```javascript
const handleWhatsAppClick = async () => {
  // Track click
  fetch(`/api/listings/${listingId}/track-click`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'whatsapp' })
  }).catch(console.error);

  // Open WhatsApp
  window.open(`https://wa.me/${phoneNumber}`, '_blank');
};
```

### Track Share
```javascript
const handleShare = async () => {
  // Track click
  fetch(`/api/listings/${listingId}/track-click`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'share' })
  }).catch(console.error);

  // Share logic
  if (navigator.share) {
    await navigator.share({
      title: listing.title,
      url: window.location.href
    });
  }
};
```

### Track Favorite
```javascript
const handleFavorite = async () => {
  // Track click
  fetch(`/api/listings/${listingId}/track-click`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'favorite' })
  }).catch(console.error);

  // Update favorite state
  setIsFavorite(!isFavorite);
};
```

## React Hook Example

```javascript
const useAnalytics = (listingId) => {
  const trackView = useCallback(async () => {
    try {
      await fetch(`/api/listings/${listingId}/view`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to track view:', error);
    }
  }, [listingId]);

  const trackClick = useCallback(async (type) => {
    try {
      await fetch(`/api/listings/${listingId}/track-click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  }, [listingId]);

  return { trackView, trackClick };
};

// Usage
const ListingDetail = ({ listing }) => {
  const { trackView, trackClick } = useAnalytics(listing.id);

  useEffect(() => {
    trackView();
  }, [trackView]);

  return (
    <div>
      <button onClick={() => trackClick('whatsapp')}>
        Contact via WhatsApp
      </button>
      <button onClick={() => trackClick('share')}>
        Share
      </button>
      <button onClick={() => trackClick('favorite')}>
        Favorite
      </button>
    </div>
  );
};
```

## Best Practices

### 1. Silent Failures
Don't block user actions if tracking fails:
```javascript
// Good - fire and forget
fetch('/api/listings/123/track-click', {
  method: 'POST',
  body: JSON.stringify({ type: 'whatsapp' })
}).catch(console.error);

// Then proceed with action
window.open(whatsappUrl);
```

### 2. Debounce Rapid Clicks
```javascript
const debouncedTrack = debounce((type) => {
  fetch(`/api/listings/${id}/track-click`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type })
  });
}, 1000);
```

### 3. Track Once Per Session
```javascript
const trackedViews = new Set();

const trackViewOnce = (listingId) => {
  if (trackedViews.has(listingId)) return;
  
  fetch(`/api/listings/${listingId}/view`, {
    method: 'POST'
  }).then(() => trackedViews.add(listingId));
};
```

## Admin Analytics Dashboard

### Get Listing Stats
```javascript
const ListingStats = ({ listing }) => {
  const conversionRate = listing.views > 0 
    ? ((listing.whatsappClicks / listing.views) * 100).toFixed(1)
    : 0;

  return (
    <div>
      <h3>Analytics</h3>
      <p>Views: {listing.views}</p>
      <p>WhatsApp Clicks: {listing.whatsappClicks}</p>
      <p>Shares: {listing.shareClicks}</p>
      <p>Favorites: {listing.favoriteClicks}</p>
      <p>Conversion Rate: {conversionRate}%</p>
    </div>
  );
};
```

### Top Performing Listings
```bash
# Get listings sorted by views
curl "http://localhost:5000/api/admin/listings?sortBy=views&sortOrder=desc&limit=10" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## Security Considerations

### Rate Limiting
- Prevents automated bots from inflating counts
- IP-based tracking (consider proxy/VPN users)
- Adjust limits based on traffic patterns

### Validation
- Click type is validated (whatsapp, share, favorite only)
- Listing existence is verified before tracking
- Invalid requests return 400 errors

### Atomic Operations
- Uses database-level increment
- No race conditions
- Accurate counts under high concurrency

## Performance

### Database Impact
- Single UPDATE query per tracking request
- Indexed ID field (fast lookup)
- No SELECT needed (increment is atomic)

### Response Time
- ~10-20ms per tracking request
- Non-blocking for user actions
- Can be made async/background job if needed

## Testing

### Test View Tracking
```bash
# Track a view
curl -X POST http://localhost:5000/api/listings/LISTING_ID/view

# Verify count increased
curl http://localhost:5000/api/listings/LISTING_ID | jq '.data.views'
```

### Test Click Tracking
```bash
# Track WhatsApp click
curl -X POST http://localhost:5000/api/listings/LISTING_ID/track-click \
  -H "Content-Type: application/json" \
  -d '{"type": "whatsapp"}'

# Track share
curl -X POST http://localhost:5000/api/listings/LISTING_ID/track-click \
  -H "Content-Type: application/json" \
  -d '{"type": "share"}'

# Verify counts
curl http://localhost:5000/api/listings/LISTING_ID | \
  jq '{whatsapp: .data.whatsappClicks, share: .data.shareClicks}'
```

### Test Rate Limiting
```bash
# Send 11 requests rapidly (should hit rate limit)
for i in {1..11}; do
  curl -X POST http://localhost:5000/api/listings/LISTING_ID/view
  echo ""
done
```

### Test Invalid Type
```bash
curl -X POST http://localhost:5000/api/listings/LISTING_ID/track-click \
  -H "Content-Type: application/json" \
  -d '{"type": "invalid"}'
```

## File Structure

```
src/
├── controllers/
│   └── listing.controller.js
│       • trackView() - View tracking handler
│       • trackClick() - Click tracking handler
│
├── services/
│   └── listing.service.js
│       • trackView() - Atomic view increment
│       • trackClick() - Atomic click increment
│
├── middleware/
│   └── analytics.middleware.js
│       • viewRateLimiter - 10 req/min per IP
│       • clickRateLimiter - 20 req/min per IP
│
└── routes/
    └── listing.routes.js
        • POST /api/listings/:id/view
        • POST /api/listings/:id/track-click
```

## Summary

**Features:**
✓ Atomic database updates (no race conditions)
✓ IP-based rate limiting (prevent abuse)
✓ Separate view and click tracking
✓ Multiple click types (whatsapp, share, favorite)
✓ Validation and error handling
✓ Fast performance (~10-20ms)

**Rate Limits:**
✓ Views: 10 per IP per minute
✓ Clicks: 20 per IP per minute

**Click Types:**
✓ whatsapp - Contact button clicks
✓ share - Share button clicks
✓ favorite - Favorite/save clicks
