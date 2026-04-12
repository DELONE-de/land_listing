#!/bin/bash

echo "🧪 Testing Upload Signature Endpoint"
echo "====================================="
echo ""

# Check if admin token is provided
if [ -z "$1" ]; then
  echo "Usage: ./test-upload.sh <ADMIN_TOKEN>"
  echo ""
  echo "First, get admin token:"
  echo "  curl -X POST http://localhost:5000/api/admin/auth/login \\"
  echo "    -H 'Content-Type: application/json' \\"
  echo "    -d '{\"email\":\"admin@landapp.com\",\"password\":\"admin123\"}'"
  exit 1
fi

ADMIN_TOKEN=$1
API_URL=${2:-http://localhost:5000}

echo "📡 Requesting upload signature..."
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/api/admin/upload-signature" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Success! (HTTP $HTTP_CODE)"
  echo ""
  echo "Response:"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  echo ""
  echo "📋 Use these values to upload to Cloudinary:"
  echo "  - timestamp: $(echo "$BODY" | jq -r '.data.timestamp' 2>/dev/null)"
  echo "  - signature: $(echo "$BODY" | jq -r '.data.signature' 2>/dev/null)"
  echo "  - api_key: $(echo "$BODY" | jq -r '.data.api_key' 2>/dev/null)"
  echo "  - cloud_name: $(echo "$BODY" | jq -r '.data.cloud_name' 2>/dev/null)"
  echo "  - folder: $(echo "$BODY" | jq -r '.data.folder' 2>/dev/null)"
else
  echo "❌ Failed! (HTTP $HTTP_CODE)"
  echo ""
  echo "Response:"
  echo "$BODY"
fi

echo ""
echo "📚 See UPLOADS_MODULE.md for frontend implementation"
