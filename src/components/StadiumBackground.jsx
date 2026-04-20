import React from 'react';
import { motion } from 'framer-motion';

/**
 * StadiumBackground Component v8.0 (Maximum Fidelity)
 * High-performance cinematic layer with volumetric lighting and lens flares.
 */
export default function StadiumBackground() {
  const bgImage = "file:///C:/Users/Guntass%20Kaur/.gemini/antigravity/brain/152e38ea-dec9-4198-80b7-f7647dc7d2b3/epic_photorealistic_night_stadium_v2_1776721356408.png";

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
      
      {/* 8K PHOTOREALISTIC STADIUM BASE */}
      <motion.div 
        initial={{ scale: 1.3 }}
        animate={{ 
          scale: [1.3, 1.15, 1.3],
          rotate: [0, 1, 0]
        }}
        transition={{ 
          duration: 45, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* VOLUMETRIC LIGHT BEAMS (TOP LEFT/RIGHT) */}
      <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-[-10%] w-[50%] h-[150%] bg-gradient-to-br from-white/20 via-transparent to-transparent rotate-[25deg] blur-[100px]" />
          <div className="absolute top-0 right-[-10%] w-[50%] h-[150%] bg-gradient-to-bl from-white/20 via-transparent to-transparent rotate-[-25deg] blur-[100px]" />
      </div>

      {/* DYNAMIC LENS FLARE */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px]"
      />

      {/* FLOODLIGHT PULSE & FLICKER */}
      <motion.div 
        animate={{ opacity: [0.03, 0.08, 0.03, 0.05, 0.03] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute inset-0 bg-white"
      />

      {/* ATMOSPHERIC HAZE & DEPTH */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px]" />
      
      {/* VIGNETTE (FOCUSING ON CENTER) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />

      {/* SCANLINE OVERLAY (BROADCAST FEEL) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 3px)' }} />
    </div>
  );
}
