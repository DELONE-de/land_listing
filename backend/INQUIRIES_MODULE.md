# Inquiries Module

## Overview
Complete inquiry management system with spam protection, validation, and admin management features.

## Database Schema

### Inquiry Model
```prisma
model Inquiry {
  id        String        @id @default(cuid())
  listingId String
  listing   Listing       @relation(onDelete: Cascade)
  name      String
  phone     String
  message   String
  source    InquirySource @default(FORM)  // FORM | WHATSAPP
  status    InquiryStatus @default(NEW)   // NEW | READ | REPLIED
  notes     String?
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}
```

### Enums
- **InquirySource:** `FORM`, `WHATSAPP`
- **InquiryStatus:** `NEW`, `READ`, `REPLIED`

## API Endpoints

### Public Endpoint

#### Submit Inquiry
```
POST /api/inquiries
Content-Type: application/json

{
  "listingId": "listing-id",
  "name": "John Doe",
  "phone": "+2348012345678",
  "message": "I'm interested in this property...",
  "source": "FORM" // optional, defaults to FORM
}
```

**Rate Limit:** 3 requests per IP per 15 minutes

**Validation:**
- `listingId`: Required, must exist
- `name`: 2-100 characters
- `phone`: 10-20 characters
- `message`: 10-1000 characters
- `source`: Optional, FORM or WHATSAPP

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "inquiry-id",
    "listingId": "listing-id",
    "name": "John Doe",
    "phone": "+2348012345678",
    "message": "I'm interested in this property...",
    "source": "FORM",
    "status": "NEW",
    "notes": null,
    "createdAt": "2026-04-12T13:00:00.000Z",
    "updatedAt": "2026-04-12T13:00:00.000Z",
    "listing": {
      "id": "listing-id",
      "title": "Property Title",
      "slug": "property-title"
    }
  },
  "message": "Inquiry submitted successfully"
}
```

**Error Responses:**
```json
// Validation error
{
  "success": false,
  "message": "Validation error",
  "errors": [
    { "field": "name", "message": "Name must be at least 2 characters" }
  ]
}

// Listing not found
{
  "success": false,
  "message": "Listing not found"
}

// Rate limit exceeded
{
  "success": false,
  "message": "Too many inquiries submitted, please try again later"
}
```

### Admin Endpoints

All admin endpoints require authentication:
```
Authorization: Bearer <admin_token>
```

#### Get All Inquiries
```
GET /api/admin/inquiries

Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- status: NEW | READ | REPLIED
- listingId: string
```

**Response:**
```json
{
  "success": true,
  "data": {
    "inquiries": [
      {
        "id": "inquiry-id",
        "listingId": "listing-id",
        "name": "John Doe",
        "phone": "+2348012345678",
        "message": "I'm interested...",
        "source": "FORM",
        "status": "NEW",
        "notes": null,
        "createdAt": "2026-04-12T13:00:00.000Z",
        "updatedAt": "2026-04-12T13:00:00.000Z",
        "listing": {
          "id": "listing-id",
          "title": "Property Title",
          "slug": "property-title"
        }
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 20,
    "pages": 3
  },
  "message": ""
}
```

#### Get Single Inquiry
```
GET /api/admin/inquiries/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "inquiry-id",
    "listingId": "listing-id",
    "name": "John Doe",
    "phone": "+2348012345678",
    "message": "I'm interested in this property...",
    "source": "FORM",
    "status": "NEW",
    "notes": null,
    "createdAt": "2026-04-12T13:00:00.000Z",
    "updatedAt": "2026-04-12T13:00:00.000Z",
    "listing": {
      "id": "listing-id",
      "title": "Property Title",
      "slug": "property-title",
      "price": "15000000"
    }
  },
  "message": ""
}
```

#### Update Inquiry
```
PATCH /api/admin/inquiries/:id
Content-Type: application/json

