const adminService = require('../services/admin.service');
const analyticsModule = require('../services/analytics');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await adminService.login(email, password);
    res.json({ success: true, data: result, message: 'Login successful' });
  } catch (error) { next(error); }
};

exports.getMe = async (req, res, next) => {
  try {
    const admin = await adminService.getProfile(req.admin.id);
    res.json({ success: true, data: admin, message: '' });
  } catch (error) { next(error); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await adminService.changePassword(req.admin.id, currentPassword, newPassword);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) { next(error); }
};

exports.createSubAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    const admin = await adminService.createSubAdmin(name, email, password);
    res.status(201).json({ success: true, data: admin, message: 'Sub-admin created successfully' });
  } catch (error) { next(error); }
};

exports.listSubAdmins = async (req, res, next) => {
  try {
    const admins = await adminService.listSubAdmins();
    res.json({ success: true, data: admins, message: '' });
  } catch (error) { next(error); }
};

exports.deleteSubAdmin = async (req, res, next) => {
  try {
    await adminService.deleteSubAdmin(req.params.id, req.admin.id);
    res.json({ success: true, message: 'Sub-admin deleted successfully' });
  } catch (error) { next(error); }
};

exports.getDashboard = async (req, res) => {
  try {
    const result = await analyticsModule.getDashboardStats();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data', error: error.message });
  }
};

exports.getPopularAnalytics = async (req, res) => {
  try {
    const result = await analyticsModule.getPopularListings();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch popular listings analytics', error: error.message });
  }
};

exports.getConversionAnalytics = async (req, res) => {
  try {
    const result = await analyticsModule.getConversionAnalytics();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch conversion analytics', error: error.message });
  }
};

exports.getAnalyticsSummary = async (req, res) => {
  try {
    const result = await analyticsModule.getAnalyticsSummary();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch analytics summary', error: error.message });
  }
};
