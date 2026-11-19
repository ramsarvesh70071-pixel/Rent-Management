const Customer = require('../models/Customer');

// Get all customers (with optional search and property filter)
exports.getCustomers = async (req, res) => {
  try {
    const { search, property } = req.query;
    let query = {};
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { fatherName: regex },
        { phone: regex },
        { address: regex },
        { defaultShopNumber: regex },
        { propertyName: regex },
      ];
    }
    if (property && property.trim()) {
      query.propertyName = new RegExp(property.trim(), 'i');
    }
    const customers = await Customer.find(query).sort({ name: 1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch customers', error: error.message });
  }
};

// Get single customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch customer', error: error.message });
  }
};

// Create new customer
exports.createCustomer = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      phone,
      address,
      defaultShopNumber,
      defaultAmount,
      propertyId,
      propertyName,
      notes,
    } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Customer name is required' });
    }

    const customer = new Customer({
      name: name.trim(),
      fatherName: fatherName ? fatherName.trim() : '',
      phone: phone ? phone.trim() : '',
      address: address ? address.trim() : '',
      defaultShopNumber: defaultShopNumber ? defaultShopNumber.trim() : '',
      defaultAmount: defaultAmount ? Number(defaultAmount) : 0,
      propertyId: propertyId ? String(propertyId).trim() : '',
      propertyName: propertyName ? propertyName.trim() : '',
      notes: notes ? notes.trim() : '',
    });

    const saved = await customer.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create customer', error: error.message });
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      phone,
      address,
      defaultShopNumber,
      defaultAmount,
      propertyId,
      propertyName,
      notes,
    } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Customer name is required' });
    }

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.name = name.trim();
    customer.fatherName = fatherName ? fatherName.trim() : '';
    customer.phone = phone ? phone.trim() : '';
    customer.address = address ? address.trim() : '';
    customer.defaultShopNumber = defaultShopNumber !== undefined ? defaultShopNumber.trim() : customer.defaultShopNumber;
    customer.defaultAmount = defaultAmount !== undefined ? Number(defaultAmount) : customer.defaultAmount;
    if (propertyId !== undefined) customer.propertyId = String(propertyId).trim();
    if (propertyName !== undefined) customer.propertyName = propertyName.trim();
    customer.notes = notes !== undefined ? notes.trim() : customer.notes;

    const updated = await customer.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update customer', error: error.message });
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete customer', error: error.message });
  }
};

