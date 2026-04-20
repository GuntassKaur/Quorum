import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Wifi, Shield, Globe } from 'lucide-react';

export default function SystemBoot({ onComplete }) {
  const [phase, setPhase] = useState('hero'); // hero, loading, complete
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  const bootLogs = [
    "INITIALIZING_QUORUM_KERNEL_v6.4.2...",
    "SYNCING_DECENTRALIZED_MESH_NODES...",
    "ESTABLISHING_LATTICE_ENCRYPTION...",
    "CALIBRATING_NEURAL_CROWD_MATRIX...",
    "FETCHING_STADIUM_TOPOLOGY: [SUCCESS]",
    "SYSTEM_INTEGRITY: 100% - OPTIMAL",
    "BOOT_COMPLETE - WELCOME COMMANDER"
  ];

  useEffect(() => {
    if (phase === 'hero') {
      const timer = setTimeout(() => setPhase('loading'), 500);
      return () => clearTimeout(timer);
    }

    if (phase === 'loading') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => onComplete(), 1000);
            return 100;
          }
          return p + 2.5;
        });
      }, 40);

      const logInterval = setInterval(() => {
        setLogs(prev => {
          if (prev.length < bootLogs.length) {
            return [...prev, bootLogs[prev.length]];
          }
          clearInterval(logInterval);
          return prev;
          });
      }, 400);

      return () => {
        clearInterval(interval);
        clearInterval(logInterval);
      };
    }
  }, [phase]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'hero' && (
          <motion.div 
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 1.5 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Live stadium background with camera zoom */}
            <motion.div 
               initial={{ scale: 1.2 }}
               animate={{ scale: 1 }}
               transition={{ duration: 6, ease: "easeOut" }}
               className="absolute inset-0 bg-cover bg-center brightness-50"
               style={{ backgroundImage: 'url("/stadium_bg.png")' }}
            />
            
            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-60"></div>

            <div className="text-center relative z-10">
               <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.8, duration: 1.2 }}
               >
                 <h1 className="text-8xl font-display font-black tracking-[0.4em] text-white italic mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">QUORUM</h1>
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent mb-6 mx-auto"
                 />
                 <p className="text-sm font-mono tracking-[1.2em] text-neon-cyan uppercase animate-pulse">The Pulse of Live Events</p>
               </motion.div>
            </div>
            
            {/* HUD Frame */}
            <div className="absolute inset-12 border border-white/10 pointer-events-none">
               <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-cyan"></div>
               <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon-cyan"></div>
               <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neon-cyan"></div>
               <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-cyan"></div>
            </div>
          </motion.div>
        )}

        {phase === 'loading' && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl px-12 flex flex-col items-center"
          >
            <div className="relative w-full h-1.5 bg-white/5 overflow-hidden mb-16 rounded-full border border-white/5">
               <motion.div 
                 initial={{ x: '-100%' }}
                 animate={{ x: `${progress - 100}%` }}
                 className="absolute inset-0 bg-neon-cyan shadow-[0_0_30px_#00f3ff]"
               />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 w-full mb-16">
               {[
                 { icon: Cpu, label: 'CORE_KERNEL', val: 'LOADED', color: 'text-neon-cyan' },
                 { icon: Wifi, label: 'MESH_NODES', val: 'SYNCING', color: 'text-neon-green' },
                 { icon: Shield, label: 'LATTICE_SEC', val: 'ACTIVE', color: 'text-neon-cyan' },
                 { icon: Globe, label: 'TOTAL_TELOS', val: 'UPDATING', color: 'text-white/40' }
               ].map((item, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="flex flex-col gap-3"
                 >
                    <div className="flex items-center gap-3">
                       <item.icon size={14} className={`${item.color} opacity-60`} />
                       <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">{item.label}</span>
                    </div>
                    <span className="text-lg font-mono font-black text-white italic tracking-tighter">{item.val}</span>
                 </motion.div>
               ))}
            </div>

            <div className="w-full font-mono text-[10px] text-neon-cyan/40 space-y-3 uppercase tracking-[0.2em] bg-white/[0.02] p-8 rounded-2xl border border-white/5 relative overflow-hidden h-[200px] no-scrollbar">
               <div className="absolute top-0 left-0 w-full h-full scanline opacity-30"></div>
               {logs.map((log, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="flex items-center gap-6"
                 >
                    <span className="text-neon-cyan/20">0x00{i+1}_INF</span>
                    <span className={i === logs.length - 1 ? 'text-neon-green font-black' : ''}>{log}</span>
                 </motion.div>
               ))}
            </div>
            
            <div className="mt-8 flex items-center gap-3">
               <div className="w-3 h-3 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
               <span className="text-[10px] font-mono text-white/20 tracking-[0.5em]">SYSTEM_INITIALIZING_RESOURCES</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

