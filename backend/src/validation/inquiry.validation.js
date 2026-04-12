const { z } = require('zod');

exports.createInquirySchema = z.object({
  listingId: z.string().min(1, 'Listing ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().min(10, 'Phone must be at least 10 characters').max(20),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
  source: z.enum(['FORM', 'WHATSAPP']).optional(),
});

exports.updateInquirySchema = z.object({
  status: z.enum(['NEW', 'READ', 'REPLIED']).optional(),
  notes: z.string().max(500).optional(),
});

exports.inquiryQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  status: z.enum(['NEW', 'READ', 'REPLIED']).optional(),
  listingId: z.string().optional(),
});
