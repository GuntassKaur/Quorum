import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, ChevronRight, Activity, Zap, Terminal } from 'lucide-react';

export default function AIDecisionPanel({ decisions, emergency }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [decisions]);

  return (
    <div className={`glass-panel p-6 hud-border relative flex flex-col h-full transition-all duration-700 ${
      emergency ? 'border-red-500/40' : ''
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-cyan-400/10 rounded-lg">
              <BrainCircuit size={18} className="text-cyan-400" />
           </div>
           <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/90">AI Oracle // Decision Feed</h2>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-md">
           <Zap size={10} className="text-cyan-400" />
           <span className="text-[8px] font-mono text-cyan-400">LATENCY: 0.02ms</span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2"
      >
        <AnimatePresence initial={false}>
          {decisions.map((d, i) => (
            <motion.div
              key={d.id || i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden group ${
                d.severity === 'Critical' 
                  ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_20px_rgba(255,0,0,0.05)]' 
                  : 'bg-white/[0.03] border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4 relative z-10">
                 <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <span className={`text-[8px] font-black tracking-widest uppercase ${
                         d.severity === 'Critical' ? 'text-red-400' : 'text-cyan-400'
                       }`}>
                         {d.type} // {d.zone}
                       </span>
                       <span className="text-[8px] font-mono text-white/20 italic">0.0{i}s ago</span>
                    </div>
                    <p className="text-xs font-bold text-white leading-relaxed">{d.title}</p>
                    <p className="text-[10px] text-white/40 font-medium">{d.logic}</p>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                    <span className="text-[7px] font-black text-white/20 uppercase">Confidence</span>
                    <span className={`text-xs font-black font-mono ${
                      d.confidence > 0.9 ? 'text-emerald-400' : 'text-cyan-400'
                    }`}>
                      {(d.confidence * 100).toFixed(0)}%
                    </span>
                 </div>
              </div>

              {/* Action Prompt */}
              <div className="mt-3 flex items-center justify-between pointer-events-none group-hover:pointer-events-auto">
                 <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                 </div>
                 <button className="flex items-center gap-1 text-[8px] font-black text-cyan-400 hover:text-white transition-colors uppercase tracking-widest">
                    Execute Directive <ChevronRight size={10} />
                 </button>
              </div>

              {d.severity === 'Critical' && (
                <motion.div 
                  animate={{ opacity: [0, 0.2, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 bg-red-500/5"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
         <Terminal size={14} className="text-white/20" />
         <p className="text-[9px] font-mono text-white/20 italic animate-pulse">
            Neural processor awaiting next signal pack...
         </p>
      </div>
    </div>
  );
}
