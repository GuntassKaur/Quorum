import React from 'react';
import { Thermometer, Droplets, Wind, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EnvironmentPanel({ environment, emergency }) {
  const isHighRisk = environment.heatIndex > 30;

  return (
    <div className={`glass-panel p-5 hud-border relative overflow-hidden transition-all duration-700 ${isHighRisk && !emergency ? 'ring-1 ring-amber-500/50' : ''}`}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-white/50">Environment</h3>
        {isHighRisk && (
           <motion.div 
             animate={{ opacity: [1, 0.4, 1] }} 
             transition={{ duration: 1, repeat: Infinity }}
             className="flex items-center gap-1 text-amber-500"
           >
             <AlertCircle size={10} />
             <span className="text-[8px] font-black uppercase">Heat Warning</span>
           </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded bg-white/5">
                <Thermometer size={14} className="text-neon-cyan" />
             </div>
             <div>
                <p className="text-[8px] font-bold text-white/30 uppercase">Temperature</p>
                <p className="text-sm font-mono font-black">{environment.temp.toFixed(1)}°C</p>
             </div>
          </div>
          {/* Heat wave animation */}
          <div className="flex gap-1">
             {[0.4, 1, 0.6].map((h, i) => (
               <motion.div 
                 key={i}
                 animate={{ height: ['40%', '100%', '40%'] }}
                 transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                 className="w-[2px] bg-neon-cyan opacity-40 rounded-full"
                 style={{ height: '12px' }}
               />
             ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded bg-white/5">
                <Droplets size={14} className="text-neon-cyan" />
             </div>
             <div>
                <p className="text-[8px] font-bold text-white/30 uppercase">Humidity</p>
                <p className="text-sm font-mono font-black">{environment.humidity.toFixed(0)}%</p>
             </div>
          </div>
        </div>

        <div className="relative group p-3 rounded bg-black/40 border border-white/5">
           <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold text-white/40 uppercase">Global Heat Index</span>
              <Wind size={12} className="text-neon-cyan" />
           </div>
           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${Math.min(100, (environment.heatIndex / 40) * 100)}%` }}
                className={`h-full ${isHighRisk ? 'bg-amber-500' : 'bg-neon-cyan'}`}
              />
           </div>
           <p className="text-[8px] font-mono mt-2 text-white/20">STADIUM_THERMAL_STATUS: NOMINAL</p>
        </div>
      </div>
    </div>
  );
}
