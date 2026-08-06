const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// ✅ Get all users for the current tenant
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const users = await User.find({ tenantId }).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ✅ Get single user
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    }).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ✅ Create new user (invite team member)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { email, firstName, lastName, role } = req.body;
    const tenantId = req.user.tenantId;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user with a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const user = new User({
      tenantId,
      email,
      firstName,
      lastName,
      role: role || 'staff',
      password: tempPassword,
      isActive: true,
    });
    await user.save();

    // TODO: Send invitation email with temp password
    console.log(`📧 Invitation sent to ${email} with password: ${tempPassword}`);

    res.status(201).json({
      message: 'Team member added successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to add team member' });
  }
});

// ✅ Update user role
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'owner') {
      return res.status(403).json({ error: 'Cannot change owner role' });
    }

    user.role = role;
    await user.save();

    res.json({
      message: 'User role updated',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// ✅ Delete user (remove team member)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'owner') {
      return res.status(403).json({ error: 'Cannot remove owner' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team member removed successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to remove team member' });
  }
});

module.exports = router;