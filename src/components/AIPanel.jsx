import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Activity, ShieldCheck, AlertCircle, Zap } from 'lucide-react';

export default function AIPanel({ zones, avgO2, emergency }) {
  const criticalZone = useMemo(() => {
    return (zones || []).reduce((prev, curr) => (curr.density > (prev?.density || 0)) ? curr : prev, null);
  }, [zones]);

  const status = emergency ? 'CRITICAL' : criticalZone?.density > 0.8 ? 'ALERT' : 'SAFE';
  const statusColor = status === 'CRITICAL' ? 'text-red-500' : status === 'ALERT' ? 'text-yellow-400' : 'text-[#00ffc8]';
  const borderColor = status === 'CRITICAL' ? 'border-red-500/80' : status === 'ALERT' ? 'border-yellow-400/80' : 'border-[#00ffc8]/80';
  const glowColor = status === 'CRITICAL' ? 'shadow-[0_0_80px_rgba(239,68,68,0.5)]' : status === 'ALERT' ? 'shadow-[0_0_60px_rgba(250,204,21,0.4)]' : 'shadow-[0_0_50px_rgba(0,255,200,0.3)]';

  return (
    <div className="w-full h-full flex flex-col p-6 gap-8 overflow-y-auto no-scrollbar">
      {/* AI DECISION ENGINE BLOCK */}
      <div className="space-y-4">
         <div className="flex items-center gap-3 text-[#00ffc8] opacity-80 mb-2">
            <Cpu size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI DECISION ENGINE</span>
         </div>
         
         <AnimatePresence mode="wait">
           <motion.div 
             key={status + (criticalZone?.id || '')}
             initial={{ opacity: 0, scale: 0.95, y: 10 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.95, y: -10 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className={`p-8 space-y-6 rounded-[2.5rem] border-[4px] bg-black/90 backdrop-blur-3xl transition-all duration-300 ${borderColor} ${glowColor}`}
           >
              {/* STATUS (Big Text) */}
              <div>
                 <div className="flex items-start gap-3 min-w-0">
                    <span className={`text-3xl md:text-4xl xl:text-5xl font-black tracking-tight ${statusColor} break-words whitespace-normal leading-none`}>
                       {status}
                    </span>
                 </div>
              </div>

              {/* ACTIONS (Arrow List) */}
              <div className="pt-6 border-t border-white/5">
                 <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] block mb-4">ACTIONS:</span>
                 <div className="flex flex-col gap-3">
                    {emergency && (
                       <>
                          <div className="flex items-start gap-3 text-lg font-bold text-white"><span className="text-[#00ffc8] shrink-0 mt-1">→</span> <span className="break-words">EVACUATE</span></div>
                          <div className="flex items-start gap-3 text-lg font-bold text-white"><span className="text-[#00ffc8] shrink-0 mt-1">→</span> <span className="break-words">AC MAX</span></div>
                       </>
                    )}
                    {status === 'ALERT' && (
                       <>
                          <div className="flex items-start gap-3 text-lg font-bold text-white"><span className="text-[#00ffc8] shrink-0 mt-1">→</span> <span className="break-words">OPEN GATES ({criticalZone?.id})</span></div>
                          <div className="flex items-start gap-3 text-lg font-bold text-white"><span className="text-[#00ffc8] shrink-0 mt-1">→</span> <span className="break-words">REDIRECT TO E2</span></div>
                       </>
                    )}
                    {status === 'SAFE' && (
                       <div className="flex items-start gap-3 text-lg font-bold text-white"><span className="text-[#00ffc8] shrink-0 mt-1">→</span> <span className="break-words">MONITOR FLOW</span></div>
                    )}
                 </div>
              </div>

              {/* WHY (Short Explanation) */}
              <div className="pt-6 border-t border-white/5 opacity-80">
                 <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] block mb-2">WHY:</span>
                 <p className="text-sm font-medium text-white italic">
                    {emergency ? "CRITICAL SYNC DETECTED" : status === 'ALERT' ? `HIGH DENSITY (${Math.round((criticalZone?.density || 0)*100)}%) + LOW O2` : "NOMINAL PARAMETERS"}
                 </p>
              </div>
           </motion.div>
         </AnimatePresence>
      </div>

      {/* REASONING TELEMETRY (Reduced Opacity) */}
      <div className="space-y-4 opacity-30">
         <div className="flex items-center gap-2 text-white/20 mb-2">
            <Activity size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">SENSORS</span>
         </div>
         
         <div className="grid grid-cols-1 gap-4">
             <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] uppercase font-bold text-white/40">DENSITY</span>
                <span className={`text-sm font-black ${statusColor}`}>{Math.round((criticalZone?.density || 0) * 100)}%</span>
             </div>
             <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] uppercase font-bold text-white/40">O2 LEVEL</span>
                <span className={`text-sm font-black ${avgO2 < 19.5 ? 'text-red-500' : 'text-white'}`}>{avgO2}%</span>
             </div>
         </div>
      </div>

      {/* FOOTER */}
      <div className="mt-auto pt-6 border-t border-white/5">
         <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <ShieldCheck size={12} className="text-[#00ffc8]" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#00ffc8]">ENCRYPTED SYNC</span>
         </div>
      </div>
    </div>
  );
}
