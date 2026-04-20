import React from 'react';
import { motion } from 'framer-motion';

/**
 * StadiumBackground Component
 * Realistic stadium atmosphere using a high-quality external asset to keep repo size minimal.
 */
export default function StadiumBackground() {
  // Premium Night Stadium Asset (Unsplash High-Res)
  const bgImage = "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=2500";

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
      
      {/* CINEMATIC EXTERNAL ASSET WITH SLOW ZOOM */}
      <motion.div 
        initial={{ scale: 1.15 }}
        animate={{ 
          scale: [1.15, 1.05, 1.15],
          opacity: 0.6
        }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* MOVING LIGHTS / LENS FLARE EFFECT */}
      <motion.div 
        animate={{ 
            x: ["-20%", "120%"],
            opacity: [0, 0.15, 0]
        }}
        transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
        }}
        className="absolute top-0 left-0 w-[40%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[20deg]"
      />

      {/* SUBTLE NOISE OVERLAY */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />

      {/* DARK OVERLAYS FOR READABILITY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black/90" />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
}
