const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '.env') });

const Customer = require('./models/Customer');
const Receipt = require('./models/Receipt');
const Settings = require('./models/Settings');
const Counter = require('./models/Counter');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rent_receipt_db';

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected successfully: ${mongoose.connection.host}`);

    // Clear existing data for fresh seed
    console.log('Clearing existing collections...');
    await Promise.all([
      Customer.deleteMany({}),
      Receipt.deleteMany({}),
      Settings.deleteMany({}),
      Counter.deleteMany({}),
    ]);
    console.log('Cleared Customer, Receipt, Settings, Counter collections.');

    // 1. Seed Property & Owner Settings
    console.log('Seeding Default Settings...');
    const defaultSettings = await Settings.create({
      ownerName: 'SRI KIRTI AGRAWAL',
      ownerFatherName: 'LATE SRI SATYA PRAKASH AGRAWAL',
      propertyAddress: 'BUXIPUR SHER KOTHI, GORAKHPUR',
      defaultShopNumber: 'Second floor portion',
      properties: [
        {
          name: 'BUXIPUR SHER KOTHI',
          address: 'BUXIPUR SHER KOTHI, GORAKHPUR',
          defaultShopNumber: 'Second floor portion',
          ownerName: 'SRI KIRTI AGRAWAL',
          ownerFatherName: 'LATE SRI SATYA PRAKASH AGRAWAL',
          isDefault: true,
        },
      ],
      currencyPrefix: 'Rs.',
      receiptNumberPrefix: '',
      receiptNumberPadding: 5,
    });
    console.log(`Created Settings: ${defaultSettings.ownerName}`);

    // 2. Seed Receipt Sequence Counter
    console.log('Initializing Receipt Counter...');
    // seq = 14 so the next generated receipt is 15 -> #00015 (matching photo)
    await Counter.create({
      _id: 'receiptNumber',
      seq: 14,
    });
    console.log('Counter initialized to 14 (Next receipt will be #00015).');

    // 3. Seed Customers / Tenants
    console.log('Seeding Customers / Tenants...');
    const customers = await Customer.create([
      {
        name: 'SRI SUNNY KUMAR',
        phone: '+91 9876543210',
        address: 'Buxipur, Sher Kothi, Gorakhpur',
        defaultShopNumber: 'Second floor portion',
        defaultAmount: 7500,
        notes: 'Regular tenant since 2024',
      },
      {
        name: 'SRI RAVI PRAKASH AGARWAL',
        phone: '+91 9839000000',
        address: 'Buxipur, Gorakhpur',
        defaultShopNumber: 'Ground floor shop 1',
        defaultAmount: 9000,
        notes: 'Ground floor commercial shop',
      },
      {
        name: 'M/S GUPTA ELECTRONICS',
        phone: '+91 9912345678',
        address: 'Sher Kothi, Gorakhpur',
        defaultShopNumber: 'Shop No. 4, Ground Floor',
        defaultAmount: 12000,
        notes: 'Electronics showroom tenant',
      },
      {
        name: 'SHREE RAM APPARELS',
        phone: '+91 9415000000',
        address: 'Buxipur, Gorakhpur',
        defaultShopNumber: 'First floor portion',
        defaultAmount: 8500,
        notes: 'Garment workshop & storage',
      },
    ]);
    console.log(`Seeded ${customers.length} customers successfully.`);

    // 4. Seed a Sample Previous Receipt (#00014) in History
    console.log('Seeding Sample Previous Receipt in History...');
    await Receipt.create({
      receiptNumber: '00014',
      sequenceNumber: 14,
      customerId: customers[0]._id,
      customerName: 'SRI SUNNY KUMAR',
      customerFatherName: '',
      amount: 7500,
      amountInWords: 'SEVEN THOUSAND FIVE HUNDRED ONLY',
      rentMonth: 'OCTOBER 2026',
      receiptDate: '2026-10-05',
      shopNumber: 'Second floor portion',
      propertyAddress: 'BUXIPUR SHER KOTHI, GORAKHPUR',
      ownerName: 'SRI KIRTI AGRAWAL',
      ownerFatherName: 'LATE SRI SATYA PRAKASH AGRAWAL',
      notes: 'October 2026 rent payment',
    });
    console.log('Sample previous receipt (#00014) created in history.');

    console.log('\n=========================================');
    console.log('   DATABASE SEED COMPLETED SUCCESSFULLY!  ');
    console.log('=========================================');
    console.log('- Default Owner: SRI KIRTI AGRAWAL');
    console.log('- Location: BUXIPUR SHER KOTHI, GORAKHPUR');
    console.log('- Counter: Next receipt will be #00015');
    console.log(`- Customers: ${customers.length} tenants loaded`);
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error.message);
    process.exit(1);
  }
};

seedData();

