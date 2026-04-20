import React from 'react';
import { motion } from 'framer-motion';

export default function CircularMeter({ value, label, sublabel, color = "#00f3ff", emergency }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 relative group">
      <svg className="w-32 h-32 transform -rotate-90">
        {/* Background track */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="6"
          fill="transparent"
        />
        {/* Progress Arc */}
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          stroke={emergency ? '#ff003c' : color}
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeLinecap="round"
          className="drop-shadow-[0_0_8px_currentColor]"
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
         <motion.span 
           animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
           transition={{ duration: 2, repeat: Infinity }}
           className="text-2xl font-display font-black tracking-tighter text-white"
         >
           {value}%
         </motion.span>
         <span className="text-[8px] font-mono tracking-widest text-white/30 uppercase mt-[-4px]">{sublabel}</span>
      </div>
      
      <div className="mt-4 text-center">
         <span className="text-[9px] font-black tracking-[0.3em] text-white/50 uppercase">{label}</span>
      </div>
    </div>
  );
}
