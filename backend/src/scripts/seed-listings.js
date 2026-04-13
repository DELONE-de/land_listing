require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');

const prisma = new PrismaClient();

function generateSlug(title) {
  return slugify(title, { lower: true, strict: true });
}

const sampleListings = [
  {
    title: 'Prime Commercial Land in Lekki',
    description: 'Excellent commercial property in the heart of Lekki Phase 1. Perfect for retail or office development.',
    price: 25000000,
    size: 800,
    landType: 'COMMERCIAL',
    status: 'AVAILABLE',
    address: '15 Admiralty Way',
    state: 'Lagos',
    city: 'Lekki',
    lat: 6.4474,
    lng: 3.5406,
    amenities: ['24/7 Security', 'Good Road Network', 'Electricity', 'Water Supply'],
    titleDocuments: ['C of O', 'Survey Plan'],
    photos: [
      { url: 'https://example.com/photo1.jpg', publicId: 'photo1', order: 0 },
      { url: 'https://example.com/photo2.jpg', publicId: 'photo2', order: 1 }
    ]
  },
  {
    title: 'Luxury Residential Plot in Ikoyi',
    description: 'Premium residential land in exclusive Ikoyi neighborhood. Gated estate with modern amenities.',
    price: 45000000,
    size: 600,
    landType: 'RESIDENTIAL',
    status: 'AVAILABLE',
    address: '23 Banana Island Road',
    state: 'Lagos',
    city: 'Ikoyi',
    lat: 6.4698,
    lng: 3.4343,
    amenities: ['Gated Estate', 'Swimming Pool', 'Gym', 'Playground', 'Security'],
    titleDocuments: ['C of O', 'Survey Plan', 'Deed of Assignment'],
    photos: [
      { url: 'https://example.com/photo3.jpg', publicId: 'photo3', order: 0 }
    ]
  },
  {
    title: 'Agricultural Land in Epe',
    description: 'Large agricultural land suitable for farming. Fertile soil with access to water.',
    price: 5000000,
    size: 5000,
    landType: 'AGRICULTURAL',
    status: 'AVAILABLE',
    address: 'Epe-Ijebu Ode Road',
    state: 'Lagos',
    city: 'Epe',
    lat: 6.5833,
    lng: 3.9833,
    amenities: ['Water Access', 'Road Access'],
    titleDocuments: ['Survey Plan'],
    photos: []
  },
  {
    title: 'Industrial Plot in Ikeja',
    description: 'Strategic industrial land near major highways. Ideal for warehouse or manufacturing.',
    price: 35000000,
    size: 1200,
    landType: 'INDUSTRIAL',
    status: 'UNDER_OFFER',
    address: 'Acme Road, Ogba',
    state: 'Lagos',
    city: 'Ikeja',
    lat: 6.6018,
    lng: 3.3515,
    amenities: ['Highway Access', 'Electricity', 'Security'],
    titleDocuments: ['C of O', 'Survey Plan'],
    photos: [
      { url: 'https://example.com/photo4.jpg', publicId: 'photo4', order: 0 },
      { url: 'https://example.com/photo5.jpg', publicId: 'photo5', order: 1 },
      { url: 'https://example.com/photo6.jpg', publicId: 'photo6', order: 2 }
    ]
  },
  {
    title: 'Mixed Use Development Land',
    description: 'Versatile land suitable for mixed residential and commercial development.',
    price: 60000000,
    size: 2000,
    landType: 'MIXED_USE',
    status: 'AVAILABLE',
    address: 'Victoria Island Extension',
    state: 'Lagos',
    city: 'Victoria Island',
    lat: 6.4281,
    lng: 3.4219,
    amenities: ['Prime Location', 'All Utilities', 'Security', 'Drainage'],
    titleDocuments: ['C of O', 'Survey Plan', 'Building Permit'],
    photos: [
      { url: 'https://example.com/photo7.jpg', publicId: 'photo7', order: 0 }
    ]
  }
];

async function seedListings() {
  console.log('🌱 Seeding sample listings...');
  
  for (const listing of sampleListings) {
    const created = await prisma.listing.create({ data: { ...listing, slug: generateSlug(listing.title) } });
    console.log(`✓ Created: ${created.title} (${created.slug})`);
  }
  
  console.log('\n✅ Seeding complete!');
  console.log(`📊 Created ${sampleListings.length} listings`);
}

seedListings()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
