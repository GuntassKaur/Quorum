import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Activity, Clock } from 'lucide-react';

/**
 * TopBar Component v6.0
 * Minimalist tactical header with premium glassmorphism.
 */
export default function TopBar({ emergency, syncStatus = 'LIVE', mode = 'user', onToggleMode }) {
  return (
    <header className="fixed top-0 left-0 w-full h-[80px] md:h-[90px] z-[500] px-6 md:px-10 flex items-center justify-between">
      {/* GLOWING GRADIENT BORDER */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* BRAND & LOGO */}
      <div className="flex items-center gap-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_15px_#10b981] animate-pulse" />
            <h1 className="text-xl md:text-2xl font-black tracking-[0.3em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">Quorum OS</h1>
          </div>
          <span className="text-[9px] font-black tracking-[0.5em] text-white/20 uppercase mt-1">Tactical Node — Sector 77B</span>
        </div>

        {/* SYSTEM STATS (Hidden on small mobile) */}
        <div className="hidden lg:flex items-center gap-8 border-l border-white/5 pl-10">
            <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Network Stream</span>
                <div className="flex items-center gap-2">
                    <Activity size={12} className={syncStatus === 'LIVE' ? 'text-[#10b981]' : 'text-amber-500'} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${syncStatus === 'LIVE' ? 'text-[#10b981]' : 'text-amber-500'}`}>{syncStatus} DATA</span>
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Intelligence</span>
                <div className="flex items-center gap-2">
                    <Zap size={12} className="text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">ACTIVE</span>
                </div>
            </div>
        </div>
      </div>

      {/* CONTROLS & STATUS */}
      <div className="flex items-center gap-4 md:gap-10">
        
        {/* TACTICAL MODE TOGGLE */}
        <div className="flex items-center bg-white/5 backdrop-blur-3xl border border-white/10 p-1 rounded-full overflow-hidden">
            <button 
                onClick={() => onToggleMode('user')}
                className={`px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'user' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            >
                USER
            </button>
            <button 
                onClick={() => onToggleMode('admin')}
                className={`px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'admin' ? 'bg-[#10b981] text-black' : 'text-white/40 hover:text-white'}`}
            >
                ADMIN
            </button>
        </div>

        {/* SYSTEM HEALTH BADGE */}
        <motion.div 
            animate={emergency ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
            className={`flex items-center gap-3 px-6 py-2.5 rounded-full border transition-all ${
                emergency 
                ? 'bg-red-600/20 border-red-500/50 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' 
                : 'bg-white/5 border-white/10 text-[#10b981]'
            }`}
        >
          {emergency ? <ShieldCheck size={14} className="text-red-500" /> : <ShieldCheck size={14} />}
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
             {emergency ? 'EMERGENCY' : 'NOMINAL'}
          </span>
        </motion.div>

        {/* LIVE CLOCK */}
        <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center gap-2">
                <Clock size={12} className="text-white/20" />
                <span className="text-lg font-black tracking-tighter text-white font-mono leading-none">
                    {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 mt-1">Live Telemetry</span>
        </div>
      </div>
    </header>
  );
}
