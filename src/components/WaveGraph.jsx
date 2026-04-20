import React from 'react';
import { motion } from 'framer-motion';

export default function WaveGraph({ data, emergency, color = "#00f3ff" }) {
  // Simple path generator for a few points
  const points = data || [30, 45, 35, 60, 50, 75, 40, 80, 55, 90];
  const max = Math.max(...points);
  const width = 200;
  const height = 40;
  
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - (p / max) * height;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="w-full mt-4 h-12 relative overflow-hidden">
       <svg width="100%" height="40" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
         <motion.path 
           d={path}
           fill="none"
           stroke={emergency ? '#ff003c' : color}
           strokeWidth="2"
           initial={{ pathLength: 0 }}
           animate={{ pathLength: 1 }}
           transition={{ duration: 1, ease: 'easeInOut' }}
           className="drop-shadow-[0_0_5px_currentColor]"
         />
         {/* Wave area fill */}
         <motion.path 
           d={`${path} L ${width} ${height} L 0 ${height} Z`}
           fill={emergency ? 'rgba(255,0,60,0.1)' : 'rgba(0,243,255,0.05)'}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
         />
       </svg>
       
       {/* Animated scan line */}
       <motion.div 
         animate={{ x: ['-20%', '120%'] }}
         transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
         className="absolute inset-y-0 w-[1px] bg-white/20 shadow-[0_0_10px_white]"
       />
    </div>
  );
}
