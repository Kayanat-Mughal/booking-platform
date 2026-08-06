const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,  // ✅ Removes extra spaces from start and end
    maxlength: [100, 'Company name cannot exceed 100 characters'],
  },
  subdomain: {
    type: String,
    required: [true, 'Subdomain is required'],
    unique: true,
    lowercase: true,  // ✅ Auto-converts to lowercase
    trim: true,  // ✅ Removes extra spaces
    match: [/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'],
    minlength: [3, 'Subdomain must be at least 3 characters'],
    maxlength: [50, 'Subdomain cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,  // ✅ Auto-converts to lowercase
    trim: true,  // ✅ Removes extra spaces
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  plan: {
    type: String,
    enum: {
      values: ['free', 'basic', 'premium'],
      message: 'Plan must be either: free, basic, or premium',
    },
    default: 'free',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // Add these fields to your tenant schema
stripeCustomerId: {
  type: String,
  sparse: true,
},
stripeSubscriptionId: {
  type: String,
  sparse: true,
},
subscriptionStatus: {
  type: String,
  enum: ['active', 'inactive', 'past_due', 'canceled', 'trialing'],
  default: 'inactive',
},
subscriptionEndDate: {
  type: Date,
},
plan: {
  type: String,
  enum: ['free', 'basic', 'premium'],
  default: 'free',
}
}, {
  timestamps: true  // ✅ Auto-adds createdAt and updatedAt
});



module.exports = mongoose.model('Tenant', tenantSchema);