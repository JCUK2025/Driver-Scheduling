const mongoose = require('mongoose');
const TradeCustomer = require('../models/TradeCustomer');
const inMemoryStore = require('../utils/inMemoryStore');

// Check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Create a new trade customer
const createTradeCustomer = async (req, res) => {
  try {
    const { name, postcodes, priority, notes } = req.body;

    // Validate required fields
    if (!name || !postcodes || !Array.isArray(postcodes) || postcodes.length === 0) {
      return res.status(400).json({ 
        error: 'Customer name and at least one postcode area are required' 
      });
    }

    // Use in-memory store if MongoDB not connected
    if (!isMongoConnected()) {
      const customer = await inMemoryStore.createTradeCustomer({
        name,
        postcodes: postcodes.map(p => p.toUpperCase()),
        priority: priority || 'P1',
        notes: notes || ''
      });
      return res.status(201).json(customer);
    }

    const tradeCustomer = new TradeCustomer({
      name,
      postcodes,
      priority: priority || 'P1',
      notes: notes || ''
    });

    const savedCustomer = await tradeCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create trade customer' });
  }
};

// Get all trade customers
const getAllTradeCustomers = async (req, res) => {
  try {
    // Use in-memory store if MongoDB not connected
    if (!isMongoConnected()) {
      const customers = await inMemoryStore.findAllTradeCustomers();
      return res.json(customers);
    }

    const customers = await TradeCustomer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trade customers' });
  }
};

// Get a single trade customer by ID
const getTradeCustomerById = async (req, res) => {
  try {
    // Use in-memory store if MongoDB not connected
    if (!isMongoConnected()) {
      const customer = await inMemoryStore.findTradeCustomerById(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: 'Trade customer not found' });
      }
      return res.json(customer);
    }

    const customer = await TradeCustomer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Trade customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trade customer' });
  }
};

// Update a trade customer
const updateTradeCustomer = async (req, res) => {
  try {
    const { name, postcodes, priority, notes } = req.body;

    // Validate required fields
    if (!name || !postcodes || !Array.isArray(postcodes) || postcodes.length === 0) {
      return res.status(400).json({ 
        error: 'Customer name and at least one postcode area are required' 
      });
    }

    // Use in-memory store if MongoDB not connected
    if (!isMongoConnected()) {
      const customer = await inMemoryStore.updateTradeCustomer(req.params.id, {
        name,
        postcodes: postcodes.map(p => p.toUpperCase()),
        priority: priority || 'P1',
        notes: notes || ''
      });
      if (!customer) {
        return res.status(404).json({ error: 'Trade customer not found' });
      }
      return res.json(customer);
    }

    const customer = await TradeCustomer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Trade customer not found' });
    }

    customer.name = name;
    customer.postcodes = postcodes;
    customer.priority = priority || customer.priority;
    customer.notes = notes !== undefined ? notes : customer.notes;

    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update trade customer' });
  }
};

// Delete a trade customer
const deleteTradeCustomer = async (req, res) => {
  try {
    // Use in-memory store if MongoDB not connected
    if (!isMongoConnected()) {
      const customer = await inMemoryStore.deleteTradeCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: 'Trade customer not found' });
      }
      return res.json({ message: 'Trade customer deleted successfully', customer });
    }

    const customer = await TradeCustomer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Trade customer not found' });
    }
    res.json({ message: 'Trade customer deleted successfully', customer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete trade customer' });
  }
};

module.exports = {
  createTradeCustomer,
  getAllTradeCustomers,
  getTradeCustomerById,
  updateTradeCustomer,
  deleteTradeCustomer
};
