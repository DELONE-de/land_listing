const prisma = require('../lib/prisma');

const createInquiry = async (data) => {
  const listing = await prisma.listing.findUnique({ 
    where: { id: data.listingId },
    select: { id: true }
  });
  
  if (!listing) {
    const err = new Error('Listing not found');
    err.status = 404;
    throw err;
  }

  return prisma.inquiry.create({
    data: {
      ...data,
      source: data.source || 'FORM',
    },
    include: {
      listing: {
        select: { id: true, title: true, slug: true }
      }
    }
  });
};

const getInquiries = async (filters = {}) => {
  const { page = 1, limit = 20, status, listingId } = filters;
  
  const where = {};
  if (status) where.status = status;
  if (listingId) where.listingId = listingId;

  const [inquiries, total] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        listing: {
          select: { id: true, title: true, slug: true }
        }
      }
    }),
    prisma.inquiry.count({ where }),
  ]);

  return { inquiries, total, page, limit, pages: Math.ceil(total / limit) };
};

const getInquiryById = async (id) => {
  const inquiry = await prisma.inquiry.findUnique({ 
    where: { id },
    include: {
      listing: {
        select: { id: true, title: true, slug: true, price: true }
      }
    }
  });
  
  if (!inquiry) {
    const err = new Error('Inquiry not found');
    err.status = 404;
    throw err;
  }
  
  return inquiry;
};

const updateInquiry = async (id, data) => {
  const inquiry = await prisma.inquiry.findUnique({ 
    where: { id },
    select: { id: true }
  });
  
  if (!inquiry) {
    const err = new Error('Inquiry not found');
    err.status = 404;
    throw err;
  }

  return prisma.inquiry.update({
    where: { id },
    data,
    include: {
      listing: {
        select: { id: true, title: true, slug: true }
      }
    }
  });
};

module.exports = {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiry,
};
