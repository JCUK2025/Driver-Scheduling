const mongoose = require('mongoose');
const DeliveryArea = require('../models/DeliveryArea');
const inMemoryStore = require('../utils/inMemoryStore');

// Check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Create a new delivery area
const createDeliveryArea = async (req, res) => {
  try {
    const { name, colour, postcodes, deliveryDays, priority } = req.body;

    // Validate required fields
    if (!name || !postcodes || postcodes.length === 0) {
      return res.status(400).json({ 
        error: 'Name and at least one postcode are required' 
      });
    }

    // Use in-memory store if MongoDB not connected
    if (!isMongoConnected()) {
      const area = await inMemoryStore.create({
        name,
        colour: colour || '#3498db',
        postcodes: [...new Set(postcodes.map(pc => pc.toUpperCase()))],
        deliveryDays: deliveryDays ?? 1,
        priority: priority ?? 1
      });
      return res.status(201).json(area);
    }

    const deliveryArea = new DeliveryArea({
      name,
      colour: colour || '#3498db',
      postcodes,
      deliveryDays: deliveryDays ?? 1,
      priority: priority ?? 1
    });

    const savedArea = await deliveryArea.save();
    res.status(201).json(savedArea);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create delivery area' });
  }
};

// Get all delivery areas
const getAllDeliveryAreas = async (req, res) => {
  try {
    // Use in-memory store if MongoDB not connected
    if (!isMongoConnected()) {
      const areas = await inMemoryStore.findAll();
      return res.json(areas);
    }

    const areas = await DeliveryArea.find().sort({ createdAt: -1 });
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch delivery areas' });
  }
};

// Get a single delivery area by ID
const getDeliveryAreaById = async (req, res) => {
  try {
    // Use in-memory store if MongoDB not connected
    if (!isMongoConnected()) {
      const area = await inMemoryStore.findById(req.params.id);
      if (!area) {
        return res.status(404).json({ error: 'Delivery area not found' });
      }
      return res.json(area);
    }

    const area = await DeliveryArea.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ error: 'Delivery area not found' });
    }
    res.json(area);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch delivery area' });
  }
};

// Update a delivery area
const updateDeliveryArea = async (req, res) => {
  try {
    const { name, colour, postcodes, deliveryDays, priority } = req.body;

    // Validate required fields
    if (!name || !postcodes || postcodes.length === 0) {
      return res.status(400).json({ 
        error: 'Name and at least one postcode are required' 
      });
    }

    // Use in-memory store if MongoDB not connected
    if (!isMongoConnected()) {
      const area = await inMemoryStore.update(req.params.id, {
        name,
        colour: colour || '#3498db',
        postcodes: [...new Set(postcodes.map(pc => pc.toUpperCase()))],
        deliveryDays: deliveryDays ?? 1,
        priority: priority ?? 1
      });
      if (!area) {
        return res.status(404).json({ error: 'Delivery area not found' });
      }
      return res.json(area);
    }

    const area = await DeliveryArea.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ error: 'Delivery area not found' });
    }

    area.name = name;
    area.colour = colour || area.colour;
    area.postcodes = postcodes;
    area.deliveryDays = deliveryDays ?? area.deliveryDays;
    area.priority = priority ?? area.priority;

    const updatedArea = await area.save();
    res.json(updatedArea);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update delivery area' });
  }
};

// Delete a delivery area
const deleteDeliveryArea = async (req, res) => {
  try {
    // Use in-memory store if MongoDB not connected
    if (!isMongoConnected()) {
      const area = await inMemoryStore.delete(req.params.id);
      if (!area) {
        return res.status(404).json({ error: 'Delivery area not found' });
      }
      return res.json({ message: 'Delivery area deleted successfully', area });
    }

    const area = await DeliveryArea.findByIdAndDelete(req.params.id);
    if (!area) {
      return res.status(404).json({ error: 'Delivery area not found' });
    }
    res.json({ message: 'Delivery area deleted successfully', area });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete delivery area' });
  }
};

module.exports = {
  createDeliveryArea,
  getAllDeliveryAreas,
  getDeliveryAreaById,
  updateDeliveryArea,
  deleteDeliveryArea
};
