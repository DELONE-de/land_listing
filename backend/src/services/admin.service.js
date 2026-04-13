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

exports.changePassword = async (adminId, currentPassword, newPassword) => {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin || !(await bcrypt.compare(currentPassword, admin.password))) {
    throw new Error('Current password is incorrect');
  }
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.admin.update({ where: { id: adminId }, data: { password: hashed } });
};

exports.createSubAdmin = async (name, email, password) => {
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) throw Object.assign(new Error('Email already in use'), { status: 409 });
  const hashed = await bcrypt.hash(password, 10);
  return prisma.admin.create({
    data: { name, email, password: hashed, role: 'sub_admin' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
};

exports.listSubAdmins = async () => {
  return prisma.admin.findMany({
    where: { role: 'sub_admin' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
};

exports.deleteSubAdmin = async (id, requestingAdminId) => {
  if (id === requestingAdminId) throw Object.assign(new Error('Cannot delete yourself'), { status: 400 });
  await prisma.admin.delete({ where: { id } });
};
