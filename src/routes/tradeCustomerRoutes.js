const express = require('express');
const router = express.Router();
const {
  createTradeCustomer,
  getAllTradeCustomers,
  getTradeCustomerById,
  updateTradeCustomer,
  deleteTradeCustomer
} = require('../controllers/tradeCustomerController');

// Create a new trade customer
router.post('/trade-customers', createTradeCustomer);

// Get all trade customers
router.get('/trade-customers', getAllTradeCustomers);

// Get a single trade customer by ID
router.get('/trade-customers/:id', getTradeCustomerById);

// Update a trade customer
router.put('/trade-customers/:id', updateTradeCustomer);

// Delete a trade customer
router.delete('/trade-customers/:id', deleteTradeCustomer);

module.exports = router;
