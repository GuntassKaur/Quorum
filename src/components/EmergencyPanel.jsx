import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ShieldAlert, Timer, CheckCircle2, Ambulance, Siren } from 'lucide-react';

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export default function EmergencyPanel({ emergency, setEmergency, emergencyETA }) {
  const [phase, setPhase] = useState('idle'); // idle | armed | active

  // Local arming confirmation (prevents accidental activation)
  useEffect(() => {
    if (!emergency && phase === 'active') setPhase('idle');
  }, [emergency]);

  const handleActivate = () => {
    if (phase === 'idle') {
      setPhase('armed');
      const t = setTimeout(() => setPhase('idle'), 4000);
      return () => clearTimeout(t);
    }
    if (phase === 'armed') {
      setPhase('active');
      setEmergency(true);
    }
  };

  return (
    <div className={`glass-panel p-5 relative overflow-hidden transition-all duration-700 ${
      emergency
        ? 'border-neon-red/60 shadow-[0_0_40px_rgba(255,0,60,0.2)]'
        : phase === 'armed'
          ? 'border-orange-500/60'
          : 'border-white/5'
    }`}>
      {/* Pulsing red overlay when active */}
      {emergency && (
        <motion.div
          animate={{ opacity: [0, 0.15, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="absolute inset-0 bg-neon-red pointer-events-none"
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl transition-all ${
            emergency ? 'bg-neon-red animate-pulse border border-neon-red' : 'bg-white/5 border border-white/10'
          }`}>
            <ShieldAlert size={18} className={emergency ? 'text-white' : 'text-white/50'} />
          </div>
          <div>
            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/90">
              Safety Protocol
            </h3>
            <p className="text-[7px] text-white/30 font-mono tracking-widest mt-0.5">
              AXION_DEFENSE_v3.0
            </p>
          </div>
        </div>

        {emergency && (
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-neon-red/30 border border-neon-red/60"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-neon-red" />
            <span className="text-[8px] font-black text-neon-red uppercase">SYSTEM RED</span>
          </motion.div>
        )}
      </div>

      <div className="relative z-10 space-y-4">
        {emergency ? (
          /* ─── ACTIVE EMERGENCY VIEW ─── */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4"
          >
            {/* Countdown */}
            <div className="text-center p-4 rounded-xl bg-black/60 border border-neon-red/30">
              <p className="text-[9px] font-mono text-neon-red/70 uppercase tracking-[0.4em] mb-2">
                T-MINUS SAFE CLEARANCE
              </p>
              <div className="flex items-center justify-center gap-3">
                <Timer size={20} className="text-neon-red" />
                <span className="text-4xl font-display font-black text-white italic tracking-tighter tabular-nums">
                  {formatTime(emergencyETA)}
                </span>
              </div>
            </div>

            {/* Route Status */}
            <div className="p-3 rounded-xl bg-neon-green/5 border border-neon-green/40">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={14} className="text-neon-green" />
                <span className="text-[10px] font-black text-neon-green uppercase tracking-widest">
                  Safe Routes Generated
                </span>
              </div>
              <p className="text-[9px] font-mono text-white/60">
                4 green corridor paths activated. All exits confirmed clear.
              </p>
            </div>

            {/* Ambulance Route */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
                <Ambulance size={16} className="text-orange-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white uppercase">Ambulance Route Cleared</p>
                <p className="text-[9px] font-mono text-orange-400 mt-0.5">
                  ETA: {Math.max(0, (emergencyETA - 90) / 60).toFixed(1)} min via Gate North
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Flow Rerouted', value: '94%' },
                { label: 'Gates Open', value: '4/4' },
              ].map((s, i) => (
                <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
                  <p className="text-[8px] font-mono text-white/30 uppercase">{s.label}</p>
                  <p className="text-sm font-black text-white italic">{s.value}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setEmergency(false)}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 rounded-xl text-[10px] font-black tracking-[0.3em] uppercase transition-all"
            >
              Cancel Override
            </button>
          </motion.div>
        ) : (
          /* ─── STANDBY VIEW ─── */
          <div className="space-y-4">
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 font-mono text-[9px] text-white/40 leading-relaxed uppercase tracking-widest">
              All 1,402 mesh nodes active. No critical anomalies detected. System on standby.
            </div>

            {/* Armed state confirmation */}
            <AnimatePresence>
              {phase === 'armed' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/40 text-center"
                >
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">
                    ⚠️ Confirm to Activate Emergency
                  </p>
                  <p className="text-[8px] font-mono text-white/40 mt-1">
                    Click the button again within 4 seconds
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Big Red Button */}
            <button
              onClick={handleActivate}
              className={`w-full py-6 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 group relative overflow-hidden border ${
                phase === 'armed'
                  ? 'bg-orange-500/20 border-orange-500/60 scale-[0.98]'
                  : 'bg-neon-red/5 hover:bg-neon-red/20 border-neon-red/30 hover:border-neon-red/60'
              }`}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-neon-red/3 group-hover:bg-neon-red/8"
              />
              <AlertCircle size={32} className={`${
                phase === 'armed' ? 'text-orange-400' : 'text-neon-red'
              } group-hover:scale-110 transition-transform relative z-10`} />
              <span className="text-[11px] font-black tracking-[0.4em] text-white uppercase relative z-10">
                {phase === 'armed' ? 'Confirm Activation' : 'Initiate System Red'}
              </span>
              <span className="text-[8px] font-mono text-white/30 relative z-10 uppercase">
                {phase === 'armed' ? 'One more click' : 'Double-confirm required'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
