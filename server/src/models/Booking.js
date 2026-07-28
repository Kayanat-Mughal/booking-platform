const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clientName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  clientEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/,
  },
  clientPhone: {
    type: String,
    trim: true,
  },
  service: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
    validate: {
      validator(value) {
        return !this.startTime || value > this.startTime;
      },
      message: 'End time must be after start time',
    },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  idempotencyKey: {
    type: String,
    unique: true,
    sparse: true,
  },
}, {
  timestamps: true,
});

// Indexes for performance
bookingSchema.index({ tenantId: 1, startTime: 1 });
bookingSchema.index({ clientEmail: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);