const mongoose = require('mongoose');

const DeliveryGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  postcodes: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: String, required: true }
});

module.exports = mongoose.model('DeliveryGroup', DeliveryGroupSchema);