import React from 'react';
import { motion } from 'framer-motion';
import { History, FastForward } from 'lucide-react';

export default function TimeMachine({ time, setTime, emergency }) {
  const points = [0, 5, 10, 15];

  if (emergency) return null;

  return (
    <div className="glass-panel p-4 flex items-center gap-6 hud-border bg-gradient-to-r from-neon-blue/10 to-transparent">
      <div className="flex items-center gap-3">
         <div className="p-2 rounded-full bg-neon-cyan/20 border border-neon-cyan/50 animate-pulse">
            <History size={16} className="text-neon-cyan" />
         </div>
         <div>
            <h4 className="text-[10px] font-black tracking-widest uppercase">Predictive Flow</h4>
            <p className="text-[8px] text-neon-cyan font-mono uppercase">Telemetry Simulation</p>
         </div>
      </div>

      <div className="flex-1 flex items-center justify-between px-4 relative">
         <div className="absolute left-4 right-4 h-px bg-white/10 top-1/2 -translate-y-1/2" />
         {points.map(p => (
           <button
             key={p}
             onClick={() => setTime(p)}
             className={`relative z-10 w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center font-mono text-[10px] font-black ${time === p ? 'bg-neon-cyan border-neon-cyan text-black scale-125 shadow-[0_0_15px_#00f3ff]' : 'bg-black border-white/10 text-white/40 hover:border-white/30'}`}
           >
             {p === 0 ? 'NOW' : `+${p}`}
           </button>
         ))}
      </div>

      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded bg-black/40 border border-white/5 font-mono text-[10px] text-white/40">
         <FastForward size={12} className={time > 0 ? 'text-neon-cyan animate-pulse' : ''} />
         <span>PROJECTION: {time === 0 ? 'REALTIME' : 'SIMULATED'}</span>
      </div>
    </div>
  );
}
