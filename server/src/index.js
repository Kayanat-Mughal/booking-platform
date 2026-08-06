// ==================== 1. LOAD ENVIRONMENT VARIABLES FIRST ====================
const dotenv = require('dotenv');
dotenv.config();

// ==================== 2. VALIDATE ENVIRONMENT VARIABLES ====================
const validateEnv = require('./utils/validateEnv');
validateEnv();

// ==================== 3. IMPORT DEPENDENCIES ====================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Tenant = require('./models/Tenant');
const authMiddleware = require('./middleware/auth');

const app = express();

// ==================== 4. MIDDLEWARE ====================

// ✅ CORS
app.use(cors());

// ✅ Webhook routes (MUST be BEFORE express.json() for raw body)
const webhookRoutes = require('./routes/webhook.routes');
app.use('/webhook', webhookRoutes);

// ✅ JSON parser for all other routes
app.use(express.json());

// ==================== 5. SUBDOMAIN ROUTING ====================
app.use(async (req, res, next) => {
  try {
    const host = req.get('host');
    const hostname = host.split(':')[0];
    const parts = hostname.split('.');
    let subdomain = null;

    if (hostname.includes('localhost')) {
      if (parts.length > 1) {
        subdomain = parts[0];
      }
    } else if (parts.length > 2) {
      subdomain = parts[0];
    }

    if (!subdomain || subdomain === 'www' || subdomain === 'app') {
      req.tenant = null;
      req.tenantSubdomain = null;
      return next();
    }

    console.log(`🔵 Subdomain detected: ${subdomain}`);

    const tenant = await Tenant.findOne({ subdomain });
    if (!tenant) {
      console.log(`❌ Tenant not found for subdomain: ${subdomain}`);
      req.tenant = null;
      req.tenantSubdomain = subdomain;
      return next();
    }

    console.log(`✅ Tenant loaded: ${tenant.name} (${tenant.subdomain})`);
    req.tenant = tenant;
    req.tenantSubdomain = subdomain;
    next();
  } catch (error) {
    console.error('❌ Subdomain middleware error:', error);
    req.tenant = null;
    req.tenantSubdomain = null;
    next();
  }
});

console.log('🚀 Starting server...');

// ==================== 6. DATABASE CONNECTION ====================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ==================== 7. ROUTES ====================
const authRoutes = require('./routes/auth.routes');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');
const tenantRoutes = require('./routes/tenant.routes');
const userRoutes = require('./routes/user.routes');

// ✅ Public routes
app.use('/api/auth', authRoutes);

// ✅ Protected routes
app.use('/api/bookings', authMiddleware, bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/tenants', authMiddleware, tenantRoutes);
app.use('/api/users', authMiddleware, userRoutes);

// ==================== 8. TEST ROUTE ====================
app.get('/test', (req, res) => {
  res.json({
    message: 'Server is working!',
    tenant: req.tenant ? {
      name: req.tenant.name,
      subdomain: req.tenant.subdomain,
    } : null,
    subdomain: req.tenantSubdomain,
  });
});

// ==================== 9. START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});