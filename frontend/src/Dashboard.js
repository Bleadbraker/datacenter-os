import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cpu, Activity, Thermometer, Zap } from 'lucide-react';
import { API_URL } from './config';

export default function Dashboard() {
  const [networkData, setNetworkData] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch(`${API_URL}/metrics`);
        const data = await res.json();
        setNetworkData(data);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };
    
    fetchMetrics();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 w-full min-h-full flex flex-col gap-8">
      
      {/* --- Header --- */}
      <div className="flex justify-between items-end border-b border-dcDarkGreen/20 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System <span className="text-dcLeafGreen">Metrics</span></h1>
          <p className="text-gray-400 mt-1">Real-time data center health monitoring</p>
        </div>
        <div className="bg-dcDarkGreen/20 text-dcLeafGreen px-4 py-2 rounded-full text-sm font-mono border border-dcLeafGreen/30 flex items-center gap-2 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
          <div className="w-2 h-2 bg-dcLeafGreen rounded-full animate-pulse"></div>
          SYSTEM NOMINAL
        </div>
      </div>

      {/* --- Top Stat Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Cpu size={20} />} label="Global CPU Load" value="42%" trend="+2.4%" isGood={false} />
        <StatCard icon={<Activity size={20} />} label="Network Traffic" value="840 Gbps" trend="+14%" isGood={true} />
        <StatCard icon={<Thermometer size={20} />} label="Avg Temperature" value="22°C" trend="-0.5°C" isGood={false} />
        <StatCard icon={<Zap size={20} />} label="Power Draw" value="1.2 MW" trend="Stable" isGood={true} />
      </div>

      {/* --- Live Chart --- */}
      <div className="bg-dcPanel p-6 rounded-xl border border-dcDarkGreen/20 shadow-xl flex-1 min-h-[400px] flex flex-col mt-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">24h Network Throughput</h3>
          <span className="text-xs text-gray-500 font-mono">LIVE DATACENTER FEED</span>
        </div>
        
        <div className="flex-1 w-full h-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {/* The chart is now using your live 'networkData' state! */}
            <AreaChart data={networkData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#4b5563" fontSize={12} tickMargin={10} />
              <YAxis stroke="#4b5563" fontSize={12} tickMargin={10} />
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                itemStyle={{ color: '#4ade80' }}
              />
              {/* Changed dataKey to "value" to match the backend! */}
              <Area type="monotone" dataKey="value" stroke="#4ade80" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

// --- Sub-Components ---
const StatCard = ({ icon, label, value, trend, isGood }) => (
  <div className="bg-dcPanel p-6 rounded-xl border border-dcDarkGreen/20 shadow-lg flex flex-col justify-between h-32 relative overflow-hidden group">
    <div className="absolute -right-4 -top-4 text-dcDarkGreen opacity-10 group-hover:scale-110 transition-transform duration-500">
      {React.cloneElement(icon, { size: 100 })}
    </div>
    <div className="flex justify-between items-start z-10">
      <div className="p-2 bg-dcBlack rounded-lg text-dcLeafGreen border border-dcDarkGreen/30">
        {icon}
      </div>
      <span className={`text-xs font-mono px-2 py-1 rounded bg-dcBlack border ${isGood ? 'text-dcLeafGreen border-dcLeafGreen/30' : 'text-red-400 border-red-500/30'}`}>
        {trend}
      </span>
    </div>
    <div className="z-10">
      <div className="text-gray-400 text-sm mb-1">{label}</div>
      <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
    </div>
  </div>
);