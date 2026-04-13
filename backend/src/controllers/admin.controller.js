const adminService = require('../services/admin.service');
const analyticsModule = require('../services/analytics');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await adminService.login(email, password);
    res.json({ success: true, data: result, message: 'Login successful' });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const admin = await adminService.getProfile(req.admin.id);
    res.json({ success: true, data: admin, message: '' });
  } catch (error) {
    next(error);
  }
};

exports.createSubAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    const admin = await adminService.createSubAdmin(name, email, password);
    res.status(201).json({ success: true, data: admin, message: 'Sub-admin created successfully' });
  } catch (error) {
    next(error);
  }
};

exports.listSubAdmins = async (req, res, next) => {
  try {
    const admins = await adminService.listSubAdmins();
    res.json({ success: true, data: admins, message: '' });
  } catch (error) {
    next(error);
  }
};

exports.deleteSubAdmin = async (req, res, next) => {
  try {
    await adminService.deleteSubAdmin(req.params.id, req.admin.id);
    res.json({ success: true, message: 'Sub-admin deleted successfully' });
  } catch (error) {
    next(error);
  }
};



 
const getDashboard = async (req, res) => {
  try {
    const result = await analyticsModule.getDashboardStats();
    
    res.status(200).json(result);
    
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

/**
 * Get popular listings analytics
 * GET /api/admin/analytics/popular
 */
const getPopularAnalytics = async (req, res) => {
  try {
    const result = await analyticsModule.getPopularListings();
    
    res.status(200).json(result);
    
  } catch (error) {
    console.error('Popular Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular listings analytics',
      error: error.message
    });
  }
};

/**
 * Get conversion analytics
 * GET /api/admin/analytics/conversion
 */
const getConversionAnalytics = async (req, res) => {
  try {
    const result = await analyticsModule.getConversionAnalytics();
    
    res.status(200).json(result);
    
  } catch (error) {
    console.error('Conversion Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversion analytics',
      error: error.message
    });
  }
};

/**
 * Get complete analytics summary
 * GET /api/admin/analytics/summary
 */
const getAnalyticsSummary = async (req, res) => {
  try {
    const result = await analyticsModule.getAnalyticsSummary();
    
    res.status(200).json(result);
    
  } catch (error) {
    console.error('Analytics Summary Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics summary',
      error: error.message
    });
  }
};

module.exports = {
  login: exports.login,
  getMe: exports.getMe,
  changePassword: exports.changePassword,
  createSubAdmin: exports.createSubAdmin,
  listSubAdmins: exports.listSubAdmins,
  deleteSubAdmin: exports.deleteSubAdmin,
  getDashboard,
  getPopularAnalytics,
  getConversionAnalytics,
  getAnalyticsSummary
};