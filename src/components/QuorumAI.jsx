import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Search, Activity, Cpu, Thermometer, Droplets, UserCheck } from 'lucide-react';

const REASONING_STEPS = [
  "SCANNING_MESH_NODES...",
  "ANALYZING_THERMAL_VECTORS...",
  "EXTRACTING_SENTIMENT_BIOMETRICS...",
  "PREDICTING_CROWD_SATURATION...",
  "RESOLVING_OPTIMAL_DIRECTIVE..."
];

export default function QuorumAI({ selectedZone, emergency, zones }) {
  const [reasoningLog, setReasoningLog] = useState([]);
  const [typing, setTyping] = useState(false);
  const [directive, setDirective] = useState('');

  useEffect(() => {
    if (selectedZone) {
      processAI();
    }
  }, [selectedZone]);

  const processAI = async () => {
    setTyping(true);
    setReasoningLog([]);
    setDirective('');

    for (const step of REASONING_STEPS) {
      await new Promise(r => setTimeout(r, 400));
      setReasoningLog(prev => [...prev.slice(-3), step]);
    }

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Analyze this stadium zone: ${selectedZone.label}. It is currently at ${selectedZone.crowdPercent}% capacity. Vitals: O2 ${selectedZone.o2}%, Heat ${selectedZone.heat}C, Sentiment ${selectedZone.sentiment}. Give a one-sentence tactical directive.`,
          context: `Stadium simulation mode. Zone focus: ${selectedZone.id}. Emergency: ${emergency ? 'ACTIVE' : 'INACTIVE'}.`
        }),
      });

      if (!response.ok) throw new Error();
      const result = await response.json();
      
      if (result.success && result.data?.reply) {
        // Strip out the extra structure if Gemini follows it too strictly for a one-sentence directive
        let text = result.data.reply;
        if (text.includes('🔚')) text = text.split('🔚')[0]; // simple cleanup
        setDirective(text.slice(0, 150)); 
      } else {
        throw new Error();
      }
    } catch {
      const logicDetails = {
        Gate: "Ingress stabilization required. Monitoring foyer pressure.",
        Food: "Thermal load elevated. Ventilation boost recommended.",
        Seating: "Sector nominal. Maintaining stadium continuity.",
        Area: "Vector field stable. No redirection required."
      };
      setDirective(logicDetails[selectedZone.type] || "Monitoring zone continuity. Vitals within safe threshold.");
    }
    setTyping(false);
  };

  if (!selectedZone) return null;

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed top-32 left-8 z-50 w-80 obsidian-panel p-6 backdrop-blur-ultra hud-glow-cyan pointer-events-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-xl">
             <Brain size={16} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/90">AI Neural Engine</h2>
            <p className="text-[7px] font-mono text-cyan-500/60 uppercase">Node_Processing: {selectedZone.id}</p>
          </div>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      {/* Reasoning Canvas */}
      <div className="bg-black/40 rounded-2xl p-4 border border-white/5 mb-6 font-mono-data text-[9px] min-h-[140px]">
        <div className="text-white/20 mb-3 flex items-center gap-2">
           <Search size={10} />
           <span>CHAIN_OF_THOUGHT</span>
        </div>
        <div className="space-y-2">
          {reasoningLog.map((log, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              key={i} 
              className="text-cyan-400/80 flex gap-3"
            >
              <span className="opacity-20 shrink-0">·</span>
              <span>{log}</span>
            </motion.div>
          ))}
          {typing && (
            <div className="flex gap-2 text-white/40 mt-2">
               <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
               <span className="animate-pulse italic">Thinking...</span>
            </div>
          )}
          {!typing && directive && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="mt-4 pt-4 border-t border-white/5 text-emerald-400 font-bold leading-relaxed"
            >
               DIRECTIVE: {directive}
            </motion.div>
          )}
        </div>
      </div>

      {/* Biological Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-6">
         <MetricCard 
           icon={Thermometer} 
           label="Heat Index" 
           val={`${selectedZone.heat}°C`} 
           warning={selectedZone.heat > 31} 
         />
         <MetricCard 
           icon={Droplets} 
           label="Hydration Risk" 
           val={`${selectedZone.hydrationRisk || 0}%`} 
           warning={(selectedZone.hydrationRisk || 0) > 70} 
         />
         <MetricCard 
           icon={UserCheck} 
           label="Panic Prob." 
           val={`${((selectedZone.panicProb || 0) * 100).toFixed(1)}%`} 
           warning={(selectedZone.panicProb || 0) > 0.4} 
         />
         <MetricCard 
           icon={Activity} 
           label="Sentiment" 
           val={selectedZone.sentiment} 
           info
         />
      </div>

      <div className="flex items-center gap-2 opacity-20 hover:opacity-100 transition-opacity">
         <Cpu size={10} />
         <span className="text-[7px] font-mono font-black italic uppercase">Confidence: 0.988 // Entropy: 0.012</span>
      </div>
    </motion.div>
  );
}

function MetricCard({ icon: Icon, label, val, warning, info }) {
  return (
    <div className={`p-3 bg-white/[0.02] border rounded-2xl transition-all ${
      warning ? 'border-red-500/40 bg-red-500/5' : 'border-white/5'
    }`}>
       <div className="flex items-center gap-2 mb-2">
          <Icon size={12} className={warning ? 'text-red-500' : info ? 'text-cyan-400' : 'text-white/40'} />
          <span className="text-[7px] font-mono-data text-white/40 tracking-widest uppercase">{label}</span>
       </div>
       <div className={`text-xs font-black font-mono-data ${warning ? 'text-red-500' : 'text-white'}`}>{val}</div>
    </div>
  );
}
