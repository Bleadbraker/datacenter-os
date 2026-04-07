import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function Login({ onLogin }) {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, we are hardcoding a simple passkey check. 
    // In the next step, we will move this secret to the backend!
    if (passkey === 'admin2026') {
      onLogin();
    } else {
      setError(true);
      setPasskey('');
    }
  };

  return (
    <div className="min-h-screen bg-dcBlack flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dcPanel border border-dcDarkGreen/30 p-8 rounded-2xl shadow-2xl shadow-dcLeafGreen/10 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-dcDarkGreen/20 rounded-full flex items-center justify-center mb-4 border border-dcLeafGreen/50">
            <Shield size={32} className="text-dcLeafGreen" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">DC<span className="text-dcLeafGreen">OS</span> Clearance</h1>
          <p className="text-gray-400 text-sm mt-2">Enter your administrator passkey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="password" 
              value={passkey}
              onChange={(e) => {
                setPasskey(e.target.value);
                setError(false);
              }}
              placeholder="••••••••"
              className={`w-full bg-dcBlack border ${error ? 'border-red-500 focus:border-red-500' : 'border-dcDarkGreen/50 focus:border-dcLeafGreen'} rounded-lg px-4 py-3 text-white outline-none transition-colors text-center tracking-widest`}
            />
            {error && <p className="text-red-500 text-xs mt-2 text-center">Access Denied. Invalid Passkey.</p>}
          </div>
          
          <button 
            type="submit"
            className="w-full bg-dcLeafGreen text-dcBlack font-bold py-3 rounded-lg hover:bg-white transition-colors"
          >
            Authenticate
          </button>
        </form>
      </motion.div>
    </div>
  );
}