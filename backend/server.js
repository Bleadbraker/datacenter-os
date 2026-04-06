const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const app = express();

// --- Standard Middleware ---
app.use(cors());
app.use(express.json());

// --- Security Middleware (The Invisible Bouncer) ---
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const clientKey = req.headers['x-admin-key'];
    
    if (clientKey !== 'admin2026') {
      console.log("🚨 Blocked an unauthorized access attempt!");
      return res.status(403).json({ error: "Access Denied: Missing or Invalid Security Key" });
    }
  }
  next();
});

// --- API Routes ---
app.use('/api/logs', require('./routes/logs')); 
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/ports', require('./routes/ports'));

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 MongoDB Database Connected Successfully'))
  .catch(err => console.log('🔴 MongoDB Connection Error:', err));

// --- Start the Server & WebSockets ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // Allows your Vercel frontend to connect
});

// Broadcast fake network data every 2 seconds for the Dashboard
io.on('connection', (socket) => {
  console.log('⚡ Dashboard Client Connected!');
  
  setInterval(() => {
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
    const traffic = Math.floor(Math.random() * 800) + 200;
    socket.emit('network-update', { time: timestamp, traffic: traffic });
  }, 2000);
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 DCIM Backend Server running on http://localhost:${PORT}`));