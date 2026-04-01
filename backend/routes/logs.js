const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

// GET: Fetch all access logs
router.get('/', async (req, res) => {
  try {
    const logs = await Log.find().sort({ timeIn: -1 }); // Sort newest first
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Create a new access log
router.post('/', async (req, res) => {
  const log = new Log({
    logId: `LOG-${Math.floor(Math.random() * 10000)}`, // Auto-generate ID
    name: req.body.name,
    role: req.body.role,
    clearance: req.body.clearance,
    zone: req.body.zone,
    status: req.body.status
  });

  try {
    const newLog = await log.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;