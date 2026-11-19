const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    sequenceNumber: {
      type: Number,
      required: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerFatherName: {
      type: String,
      trim: true,
      default: '',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be greater than 0'],
    },
    amountInWords: {
      type: String,
      required: [true, 'Amount in words is required'],
      trim: true,
    },
    rentMonth: {
      type: String,
      required: [true, 'Rent month is required'],
      trim: true,
    },
    receiptDate: {
      type: String,
      required: [true, 'Receipt date is required'],
      trim: true,
    },
    shopNumber: {
      type: String,
      default: 'Second floor portion',
      trim: true,
    },
    propertyName: {
      type: String,
      default: '',
      trim: true,
    },
    propertyAddress: {
      type: String,
      default: 'BUXIPUR SHER KOTHI, GORAKHPUR',
      trim: true,
    },
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
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Receipt', receiptSchema);

