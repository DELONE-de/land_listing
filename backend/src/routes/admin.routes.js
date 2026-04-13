const router = require('express').Router();
const { authenticateAdmin } = require('../middleware/auth.middleware');
const adminController = require('../controllers/admin.controller');
const listingController = require('../controllers/listing.controller');
const uploadController = require('../controllers/upload.controller');
const inquiryController = require('../controllers/inquiry.controller');
const prisma = require('../lib/prisma');

// Auth routes
router.post('/auth/login', adminController.login);
router.get('/auth/me', authenticateAdmin, adminController.getMe);
router.post('/auth/change-password', authenticateAdmin, adminController.changePassword);

// Sub-admin management
router.get('/sub-admins', authenticateAdmin, adminController.listSubAdmins);
router.post('/sub-admins', authenticateAdmin, adminController.createSubAdmin);
router.delete('/sub-admins/:id', authenticateAdmin, adminController.deleteSubAdmin);

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
router.get('/dashboard', adminController.getDashboard);

// Analytics endpoints
router.get('/analytics/popular', adminController.getPopularAnalytics);
router.get('/analytics/conversion', adminController.getConversionAnalytics);
router.get('/analytics/summary', adminController.getAnalyticsSummary);

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
