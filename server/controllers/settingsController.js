const Settings = require('../models/Settings');
const Counter = require('../models/Counter');

// Get settings (creates default if none exists, migrates properties if empty)
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
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
    } else if (!settings.properties || settings.properties.length === 0) {
      // Migrate legacy single property to multiple properties array
      settings.properties = [
        {
          name: 'BUXIPUR SHER KOTHI',
          address: settings.propertyAddress || 'BUXIPUR SHER KOTHI, GORAKHPUR',
          defaultShopNumber: settings.defaultShopNumber || 'Second floor portion',
          ownerName: settings.ownerName || 'SRI KIRTI AGRAWAL',
          ownerFatherName: settings.ownerFatherName || 'LATE SRI SATYA PRAKASH AGRAWAL',
          isDefault: true,
        },
      ];
      await settings.save();
    } else {
      // Ensure at least one property is default
      const hasDefault = settings.properties.some((p) => p.isDefault);
      if (!hasDefault && settings.properties.length > 0) {
        settings.properties[0].isDefault = true;
        await settings.save();
      }
    }

    const counter = await Counter.findById('receiptNumber');
    const currentSeq = counter ? counter.seq : 14;

    res.json({
      ...settings.toObject(),
      currentCounter: currentSeq,
      nextReceiptNumber: currentSeq + 1,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch settings', error: error.message });
  }
};

// Update settings
exports.updateSettings = async (req, res) => {
  try {
    const {
      ownerName,
      ownerFatherName,
      propertyAddress,
      defaultShopNumber,
      properties,
      currencyPrefix,
      receiptNumberPrefix,
      receiptNumberPadding,
      setNextSequenceNumber,
    } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    if (ownerName !== undefined) settings.ownerName = ownerName.trim();
    if (ownerFatherName !== undefined) settings.ownerFatherName = ownerFatherName.trim();
    if (propertyAddress !== undefined) settings.propertyAddress = propertyAddress.trim();
    if (defaultShopNumber !== undefined) settings.defaultShopNumber = defaultShopNumber.trim();
    if (currencyPrefix !== undefined) settings.currencyPrefix = currencyPrefix.trim();
    if (receiptNumberPrefix !== undefined) settings.receiptNumberPrefix = receiptNumberPrefix.trim();
    if (receiptNumberPadding !== undefined) settings.receiptNumberPadding = Number(receiptNumberPadding) || 5;

    // Handle multiple properties
    if (Array.isArray(properties) && properties.length > 0) {
      const cleanProperties = properties.map((p, idx) => ({
        ...(p._id ? { _id: p._id } : {}),
        name: (p.name || `Property ${idx + 1}`).trim().toUpperCase(),
        address: (p.address || '').trim().toUpperCase(),
        defaultShopNumber: (p.defaultShopNumber || '').trim(),
        ownerName: (p.ownerName || settings.ownerName || '').trim().toUpperCase(),
        ownerFatherName: (p.ownerFatherName || settings.ownerFatherName || '').trim().toUpperCase(),
        isDefault: Boolean(p.isDefault),
      }));

      // Ensure at least one default
      const hasDefault = cleanProperties.some((p) => p.isDefault);
      if (!hasDefault) {
        cleanProperties[0].isDefault = true;
      }

      settings.properties = cleanProperties;

      // Sync top-level fields with the default property
      const defaultProp = cleanProperties.find((p) => p.isDefault) || cleanProperties[0];
      if (defaultProp) {
        settings.propertyAddress = defaultProp.address;
        if (defaultProp.defaultShopNumber) settings.defaultShopNumber = defaultProp.defaultShopNumber;
        if (defaultProp.ownerName) settings.ownerName = defaultProp.ownerName;
        if (defaultProp.ownerFatherName) settings.ownerFatherName = defaultProp.ownerFatherName;
      }
    }

    await settings.save();

    if (setNextSequenceNumber !== undefined && Number(setNextSequenceNumber) > 0) {
      const newCounterSeq = Number(setNextSequenceNumber) - 1;
      await Counter.findByIdAndUpdate(
        'receiptNumber',
        { seq: newCounterSeq },
        { upsert: true }
      );
    }

    const counter = await Counter.findById('receiptNumber');
    const currentSeq = counter ? counter.seq : 14;

    res.json({
      ...settings.toObject(),
      currentCounter: currentSeq,
      nextReceiptNumber: currentSeq + 1,
    });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update settings', error: error.message });
  }
};


