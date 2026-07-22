const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');

// Get current tenant info
router.get('/current', authMiddleware, (req, res) => {
  res.json({
    tenant: req.tenant || req.user?.tenantId
  });
});

// Get all tenants (admin only)
router.get('/all', authMiddleware, tenantMiddleware, async (req, res) => {
  if (req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const tenants = await require('../models/Tenant').find().sort({ name: 1 });
  res.json(tenants);
});

module.exports = router;