require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const analyticsModule = require('./services/analytics');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/listings', limiter);
app.use('/api/inquiries', limiter);

// Graceful shutdown
process.on('SIGINT', async () => {
  await analyticsModule.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await analyticsModule.disconnect();
  process.exit(0);
});

app.use('/api/auth',      require('./routes/auth.routes'));
app.use('/api/listings',  require('./routes/listing.routes'));
app.use('/api/inquiries', require('./routes/inquiry.routes'));
app.use('/api/admin',     require('./routes/admin.routes'));

app.use(errorHandler);

module.exports = app;
