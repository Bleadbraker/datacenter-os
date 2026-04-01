const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');

// GET all equipment
router.get('/', async (req, res) => {
  try {
    const equipment = await Equipment.find();
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new equipment
router.post('/', async (req, res) => {
  const item = new Equipment(req.body);
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;