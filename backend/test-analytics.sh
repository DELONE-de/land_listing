#!/bin/bash

echo "🧪 Testing Analytics Tracking"
echo "=============================="
echo ""

if [ -z "$1" ]; then
  echo "Usage: ./test-analytics.sh <LISTING_ID>"
  echo ""
  echo "First, create a listing or use existing ID"
  exit 1
fi

LISTING_ID=$1
API_URL=${2:-http://localhost:5000}

echo "📊 Testing with Listing ID: $LISTING_ID"
echo ""

# Get initial counts
echo "1️⃣  Getting initial counts..."
INITIAL=$(curl -s "$API_URL/api/listings/$LISTING_ID")
INITIAL_VIEWS=$(echo "$INITIAL" | jq -r '.data.views // 0')
INITIAL_WHATSAPP=$(echo "$INITIAL" | jq -r '.data.whatsappClicks // 0')
INITIAL_SHARE=$(echo "$INITIAL" | jq -r '.data.shareClicks // 0')
INITIAL_FAVORITE=$(echo "$INITIAL" | jq -r '.data.favoriteClicks // 0')

echo "   Views: $INITIAL_VIEWS"
echo "   WhatsApp: $INITIAL_WHATSAPP"
echo "   Share: $INITIAL_SHARE"
echo "   Favorite: $INITIAL_FAVORITE"
echo ""

# Track view
echo "2️⃣  Tracking view..."
VIEW_RESPONSE=$(curl -s -X POST "$API_URL/api/listings/$LISTING_ID/view")
echo "   $(echo "$VIEW_RESPONSE" | jq -r '.message')"
echo ""

# Track WhatsApp click
echo "3️⃣  Tracking WhatsApp click..."
WHATSAPP_RESPONSE=$(curl -s -X POST "$API_URL/api/listings/$LISTING_ID/track-click" \
  -H "Content-Type: application/json" \
  -d '{"type": "whatsapp"}')
echo "   $(echo "$WHATSAPP_RESPONSE" | jq -r '.message')"
echo ""

# Track share click
echo "4️⃣  Tracking share click..."
SHARE_RESPONSE=$(curl -s -X POST "$API_URL/api/listings/$LISTING_ID/track-click" \
  -H "Content-Type: application/json" \
  -d '{"type": "share"}')
echo "   $(echo "$SHARE_RESPONSE" | jq -r '.message')"
echo ""

# Track favorite click
echo "5️⃣  Tracking favorite click..."
FAVORITE_RESPONSE=$(curl -s -X POST "$API_URL/api/listings/$LISTING_ID/track-click" \
  -H "Content-Type: application/json" \
  -d '{"type": "favorite"}')
echo "   $(echo "$FAVORITE_RESPONSE" | jq -r '.message')"
echo ""

# Get updated counts
echo "6️⃣  Getting updated counts..."
sleep 1
UPDATED=$(curl -s "$API_URL/api/listings/$LISTING_ID")
UPDATED_VIEWS=$(echo "$UPDATED" | jq -r '.data.views // 0')
UPDATED_WHATSAPP=$(echo "$UPDATED" | jq -r '.data.whatsappClicks // 0')
UPDATED_SHARE=$(echo "$UPDATED" | jq -r '.data.shareClicks // 0')
UPDATED_FAVORITE=$(echo "$UPDATED" | jq -r '.data.favoriteClicks // 0')

echo "   Views: $UPDATED_VIEWS (+$((UPDATED_VIEWS - INITIAL_VIEWS)))"
echo "   WhatsApp: $UPDATED_WHATSAPP (+$((UPDATED_WHATSAPP - INITIAL_WHATSAPP)))"
echo "   Share: $UPDATED_SHARE (+$((UPDATED_SHARE - INITIAL_SHARE)))"
echo "   Favorite: $UPDATED_FAVORITE (+$((UPDATED_FAVORITE - INITIAL_FAVORITE)))"
echo ""

# Test invalid click type
echo "7️⃣  Testing invalid click type..."
INVALID_RESPONSE=$(curl -s -X POST "$API_URL/api/listings/$LISTING_ID/track-click" \
  -H "Content-Type: application/json" \
  -d '{"type": "invalid"}')
INVALID_SUCCESS=$(echo "$INVALID_RESPONSE" | jq -r '.success')
if [ "$INVALID_SUCCESS" = "false" ]; then
  echo "   ✅ Correctly rejected: $(echo "$INVALID_RESPONSE" | jq -r '.message')"
else
  echo "   ❌ Should have rejected invalid type"
fi
echo ""

# Test rate limiting (optional - commented out to avoid hitting limits)
# echo "8️⃣  Testing rate limiting (sending 12 requests)..."
# for i in {1..12}; do
#   RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/listings/$LISTING_ID/view")
#   HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
#   if [ "$HTTP_CODE" = "429" ]; then
#     echo "   ✅ Rate limit triggered at request $i"
#     break
#   fi
# done
# echo ""

echo "✅ Analytics tracking test complete!"
echo ""
echo "📚 See ANALYTICS_TRACKING.md for more details"
