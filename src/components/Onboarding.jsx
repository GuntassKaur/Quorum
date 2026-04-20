import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user already saw onboarding
    const hasSeen = localStorage.getItem('quorum_onboarding_done');
    if (!hasSeen) {
      setTimeout(() => setVisible(true), 1500); // delayed entrance for drama
    }
  }, []);

  const complete = () => {
    setVisible(false);
    localStorage.setItem('quorum_onboarding_done', 'true');
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      complete();
    }
  };

  const steps = [
    { 
      text: "This is your stadium view — red means danger",
      position: { bottom: '40%', left: '40%', transform: 'translate(-50%, 0)' },
      targetW: '60vw', targetH: '60vh', targetX: '20vw', targetY: '20vh'
    },
    { 
      text: "Click any zone to see details",
      position: { bottom: '30%', left: '40%', transform: 'translate(-50%, 0)' },
      targetW: '30vw', targetH: '30vh', targetX: '35vw', targetY: '35vh' 
    },
    { 
      text: "AI gives actions on right panel",
      position: { top: '50%', right: '22%', transform: 'translate(0, -50%)' },
      targetW: '22vw', targetH: '90vh', targetX: '78vw', targetY: '5vh' 
    },
    { 
      text: "Press SYSTEM RED to simulate emergency",
      position: { top: '15%', right: '5%' },
      targetW: '15vw', targetH: '8vh', targetX: '82vw', targetY: '4vh' 
    }
  ];

  if (!visible) return null;

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 z-[500] pointer-events-auto flex items-center justify-center">
      {/* Dynamic Screen Dimmer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="absolute inset-0 bg-black backdrop-blur-[2px]"
        onClick={nextStep}
      />

      {/* Onboarding Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
          className="absolute max-w-sm w-[340px] bg-black/80 backdrop-blur-3xl border border-white/20 rounded-[2rem] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col gap-5"
          style={currentStep.position}
        >
          {/* Progress Indicator */}
          <div className="flex gap-2 mb-1">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 flex-1 rounded-full ${i === step ? 'bg-neon-cyan shadow-[0_0_8px_var(--neon-cyan)]' : i < step ? 'bg-white/40' : 'bg-white/10'}`} 
              />
            ))}
          </div>

          <h2 className="text-xl font-black text-white tracking-wide leading-tight">
            {currentStep.text}
          </h2>

          <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/10">
            <button 
              onClick={complete}
              className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors py-2"
            >
              Skip Tour
            </button>
            <button 
              onClick={nextStep}
              className="px-6 py-2.5 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              {step === steps.length - 1 ? 'Finish' : 'Next Step →'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
