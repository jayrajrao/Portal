// scripts/create_admin.js
// Usage: node scripts/create_admin.js
// Make sure your MongoDB is running and the MONGO_URI below is correct.

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Adjust this path if your models folder is different
const UserModel = require('../model/UserModel');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Admission_portal';

async function run() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB:', MONGO_URI);

    const adminEmail = 'admin@example.com';     // change to your desired admin email
    const adminPassword = 'Admin@123';          // change to a strong password before using in production
    const adminName = 'Admin';

    const existing = await UserModel.findOne({ email: adminEmail.toLowerCase() });
    if (existing) {
      console.log('Admin user already exists:', existing.email);
      console.log('If you forgot the password, either update it in DB or create a new admin with a different email.');
      await mongoose.disconnect();
      process.exit(0);
    }

    const hashed = await bcrypt.hash(adminPassword, 10);

    const admin = await UserModel.create({
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: hashed,
      role: 'admin',
    });

    console.log('Created admin user:');
    console.log('  email:', admin.email);
    console.log('  password:', adminPassword);
    console.log('  name:', admin.name);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    try { await mongoose.disconnect(); } catch(e){}
    process.exit(1);
  }
}

run();
