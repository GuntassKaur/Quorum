import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Ambulance, ShieldAlert, Cpu, Wind, Target, Zap, ChevronRight, Bell } from 'lucide-react';

export const QuorumStatus = ({ emergency, eventMode }) => {
  const themeColor = {
    FOOTBALL: 'text-cyan-400',
    CRICKET: 'text-amber-400',
    CONCERT: 'text-fuchsia-400',
    ESPORTS: 'text-emerald-400',
    TENNIS: 'text-lime-400'
  }[eventMode] || 'text-cyan-400';

  return (
    <div className="fixed top-8 left-8 z-50 pointer-events-auto animate-breathing">
      <div className="flex items-center gap-6">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 ${emergency ? 'bg-red-500/20 border-red-500 shadow-[0_0_50px_rgba(255,0,0,0.4)]' : 'bg-black/60 border-white/10 backdrop-blur-xl'}`}
        >
          <span className={`font-black text-3xl italic font-display ${emergency ? 'text-red-500' : 'text-white'}`}>Q</span>
        </motion.div>
        <div>
          <h1 className="text-2xl font-black tracking-[.3em] font-display italic leading-none text-white">QUORUM AI</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-[10px] font-mono tracking-[.2em] uppercase ${emergency ? 'text-red-500 animate-pulse' : themeColor}`}>
              {emergency ? 'SYSTEM_RED_ACTIVE' : `${eventMode}_PROTOCOL_LIVE`}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${emergency ? 'bg-red-500' : 'bg-current'} animate-pulse ${themeColor}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SportToggle = ({ activeSport, onSportChange }) => {
  const sports = [
    { id: 'FOOTBALL', icon: '⚽', label: 'Match' },
    { id: 'CRICKET', icon: '🏏', label: 'Innings' },
    { id: 'TENNIS', icon: '🎾', label: 'Court' },
    { id: 'CONCERT', icon: '🎸', label: 'Live' },
    { id: 'ESPORTS', icon: '🎮', label: 'Arena' }
  ];

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto hide-scrollbar">
      <div className="flex backdrop-blur-ultra bg-black/40 border border-white/5 p-1 rounded-full shadow-2xl space-x-1">
        {sports.map(sport => (
          <button
            key={sport.id}
            onClick={() => onSportChange(sport.id)}
            className={`px-5 py-2 rounded-full transition-all duration-500 flex items-center gap-3 relative group ${
              activeSport === sport.id ? 'text-white' : 'text-white/20 hover:text-white/60'
            }`}
          >
            {activeSport === sport.id && (
              <motion.div 
                layoutId="sport-pill" 
                className="absolute inset-0 bg-white/5 border border-white/10 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.05)]" 
                transition={{ type: 'spring', bounce: 0.1, duration: 0.8 }} 
              />
            )}
            <span className="relative z-10 text-sm group-hover:scale-110 transition-transform">{sport.icon}</span>
            <span className="relative z-10 text-[8px] font-black tracking-[0.3em] uppercase">{sport.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const HealthMiniCard = ({ o2Level, zones }) => {
  const [isHovered, setIsHovered] = useState(false);
  const critical = o2Level < 19;

  return (
    <motion.div 
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`fixed bottom-8 left-8 z-50 p-4 bg-black/60 backdrop-blur-ultra border border-white/5 rounded-2xl cursor-pointer transition-all duration-500 ${critical ? 'ring-2 ring-red-500 shadow-[0_0_30px_rgba(255,0,0,0.2)]' : 'hover:border-white/20'}`}
      animate={{ 
        width: isHovered || critical ? 300 : 70,
        height: isHovered || critical ? 160 : 70
      }}
    >
      <div className="flex flex-col h-full justify-between overflow-hidden">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${critical ? 'bg-red-500/10' : 'bg-white/5'}`}>
            <Activity size={20} className={critical ? 'text-red-500 animate-pulse' : 'text-cyan-400'} />
          </div>
          <AnimatePresence>
            {(isHovered || critical) && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="whitespace-nowrap"
              >
                <div className="text-[10px] font-black tracking-widest text-white/30 uppercase">Vitals Monitoring</div>
                <div className={`text-sm font-bold ${critical ? 'text-red-500' : 'text-white'}`}>STADIUM_O2: {o2Level}%</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {(isHovered || critical) && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 pt-4 border-t border-white/5 space-y-3"
            >
              <div className="flex justify-between items-center text-[9px] font-mono">
                <span className="text-white/40">AIR_FLOW_STATUS</span>
                <span className={critical ? 'text-red-500' : 'text-emerald-400'}>{critical ? 'RESTRICTED' : 'OPTIMAL'}</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${critical ? 'bg-red-500' : 'bg-cyan-400 shadow-[0_0_10px_rgba(0,243,255,0.5)]'}`} 
                  animate={{ width: `${o2Level}%` }} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const AmbulanceTracker = ({ emergency }) => {
  return (
    <AnimatePresence>
      {emergency && (
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="fixed bottom-32 left-8 z-50 pointer-events-auto"
        >
          <div className="px-6 py-4 bg-black/80 backdrop-blur-xl border border-red-500/20 rounded-2xl flex items-center gap-5 shadow-2xl">
            <div className="p-3 bg-red-500/20 rounded-xl relative">
              <Ambulance size={24} className="text-red-500 animate-bounce" />
              <div className="absolute inset-0 bg-red-500/40 blur-xl animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-black tracking-widest text-red-500/60 uppercase">Ambulance Vector</div>
              <div className="text-xs font-mono text-red-500 font-bold">ALPHA_ESCORT_ACTIVE // 2.4m</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const SystemRedButton = ({ emergency, onClick }) => (
  <button 
    onClick={onClick}
    className={`fixed bottom-8 right-8 z-50 px-12 py-6 rounded-2xl font-black tracking-[0.5em] uppercase transition-all duration-700 overflow-hidden group ${
      emergency ? 'bg-red-600 text-white shadow-[0_0_60px_rgba(255,0,0,0.4)]' : 'bg-white/5 text-white/30 border border-white/5 hover:bg-white/10 hover:text-white'
    }`}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    <span className="relative z-10 flex items-center gap-4">
      <ShieldAlert size={22} className={emergency ? 'animate-pulse' : ''} />
      {emergency ? 'DEACTIVATE_PROTOCOL' : 'SYSTEM_RED'}
    </span>
  </button>
);
