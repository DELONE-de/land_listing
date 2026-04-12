const slugify = require('slugify');
const prisma = require('../lib/prisma');

// Haversine formula to calculate distance between two coordinates in meters
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const generateUniqueSlug = async (title) => {
  let slug = slugify(title, { lower: true, strict: true });
  let exists = await prisma.listing.findUnique({ where: { slug }, select: { id: true } });
  let counter = 1;
  while (exists) {
    slug = `${slugify(title, { lower: true, strict: true })}-${counter}`;
    exists = await prisma.listing.findUnique({ where: { slug }, select: { id: true } });
    counter++;
  }
  return slug;
};

const createListing = async (data) => {
  const slug = await generateUniqueSlug(data.title);
  return prisma.listing.create({
    data: {
      ...data,
      slug,
      amenities: data.amenities || [],
      titleDocuments: data.titleDocuments || [],
      photos: data.photos || [],
    },
  });
};

const getListings = async (filters = {}) => {
  const { page = 1, limit = 20, minPrice, maxPrice, landType, status, state, city, lat, lng, radius, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
  
  // Geospatial search with radius
  if (lat && lng && radius) {
    const radiusInDegrees = radius / 111320; // Convert meters to degrees (approximate)
    
    const where = { status: status || 'AVAILABLE' };
    if (minPrice || maxPrice) where.price = { ...(minPrice && { gte: minPrice }), ...(maxPrice && { lte: maxPrice }) };
    if (landType) where.landType = landType;
    where.lat = { not: null };
    where.lng = { not: null };

    // Get all listings with coordinates
    const allListings = await prisma.listing.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        size: true,
        landType: true,
        status: true,
        address: true,
        state: true,
        city: true,
        lat: true,
        lng: true,
        photos: true,
        views: true,
        createdAt: true,
      },
    });

    // Calculate distance and filter by radius
    const listingsWithDistance = allListings
      .map(listing => {
        const distance = calculateDistance(lat, lng, listing.lat, listing.lng);
        return { ...listing, distance };
      })
      .filter(listing => listing.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    const total = listingsWithDistance.length;
    const paginatedListings = listingsWithDistance.slice((page - 1) * limit, page * limit);

    return { listings: paginatedListings, total, page, limit, pages: Math.ceil(total / limit) };
  }

  // Standard search without geospatial
  const where = { status: status || 'AVAILABLE' };
  if (minPrice || maxPrice) where.price = { ...(minPrice && { gte: minPrice }), ...(maxPrice && { lte: maxPrice }) };
  if (landType) where.landType = landType;
  if (state) where.state = state;
  if (city) where.city = city;

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        size: true,
        landType: true,
        status: true,
        address: true,
        state: true,
        city: true,
        photos: true,
        views: true,
        createdAt: true,
      },
    }),
    prisma.listing.count({ where }),
  ]);

  return { listings, total, page, limit, pages: Math.ceil(total / limit) };
};

const getListingById = async (id) => {
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) { const err = new Error('Listing not found'); err.status = 404; throw err; }
  return listing;
};

const getListingBySlug = async (slug) => {
  const listing = await prisma.listing.findUnique({ where: { slug } });
  if (!listing) { const err = new Error('Listing not found'); err.status = 404; throw err; }
  return listing;
};

const getRelatedListings = async (id) => {
  const listing = await prisma.listing.findUnique({ 
    where: { id },
    select: { state: true, city: true, landType: true, price: true }
  });
  
  if (!listing) { const err = new Error('Listing not found'); err.status = 404; throw err; }

  const priceMin = Number(listing.price) * 0.7;
  const priceMax = Number(listing.price) * 1.3;

  const related = await prisma.listing.findMany({
    where: {
      id: { not: id },
      status: 'AVAILABLE',
      OR: [
        { state: listing.state, city: listing.city },
        { landType: listing.landType },
      ],
      price: { gte: priceMin, lte: priceMax },
    },
    take: 6,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      size: true,
      landType: true,
      address: true,
      state: true,
      city: true,
      photos: true,
      views: true,
    },
  });

  return related;
};

const getLocations = async () => {
  const locations = await prisma.listing.groupBy({
    by: ['state', 'city'],
    where: { status: 'AVAILABLE' },
    _count: { id: true },
    orderBy: [{ state: 'asc' }, { city: 'asc' }],
  });

  const grouped = locations.reduce((acc, loc) => {
    if (!acc[loc.state]) acc[loc.state] = [];
    acc[loc.state].push({ city: loc.city, count: loc._count.id });
    return acc;
  }, {});

  return grouped;
};

const getLandTypes = async () => {
  const types = await prisma.listing.groupBy({
    by: ['landType'],
    where: { status: 'AVAILABLE' },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  });

  return types.map(t => ({ type: t.landType, count: t._count.id }));
};

const getAmenities = async () => {
  const listings = await prisma.listing.findMany({
    where: { status: 'AVAILABLE' },
    select: { amenities: true },
  });

  const amenitiesMap = {};
  listings.forEach(listing => {
    listing.amenities.forEach(amenity => {
      amenitiesMap[amenity] = (amenitiesMap[amenity] || 0) + 1;
    });
  });

  return Object.entries(amenitiesMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

const updateListing = async (id, data) => {
  const listing = await prisma.listing.findUnique({ where: { id }, select: { id: true, title: true } });
  if (!listing) { const err = new Error('Listing not found'); err.status = 404; throw err; }
  
  if (data.title && data.title !== listing.title) {
    data.slug = await generateUniqueSlug(data.title);
  }
  
  return prisma.listing.update({ where: { id }, data });
};

const deleteListing = async (id) => {
  const listing = await prisma.listing.findUnique({ where: { id }, select: { id: true } });
  if (!listing) { const err = new Error('Listing not found'); err.status = 404; throw err; }
  return prisma.listing.delete({ where: { id } });
};

const trackView = async (id) => {
  const listing = await prisma.listing.findUnique({ where: { id }, select: { id: true } });
  if (!listing) { const err = new Error('Listing not found'); err.status = 404; throw err; }
  
  await prisma.listing.update({
    where: { id },
    data: { views: { increment: 1 } }
  });
};

const trackClick = async (id, type) => {
  const field = { whatsapp: 'whatsappClicks', share: 'shareClicks', favorite: 'favoriteClicks' }[type];
  if (!field) { const err = new Error('Invalid click type'); err.status = 400; throw err; }
  
  const listing = await prisma.listing.findUnique({ where: { id }, select: { id: true } });
  if (!listing) { const err = new Error('Listing not found'); err.status = 404; throw err; }
  
  await prisma.listing.update({
    where: { id },
    data: { [field]: { increment: 1 } }
  });
};

module.exports = { 
  createListing, 
  getListings, 
  getListingById, 
  getListingBySlug, 
  getRelatedListings,
  getLocations,
  getLandTypes,
  getAmenities,
  updateListing, 
  deleteListing,
  trackView,
  trackClick 
};
