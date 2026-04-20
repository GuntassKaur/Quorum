import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Navigation, Signal, Battery, Wifi } from 'lucide-react';

export default function PhoneUI({ emergency, userSeatId, userZone, zones }) {
  const currentZoneData = useMemo(() => {
    return (zones || []).find(z => z.label?.includes(userZone) || z.id === userZone) || { density: 0.4 };
  }, [zones, userZone]);

  const nearestExit = useMemo(() => {
     const emap = { 'A1': 'Gate 4', 'B2': 'Gate 6', 'C3': 'Gate 2', 'D4': 'Gate 8', 'F6': 'Gate 5' };
     return emap[userZone] || 'Gate 4';
  }, [userZone]);

  if (!userSeatId) return null;

  return (
    <div className="absolute bottom-12 right-[22%] z-[300] pointer-events-none hidden lg:block">
      <motion.div
        initial={{ y: 300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-[260px] h-[520px] bg-[#1a1a20] rounded-[3.5rem] border-[10px] border-[#0a0a0c] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden relative pointer-events-auto ring-1 ring-white/10"
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#0a0a0c] rounded-b-3xl z-50 flex items-center justify-center">
           <div className="w-10 h-1 bg-white/10 rounded-full" />
        </div>

        {/* Screen Content */}
        <div className="relative h-full flex flex-col bg-gradient-to-b from-[#1a1a20] to-[#0a0a0c] text-white overflow-hidden p-6">
          
          {/* Status Bar */}
          <div className="flex justify-between items-center mb-10 pt-1">
             <span className="text-[11px] font-black tracking-tight">9:41</span>
             <div className="flex items-center gap-1.5 opacity-60">
                <Signal size={12} />
                <Wifi size={12} />
                <Battery size={12} />
             </div>
          </div>

          {/* APP INTERFACE */}
          <AnimatePresence mode="wait">
             <motion.div 
               key={userZone + emergency}
               initial={{ x: 50, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: -20, opacity: 0 }}
               className="flex flex-col gap-6"
             >
                {/* NOTIFICATION BANNER */}
                {emergency && (
                   <motion.div 
                     initial={{ scale: 0.8, y: -20 }}
                     animate={{ scale: 1, y: 0 }}
                     className="bg-red-600 p-4 rounded-3xl shadow-[0_10px_30px_rgba(220,38,38,0.4)] flex items-start gap-4"
                   >
                      <ShieldAlert size={20} className="shrink-0 animate-pulse" />
                      <div>
                         <span className="text-[10px] font-black uppercase tracking-widest block mb-1">Emergency Alert</span>
                         <p className="text-[11px] font-bold leading-tight">Move towards {nearestExit} immediately.</p>
                      </div>
                   </motion.div>
                )}

                <div className="flex flex-col gap-1">
                   <h2 className="text-2xl font-black italic tracking-tighter uppercase">Quorum Pilot</h2>
                   <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#00ffc8]">Active Guidance</span>
                </div>

                {/* STATUS CARDS */}
                <div className="space-y-4">
                   <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-3">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                         <span className="text-[10px] uppercase font-black text-white/30">Your Position</span>
                         <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00ffc8]/10 text-[#00ffc8] font-black">LIVE</span>
                      </div>
                      <div className="flex justify-between">
                         <div className="flex flex-col">
                            <span className="text-[9px] uppercase font-bold text-white/20">Seat</span>
                            <span className="text-lg font-black">{userSeatId}</span>
                         </div>
                         <div className="flex flex-col text-right">
                            <span className="text-[9px] uppercase font-bold text-white/20">Zone</span>
                            <span className="text-lg font-black text-[#00ffc8]">{userZone}</span>
                         </div>
                      </div>
                   </div>

                   <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] uppercase font-black text-white/30">Local Risk</span>
                         <span className={`text-[11px] font-black ${currentZoneData.density > 0.8 ? 'text-red-500' : 'text-[#00ffc8]'}`}>
                            {currentZoneData.density > 0.8 ? 'DANGER' : 'NOMINAL'}
                         </span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${currentZoneData.density * 100}%` }}
                           className={`h-full ${currentZoneData.density > 0.8 ? 'bg-red-500' : 'bg-[#00ffc8]'}`}
                         />
                      </div>
                      <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase">
                         {currentZoneData.density > 0.8 ? 'HIGH DENSITY DETECTED' : 'ZONE OPERATING NORMALLY'}
                      </p>
                   </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                   <span className="text-[9px] uppercase font-black text-white/20 tracking-widest pl-2">Navigation</span>
                   <div className="p-5 rounded-3xl bg-[#00ffc8] text-black flex items-center justify-between shadow-xl">
                      <div className="flex flex-col">
                         <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Follow Exit</span>
                         <span className="text-lg font-black tracking-tight">{nearestExit}</span>
                      </div>
                      <Navigation size={24} className="fill-current" />
                   </div>
                </div>
             </motion.div>
          </AnimatePresence>

          {/* HOME INDICATOR */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-white/10 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}
