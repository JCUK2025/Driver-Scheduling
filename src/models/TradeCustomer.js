const mongoose = require('mongoose');

const TradeCustomerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Customer name is required'],
    trim: true
  },
  postcodes: { 
    type: [String], 
    required: [true, 'At least one postcode area is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one postcode area is required'
    }
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

// Ensure postcode areas are uppercase
TradeCustomerSchema.pre('save', function(next) {
  if (this.postcodes && Array.isArray(this.postcodes)) {
    this.postcodes = this.postcodes.map(p => p.toUpperCase());
  }
  next();
});

module.exports = mongoose.model('TradeCustomer', TradeCustomerSchema);
