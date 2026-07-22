const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, companyName, subdomain } = req.body;
    
    // Check if tenant exists
    const existing = await Tenant.findOne({ $or: [{ subdomain }, { email }] });
    if (existing) {
      return res.status(400).json({ error: 'Company or email already exists' });
    }
    
    // Create tenant
    const tenant = new Tenant({
      name: companyName,
      subdomain,
      email,
    });
    await tenant.save();
    console.log('✅ Tenant created:', tenant.name);
    
    // Create user
    const user = new User({
      tenantId: tenant._id,
      email,
      password,
      firstName,
      lastName,
      role: 'owner',
    });
    await user.save();
    console.log('✅ User created:', user.email);
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenant: {
          id: tenant._id,
          name: tenant.name,
          subdomain: tenant.subdomain,
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).populate('tenantId');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenant: {
          id: user.tenantId._id,
          name: user.tenantId.name,
          subdomain: user.tenantId.subdomain,
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
        tenant: req.user.tenantId,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

module.exports = router;