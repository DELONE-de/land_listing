const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

exports.login = async (email, password) => {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ id: admin.id, type: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { token, admin: { id: admin.id, email: admin.email, createdAt: admin.createdAt } };
};

exports.getProfile = async (adminId) => {
  const admin = await prisma.admin.findUnique({ where: { id: adminId }, select: { id: true, email: true, createdAt: true } });
  if (!admin) throw new Error('Admin not found');
  return admin;
};
