const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('AUTH: missing token');
      return res.status(401).json({ error: 'Please login first' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate('tenantId');
    
    if (!user) {
      console.log('AUTH: user not found', decoded.userId);
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = user;
    req.tenant = user.tenantId;
    console.log('AUTH: authenticated', user.email, user.role, user.tenantId?._id || user.tenantId);
    next();
  } catch (error) {
    console.error('AUTH: invalid token', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;