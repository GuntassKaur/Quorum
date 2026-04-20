import React from 'react';
import { motion } from 'framer-motion';

/**
 * StadiumBackground Component
 * Ultra-high-fidelity cinematic layer for Quorum OS.
 * Features: Slow zoom, Floodlight flicker, Haze/Smoke, Ambient particles.
 */
export default function StadiumBackground() {
  const bgImage = "file:///C:/Users/Guntass%20Kaur/.gemini/antigravity/brain/152e38ea-dec9-4198-80b7-f7647dc7d2b3/ultra_8k_night_stadium_atmosphere_1776717309055.png";

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
      
      {/* 8K STADIUM CINEMATIC WITH SLOW ZOOM */}
      <motion.div 
        initial={{ scale: 1.2, rotate: 0.01 }}
        animate={{ 
          scale: [1.2, 1.1, 1.2],
          x: [0, -20, 0],
          opacity: 0.6
        }}
        transition={{ 
          duration: 60, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* FLOODLIGHT FLICKER EFFECT */}
      <motion.div 
        animate={{ 
          opacity: [0.05, 0.1, 0.05, 0.08, 0.05],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "linear"
        }}
        className="absolute inset-0 bg-white"
      />

      {/* HAZE / SMOKE DRIFT */}
      <motion.div 
        animate={{ 
          x: ["-50%", "0%"],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-20"
      />

      {/* AMBIENT PARTICLES (CROWD ENERGY) */}
      <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
              <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * 100 + "%", 
                    y: Math.random() * 100 + "%",
                    scale: Math.random() * 0.5 + 0.5,
                    opacity: 0
                  }}
                  animate={{ 
                    y: [null, "-20%"],
                    opacity: [0, 0.4, 0]
                  }}
                  transition={{ 
                    duration: Math.random() * 10 + 5, 
                    repeat: Infinity, 
                    delay: Math.random() * 10 
                  }}
                  className="absolute w-1 h-1 bg-[#10b981] rounded-full blur-[1px]"
              />
          ))}
      </div>

      {/* CINEMATIC OVERLAYS FOR READABILITY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black/90" />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />

      {/* SCANLINE / NOISE HINT */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
    </div>
  );
}
