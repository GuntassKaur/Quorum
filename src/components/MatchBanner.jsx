import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Flame, CloudSun, Thermometer, Zap } from 'lucide-react';

const MATCH_DATA = {
  'FOOTBALL': { teams: 'REAL MADRID vs MAN CITY', meta: '🏆 CHAMPIONS LEAGUE – SEMI FINAL', location: 'Section A-D' },
  'CRICKET': { teams: 'INDIA vs AUSTRALIA', meta: '🏏 WORLD CUP 2026 – FINAL', location: 'Oval Grounds' },
  'TENNIS': { teams: 'ALCARAZ vs SINNER', meta: '🎾 WIMBLEDON – CENTER COURT', location: 'Main Court' },
  'CONCERT': { teams: 'COLDPLAY – LIVE', meta: '🎤 MUSIC OF THE SPHERES TOUR', location: 'Festival Arena' },
  'ESPORTS': { teams: 'NAVI vs G2', meta: '🎮 PGL MAJOR COPENHAGEN', location: 'Nexus Hall' }
};

export default function MatchBanner({ attendees, emergency, sportMode, weather }) {
  const data = MATCH_DATA[sportMode] || MATCH_DATA['FOOTBALL'];
  const energy = attendees > 42900 ? 'PEAK' : 'STABLE';
  
  return (
    <div className={`glass-panel p-6 hud-border relative overflow-hidden transition-all duration-700 ${
      emergency ? 'border-neon-red shadow-[0_0_30px_rgba(255,0,0,0.2)]' : 'border-white/5 shadow-2xl'
    }`}>
      
      {/* Background Holographic Texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
         <div className="absolute inset-0 bg-grid"></div>
         <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-neon-cyan/20 blur-[100px] rounded-full"></div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Teams & Meta */}
        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left flex-1">
          <div className="relative group">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 transform group-hover:rotate-12 ${
              emergency 
                ? 'border-neon-red bg-neon-red/10 shadow-[0_0_20px_rgba(255,0,60,0.4)]' 
                : 'border-neon-cyan/30 bg-white/5 shadow-[0_0_30px_rgba(0,243,255,0.1)]'
            }`}>
               <Trophy size={32} className={emergency ? 'text-neon-red' : 'text-neon-cyan'} />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center">
               <Zap size={14} className="text-neon-green" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-3">
               <span className={`w-2 h-2 rounded-full ${emergency ? 'bg-neon-red' : 'bg-neon-green'} animate-pulse`} />
               <p className="text-[10px] font-black tracking-[0.5em] uppercase text-white/40 font-mono italic">
                 {data.meta} // {data.location}
               </p>
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-black tracking-tighter text-white italic transition-all">
               {data.teams.includes(' vs ') ? (
                 <>
                   {data.teams.split(' vs ')[0]} <span className={emergency ? 'text-neon-red' : 'text-neon-cyan animate-pulse'}>VS</span> {data.teams.split(' vs ')[1]}
                 </>
               ) : (
                 data.teams
               )}
            </h2>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-16 w-px bg-white/10 hidden xl:block"></div>

        {/* Global Realtime Metrics */}
        <div className="flex items-center gap-8 w-full xl:w-auto justify-around xl:justify-end">
            {/* Attendees */}
            <div className="text-center xl:text-left">
               <div className="flex items-center gap-2 mb-2 justify-center xl:justify-start">
                  <Users size={14} className="text-white/40" />
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Live Capacity</span>
               </div>
               <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-display font-black text-white italic tracking-tighter tabular-nums">
                   {attendees.toLocaleString()}
                 </span>
                 <span className="text-[10px] text-white/20 font-mono tracking-widest">/ 52,000</span>
               </div>
            </div>

            {/* Weather Pulse */}
            <div className="text-center xl:text-left group cursor-crosshair">
               <div className="flex items-center gap-2 mb-2 justify-center xl:justify-start">
                  <CloudSun size={14} className="text-neon-cyan" />
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Atmosphere</span>
               </div>
               <div className="flex items-center gap-3">
                 <span className="text-3xl font-display font-black text-white italic tracking-tighter tabular-nums">
                   {weather?.tempC || '28.4'}°
                 </span>
                 <div className="pb-1">
                    <p className={`text-[10px] font-black italic tracking-widest ${weather?.fatigue > 0.5 ? 'text-neon-red' : 'text-neon-cyan'}`}>
                       {weather?.condition?.toUpperCase() || 'CLEAR'}
                    </p>
                    <div className="flex items-center gap-1">
                       <Thermometer size={10} className="text-white/20" />
                       <span className="text-[9px] font-mono text-white/20 tracking-tighter">FEELS {weather?.feelsLike || '29.2'}°</span>
                    </div>
                 </div>
               </div>
            </div>

            {/* Energy Badge */}
            <div className={`hidden sm:flex px-6 py-4 rounded-3xl bg-black/60 border border-white/10 items-center gap-5 transition-all duration-500 hover:border-white/20 ${energy === 'PEAK' ? 'ring-2 ring-neon-cyan/20' : ''}`}>
              <div className="text-right">
                <span className="block text-[8px] font-black text-white/30 uppercase tracking-[0.4em] mb-1">CROWD_ENERGY</span>
                <span className={`text-sm font-black tracking-[0.2em] italic ${energy === 'PEAK' ? 'text-neon-cyan animate-pulse' : 'text-neon-green uppercase'}`}>
                  {energy}_LOAD
                </span>
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }}
                transition={{ duration: 1, repeat: Infinity }}
                className={`p-2.5 rounded-2xl ${energy === 'PEAK' ? 'bg-neon-cyan/20 shadow-[0_0_15px_rgba(0,243,255,0.4)]' : 'bg-neon-green/20'}`}
              >
                 <Flame size={20} className={energy === 'PEAK' ? 'text-neon-cyan' : 'text-neon-green'} />
              </motion.div>
            </div>
        </div>
      </div>

      {/* Capacity Progress Bar (Bottom Edge) */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-white/5">
        <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${(attendees / 52000) * 100}%` }}
           className={`h-full transition-colors duration-1000 ${emergency ? 'bg-neon-red' : 'bg-neon-cyan shadow-[0_0_20px_#00f3ff]'}`}
           transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
