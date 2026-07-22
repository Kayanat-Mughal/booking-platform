const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Tenant = require('./models/Tenant');  // ← Import Tenant model
const authMiddleware = require('./middleware/auth');
const validateEnv = require('./utils/validateEnv');
const tenantRoutes = require('./routes/tenant.routes'); 
const bookingRoutes = require('./routes/booking.routes');

dotenv.config();
validateEnv();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/tenants', authMiddleware, tenantRoutes);
app.use('/api/bookings', authMiddleware, bookingRoutes);

// ✅ COMPLETE WILDCARD SUBDOMAIN ROUTING
app.use(async (req, res, next) => {
  try {
    const host = req.get('host');
    // Remove port number if present (e.g., localhost:5000 → localhost)
    const hostname = host.split(':')[0];
    const parts = hostname.split('.');
    
    // Check if we have a subdomain (more than 2 parts or not localhost)
    let subdomain = null;
    
    // Handle localhost: acme.localhost → subdomain = acme
    if (hostname.includes('localhost')) {
      if (parts.length > 1) {
        subdomain = parts[0];
      }
    } 
    // Handle real domains: acme.example.com → subdomain = acme
    else if (parts.length > 2) {
      subdomain = parts[0];
    }
    
    // Skip for main domain or www
    if (!subdomain || subdomain === 'www' || subdomain === 'app') {
      req.tenant = null;
      req.tenantSubdomain = null;
      return next();
    }
    
    console.log(`🔵 Subdomain detected: ${subdomain}`);
    
    // Load tenant from database
    const tenant = await Tenant.findOne({ subdomain });
    if (!tenant) {
      console.log(`❌ Tenant not found for subdomain: ${subdomain}`);
      // Don't block the request, just set tenant to null
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

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    tenant: req.tenant ? {
      name: req.tenant.name,
      subdomain: req.tenant.subdomain
    } : null,
    subdomain: req.tenantSubdomain
  });
});


// Import routes 
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});