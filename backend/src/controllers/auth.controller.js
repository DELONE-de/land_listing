const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    res.status(201).json({ success: true, data, message: 'Registered successfully' });
  } catch (e) { next(e); }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    res.json({ success: true, data, message: 'Login successful' });
  } catch (e) { next(e); }
};

module.exports = { register, login };
