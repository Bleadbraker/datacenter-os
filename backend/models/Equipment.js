const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Server', 'Network', 'Storage'], required: true },
  size: { type: Number, required: true }, // How many U-spaces it takes
  startU: { type: Number, required: true }, // The slot number it starts at
  status: { type: String, default: 'online' }
});

module.exports = mongoose.model('Equipment', EquipmentSchema);