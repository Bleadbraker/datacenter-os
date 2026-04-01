const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  logId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  clearance: { type: String, required: true },
  zone: { type: String, required: true },
  timeIn: { type: Date, default: Date.now },
  timeOut: { type: Date },
  status: { type: String, enum: ['Active', 'Departed', 'Denied'], default: 'Active' }
});

module.exports = mongoose.model('Log', LogSchema);