const mongoose = require('mongoose');

// Schedule assignment for a specific driver on a specific day in a specific week
const ScheduleAssignmentSchema = new mongoose.Schema({
  driverId: {
    type: String,
    required: true
  },
  deliveryAreaId: {
    type: String,
    required: true
  },
  week: {
    type: Number,
    enum: [1, 2],
    required: true
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    required: true
  },
  startDay: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
  endDay: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  }
});

const ScheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Current Schedule'
  },
  assignments: [ScheduleAssignmentSchema],
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
ScheduleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
