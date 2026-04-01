const mongoose = require('mongoose');

const PortSchema = new mongoose.Schema({
  portId: { type: Number, required: true, unique: true },
  status: { type: String, enum: ['active', 'error', 'empty'], default: 'empty' },
  device: { type: String, default: 'Unassigned' },
  mac: { type: String, default: '-' },
  speed: { type: String, default: '-' },
  vlan: { type: String, default: '-' }
});

module.exports = mongoose.model('Port', PortSchema);