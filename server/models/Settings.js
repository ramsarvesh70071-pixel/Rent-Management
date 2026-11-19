const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Property name is required'],
    trim: true,
    default: 'Main Property',
  },
  address: {
    type: String,
    required: [true, 'Property address is required'],
    trim: true,
  },
  defaultShopNumber: {
    type: String,
    trim: true,
    default: 'Second floor portion',
  },
  ownerName: {
    type: String,
    trim: true,
    default: '',
  },
  ownerFatherName: {
    type: String,
    trim: true,
    default: '',
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const settingsSchema = new mongoose.Schema(
  {
    ownerName: {
      type: String,
      default: 'SRI KIRTI AGRAWAL',
      trim: true,
    },
    ownerFatherName: {
      type: String,
      default: 'LATE SRI SATYA PRAKASH AGRAWAL',
      trim: true,
    },
    propertyAddress: {
      type: String,
      default: 'BUXIPUR SHER KOTHI, GORAKHPUR',
      trim: true,
    },
    defaultShopNumber: {
      type: String,
      default: 'Second floor portion',
      trim: true,
    },
    properties: [propertySchema],
    currencyPrefix: {
      type: String,
      default: 'Rs.',
      trim: true,
    },
    receiptNumberPrefix: {
      type: String,
      default: '',
      trim: true,
    },
    receiptNumberPadding: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', settingsSchema);


