import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Navigation, Users, Timer } from 'lucide-react';

export default function SmartZones({ zones, selectedZone, setSelectedZone, emergency, eventMode, activePath }) {
  
  const getZoneGlow = (density) => {
    if (emergency) return 'shadow-[inset_0_0_20px_#ff003c44] border-neon-red/50';
    if (density === 'high') return 'shadow-[inset_0_0_20px_#ff003c33] border-neon-red/40';
    if (density === 'med') return 'shadow-[inset_0_0_20px_#eab30833] border-yellow-500/40';
    return 'shadow-[inset_0_0_15px_#00f3ff11] border-neon-cyan/20';
  };

  const getPitchStyle = () => {
    switch(eventMode) {
      case 'CRICKET': return 'rounded-[140px] border-emerald-500/20 bg-emerald-500/5';
      case 'FOOTBALL': return 'rounded-xl border-emerald-600/20 bg-emerald-600/5';
      case 'CONCERT': return 'rounded-t-[80px] border-purple-500/20 bg-purple-500/5';
      case 'ESPORTS': return 'rounded-none border-blue-600/20 bg-blue-600/5 border-dashed';
      case 'BASKETBALL': return 'rounded-2xl border-orange-500/20 bg-orange-500/5';
      default: return 'rounded-full border-white/5';
    }
  };

  return (
    <div className="glass-panel p-6 relative overflow-hidden h-[600px] hud-border flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
           <h2 className="text-sm font-display font-black tracking-[0.3em] uppercase flex items-center gap-2">
              <Navigation size={16} className="text-neon-cyan" />
              Intelligence_Grid // {eventMode}
           </h2>
           <p className="text-[9px] text-white/30 font-mono tracking-widest mt-1 italic">Click zones for vector analysis</p>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1 bg-black/40 border border-white/5 rounded-full text-[8px] font-mono text-white/40">
              ACTIVE_NODES: {zones.reduce((acc, z) => acc + (z.count || 0), 0)}
           </div>
        </div>
      </div>

      <div className="flex-1 relative bg-black/40 rounded-3xl border border-white/5 overflow-hidden p-8 perspective-1000">
         <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
         
         {/* Adaptive Pitch/Stage */}
         <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[40%] border-4 flex items-center justify-center transition-all duration-1000 ${getPitchStyle()}`}>
            <span className="text-[10px] font-black tracking-[1em] text-white/10 uppercase italic">{eventMode}_MATRIX</span>
            {eventMode === 'CONCERT' && (
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
            )}
         </div>

         {/* Path Overlay Layer */}
         <AnimatePresence>
            {activePath && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                 <motion.path
                   initial={{ pathLength: 0, opacity: 0 }}
                   animate={{ pathLength: 1, opacity: 1 }}
                   exit={{ opacity: 0 }}
                   transition={{ duration: 1.5, ease: 'easeInOut' }}
                   d={activePath}
                   fill="none"
                   stroke={emergency ? '#ff003c' : '#00f3ff'}
                   strokeWidth="3"
                   strokeDasharray="10 5"
                   className={`drop-shadow-[0_0_10px_#00f3ff] ${!emergency && 'animate-[scanline_2s_linear_infinite]'}`}
                 />
              </svg>
            )}
         </AnimatePresence>

         {/* Interactive Zones */}
         <div className="absolute inset-0 p-8 grid grid-cols-12 grid-rows-12 gap-2">
           {zones.map(zone => {
              const isSelected = selectedZone?.id === zone.id;
              return (
                <motion.button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`absolute rounded-xl border-2 transition-all duration-500 group overflow-hidden ${getZoneGlow(zone.density)} ${isSelected ? 'ring-2 ring-white scale-105 z-25' : 'z-10'}`}
                  style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.w}%`, height: `${zone.h}%` }}
                  animate={{ 
                    y: zone.density === 'high' ? [0, -2, 0] : 0 
                  }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                   <div className={`absolute inset-0 opacity-5 group-hover:opacity-20 transition-opacity ${zone.density === 'high' ? 'bg-neon-red' : 'bg-neon-cyan'}`}></div>
                   <div className="p-2 h-full flex flex-col justify-between items-start">
                      <span className="text-[8px] font-black tracking-widest uppercase text-white/40 group-hover:text-white/80 transition-colors">{zone.label}</span>
                      <div className="w-full">
                         <div className="flex justify-between items-end mb-1">
                            <span className="text-[10px] font-display font-black text-white">{zone.crowdPercent}%</span>
                            <span className="text-[7px] font-mono text-white/40">{Math.ceil(zone.currentWait)}m</span>
                         </div>
                         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                               animate={{ width: `${zone.crowdPercent}%` }} 
                               className={`h-full ${zone.density === 'high' ? 'bg-neon-red' : zone.density === 'med' ? 'bg-yellow-500' : 'bg-neon-cyan'}`} 
                            />
                         </div>
                      </div>
                   </div>
                </motion.button>
              );
           })}
         </div>
      </div>

      {/* Selected Zone Overlay Panel */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-4 left-4 right-4 glass-panel p-4 z-40 border-neon-cyan/40 bg-black/90 flex items-center justify-between"
          >
             <div className="flex items-center gap-6">
                <div className="p-3 bg-neon-cyan/20 rounded-xl relative overflow-hidden">
                   <Info size={20} className="text-neon-cyan relative z-10" />
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                     className="absolute inset-0 border border-dashed border-neon-cyan/30 rounded-xl"
                   />
                </div>
                <div>
                   <h4 className="text-xs font-black tracking-widest text-white uppercase">{selectedZone.label} TELEMETRY</h4>
                   <div className="flex gap-4 mt-1">
                      <div className="flex items-center gap-1.5 font-mono text-[9px]">
                         <Users size={10} className="text-white/40" />
                         <span className="text-white/60 uppercase">Load:</span>
                         <span className="text-neon-cyan font-bold">{selectedZone.crowdPercent}%</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[9px]">
                         <Timer size={10} className="text-white/40" />
                         <span className="text-white/60 uppercase">Est:</span>
                         <span className="text-neon-cyan font-bold">{selectedZone.currentWait.toFixed(1)} MIN</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex gap-3">
                <button className="px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/40 rounded-lg text-[10px] font-black tracking-widest uppercase text-neon-cyan hover:bg-neon-cyan/20 transition-all">
                   Deploy Guide
                </button>
                <button 
                  onClick={() => setSelectedZone(null)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black tracking-widest uppercase text-white/40 hover:text-white transition-all"
                >
                   Close
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
