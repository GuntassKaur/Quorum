import React, { useState } from 'react';
import { Sparkles, Utensils, Droplets, ArrowRight, X, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INTENTS = [
  { id: 'food', label: 'Find Food', icon: Utensils, color: 'from-orange-500/20 to-pink-500/10', border: 'hover:border-orange-500/40' },
  { id: 'washroom', label: 'Nearest Hygiene', icon: Droplets, color: 'from-neon-cyan/20 to-neon-blue/10', border: 'hover:border-neon-cyan/40' },
  { id: 'exit', label: 'Exit Vector', icon: ArrowRight, color: 'from-neon-green/20 to-neon-blue/10', border: 'hover:border-neon-green/40' }
];

// Mock SVG path strings for guidance
const PATH_DATA = {
  'food': 'M 100,500 Q 300,300 500,100',
  'washroom': 'M 100,500 L 400,100',
  'exit': 'M 100,500 C 200,600 800,600 900,100'
};

export default function AIIntent({ zones, emergency, onPathRequest }) {
  const [active, setActive] = useState(null);
  const [result, setResult] = useState(null);

  const handleClick = (id) => {
    if (emergency) return;
    setActive(id);
    
    // Clear previous path
    onPathRequest(null);

    setTimeout(() => {
      let smartOutput = [];
      if (id === 'food') {
        const foods = zones.filter(z => z.type === 'Food').sort((a, b) => a.currentWait - b.currentWait);
        smartOutput = foods.map((f, i) => ({ label: f.label, wait: f.currentWait.toFixed(1), meta: i === 0 ? 'OPTIMAL' : 'BUSY' }));
        onPathRequest(PATH_DATA.food);
      } else if (id === 'washroom') {
        const washes = zones.filter(z => z.type === 'Washroom').sort((a, b) => a.currentWait - b.currentWait);
        smartOutput = [{ label: washes[0].label, wait: washes[0].currentWait.toFixed(1), meta: 'NEAREST' }];
        onPathRequest(PATH_DATA.washroom);
      } else if (id === 'exit') {
        const gates = zones.filter(z => z.type === 'Gate').sort((a, b) => a.currentWait - b.currentWait);
        smartOutput = [{ label: gates[0].label, wait: gates[0].currentWait.toFixed(1), meta: 'SECURE' }];
        onPathRequest(PATH_DATA.exit);
      }
      
      setResult({ title: `${id.toUpperCase()} PATHING_RESOLVED`, data: smartOutput });
      setActive(null);
    }, 1200);
  };

  return (
    <div className={`glass-panel p-5 relative overflow-hidden h-full flex flex-col hud-border transition-all duration-500 ${emergency ? 'opacity-20 pointer-events-none' : ''}`}>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={16} className="text-neon-cyan animate-pulse" />
        <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/90">Intent Matrix</h2>
      </div>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex-1 flex flex-col justify-center bg-neon-cyan/5 border border-neon-cyan/20 rounded-xl p-4 relative hologram-effect"
          >
            <button onClick={() => { setResult(null); onPathRequest(null); }} className="absolute top-2 right-2 text-white/30 hover:text-white transition-colors">
              <X size={14} />
            </button>
            <div className="flex items-center gap-2 mb-4">
               <Navigation size={12} className="text-neon-cyan" />
               <h3 className="text-[9px] font-black text-neon-cyan uppercase tracking-widest">{result.title}</h3>
            </div>
            
            <div className="space-y-2">
              {result.data.map((item, i) => (
                <div key={i} className="flex flex-col gap-1 bg-white/5 p-3 rounded-lg border border-white/5 hover:border-neon-cyan/30 transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white group-hover:text-neon-cyan transition-colors">{item.label}</span>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${item.meta === 'OPTIMAL' ? 'bg-neon-green/20 text-neon-green' : 'bg-white/10 text-white/40'}`}>
                      {item.meta}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[8px] font-mono text-white/40">CALC_WAIT</span>
                     <span className="text-xs font-mono font-black text-neon-cyan">{item.wait}m</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col gap-3 justify-center">
            {INTENTS.map(intent => (
              <button
                key={intent.id}
                onClick={() => handleClick(intent.id)}
                disabled={active !== null}
                className={`group relative overflow-hidden w-full flex items-center justify-between p-4 rounded-xl border border-white/5 bg-gradient-to-r ${intent.color} transition-all duration-300 ${intent.border} ${active === intent.id ? 'scale-[0.98] brightness-125' : ''}`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/10 group-hover:border-neon-cyan/50 transition-colors">
                    <intent.icon size={16} className="text-white group-hover:text-neon-cyan transition-colors" />
                  </div>
                  <span className="font-bold tracking-[0.1em] text-xs uppercase text-white/90 group-hover:text-white transition-colors">{intent.label}</span>
                </div>
                {active === intent.id ? (
                  <div className="w-3 h-3 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ArrowRight size={14} className="text-white/30 group-hover:text-neon-cyan transition-all" />
                )}
              </button>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
