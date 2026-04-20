import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Wind, Zap, Lock, Unlock, Fan, Lightbulb, Radio } from 'lucide-react';

export default function InfrastructureControl({ config, emergency }) {
  const controls = [
    { label: 'PERIMETER GATES', value: config.gates, icon: config.gates === 'OPEN' ? Unlock : Lock, color: config.gates === 'OPEN' ? 'text-emerald-400' : 'text-white/40' },
    { label: 'HVAC VENTILATION', value: config.ventilation, icon: Fan, animate: config.ventilation !== 'NOMINAL', color: config.ventilation === 'MAX_FORCE' ? 'text-red-400' : 'text-cyan-400' },
    { label: 'EMERGENCY LIGHTS', value: config.lights, icon: Lightbulb, color: config.lights === 'EMERGENCY' ? 'text-orange-400' : 'text-cyan-400' },
    { label: 'MESH FREQUENCY', value: '4.2GHz', icon: Radio, color: 'text-cyan-400' }
  ];

  return (
    <div className={`glass-panel p-6 hud-border relative overflow-hidden transition-all duration-700 ${
      emergency ? 'border-red-500/40 bg-red-950/5' : ''
    }`}>
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck size={16} className={emergency ? 'text-red-400' : 'text-cyan-400'} />
        <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/90">Infrastructure Control</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {controls.map((ctrl, i) => (
          <div key={i} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-4 group hover:bg-white/[0.05] transition-all">
            <div className={`p-2 rounded-xl bg-black/40 border border-white/5 ${ctrl.color}`}>
               <ctrl.icon size={18} className={ctrl.animate ? 'animate-spin-slow' : ''} />
            </div>
            <div>
               <p className="text-[7px] font-black text-white/30 tracking-widest uppercase mb-1">{ctrl.label}</p>
               <p className={`text-xs font-black tracking-tighter ${ctrl.color}`}>{ctrl.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[8px] font-mono text-white/40 uppercase">Systems Synced</span>
         </div>
         <button className="text-[8px] font-black text-cyan-400 uppercase tracking-widest hover:text-white transition-colors">
            Override Console
         </button>
      </div>

      {emergency && (
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 bg-red-500/5 pointer-events-none"
        />
      )}
    </div>
  );
}
