const isLocalhost = window.location.hostname === 'localhost';

// The base URL for WebSockets
export const SOCKET_URL = isLocalhost 
  ? 'http://localhost:5001' 
  : 'https://datacenter-os-ap.onrender.com'; // <--- YOUR RENDER LINK

// The API URL for database fetches
export const API_URL = `${SOCKET_URL}/api`;