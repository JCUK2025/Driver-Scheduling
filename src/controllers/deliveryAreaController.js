const DeliveryArea = require('../models/DeliveryArea');

// Create a new delivery area
const createDeliveryArea = async (req, res) => {
  try {
    const { name, colour, postcodes } = req.body;

    // Validate required fields
    if (!name || !postcodes || postcodes.length === 0) {
      return res.status(400).json({ 
        error: 'Name and at least one postcode are required' 
      });
    }

    const deliveryArea = new DeliveryArea({
      name,
      colour: colour || '#3498db',
      postcodes
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
    const areas = await DeliveryArea.find().sort({ createdAt: -1 });
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch delivery areas' });
  }
};

// Get a single delivery area by ID
const getDeliveryAreaById = async (req, res) => {
  try {
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
    const { name, colour, postcodes } = req.body;

    // Validate required fields
    if (!name || !postcodes || postcodes.length === 0) {
      return res.status(400).json({ 
        error: 'Name and at least one postcode are required' 
      });
    }

    const area = await DeliveryArea.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ error: 'Delivery area not found' });
    }

    area.name = name;
    area.colour = colour || area.colour;
    area.postcodes = postcodes;

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
