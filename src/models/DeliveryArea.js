const mongoose = require('mongoose');

const DeliveryAreaSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Delivery area name is required'],
    trim: true
  },
  colour: { 
    type: String, 
    required: [true, 'Colour is required'],
    validate: {
      validator: function(v) {
        return /^#[0-9A-F]{6}$/i.test(v);
      },
      message: props => `${props.value} is not a valid hex colour code`
    },
    default: '#3498db'
  },
  postcodes: { 
    type: [String], 
    required: [true, 'At least one postcode is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one postcode is required'
    }
  },
  deliveryDays: {
    type: Number,
    enum: [1, 2, 3],
    required: [true, 'Delivery days is required'],
    default: 1
  },
  priority: {
    type: Number,
    enum: [1, 2],
    required: [true, 'Priority is required'],
    default: 1
  },
  weekAssignment: {
    type: Number,
    enum: [null, 1, 2],
    default: null,
    required: false
  },
  consecutiveWith: {
    type: String,
    required: false,
    default: null
  },
  routeOrder: {
    type: Number,
    min: 1,
    max: 3,
    required: false,
    default: null
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
DeliveryAreaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure postcodes are uppercase and unique
DeliveryAreaSchema.pre('save', function(next) {
  if (this.postcodes) {
    this.postcodes = [...new Set(this.postcodes.map(pc => pc.toUpperCase()))];
  }
  next();
});

module.exports = mongoose.model('DeliveryArea', DeliveryAreaSchema);
