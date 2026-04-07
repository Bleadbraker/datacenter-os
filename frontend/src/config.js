// frontend/src/config.js

// This automatically detects if you are running locally or on the live internet!
const isLocalhost = window.location.hostname === 'localhost';

export const API_URL = isLocalhost 
  ? 'http://localhost:5001/api' 
  : 'https://datacenter-os-ap.onrender.com/api'; // <--- PASTE YOUR RENDER LINK HERE