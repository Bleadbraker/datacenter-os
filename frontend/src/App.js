import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Server, Network, ShieldCheck } from 'lucide-react';

// --- Import all your Pages ---
import AccessControl from './AccessControl';
import PortTracker from './PortTracker';
import RackVisualizer from './RackVisualizer';
import Dashboard from './Dashboard';
import Login from './Login'; // <-- 1. Import the new Login Screen

export default function App() {
  // 2. Add Authentication State (Defaults to 'false' so it stays locked!)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 3. The Security Lock: If not logged in, ONLY render the Login screen
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  // If they ARE logged in, render the actual Data Center OS
  return (
    <Router>
      <div className="flex h-screen bg-dcBlack overflow-hidden">
        {/* Animated Sidebar */}
        <motion.nav 
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          className="w-64 bg-dcPanel border-r border-dcDarkGreen/20 flex flex-col pt-8"
        >
          <div className="px-6 mb-10">
            <h2 className="text-2xl font-black tracking-wider flex items-center gap-2">
              <span className="text-dcLeafGreen">DC</span> OS
            </h2>
          </div>
          
          <div className="flex flex-col gap-2 px-4">
            <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavItem to="/racks" icon={<Server size={20} />} label="Rack Visualizer" />
            <NavItem to="/ports" icon={<Network size={20} />} label="Port Mapping" />
            <NavItem to="/access" icon={<ShieldCheck size={20} />} label="Access Logs" />
          </div>
        </motion.nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/racks" element={<RackVisualizer />} />
            <Route path="/ports" element={<PortTracker />} />
            <Route path="/access" element={<AccessControl />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// --- Navigation Item Component ---
const NavItem = ({ to, icon, label }) => (
  <Link to={to}>
    <motion.div 
      whileHover={{ scale: 1.02, backgroundColor: '#166534', color: '#4ade80' }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 transition-colors duration-200"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </motion.div>
  </Link>
);