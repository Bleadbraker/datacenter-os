import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Zap, Shield, Link2, Activity } from 'lucide-react';
import { API_URL } from './config';
export default function PortTracker() {
  const [ports, setPorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState(null);

  const fetchPorts = async () => {
    try {
      const res = await fetch(`${API_URL}/ports`);
      const data = await res.json();
      setPorts(data);
      // Update selected port details if one is actively selected
      if (selectedPort) {
        const updatedSelected = data.find(p => p.portId === selectedPort.portId);
        setSelectedPort(updatedSelected);
      }
    } catch (error) {
      console.error("Error fetching ports:", error);
    }
  };

  React.useEffect(() => {
    fetchPorts();
  }, [selectedPort]); // Added selectedPort dependency to prevent stale state

  // Simulate plugging a cable into the first available empty port
  const simulatePatch = async () => {
    const emptyPort = ports.find(p => p.status === 'empty');
    if (!emptyPort) return alert("Switch is fully populated!");

    try {
      await fetch(`${API_URL}/ports/${emptyPort.portId}`, {
  // ... headers and body stay the same ...
});
      
      // Refresh the ports after a successful patch
      fetchPorts();
    } catch (error) {
      console.error("Error patching port:", error);
    }
  }; // <--- THIS WAS THE MISSING BRACKET!

  const activeCount = ports.filter(p => p.status === 'active').length;
  const errorCount = ports.filter(p => p.status === 'error').length;
  const emptyCount = ports.filter(p => p.status === 'empty').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 w-full min-h-full flex flex-col gap-8 relative">
      
      <button onClick={simulatePatch} className="absolute top-8 right-8 bg-dcLeafGreen text-dcBlack px-4 py-2 rounded-lg font-bold z-50 hover:bg-white transition-colors">
        + Patch New Cable
      </button>

      <div className="flex justify-between items-end mt-12">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Port <span className="text-dcLeafGreen">Mapping</span></h1>
          <p className="text-gray-400 mt-1">Core Switch Alpha - Top of Rack A</p>
        </div>
        <div className="flex gap-4">
          <StatBadge label="Active" count={activeCount} color="text-dcLeafGreen" dotColor="bg-dcLeafGreen" />
          <StatBadge label="Issues" count={errorCount} color="text-red-400" dotColor="bg-red-500" />
          <StatBadge label="Available" count={emptyCount} color="text-gray-400" dotColor="bg-gray-600" />
        </div>
      </div>

      {/* --- Visual Hardware Switch --- */}
      <div className="bg-dcBlack border-2 border-dcDarkGreen/30 rounded-xl p-6 shadow-2xl overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="flex justify-between items-center mb-6 border-b border-dcDarkGreen/20 pb-2">
            <div className="flex items-center gap-2">
              <Network className="text-dcLeafGreen" size={20} />
              <span className="font-mono text-sm text-gray-300">Cisco Nexus 93180YC-EX Simulator</span>
            </div>
            <span className="font-mono text-xs text-dcDarkGreen">MGMT: 10.0.1.254</span>
          </div>

          <div className="grid grid-cols-12 gap-x-4 gap-y-6 bg-dcPanel p-6 rounded-lg border border-[#1a1a1a]">
            {ports.map((port) => (
              <Port key={port.portId} port={{...port, id: port.portId}} isSelected={selectedPort?.portId === port.portId} onClick={() => setSelectedPort(port)} />
            ))}
          </div>
        </div>
      </div>

      {/* --- Details Panel --- */}
      <AnimatePresence mode="wait">
        {selectedPort ? (
          <motion.div key={selectedPort.portId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-dcPanel border border-dcLeafGreen/30 rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6 border-b border-dcDarkGreen/20 pb-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 ${selectedPort.status === 'active' ? 'bg-dcDarkGreen/20 border-dcLeafGreen text-dcLeafGreen' : selectedPort.status === 'error' ? 'bg-red-900/20 border-red-500 text-red-500' : 'bg-gray-900 border-gray-700 text-gray-500'}`}>
                  <span className="text-xl font-black">{selectedPort.portId}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Port {selectedPort.portId}</h3>
                  <span className="text-sm text-gray-400 font-mono">Interface Ethernet1/{selectedPort.portId}</span>
                </div>
              </div>
              <button onClick={() => setSelectedPort(null)} className="text-gray-500 hover:text-white transition-colors">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <DetailCard icon={<Link2 size={18} />} label="Connected Device" value={selectedPort.device} />
              <DetailCard icon={<Activity size={18} />} label="Link Speed" value={selectedPort.speed} />
              <DetailCard icon={<Shield size={18} />} label="VLAN Tag" value={selectedPort.vlan !== '-' ? `VLAN ${selectedPort.vlan}` : '-'} />
              <DetailCard icon={<Zap size={18} />} label="MAC Address" value={selectedPort.mac} />
            </div>
          </motion.div>
        ) : (
          <div className="h-48 border-2 border-dashed border-dcDarkGreen/20 rounded-xl flex flex-col items-center justify-center text-gray-600">
            <Network size={32} className="mb-3 opacity-50" />
            <p className="font-medium">Select a port on the switch to view patch cable routing and metrics</p>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Sub-Components ---

const Port = ({ port, isSelected, onClick }) => {
  let bgColor = 'bg-gray-800';
  let ledColor = 'bg-gray-600';
  let borderColor = 'border-gray-700';

  if (port.status === 'active') {
    bgColor = 'bg-dcDarkGreen/40';
    ledColor = 'bg-dcLeafGreen shadow-[0_0_8px_#4ade80]';
    borderColor = 'border-dcLeafGreen';
  } else if (port.status === 'error') {
    bgColor = 'bg-red-900/30';
    ledColor = 'bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse';
    borderColor = 'border-red-500';
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative h-14 w-14 rounded flex flex-col items-center justify-between p-1.5 border-2 transition-all cursor-pointer
        ${isSelected ? 'ring-2 ring-white scale-105 z-10' : ''} 
        ${bgColor} ${borderColor} hover:border-white/50
      `}
    >
      <span className={`text-[10px] font-bold ${port.status === 'empty' ? 'text-gray-500' : 'text-white'}`}>
        {port.id}
      </span>
      
      <div className="w-8 h-6 bg-black rounded-sm border-t border-gray-700/50 flex items-end justify-center pb-0.5">
         <div className="w-4 h-2 bg-gray-900 rounded-[1px]"></div>
      </div>

      <div className={`absolute -top-2 -right-2 w-3 h-3 rounded-full border border-black ${ledColor}`} />
    </motion.button>
  );
};

const StatBadge = ({ label, count, color, dotColor }) => (
  <div className="bg-dcPanel border border-dcDarkGreen/20 px-4 py-2 rounded-lg flex items-center gap-3">
    <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
    <span className="text-gray-400 text-sm">{label}</span>
    <span className={`font-bold text-lg ${color}`}>{count}</span>
  </div>
);

const DetailCard = ({ icon, label, value }) => (
  <div className="bg-dcBlack p-4 rounded-lg border border-dcDarkGreen/10">
    <div className="flex items-center gap-2 text-dcLeafGreen mb-2">
      {icon}
      <span className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</span>
    </div>
    <div className="text-lg font-mono text-white truncate">{value}</div>
  </div>
);