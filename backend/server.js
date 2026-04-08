const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken'); // <--- The new Security Library

const app = express();
const SECRET_KEY = process.env.JWT_SECRET || "super-secret-datacenter-key-2026";

// --- Standard Middleware ---
app.use(cors());
app.use(express.json());

// --- LOGIN ROUTE (The Front Door) ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // In a massive production app, you would check a MongoDB "Users" collection here.
  // For our OS, we are hardcoding the Master Admin credentials.
  if (username === 'admin' && password === 'admin2026') {
    // Generate a secure badge that expires in 2 hours
    const token = jwt.sign({ role: 'admin' }, SECRET_KEY, { expiresIn: '2h' });
    res.json({ token: token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// --- Security Middleware (The JWT Bouncer) ---
app.use('/api', (req, res, next) => {
  // 1. Always let people access the login page
  if (req.path === '/login') return next();

  // 2. Check for a valid badge on all POST, PUT, and DELETE requests
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const authHeader = req.headers['authorization'];
    // Extract the token from the "Bearer <token>" string
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
      console.log("🚨 Blocked: Someone tried to make changes without logging in!");
      return res.status(403).json({ error: "Access Denied: No Token Provided" });
    }

    // Verify the badge is real and hasn't expired
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid or Expired Token" });
      req.user = user;
      next(); // Badge is valid, let them through!
    });
  } else {
    // 3. Let standard GET requests (like loading the dashboard charts) pass through
    next(); 
  }
});

// --- API Routes ---
app.use('/api/logs', require('./routes/logs')); 
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/ports', require('./routes/ports'));

// --- Metrics Route ---
app.get('/api/metrics', (req, res) => {
  const chartData = [];
  let baseTraffic = 400;
  for (let i = 0; i < 24; i++) {
    baseTraffic = baseTraffic + (Math.random() * 150 - 50); 
    chartData.push({ time: `${i}:00`, value: Math.abs(Math.round(baseTraffic)) });
  }
  res.json(chartData);
});

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 MongoDB Database Connected Successfully'))
  .catch(err => console.log('🔴 MongoDB Connection Error:', err));

// --- Start the Server & WebSockets ---
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

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