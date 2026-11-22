const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const customerRoutes = require('./routes/customerRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Seed initial default settings and sample customer if empty
const seedDefaults = async () => {
  try {
    const Settings = require('./models/Settings');
    const Customer = require('./models/Customer');
    const Counter = require('./models/Counter');

    let settings = await Settings.findOne();
    if (!settings) {
      await Settings.create({
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
      console.log('Default settings seeded');
    }

    let counter = await Counter.findById('receiptNumber');
    if (!counter) {
      await Counter.create({ _id: 'receiptNumber', seq: 14 });
      console.log('Counter initialized to 14 (so next is 00015)');
    }

    const customerCount = await Customer.countDocuments();
    if (customerCount === 0) {
      await Customer.create([
        {
          name: 'SRI SUNNY KUMAR',
          fatherName: '',
          phone: '+91 9876543210',
          address: 'Gorakhpur, Uttar Pradesh',
          defaultShopNumber: 'Second floor portion',
          defaultAmount: 7500,
          notes: 'Regular tenant',
        },
        {
          name: 'SRI RAVI PRAKASH AGARWAL',
          fatherName: 'SMT. URMILA AGARWAL',
          phone: '+91 9839000000',
          address: 'Buxipur, Gorakhpur',
          defaultShopNumber: 'Ground floor shop 1',
          defaultAmount: 9000,
          notes: 'Shop tenant',
        },
      ]);
      console.log('Sample customers seeded');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    console.log(`Rent Receipt Server running on port ${PORT}`);
    await seedDefaults();
  });
}

module.exports = app;

