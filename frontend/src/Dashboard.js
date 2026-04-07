import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Cpu, Activity, Thermometer, Zap } from 'lucide-react';

// --- Mock Data Generation ---
const initialNetworkData = [
  { time: '00:00', traffic: 120 }, { time: '04:00', traffic: 300 },
  { time: '08:00', traffic: 850 }, { time: '12:00', traffic: 940 },
  { time: '16:00', traffic: 720 }, { time: '20:00', traffic: 450 },
  { time: '24:00', traffic: 200 },
];

const serverLoadData = [
  { name: 'Rack A', load: 85 }, { name: 'Rack B', load: 62 },
  { name: 'Rack C', load: 94 }, { name: 'Rack D', load: 45 },
];

export default function Dashboard() {
  // Simulating live data updates
  const [networkData, setNetworkData] = useState(initialNetworkData);

  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkData(prev => {
        const newData = [...prev];
        // Randomly fluctuate the last data point to simulate live traffic
        const lastIndex = newData.length - 1;
        newData[lastIndex] = {
          ...newData[lastIndex],
          traffic: Math.max(100, Math.min(1000, newData[lastIndex].traffic + (Math.random() * 100 - 50)))
        };
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Framer Motion variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 w-full min-h-full"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System <span className="text-dcLeafGreen">Metrics</span></h1>
          <p className="text-gray-400 mt-1">Real-time data center health monitoring</p>
        </div>
        <div className="flex items-center gap-2 bg-dcPanel border border-dcDarkGreen/30 px-4 py-2 rounded-full shadow-lg shadow-dcLeafGreen/5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dcLeafGreen opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-dcLeafGreen"></span>
          </span>
          <span className="text-sm text-dcLeafGreen font-medium tracking-wide">SYSTEM NOMINAL</span>
        </div>
      </div>

      {/* --- Top Status Cards --- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <StatusCard title="Global CPU Load" value="42%" icon={<Cpu size={24} />} trend="+2.4%" />
        <StatusCard title="Network Traffic" value="840 Gbps" icon={<Activity size={24} />} trend="+14%" />
        <StatusCard title="Avg Temperature" value="22°C" icon={<Thermometer size={24} />} trend="-0.5°C" />
        <StatusCard title="Power Draw" value="1.2 MW" icon={<Zap size={24} />} trend="Stable" />
      </motion.div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Network Traffic Chart (Spans 2 columns) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-2 bg-dcPanel border border-dcDarkGreen/20 rounded-xl p-6 shadow-xl"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-200">24h Network Throughput</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={networkData}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid #166534', borderRadius: '8px' }}
                  itemStyle={{ color: '#4ade80' }}
                />
                <Area type="monotone" dataKey="traffic" stroke="#4ade80" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Secondary Server Load Chart (Spans 1 column) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-dcPanel border border-dcDarkGreen/20 rounded-xl p-6 shadow-xl"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-200">Critical Rack Load</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={serverLoadData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid #166534', borderRadius: '8px' }}
                  itemStyle={{ color: '#ffffff' }}
                />
                <Line type="monotone" dataKey="load" stroke="#ffffff" strokeWidth={2} dot={{ r: 4, fill: '#4ade80', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}

// --- Reusable Status Card Component ---
const StatusCard = ({ title, value, icon, trend }) => {
  const isPositive = trend.includes('+') || trend === 'Stable';
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1 }
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-dcPanel border border-dcDarkGreen/20 p-6 rounded-xl relative overflow-hidden group"
    >
      {/* Background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-dcDarkGreen/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-3 bg-dcBlack rounded-lg border border-dcDarkGreen/30 text-dcLeafGreen">
          {icon}
        </div>
        <span className={`text-sm font-medium px-2 py-1 rounded-md ${isPositive ? 'bg-dcDarkGreen/30 text-dcLeafGreen' : 'bg-red-900/30 text-red-400'}`}>
          {trend}
        </span>
      </div>
      <div className="relative z-10">
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
};