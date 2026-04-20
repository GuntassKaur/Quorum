import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const DockItem = ({ icon, label, onClick, color = 'bg-white/5' }) => {
  return (
    <motion.button
      whileHover={{ y: -10, scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`relative group flex flex-col items-center justify-center w-14 h-14 backdrop-blur-3xl border border-white/10 rounded-2xl transition-colors ${color} hover:bg-white/10`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="absolute -top-8 px-2 py-1 bg-white/10 backdrop-blur-xl border border-white/10 rounded-md text-[9px] font-black uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label}
      </span>
    </motion.button>
  );
};

export default function TacticalDock({ onPanic }) {
  const items = [
    { icon: '🍔', label: 'Food', action: () => console.log('Food active') },
    { icon: '🚻', label: 'Washrooms', action: () => console.log('Washrooms active') },
    { icon: '🤖', label: 'AI Agent', action: () => console.log('Chat active') },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 p-3 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {items.map((item, index) => (
        <DockItem key={index} {...item} />
      ))}
      <div className="h-8 w-[1px] bg-white/10 mx-1" />
      
      {/* SOS PANIC BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPanic}
        animate={{ boxShadow: ['0 0 0px rgba(239,68,68,0)', '0 0 30px rgba(239,68,68,0.4)', '0 0 0px rgba(239,68,68,0)'] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="px-6 h-14 bg-red-600/20 border-2 border-red-500 rounded-2xl flex items-center gap-3 hover:bg-red-600/40 transition-all"
      >
        <AlertCircle className="text-red-500" size={20} />
        <span className="text-[11px] font-black text-red-500 uppercase tracking-widest">SOS PANIC</span>
      </motion.button>

      <div className="h-8 w-[1px] bg-white/10 mx-1" />
      
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-10 h-10 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center"
      >
        <div className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981]" />
      </motion.div>
    </div>
  );
}
