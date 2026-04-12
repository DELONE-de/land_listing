const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const c = require('../controllers/inquiry.controller');

// Rate limiter for inquiry submissions - 3 per IP per 15 minutes
const inquiryRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Too many inquiries submitted, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public route
router.post('/', inquiryRateLimiter, c.create);

module.exports = router;
