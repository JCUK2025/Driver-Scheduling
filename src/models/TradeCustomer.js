const mongoose = require('mongoose');

const TradeCustomerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Customer name is required'],
    trim: true
  },
  postcodeArea: { 
    type: String, 
    required: [true, 'Postcode area is required'],
    trim: true
  },
  priority: {
    type: String,
    enum: ['P1', 'P2'],
    required: [true, 'Priority is required'],
    default: 'P1'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt timestamp before saving
TradeCustomerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure postcode area is uppercase
TradeCustomerSchema.pre('save', function(next) {
  if (this.postcodeArea) {
    this.postcodeArea = this.postcodeArea.toUpperCase();
  }
  next();
});

module.exports = mongoose.model('TradeCustomer', TradeCustomerSchema);
