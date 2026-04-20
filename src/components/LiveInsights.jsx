import React from 'react';
import CircularMeter from './CircularMeter';
import WaveGraph from './WaveGraph';
import { motion } from 'framer-motion';

export default function LiveInsights({ attendees, emergency, zones }) {
  const activeNodes = attendees;
  const avgWait = zones.length > 0 ? zones.filter(z => z.type !== 'Area').reduce((acc, curr) => acc + curr.currentWait, 0) / (zones.length - 1) : 0;
  const densityPercent = Math.min(98, (attendees / 50000 * 100).toFixed(1));

  return (
    <div className="glass-panel p-6 hud-border relative overflow-hidden">
       <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <h2 className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">Global Analytics Matrix</h2>
          <div className="flex gap-2">
             <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
             <span className="text-[8px] font-mono text-neon-cyan">LIVE_FEED</span>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <CircularMeter 
             value={densityPercent} 
             label="Crowd Pressure" 
             sublabel="Matrix Load" 
             emergency={emergency} 
          />
          
          <CircularMeter 
             value={Math.min(100, (avgWait * 5))} 
             label="System Latency" 
             sublabel={`Avg ${avgWait.toFixed(1)}m`} 
             color="#0066ff"
             emergency={emergency} 
          />

          <div className="md:col-span-2 flex flex-col justify-center">
             <div className="flex items-baseline justify-between mb-2">
                <span className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Pulse Continuity</span>
                <span className="text-xs font-mono font-black text-white">{activeNodes.toLocaleString()} NODES</span>
             </div>
             <WaveGraph emergency={emergency} />
             <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                   <p className="text-[8px] text-white/30 uppercase font-black mb-1">Grid Sync</p>
                   <p className="text-xs font-mono font-bold text-neon-green uppercase">Optimal</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                   <p className="text-[8px] text-white/30 uppercase font-black mb-1">Mesh Health</p>
                   <p className="text-xs font-mono font-bold text-neon-cyan uppercase">99.8%</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
