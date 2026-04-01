const express = require('express');
const router = express.Router();
const Port = require('../models/Port');

// GET all ports (and auto-generate 24 empty ports if none exist)
router.get('/', async (req, res) => {
  try {
    let ports = await Port.find().sort({ portId: 1 });
    
    // Auto-initialize 24 ports if the database is brand new
    if (ports.length === 0) {
      const initialPorts = Array.from({ length: 24 }, (_, i) => ({ portId: i + 1 }));
      ports = await Port.insertMany(initialPorts);
    }
    
    res.json(ports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT: Update a specific port (Simulate patching a cable)
router.put('/:id', async (req, res) => {
  try {
    const updatedPort = await Port.findOneAndUpdate(
      { portId: req.params.id },
      req.body,
      { new: true }
    );
    res.json(updatedPort);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;