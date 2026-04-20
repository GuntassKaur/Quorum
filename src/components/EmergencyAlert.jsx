import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmergencyAlert({ emergency }) {
  return (
    <AnimatePresence>
      {emergency && (
        <React.Fragment>
          {/* CINEMATIC BLACKOUT */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/90 pointer-events-none"
          />

          {/* SYSTEM RED SCANLINES */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[160] pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0),rgba(0,0,0,0)_1px,rgba(255,0,0,0.1)_2px,rgba(255,0,0,0.1)_3px)]"
          />

          {/* IMPACT ALERT TEXT */}
          <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center pointer-events-none px-20 text-center">
            <motion.h2 
              initial={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="text-8xl font-black italic tracking-tighter text-red-600 mb-4"
            >
              CRITICAL EVENT
            </motion.h2>
            
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 400 }}
              className="h-[2px] bg-red-600/30 mb-8"
            />

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-[12px] font-black uppercase tracking-[1em] text-white/40"
            >
              System Red Override Active // Evacuation Vectors Online
            </motion.p>
          </div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
