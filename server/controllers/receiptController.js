const Receipt = require('../models/Receipt');
const Counter = require('../models/Counter');
const Settings = require('../models/Settings');

// Helper to pad number: 15 -> "00015"
const formatReceiptNumber = (num, padding = 5, prefix = '') => {
  return `${prefix}${String(num).padStart(padding, '0')}`;
};

// Get the next anticipated receipt number
exports.getNextReceiptNumber = async (req, res) => {
  try {
    let counter = await Counter.findById('receiptNumber');
    if (!counter) {
      // Find highest existing sequenceNumber in Receipt if any
      const highest = await Receipt.findOne().sort({ sequenceNumber: -1 });
      const initialSeq = highest ? highest.sequenceNumber : 14;
      counter = await Counter.create({ _id: 'receiptNumber', seq: initialSeq });
    }

    const nextSeq = counter.seq + 1;
    const settings = await Settings.findOne() || {};
    const padding = settings.receiptNumberPadding || 5;
    const prefix = settings.receiptNumberPrefix || '';
    const formatted = formatReceiptNumber(nextSeq, padding, prefix);

    res.json({
      nextSequence: nextSeq,
      formattedReceiptNumber: formatted,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get next receipt number', error: error.message });
  }
};

// Get all receipts (with search, filter, pagination)
exports.getReceipts = async (req, res) => {
  try {
    const { search, month, property } = req.query;
    let query = {};

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { receiptNumber: regex },
        { customerName: regex },
        { customerFatherName: regex },
        { rentMonth: regex },
        { shopNumber: regex },
        { propertyName: regex },
        { propertyAddress: regex },
      ];
    }

    if (month && month.trim()) {
      query.rentMonth = new RegExp(month.trim(), 'i');
    }

    if (property && property.trim()) {
      const propRegex = new RegExp(property.trim(), 'i');
      const propFilter = {
        $or: [
          { propertyName: propRegex },
          { propertyAddress: propRegex },
        ],
      };
      if (query.$or) {
        query = { $and: [{ $or: query.$or }, propFilter] };
        if (query.rentMonth) query.rentMonth = new RegExp(month.trim(), 'i');
      } else {
        query.$or = propFilter.$or;
      }
    }

    const receipts = await Receipt.find(query)
      .sort({ sequenceNumber: -1, createdAt: -1 })
      .populate('customerId', 'phone address');

    res.json(receipts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch receipts', error: error.message });
  }
};

// Get single receipt by ID
exports.getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id).populate('customerId');
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch receipt', error: error.message });
  }
};

// Create new receipt
exports.createReceipt = async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      customerFatherName,
      amount,
      amountInWords,
      rentMonth,
      receiptDate,
      shopNumber,
      propertyName,
      propertyAddress,
      ownerName,
      ownerFatherName,
      customReceiptNumber,
      notes,
    } = req.body;

    if (!customerName || !amount || !amountInWords || !rentMonth || !receiptDate) {
      return res.status(400).json({
        message: 'Missing required receipt fields: customerName, amount, amountInWords, rentMonth, receiptDate',
      });
    }

    let finalSeq;
    let finalReceiptNumber;

    if (customReceiptNumber && customReceiptNumber.trim()) {
      const cleanNum = customReceiptNumber.trim();
      const existing = await Receipt.findOne({ receiptNumber: cleanNum });
      if (existing) {
        return res.status(400).json({ message: `Receipt number "${cleanNum}" already exists. Please choose a unique number.` });
      }
      finalReceiptNumber = cleanNum;
      // Extract numeric suffix if possible, or use next sequence
      const parsed = parseInt(cleanNum.replace(/\D/g, ''), 10);
      finalSeq = !isNaN(parsed) && parsed > 0 ? parsed : 0;

      // Update counter if user custom number is higher
      if (finalSeq > 0) {
        await Counter.findByIdAndUpdate(
          'receiptNumber',
          { $max: { seq: finalSeq } },
          { upsert: true }
        );
      }
    } else {
      // Atomic increment
      const updatedCounter = await Counter.findByIdAndUpdate(
        'receiptNumber',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      finalSeq = updatedCounter.seq;
      const settings = await Settings.findOne() || {};
      const padding = settings.receiptNumberPadding || 5;
      const prefix = settings.receiptNumberPrefix || '';
      finalReceiptNumber = formatReceiptNumber(finalSeq, padding, prefix);

      // Verify no collision
      const checkCollision = await Receipt.findOne({ receiptNumber: finalReceiptNumber });
      if (checkCollision) {
        // If collision, bump to max + 1
        const maxReceipt = await Receipt.findOne().sort({ sequenceNumber: -1 });
        finalSeq = (maxReceipt ? maxReceipt.sequenceNumber : finalSeq) + 1;
        await Counter.findByIdAndUpdate('receiptNumber', { seq: finalSeq });
        finalReceiptNumber = formatReceiptNumber(finalSeq, padding, prefix);
      }
    }

    const receipt = new Receipt({
      receiptNumber: finalReceiptNumber,
      sequenceNumber: finalSeq,
      customerId: customerId || null,
      customerName: customerName.trim(),
      customerFatherName: customerFatherName ? customerFatherName.trim() : '',
      amount: Number(amount),
      amountInWords: amountInWords.trim(),
      rentMonth: rentMonth.trim(),
      receiptDate: receiptDate.trim(),
      shopNumber: shopNumber ? shopNumber.trim() : 'Second floor portion',
      propertyName: propertyName ? propertyName.trim() : '',
      propertyAddress: propertyAddress ? propertyAddress.trim() : 'BUXIPUR SHER KOTHI, GORAKHPUR',
      ownerName: ownerName ? ownerName.trim() : 'SRI KIRTI AGRAWAL',
      ownerFatherName: ownerFatherName ? ownerFatherName.trim() : 'LATE SRI SATYA PRAKASH AGRAWAL',
      notes: notes ? notes.trim() : '',
    });

    const saved = await receipt.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Receipt number must be unique. Duplicate detected.' });
    }
    res.status(400).json({ message: 'Failed to create receipt', error: error.message });
  }
};

// Update receipt
exports.updateReceipt = async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      customerFatherName,
      amount,
      amountInWords,
      rentMonth,
      receiptDate,
      shopNumber,
      propertyName,
      propertyAddress,
      ownerName,
      ownerFatherName,
      notes,
    } = req.body;

    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    if (customerName) receipt.customerName = customerName.trim();
    if (customerFatherName !== undefined) receipt.customerFatherName = customerFatherName.trim();
    if (customerId !== undefined) receipt.customerId = customerId || null;
    if (amount) receipt.amount = Number(amount);
    if (amountInWords) receipt.amountInWords = amountInWords.trim();
    if (rentMonth) receipt.rentMonth = rentMonth.trim();
    if (receiptDate) receipt.receiptDate = receiptDate.trim();
    if (shopNumber) receipt.shopNumber = shopNumber.trim();
    if (propertyName !== undefined) receipt.propertyName = propertyName.trim();
    if (propertyAddress) receipt.propertyAddress = propertyAddress.trim();
    if (ownerName) receipt.ownerName = ownerName.trim();
    if (ownerFatherName) receipt.ownerFatherName = ownerFatherName.trim();
    if (notes !== undefined) receipt.notes = notes.trim();

    const updated = await receipt.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update receipt', error: error.message });
  }
};

// Delete receipt
exports.deleteReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findByIdAndDelete(req.params.id);
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    res.json({ message: 'Receipt deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete receipt', error: error.message });
  }
};

