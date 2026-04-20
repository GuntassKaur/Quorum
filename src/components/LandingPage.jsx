import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage({ onEnter }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleEnter = () => {
    setIsVisible(false);
    setTimeout(onEnter, 1000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="quorum-landing-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] bg-black overflow-hidden flex flex-col items-center justify-center select-none"
        >
          {/* BACKGROUND: NIGHT STADIUM SCENE */}
          <div className="absolute inset-0 z-0">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1540747913346-19e3adbb17c3?q=80&w=2400&auto=format&fit=crop')`,
              }}
            />
            {/* DARK GRADIENT OVERLAY (60-70% opacity) */}
            <div className="absolute inset-0 bg-black/70 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
          </div>

          {/* SUBTLE PARTICLE MOVEMENT */}
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-30">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
                  opacity: 0,
                }}
                animate={{
                  y: [null, "-10%"],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
                className="absolute w-1 h-1 bg-[#00ffc8] rounded-full blur-[1px]"
              />
            ))}
          </div>

          {/* CENTER CONTENT */}
          <div className="relative z-20 flex flex-col items-center gap-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex flex-col items-center gap-2"
            >
              <h1 className="text-[clamp(60px,12vw,160px)] font-black tracking-[0.5em] leading-none text-white drop-shadow-[0_0_60px_rgba(0,255,200,0.2)] ml-[0.5em]">
                QUORUM
              </h1>
              <span className="text-lg md:text-2xl font-bold tracking-[0.4em] uppercase text-[#00ffc8] opacity-80">
                Collective Crowd Intelligence
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-[10px] md:text-xs font-black tracking-[0.3em] text-white uppercase max-w-xl"
            >
              Live Events • Mass Gatherings • Real-Time Coordination
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 255, 200, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEnter}
              className="px-16 py-6 rounded-none border border-[#00ffc8]/40 bg-transparent text-[#00ffc8] text-[11px] font-black uppercase tracking-[0.5em] transition-all duration-300 relative group overflow-hidden"
            >
              <span className="relative z-10 group-hover:text-black transition-colors duration-300">[ ENTER STADIUM CONTROL ]</span>
              <div className="absolute inset-0 bg-[#00ffc8] -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </motion.button>
          </div>

          {/* EXTRA IMMERSIVE DETAILS */}
          <div className="absolute top-10 right-10 z-30">
            <div className="flex items-center gap-2 text-[#00ffc8]/60">
              <div className="w-1.5 h-1.5 bg-[#00ffc8] rounded-full animate-pulse" />
              <span className="text-[9px] font-black tracking-[0.2em] uppercase">Live Environment Active</span>
            </div>
          </div>

          <div className="absolute bottom-10 left-10 z-30">
            <span className="text-[9px] font-black tracking-[0.3em] text-white/30 uppercase">
              Simulated Real-Time System
            </span>
          </div>

          {/* AMBIENT SCAN LINES */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[100] bg-[length:100%_4px,3px_100%]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}