{
  "status": "READ" | "REPLIED",
  "notes": "Called customer, scheduled viewing"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "inquiry-id",
    "status": "READ",
    "notes": "Called customer, scheduled viewing",
    "updatedAt": "2026-04-12T14:00:00.000Z",
    ...
  },
  "message": "Inquiry updated successfully"
}
```

## Frontend Integration

### Submit Inquiry Form
```javascript
const InquiryForm = ({ listingId }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          listingId,
          source: 'FORM'
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Inquiry submitted successfully!');
        setFormData({ name: '', phone: '', message: '' });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to submit inquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />
      <textarea
        placeholder="Your Message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Inquiry'}
      </button>
    </form>
  );
};
```

### Admin Inquiry List
```javascript
const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [filter, setFilter] = useState('NEW');

  useEffect(() => {
    const fetchInquiries = async () => {
      const response = await fetch(
        `/api/admin/inquiries?status=${filter}`,
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        }
      );
      const data = await response.json();
      setInquiries(data.data.inquiries);
    };

    fetchInquiries();
  }, [filter]);

  const updateStatus = async (id, status) => {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status })
    });
    // Refresh list
  };

  return (
    <div>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="NEW">New</option>
        <option value="READ">Read</option>
        <option value="REPLIED">Replied</option>
      </select>

      {inquiries.map(inquiry => (
        <div key={inquiry.id}>
          <h4>{inquiry.name}</h4>
          <p>{inquiry.phone}</p>
          <p>{inquiry.message}</p>
          <p>Listing: {inquiry.listing.title}</p>
          <button onClick={() => updateStatus(inquiry.id, 'READ')}>
            Mark as Read
          </button>
          <button onClick={() => updateStatus(inquiry.id, 'REPLIED')}>
            Mark as Replied
          </button>
        </div>
      ))}
    </div>
  );
};
```

## Rate Limiting

**Inquiry Submissions:**
- Window: 15 minutes
- Max: 3 requests per IP
- Purpose: Prevent spam and abuse

**Rate Limit Headers:**
```
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 1712933400
```

## Validation Rules

### Create Inquiry
- **listingId:** Required, must exist in database
- **name:** 2-100 characters
- **phone:** 10-20 characters
- **message:** 10-1000 characters
- **source:** Optional, must be FORM or WHATSAPP

### Update Inquiry (Admin)
- **status:** Optional, must be NEW, READ, or REPLIED
- **notes:** Optional, max 500 characters

## Status Workflow

```
NEW → READ → REPLIED
```

- **NEW:** Initial status when inquiry is submitted
- **READ:** Admin has viewed the inquiry
- **REPLIED:** Admin has responded to the inquiry

## Testing

### Test Public Submission
```bash
curl -X POST http://localhost:5000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "listingId": "LISTING_ID",
    "name": "John Doe",
    "phone": "+2348012345678",
    "message": "I am interested in this property. Can we schedule a viewing?"
  }'
```

### Test Admin List
```bash
curl http://localhost:5000/api/admin/inquiries \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Filter by status
curl "http://localhost:5000/api/admin/inquiries?status=NEW" \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Filter by listing
curl "http://localhost:5000/api/admin/inquiries?listingId=LISTING_ID" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Test Admin Update
```bash
curl -X PATCH http://localhost:5000/api/admin/inquiries/INQUIRY_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "status": "READ",
    "notes": "Called customer, scheduled viewing for tomorrow"
  }'
```

### Test Rate Limiting
```bash
# Submit 4 inquiries rapidly (4th should be rate limited)
for i in {1..4}; do
  curl -X POST http://localhost:5000/api/inquiries \
    -H "Content-Type: application/json" \
    -d '{
      "listingId": "LISTING_ID",
      "name": "Test User",
      "phone": "1234567890",
      "message": "Test message number '$i'"
    }'
  echo ""
done
```

## File Structure

```
src/
├── controllers/
│   └── inquiry.controller.js    # Request handlers
├── services/
│   └── inquiry.service.js       # Business logic
├── validation/
│   └── inquiry.validation.js    # Zod schemas
└── routes/
    ├── inquiry.routes.js        # Public routes
    └── admin.routes.js          # Admin routes
```

## Features

✓ **Spam Protection**
  - Rate limiting (3 per 15 min)
  - IP-based tracking
  - Validation on all fields

✓ **Status Management**
  - NEW → READ → REPLIED workflow
  - Admin notes support
  - Timestamps for tracking

✓ **Validation**
  - Zod schema validation
  - Listing existence check
  - Proper error messages

✓ **Admin Features**
  - List with filters
  - Status updates
  - Notes management
  - Pagination support

✓ **Data Integrity**
  - Cascade delete (inquiry deleted when listing deleted)
  - Indexed fields for performance
  - Timestamps for audit trail

## Best Practices

### Frontend
1. Show success message after submission
2. Clear form after successful submission
3. Handle rate limit errors gracefully
4. Validate phone format before submission

### Admin
1. Mark inquiries as READ when viewing
2. Add notes for follow-up tracking
3. Update to REPLIED after responding
4. Filter by status for workflow management

## Summary

**Endpoints:**
- POST /api/inquiries (public, rate limited)
- GET /api/admin/inquiries (admin)
- GET /api/admin/inquiries/:id (admin)
- PATCH /api/admin/inquiries/:id (admin)

**Features:**
✓ Rate limiting (3 per 15 min)
✓ Zod validation
✓ Status workflow (NEW → READ → REPLIED)
✓ Admin notes
✓ Source tracking (FORM | WHATSAPP)
✓ Pagination
✓ Filtering
✓ Cascade delete
