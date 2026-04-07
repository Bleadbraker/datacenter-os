import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, ShieldAlert, Clock, UserX, CheckCircle2, Fingerprint, Plus } from 'lucide-react';

export default function AccessControl() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // 1. Live clock effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Fetch data from your new Node.js Backend
  const fetchLogs = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/logs');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setLogs(data);
      } else {
        console.error("Server returned an error instead of an array:", data);
        setLogs([]); 
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs([]); 
    } finally {
      setIsLoading(false); // <--- Stops the "Connecting to Database" text!
    }
  };

  // 3. Simulate a new badge scan (POST request to database)
  const simulateEntry = async () => {
    const names = ["Sarah Jenkins", "Marcus Johnson", "David Chen"];
    const roles = ["Network Admin", "HVAC Tech", "Security Officer"];
    const zonesList = ["Cooling Tower 1", "Server Room A", "Main Lobby"];
    
    const newScan = {
      name: names[Math.floor(Math.random() * names.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      clearance: "L" + Math.floor(Math.random() * 4 + 1) + "-Blue",
      zone: zonesList[Math.floor(Math.random() * zonesList.length)],
      status: "Active" // <--- THE VIP FIX!
    };

    try {
      await fetch('http://localhost:5001/api/logs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': 'admin2026'
        },
        body: JSON.stringify(newScan)
      });
      
      fetchLogs(); 
    } catch (error) {
      console.error("Failed to simulate entry:", error);
    }
  };

    

  // Filter logic
  const filteredLogs = logs.filter(log => 
    log.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-8 w-full min-h-full flex flex-col gap-8"
    >
      {/* --- Header & Live Clock --- */}
      <div className="flex justify-between items-end border-b border-dcDarkGreen/20 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-dcLeafGreen" size={32} />
            Security & <span className="text-dcLeafGreen">Access Logs</span>
          </h1>
          <p className="text-gray-400 mt-1">Live database monitoring and clearance verification</p>
        </div>
        <div className="text-right bg-dcBlack p-3 rounded-lg border border-dcDarkGreen/30 shadow-lg">
          <div className="text-xs text-dcLeafGreen font-mono mb-1 flex items-center gap-2 justify-end">
            <Clock size={14} /> LOCAL FACILITY TIME
          </div>
          <div className="text-2xl font-bold text-white font-mono tracking-wider">
            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
          </div>
        </div>
      </div>

      {/* --- Search & Controls --- */}
      <div className="flex justify-between items-center bg-dcPanel p-4 rounded-xl border border-dcDarkGreen/30 shadow-lg">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by personnel or zone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dcBlack border border-dcDarkGreen/50 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-dcLeafGreen transition-colors"
          />
        </div>
        <div className="flex gap-4">
          <button 
            onClick={simulateEntry}
            className="flex items-center gap-2 bg-dcLeafGreen/10 text-dcLeafGreen border border-dcLeafGreen/50 px-4 py-2 rounded-lg font-medium hover:bg-dcLeafGreen hover:text-dcBlack transition-all"
          >
            <Plus size={18} /> Simulate Scan
          </button>
          <button className="bg-dcDarkGreen/30 text-dcLeafGreen border border-dcLeafGreen/50 px-6 py-2 rounded-lg font-medium hover:bg-dcLeafGreen hover:text-dcBlack transition-all">
            Export Audit Log
          </button>
        </div>
      </div>

      {/* --- Security Data Table --- */}
      <div className="bg-dcPanel border border-dcDarkGreen/20 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dcBlack/50 text-gray-400 text-sm border-b border-dcDarkGreen/30">
                <th className="py-4 px-6 font-medium">Log ID</th>
                <th className="py-4 px-6 font-medium">Personnel</th>
                <th className="py-4 px-6 font-medium">Clearance</th>
                <th className="py-4 px-6 font-medium">Location Zone</th>
                <th className="py-4 px-6 font-medium">Time In</th>
                <th className="py-4 px-6 font-medium">Status</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={tableVariants} initial="hidden" animate="show" className="text-sm"
            >
              {filteredLogs.map((log) => (
                <motion.tr 
                  key={log._id} variants={rowVariants}
                  className="border-b border-dcDarkGreen/10 hover:bg-dcDarkGreen/10 transition-colors"
                >
                  <td className="py-4 px-6 font-mono text-gray-500">{log.logId}</td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-200">{log.name}</div>
                    <div className="text-xs text-gray-500">{log.role}</div>
                  </td>
                  <td className="py-4 px-6"><ClearanceBadge level={log.clearance} /></td>
                  <td className="py-4 px-6 text-gray-300">{log.zone}</td>
                  <td className="py-4 px-6 font-mono text-gray-400">
                    {new Date(log.timeIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-4 px-6"><StatusIndicator status={log.status} /></td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
          
          {isLoading ? (
            <div className="p-8 text-center text-dcLeafGreen animate-pulse">Connecting to Database...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No access logs found in the database.</div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

// --- Sub-Components ---
const ClearanceBadge = ({ level }) => {
  let colorStyles = 'bg-gray-900 text-gray-400 border-gray-700';
  if (level.includes('L5')) colorStyles = 'bg-red-900/30 text-red-400 border-red-500/50';
  if (level.includes('L4')) colorStyles = 'bg-orange-900/30 text-orange-400 border-orange-500/50';
  if (level.includes('L3')) colorStyles = 'bg-yellow-900/30 text-yellow-400 border-yellow-500/50';
  if (level.includes('L2')) colorStyles = 'bg-blue-900/30 text-blue-400 border-blue-500/50';
  return <span className={`px-2.5 py-1 rounded text-xs font-bold border tracking-wide ${colorStyles}`}>{level}</span>;
};

const StatusIndicator = ({ status }) => {
  if (status === 'Active') return <div className="flex items-center gap-2 text-dcLeafGreen"><CheckCircle2 size={16} /><span className="font-medium">On-Site</span></div>;
  if (status === 'Denied') return <div className="flex items-center gap-2 text-red-500"><UserX size={16} /><span className="font-medium">Denied</span></div>;
  return <div className="flex items-center gap-2 text-gray-500"><span className="w-2 h-2 rounded-full bg-gray-600"></span><span>Departed</span></div>;
};