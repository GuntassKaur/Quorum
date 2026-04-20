import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Thermometer, Wind, AlertCircle, Droplets, Gauge } from 'lucide-react';

export default function HealthSafetyPanel({ zones, emergency }) {
  // Sort zones by risk level
  const riskyZones = [...zones]
    .filter(z => z.o2 < 18.5 || z.heat > 31 || z.sentiment === 'Panic')
    .sort((a, b) => (a.o2 - b.o2));

  return (
    <div className={`glass-panel p-6 hud-border h-full relative overflow-hidden transition-all duration-700 ${
      emergency ? 'bg-red-950/5' : ''
    }`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Activity size={18} className="text-emerald-400" />
           </div>
           <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/90">Human Safety & Vitals</h2>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[8px] font-mono text-emerald-500">LIVE_BIO_SYNC</span>
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {riskyZones.length > 0 ? (
            riskyZones.slice(0, 3).map((zone, i) => (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-5 rounded-2xl border bg-black/40 transition-all ${
                  zone.o2 < 17.5 ? 'border-red-500 animate-pulse-red' : 'border-white/5'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                   <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-widest">{zone.label}</h3>
                      <p className={`text-[9px] font-mono mt-1 ${
                        zone.sentiment === 'Panic' ? 'text-red-400' : 'text-orange-400'
                      }`}>
                        STATUS: {zone.sentiment.toUpperCase()} DETECTED
                      </p>
                   </div>
                   <AlertCircle size={16} className={zone.o2 < 18 ? 'text-red-500' : 'text-orange-500'} />
                </div>

                <div className="grid grid-cols-3 gap-2">
                   <div className="p-2 bg-white/[0.02] rounded-xl border border-white/5">
                      <div className="flex items-center gap-1 mb-1 text-white/20">
                         <Wind size={10} />
                         <span className="text-[7px] font-black uppercase">O2 Level</span>
                      </div>
                      <span className={`text-sm font-black font-mono ${zone.o2 < 18 ? 'text-red-500' : 'text-emerald-400'}`}>
                         {zone.o2}%
                      </span>
                   </div>
                   <div className="p-2 bg-white/[0.02] rounded-xl border border-white/5">
                      <div className="flex items-center gap-1 mb-1 text-white/20">
                         <Thermometer size={10} />
                         <span className="text-[7px] font-black uppercase">Heat Index</span>
                      </div>
                      <span className={`text-sm font-black font-mono ${zone.heat > 31 ? 'text-red-500' : 'text-orange-400'}`}>
                         {zone.heat}°C
                      </span>
                   </div>
                   <div className="p-2 bg-white/[0.02] rounded-xl border border-white/5">
                      <div className="flex items-center gap-1 mb-1 text-white/20">
                         <Gauge size={10} />
                         <span className="text-[7px] font-black uppercase">CO2</span>
                      </div>
                      <span className="text-sm font-black font-mono text-cyan-400">
                         {zone.co2}ppm
                      </span>
                   </div>
                </div>

                {zone.o2 < 18 && (
                   <p className="mt-3 text-[9px] font-black text-red-500 italic uppercase">
                      ⚠️ HYPOXIA RISK: FAINTING PROBABILITY {((0.95 - zone.o2/21) * 100).toFixed(0)}%
                   </p>
                )}
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-30">
               <div className="w-16 h-16 rounded-full border border-dashed border-white/20 flex items-center justify-center mb-4">
                  <Droplets size={24} />
               </div>
               <p className="text-[10px] font-black tracking-widest uppercase mb-1">Stability Threshold Met</p>
               <p className="text-[9px] font-mono">No critical vitals infractions detected</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
         <div className="space-y-1">
            <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">Avg Heart Rate</span>
            <p className="text-sm font-black text-white italic">78 BPM</p>
         </div>
         <div className="space-y-1">
            <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">Fatigue Level</span>
            <p className="text-sm font-black text-white italic">LOW</p>
         </div>
      </div>
    </div>
  );
}
