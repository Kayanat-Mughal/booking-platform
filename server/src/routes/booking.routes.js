const express = require('express');
const Booking = require('../models/Booking');
const RBAC = require('../middleware/rbac');

const router = express.Router();

const getTenantId = (req) => req.user.tenantId?._id || req.user.tenantId;

// List bookings for the authenticated user's tenant.
router.get('/', RBAC.requirePermission('read:bookings'), async (req, res) => {
  try {
    const bookings = await Booking.find({ tenantId: getTenantId(req) })
      .sort({ startTime: 1 });
    res.json(bookings);
  } catch (error) {
    console.error('Failed to list bookings:', error);
    res.status(500).json({ error: 'Failed to load bookings' });
  }
});

// Get one booking, limited to the authenticated user's tenant.
router.get('/:id', RBAC.requirePermission('read:bookings'), async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      tenantId: getTenantId(req),
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: 'Invalid booking id' });
  }
});

// Create a booking for the authenticated user's tenant.
router.post('/', RBAC.requirePermission('write:bookings'), async (req, res) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      tenantId: getTenantId(req),
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to create booking' });
  }
});

// Update a booking, limited to the authenticated user's tenant.
router.patch('/:id', RBAC.requirePermission('write:bookings'), async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.tenantId;

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, tenantId: getTenantId(req) },
      updates,
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to update booking' });
  }
});

// Delete a booking, limited to the authenticated user's tenant.
router.delete('/:id', RBAC.requirePermission('write:bookings'), async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      tenantId: getTenantId(req),
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid booking id' });
  }
});

module.exports = router;
