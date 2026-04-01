require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Allows your React app to securely talk to this API
app.use(express.json()); // Allows the server to accept JSON data

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 MongoDB Database Connected Successfully'))
  .catch(err => console.error('🔴 MongoDB Connection Error:', err));

// Route Middleware
const logRouter = require('./routes/logs');
app.use('/api/logs', logRouter);
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/ports', require('./routes/ports'));
// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 DCIM Backend Server running on http://localhost:${PORT}`);
});