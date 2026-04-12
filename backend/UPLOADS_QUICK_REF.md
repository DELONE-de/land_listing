# Uploads Module - Quick Reference

## Endpoint
```
GET /api/admin/upload-signature
Authorization: Bearer <admin_token>
```

## Response
```json
{
  "success": true,
  "data": {
    "timestamp": 1712932382,
    "signature": "a1b2c3d4e5f6...",
    "api_key": "123456789012345",
    "cloud_name": "your-cloud-name",
    "folder": "landapp/listings"
  }
}
```

## Frontend Upload (Minimal)
```javascript
// 1. Get signature
const { data } = await fetch('/api/admin/upload-signature', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// 2. Upload to Cloudinary
const formData = new FormData();
formData.append('file', file);
formData.append('timestamp', data.timestamp);
formData.append('signature', data.signature);
formData.append('api_key', data.api_key);
formData.append('folder', data.folder);

const result = await fetch(
  `https://api.cloudinary.com/v1_1/${data.cloud_name}/image/upload`,
  { method: 'POST', body: formData }
).then(r => r.json());

// 3. Save to listing
const photo = {
  url: result.secure_url,
  publicId: result.public_id,
  order: 0
};
```

## Testing
```bash
# Get admin token first
TOKEN=$(curl -s -X POST http://localhost:5000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@landapp.com","password":"admin123"}' \
  | jq -r '.data.token')

# Get upload signature
curl http://localhost:5000/api/admin/upload-signature \
  -H "Authorization: Bearer $TOKEN"

# Or use test script
./test-upload.sh $TOKEN

# Or open test-upload.html in browser
```

## Files
- `src/controllers/upload.controller.js` - Controller
- `src/routes/admin.routes.js` - Route
- `UPLOADS_MODULE.md` - Full documentation
- `test-upload.html` - Interactive test
- `test-upload.sh` - CLI test
