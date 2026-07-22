const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true,
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
}, {
  timestamps: true,
});

bookingSchema.index({ tenantId: 1, startTime: 1 });

bookingSchema.pre('validate', function(next) {
  if (this.endTime <= this.startTime) {
    return next(new Error('endTime must be after startTime'));
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
