const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Driver name is required'],
    trim: true
  },
  availableDays: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  deliveryDayCapability: {
    type: Number,
    enum: [1, 2, 3],
    required: [true, 'Delivery day capability is required'],
    default: 1
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
DriverSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Driver', DriverSchema);
