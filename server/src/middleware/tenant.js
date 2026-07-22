const Tenant = require('../models/Tenant');

const tenantMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userTenantId = req.user.tenantId?._id || req.user.tenantId;
    const host = req.get('host') || '';
    const hostname = host.split(':')[0];
    const parts = hostname.split('.');
    const subdomain = hostname.includes('localhost') && parts.length > 1
      ? parts[0]
      : parts.length > 2 ? parts[0] : null;

    const tenant = await Tenant.findById(userTenantId);
    if (!tenant || !tenant.isActive) {
      return res.status(403).json({ error: 'Tenant is unavailable' });
    }

    if (subdomain && !['www', 'app'].includes(subdomain) && subdomain !== tenant.subdomain) {
      return res.status(403).json({ error: 'Tenant access denied' });
    }

    req.tenant = tenant;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve tenant' });
  }
};

module.exports = tenantMiddleware;