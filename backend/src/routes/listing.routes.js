const router = require('express').Router();
const c = require('../controllers/listing.controller');
const { viewRateLimiter, clickRateLimiter } = require('../middleware/analytics.middleware');
const { generateListingPDFController } = require('../controllers/listingController');


// Utility routes
router.get('/locations', c.locations);
router.get('/land-types', c.landTypes);
router.get('/amenities', c.amenities);
router.get('/:id/pdf', generateListingPDFController);

// Public routes
router.get('/', c.list);
router.get('/:id', c.show);
router.get('/:id/related', c.related);
router.get('/slug/:slug', c.showBySlug);

// Analytics routes (rate limited)
router.post('/:id/view', viewRateLimiter, c.trackView);
router.post('/:id/track-click', clickRateLimiter, c.trackClick);

module.exports = router;
