const express = require('express');
const router = express.Router();
const {
  createDeliveryArea,
  getAllDeliveryAreas,
  getDeliveryAreaById,
  updateDeliveryArea,
  deleteDeliveryArea
} = require('../controllers/deliveryAreaController');

// Create a new delivery area
router.post('/delivery-areas', createDeliveryArea);

// Get all delivery areas
router.get('/delivery-areas', getAllDeliveryAreas);

// Get a single delivery area by ID
router.get('/delivery-areas/:id', getDeliveryAreaById);

// Update a delivery area
router.put('/delivery-areas/:id', updateDeliveryArea);

// Delete a delivery area
router.delete('/delivery-areas/:id', deleteDeliveryArea);

module.exports = router;
