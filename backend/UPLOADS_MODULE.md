# Uploads Module Documentation

## Overview
Direct-to-Cloudinary upload system with signed upload parameters. Frontend uploads directly to Cloudinary, backend only stores URLs.

## Architecture

```
Frontend → Get Signature → Backend
         ↓
Frontend → Upload Image → Cloudinary
         ↓
Frontend → Save URLs → Backend (Listing)
```

## Backend Endpoint

### Get Upload Signature
```
GET /api/admin/upload-signature
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "data": {
    "timestamp": 1712932382,
    "signature": "a1b2c3d4e5f6...",
    "api_key": "123456789012345",
    "cloud_name": "your-cloud-name",
    "folder": "landapp/listings"
  },
  "message": ""
}
```

## Frontend Implementation

### 1. Get Upload Signature
```javascript
const getUploadSignature = async () => {
  const response = await fetch('http://localhost:5000/api/admin/upload-signature', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return response.json();
};
```

### 2. Upload to Cloudinary
```javascript
const uploadImage = async (file) => {
  // Get signature from backend
  const { data } = await getUploadSignature();
  
  // Prepare form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('timestamp', data.timestamp);
  formData.append('signature', data.signature);
  formData.append('api_key', data.api_key);
  formData.append('folder', data.folder);
  
  // Upload directly to Cloudinary
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${data.cloud_name}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  );
  
  const result = await response.json();
  
  return {
    url: result.secure_url,
    publicId: result.public_id,
    order: 0 // Set order as needed
  };
};
```

### 3. Create Listing with Photos
```javascript
const createListing = async (listingData, imageFiles) => {
  // Upload all images
  const photos = await Promise.all(
    imageFiles.map((file, index) => 
      uploadImage(file).then(photo => ({ ...photo, order: index }))
    )
  );
  
  // Create listing with photo URLs
  const response = await fetch('http://localhost:5000/api/admin/listings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      ...listingData,
      photos
    })
  });
  
  return response.json();
};
```

### 4. Update Listing Photos
```javascript
const updateListingPhotos = async (listingId, newImageFiles, existingPhotos = []) => {
  // Upload new images
  const newPhotos = await Promise.all(
    newImageFiles.map((file, index) => 
      uploadImage(file).then(photo => ({ 
        ...photo, 
        order: existingPhotos.length + index 
      }))
    )
  );
  
  // Combine existing and new photos
  const allPhotos = [...existingPhotos, ...newPhotos];
  
  // Update listing
  const response = await fetch(`http://localhost:5000/api/admin/listings/${listingId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({ photos: allPhotos })
  });
  
  return response.json();
};
```

## React Example (with useState)

```javascript
import { useState } from 'react';

function ListingForm() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    
    try {
      const uploadedPhotos = await Promise.all(
        files.map(async (file, index) => {
          const { data } = await getUploadSignature();
          
          const formData = new FormData();
          formData.append('file', file);
          formData.append('timestamp', data.timestamp);
          formData.append('signature', data.signature);
          formData.append('api_key', data.api_key);
          formData.append('folder', data.folder);
          
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${data.cloud_name}/image/upload`,
            { method: 'POST', body: formData }
          );
          
          const result = await response.json();
          
          return {
            url: result.secure_url,
            publicId: result.public_id,
            order: images.length + index
          };
        })
      );
      
      setImages([...images, ...uploadedPhotos]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };
  
  const handleSubmit = async (formData) => {
    const response = await fetch('http://localhost:5000/api/admin/listings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({
        ...formData,
        photos: images
      })
    });
    
    return response.json();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="file" 
        multiple 
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
      />
      
      {uploading && <p>Uploading...</p>}
      
      <div>
        {images.map((photo, index) => (
          <img key={index} src={photo.url} alt={`Upload ${index}`} />
        ))}
      </div>
      
      {/* Other form fields */}
    </form>
  );
}
```

## Photo Management

### Reorder Photos
```javascript
const reorderPhotos = (photos, fromIndex, toIndex) => {
  const reordered = [...photos];
  const [moved] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, moved);
  
  // Update order values
  return reordered.map((photo, index) => ({ ...photo, order: index }));
};
```

### Delete Photo
```javascript
const deletePhoto = async (listingId, photoPublicId, currentPhotos) => {
  // Remove from array
  const updatedPhotos = currentPhotos
    .filter(p => p.publicId !== photoPublicId)
    .map((photo, index) => ({ ...photo, order: index }));
  
  // Update listing
  await fetch(`http://localhost:5000/api/admin/listings/${listingId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({ photos: updatedPhotos })
  });
  
  // Optional: Delete from Cloudinary
  // (requires backend endpoint with admin API key)
};
```

## Security

- Upload signature expires after a short time (Cloudinary default: 1 hour)
- Only authenticated admins can get signatures
- Uploads are restricted to `landapp/listings` folder
- Frontend cannot upload without valid signature

## File Structure

```
src/
├── controllers/
│   └── upload.controller.js     # Signature generation
├── routes/
│   └── admin.routes.js          # Upload signature endpoint
└── lib/
    └── cloudinary.js            # Cloudinary config
```

## Environment Variables

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Benefits

✓ No file storage on backend server
✓ Direct uploads = faster performance
✓ Cloudinary handles image optimization
✓ Automatic CDN distribution
✓ Backend only stores URLs
✓ Reduced server bandwidth usage

## Testing

### 1. Get Signature
```bash
curl http://localhost:5000/api/admin/upload-signature \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 2. Upload to Cloudinary (using signature)
```bash
curl -X POST https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload \
  -F "file=@/path/to/image.jpg" \
  -F "timestamp=TIMESTAMP_FROM_SIGNATURE" \
  -F "signature=SIGNATURE_FROM_BACKEND" \
  -F "api_key=API_KEY_FROM_SIGNATURE" \
  -F "folder=landapp/listings"
```

### 3. Create Listing with Photo URLs
```bash
curl -X POST http://localhost:5000/api/admin/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Test Listing",
    "description": "Test description",
    "price": 1000000,
    "size": 500,
    "landType": "RESIDENTIAL",
    "address": "Test Address",
    "state": "Lagos",
    "city": "Lekki",
    "photos": [
      {
        "url": "https://res.cloudinary.com/...",
        "publicId": "landapp/listings/...",
        "order": 0
      }
    ]
  }'
```
