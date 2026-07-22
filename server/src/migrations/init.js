const mongoose = require('mongoose');
require('dotenv').config();

async function runMigration() {
  try {
    console.log('🔵 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create indexes for Tenant collection
    console.log('🔵 Creating Tenant indexes...');
    await mongoose.connection.collection('tenants').createIndex(
      { subdomain: 1 }, 
      { unique: true }
    );
    console.log('✅ Tenant indexes created');

    // Create indexes for User collection
    console.log('🔵 Creating User indexes...');
    await mongoose.connection.collection('users').createIndex(
      { email: 1 }, 
      { unique: true }
    );
    await mongoose.connection.collection('users').createIndex(
      { tenantId: 1 }
    );
    console.log('✅ User indexes created');

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();