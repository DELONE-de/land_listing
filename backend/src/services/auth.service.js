const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const register = async ({ name, email, password, role }) => {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) { const err = new Error('Email already in use'); err.status = 409; throw err; }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, password: hashed, role } });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const err = new Error('Invalid credentials'); err.status = 401; throw err;
  }
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
};

module.exports = { register, login };
