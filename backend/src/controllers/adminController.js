const analytics = require('../services/analytics');

exports.getDashboard = async (req, res, next) => {
  try {
    const data = await analytics.getDashboardStats();
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

exports.getPopularAnalytics = async (req, res, next) => {
  try {
    const data = await analytics.getPopularListings();
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

exports.getConversionAnalytics = async (req, res, next) => {
  try {
    const data = await analytics.getConversionAnalytics();
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

exports.getAnalyticsSummary = async (req, res, next) => {
  try {
    const data = await analytics.getAnalyticsSummary();
    res.json({ success: true, data });
  } catch (e) { next(e); }
};
