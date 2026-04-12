const router = require('express').Router();
const { authenticateAdmin } = require('../middleware/auth.middleware');
const adminController = require('../controllers/admin.controller');
const listingController = require('../controllers/listing.controller');
const uploadController = require('../controllers/upload.controller');
const inquiryController = require('../controllers/inquiry.controller');
const {
  getDashboard,
  getPopularAnalytics,
  getConversionAnalytics,
  getAnalyticsSummary
} = require('../controllers/adminController');

const prisma = require('../lib/prisma');

// Auth routes
router.post('/auth/login', adminController.login);
router.get('/auth/me', authenticateAdmin, adminController.getMe);

// Upload routes
router.get('/upload-signature', authenticateAdmin, uploadController.getUploadSignature);

// Listing management routes
router.post('/listings', authenticateAdmin, listingController.create);
router.get('/listings', authenticateAdmin, listingController.list);
router.patch('/listings/:id', authenticateAdmin, listingController.update);
router.delete('/listings/:id', authenticateAdmin, listingController.remove);

// Inquiry management routes
router.get('/inquiries', authenticateAdmin, inquiryController.list);
router.get('/inquiries/:id', authenticateAdmin, inquiryController.show);
router.patch('/inquiries/:id', authenticateAdmin, inquiryController.update);

// Dashboard endpoint
router.get('/dashboard', getDashboard);

// Analytics endpoints
router.get('/analytics/popular', getPopularAnalytics);
router.get('/analytics/conversion', getConversionAnalytics);
router.get('/analytics/summary', getAnalyticsSummary);

// Protected admin routes
router.get('/stats', authenticateAdmin, async (req, res, next) => {
  try {
    const [totalListings, agg, recentInquiries] = await Promise.all([
      prisma.listing.count(),
      prisma.listing.aggregate({ _sum: { views: true, whatsappClicks: true, shareClicks: true } }),
      prisma.inquiry.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { listing: { select: { title: true } } } }),
    ]);
    const { views = 0, whatsappClicks = 0, shareClicks = 0 } = agg._sum;
    const conversionRate = views > 0 ? ((whatsappClicks / views) * 100).toFixed(1) + '%' : '0%';
    res.json({ success: true, data: { totalListings, views, whatsappClicks, shareClicks, conversionRate, recentInquiries }, message: '' });
  } catch (e) { next(e); }
});

module.exports = router;
