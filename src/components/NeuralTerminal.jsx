import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NeuralTerminal({ decisions }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeDecision, setActiveDecision] = useState(null);

  useEffect(() => {
    if (decisions.length > 0 && decisions[0] !== activeDecision) {
      setActiveDecision(decisions[0]);
      setDisplayText('');
      setCurrentIndex(0);
    }
  }, [decisions, activeDecision]);

  useEffect(() => {
    if (activeDecision && currentIndex < activeDecision.logic.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + activeDecision.logic[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 20);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, activeDecision]);

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">Real-time Inference</span>
       </div>

       <AnimatePresence mode="wait">
         {activeDecision && (
           <motion.div 
             key={activeDecision.id}
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 10 }}
             className="space-y-4"
           >
              <div>
                 <h4 className={`text-[11px] font-black uppercase tracking-widest mb-1 ${activeDecision.severity === 'critical' ? 'text-red-500' : 'text-blue-500'}`}>
                   {activeDecision.type}
                 </h4>
                 <h3 className="text-sm font-bold text-white tracking-tight">{activeDecision.title}</h3>
              </div>
              
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 min-h-[80px]">
                 <p className="text-[10px] font-mono text-white/60 leading-relaxed typing-cursor">
                   {displayText}
                 </p>
              </div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}
