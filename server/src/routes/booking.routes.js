const express = require('express');
const { z } = require('zod');
const Booking = require('../models/Booking');
const RBAC = require('../middleware/rbac');
const { bookingSchema, updateBookingSchema } = require('../validators/booking.validator');

const router = express.Router();

const getTenantId = (req) => req.user.tenantId?._id || req.user.tenantId;

// ✅ List bookings with filtering
router.get('/', RBAC.requirePermission('read:bookings'), async (req, res) => {
  try {
    const { start, end, status, clientEmail } = req.query;
    const filter = { tenantId: getTenantId(req) };

    if (start) filter.startTime = { $gte: new Date(start) };
    if (end) filter.endTime = { $lte: new Date(end) };
    if (status) filter.status = status;
    if (clientEmail) filter.clientEmail = clientEmail;

    const bookings = await Booking.find(filter)
      .sort({ startTime: 1 })
      .limit(100);

    res.json(bookings);
  } catch (error) {
    console.error('Failed to list bookings:', error);
    res.status(500).json({ error: 'Failed to load bookings' });
  }
});

// ✅ Get one booking
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

// ✅ Create booking with idempotency and validation
router.post('/', RBAC.requirePermission('write:bookings'), async (req, res) => {
  try {
    console.log('BOOKING POST body', req.body);
    console.log('BOOKING POST user', req.user?.email, req.user?.role, getTenantId(req));
    const validatedData = bookingSchema.parse(req.body);
    console.log('BOOKING POST validated', validatedData);
    const idempotencyKey = req.headers['idempotency-key'] || `booking-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const existing = idempotencyKey ? await Booking.findOne({ idempotencyKey }) : null;
    if (existing) {
      return res.status(200).json(existing);
    }

    const booking = await Booking.create({
      ...validatedData,
      service: validatedData.service || validatedData.title || 'General',
      tenantId: getTenantId(req),
      createdBy: req.user._id,
      idempotencyKey,
    });
    console.log('BOOKING POST created', booking._id);
    res.status(201).json(booking);
  } catch (error) {
    console.error('BOOKING POST error', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(400).json({ error: error.message || 'Failed to create booking' });
  }
});

// ✅ Update booking
router.patch('/:id', RBAC.requirePermission('write:bookings'), async (req, res) => {
  try {
    const validatedData = updateBookingSchema.parse(req.body);
    delete validatedData.tenantId;

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, tenantId: getTenantId(req) },
      validatedData,
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(400).json({ error: error.message || 'Failed to update booking' });
  }
});

// ✅ Delete booking
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