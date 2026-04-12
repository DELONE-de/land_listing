const { z } = require('zod');

const photoSchema = z.object({
  url: z.string().url(),
  publicId: z.string(),
  order: z.number().int().min(0),
});

exports.createListingSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  price: z.number().positive(),
  size: z.number().positive(),
  landType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'AGRICULTURAL', 'INDUSTRIAL', 'MIXED_USE']),
  status: z.enum(['AVAILABLE', 'SOLD', 'UNDER_OFFER']).optional(),
  address: z.string().min(5),
  state: z.string().min(2),
  city: z.string().min(2),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  amenities: z.array(z.string()).optional(),
  titleDocuments: z.array(z.string()).optional(),
  photos: z.array(photoSchema).optional(),
});

exports.updateListingSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  size: z.number().positive().optional(),
  landType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'AGRICULTURAL', 'INDUSTRIAL', 'MIXED_USE']).optional(),
  status: z.enum(['AVAILABLE', 'SOLD', 'UNDER_OFFER']).optional(),
  address: z.string().min(5).optional(),
  state: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  amenities: z.array(z.string()).optional(),
  titleDocuments: z.array(z.string()).optional(),
  photos: z.array(photoSchema).optional(),
});

exports.listingQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  minPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  maxPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  landType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'AGRICULTURAL', 'INDUSTRIAL', 'MIXED_USE']).optional(),
  status: z.enum(['AVAILABLE', 'SOLD', 'UNDER_OFFER']).optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  lat: z.string().regex(/^-?\d+(\.\d+)?$/).transform(Number).optional(),
  lng: z.string().regex(/^-?\d+(\.\d+)?$/).transform(Number).optional(),
  radius: z.string().regex(/^\d+$/).transform(Number).optional(),
  sortBy: z.enum(['price', 'createdAt', 'views']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
