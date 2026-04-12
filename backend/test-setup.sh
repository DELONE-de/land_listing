#!/bin/bash

echo "🧪 Testing Listings Module Setup"
echo "================================"
echo ""

# Check if files exist
echo "📁 Checking files..."
files=(
  "prisma/schema.prisma"
  "src/validation/listing.validation.js"
  "src/services/listing.service.js"
  "src/controllers/listing.controller.js"
  "src/routes/listing.routes.js"
  "src/routes/admin.routes.js"
  "src/middleware/errorHandler.js"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✓ $file"
  else
    echo "✗ $file (missing)"
  fi
done

echo ""
echo "📦 Checking dependencies..."
if grep -q '"zod"' package.json; then
  echo "✓ zod"
else
  echo "✗ zod (missing)"
fi

if grep -q '"slugify"' package.json; then
  echo "✓ slugify"
else
  echo "✗ slugify (missing)"
fi

echo ""
echo "🔧 Next steps:"
echo "1. npm run db:push"
echo "2. npm run db:generate"
echo "3. npm run dev"
echo ""
echo "📚 Documentation: LISTINGS_MODULE.md"
