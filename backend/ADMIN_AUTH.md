# Admin Authentication System

## Setup

1. Update your `.env` file with admin credentials:
```
ADMIN_EMAIL=admin@landapp.com
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_here
```

2. Push the database schema:
```bash
npm run db:push
```

3. Create the admin user:
```bash
npm run admin:create
```

## API Endpoints

### Login
```
POST /api/admin/auth/login
Content-Type: application/json

{
  "email": "admin@landapp.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "admin": {
      "id": "...",
      "email": "admin@landapp.com",
      "createdAt": "2026-04-12T12:00:00.000Z"
    }
  },
  "message": "Login successful"
}
```

### Get Current Admin
```
GET /api/admin/auth/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "id": "...",
    "email": "admin@landapp.com",
    "createdAt": "2026-04-12T12:00:00.000Z"
  },
  "message": ""
}
```

### Admin Stats (Protected)
```
GET /api/admin/stats
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "totalListings": 10,
    "views": 100,
    "whatsappClicks": 20,
    "shares": 5,
    "conversionRate": "20.0%",
    "recentInquiries": [...]
  },
  "message": ""
}
```

## Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire in 7 days
- All `/api/admin/*` routes protected by authentication middleware
- Token must include `type: 'admin'` claim
- Authorization header format: `Bearer <token>`

## File Structure

```
src/
├── controllers/
│   └── admin.controller.js      # Login and getMe handlers
├── services/
│   └── admin.service.js         # Business logic for admin auth
├── middleware/
│   └── auth.middleware.js       # JWT verification middleware
├── routes/
│   └── admin.routes.js          # Admin routes with auth endpoints
└── scripts/
    └── create-admin.js          # Script to create admin user
```
