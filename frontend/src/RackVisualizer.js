import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Database, Cpu, Info } from 'lucide-react';

export default function RackVisualizer() {
  const [rackItems, setRackItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // --- Constants & Helper Functions ---
  const totalU = 42;
  const rackSlots = Array.from({ length: totalU }, (_, i) => totalU - i);

  const getOccupyingItem = (u) => {
    return rackItems.find(item => u <= item.startU && u > item.startU - item.size);
  };

  // --- API Calls ---
  const fetchEquipment = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/equipment');
      const data = await res.json();
      setRackItems(data);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const deployServer = async () => {
    // Generate valid random server data for the database
    const types = ['Server', 'Storage', 'Network'];
    const newEquipment = {
      name: `SRV-DCX-${Math.floor(Math.random() * 900) + 100}`,
      type: types[Math.floor(Math.random() * types.length)],
      startU: Math.floor(Math.random() * 38) + 4, // Random spot in the rack
      size: 2,
      status: 'online'
    };

    try {
      await fetch('http://localhost:5001/api/equipment', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': 'admin2026' // The Security Badge
        },
        body: JSON.stringify(newEquipment)
      });
      fetchEquipment(); // Refresh the visualizer
    } catch (error) {
      console.error("Error deploying server:", error);
    }
  };

  // --- UI Render ---
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 w-full min-h-full flex gap-8 relative"
    >
      <button
        onClick={deployServer}
        className="absolute top-8 right-8 bg-dcLeafGreen text-dcBlack px-4 py-2 rounded-lg font-bold z-50 hover:bg-white transition-colors"
      >
        + Deploy 2U Server
      </button>

      {/* Left Side: The Visual Rack */}
      <div className="flex-none w-80 bg-dcBlack border-4 border-dcDarkGreen/40 rounded-t-3xl p-4 shadow-2xl shadow-dcLeafGreen/10 mt-12">
        <div className="text-center mb-4 text-xs font-mono text-dcDarkGreen uppercase tracking-widest">
          Primary Cabinet - Row A / Rack 04
        </div>

        <div className="grid grid-cols-1 gap-1 relative bg-dcPanel p-2 rounded-lg">
          {rackSlots.map((u) => {
            const item = getOccupyingItem(u);
            const isStartOfItem = item && item.startU === u;

            return (
              <div
                key={u}
                className="relative h-6 border-b border-dcDarkGreen/10 flex items-center px-2 group"
              >
                <span className="absolute -left-8 text-[10px] font-mono text-gray-600 w-6 text-right">
                  {u}
                </span>

                {item ? (
                  isStartOfItem && (
                    <motion.div
                      layoutId={`item-${item._id || item.id}`}
                      onClick={() => setSelectedItem(item)}
                      style={{ height: `${item.size * 28 - 4}px` }}
                      className={`absolute left-1 right-1 top-0.5 z-10 rounded-md border flex items-center justify-between px-3 cursor-pointer transition-all
                        ${item.status === 'online' ? 'bg-dcDarkGreen/40 border-dcLeafGreen shadow-lg shadow-dcLeafGreen/20' : 'bg-orange-900/40 border-orange-500'}
                      `}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {item.type === 'Server' && <Cpu size={14} className="text-dcLeafGreen" />}
                        {item.type === 'Storage' && <Database size={14} className="text-dcLeafGreen" />}
                        {item.type === 'Network' && <Server size={14} className="text-dcLeafGreen" />}
                        <span className="text-[10px] font-bold text-white truncate">{item.name}</span>
                      </div>
                      <span className="text-[8px] font-mono text-dcLeafGreen">{item.size}U</span>
                    </motion.div>
                  )
                ) : (
                  <div className="w-full h-full hover:bg-dcLeafGreen/5 transition-colors cursor-crosshair" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Side: Details & Stats */}
      <div className="flex-1 space-y-6 mt-12">
        <div className="bg-dcPanel border border-dcDarkGreen/20 rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Rack Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <StatBox label="Total Capacity" value="42U" />
            <StatBox label="Used Space" value={`${rackItems.reduce((acc, curr) => acc + curr.size, 0)}U`} />
            <StatBox label="Power Usage" value="4.2 kW / 6.0 kW" />
            <StatBox label="Heat Index" value="Optimal" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedItem ? (
            <motion.div
              key={selectedItem._id || selectedItem.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-dcPanel border border-dcLeafGreen/30 rounded-xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-dcLeafGreen">{selectedItem.name}</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-500 hover:text-white transition-colors"
                >✕</button>
              </div>

              <div className="space-y-4">
                <DetailItem label="Asset Type" value={selectedItem.type} />
                <DetailItem label="U-Position" value={`${selectedItem.startU} - ${selectedItem.startU - selectedItem.size + 1}`} />
                <DetailItem label="Status" value={selectedItem.status.toUpperCase()} highlight={selectedItem.status === 'online'} />
              </div>

              <button className="w-full mt-8 py-3 bg-dcDarkGreen text-dcLeafGreen rounded-lg font-bold border border-dcLeafGreen/20 hover:bg-dcLeafGreen hover:text-dcBlack transition-all">
                Access Remote Console
              </button>
            </motion.div>
          ) : (
            <motion.div className="h-64 border-2 border-dashed border-dcDarkGreen/20 rounded-xl flex flex-col items-center justify-center text-gray-500">
              <Info size={48} className="mb-4 opacity-20" />
              <p>Select a piece of equipment to view details</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// --- Reusable UI Components ---
const StatBox = ({ label, value }) => (
  <div className="bg-dcBlack p-4 rounded-lg border border-dcDarkGreen/10">
    <div className="text-xs text-gray-500 mb-1">{label}</div>
    <div className="text-lg font-bold text-dcLeafGreen">{value}</div>
  </div>
);

const DetailItem = ({ label, value, highlight }) => (
  <div className="flex justify-between border-b border-dcDarkGreen/10 pb-2">
    <span className="text-gray-400 text-sm">{label}</span>
    <span className={`text-sm font-mono ${highlight ? 'text-dcLeafGreen' : 'text-white'}`}>{value}</span>
  </div>
);