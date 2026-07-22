const RBAC = {
  roles: {
    owner: ['*'],
    admin: ['read:all', 'write:all', 'manage:staff'],
    staff: ['read:bookings', 'write:bookings'],
    viewer: ['read:bookings']
  },
  
  checkPermission(role, permission) {
    const permissions = this.roles[role] || [];
    return permissions.includes('*') || permissions.includes(permission);
  },
  
  requirePermission(permission) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      if (!this.checkPermission(req.user.role, permission)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      next();
    };
  }
};

module.exports = RBAC;