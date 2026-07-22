const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Tenant = require('./models/Tenant');
const User = require('./models/User');
require('dotenv').config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Tenant.deleteMany({});
    await User.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create test tenants
    const tenants = [
      {
        name: 'Acme Corp',
        subdomain: 'acme',
        email: 'acme@example.com',
        plan: 'premium',
        isActive: true,
      },
      {
        name: 'Beta Inc',
        subdomain: 'beta',
        email: 'beta@example.com',
        plan: 'basic',
        isActive: true,
      },
      {
        name: 'Gamma LLC',
        subdomain: 'gamma',
        email: 'gamma@example.com',
        plan: 'free',
        isActive: true,
      },
    ];

    for (const tenantData of tenants) {
      const tenant = new Tenant(tenantData);
      await tenant.save();
      console.log(`✅ Created tenant: ${tenant.name}`);

      // Create owner user for each tenant
      const owner = new User({
        tenantId: tenant._id,
        email: `owner@${tenant.subdomain}.com`,
        password: 'password123',
        firstName: tenant.name.split(' ')[0],
        lastName: 'Owner',
        role: 'owner',
        isActive: true,
      });
      await owner.save();
      console.log(`✅ Created owner: ${owner.email}`);

      // Create staff user for each tenant
      const staff = new User({
        tenantId: tenant._id,
        email: `staff@${tenant.subdomain}.com`,
        password: 'password123',
        firstName: 'John',
        lastName: 'Staff',
        role: 'staff',
        isActive: true,
      });
      await staff.save();
      console.log(`✅ Created staff: ${staff.email}`);
    }

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();