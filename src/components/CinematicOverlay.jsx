import React from 'react';
import { motion } from 'framer-motion';

export default function CinematicOverlay({ emergency }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[8]">

      {/* ── INTENSE BROADCAST VIGNETTE ── */}
      <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 500px rgba(0,0,0,0.92)' }} />

      {/* ── FILM GRAIN / NOISE ── */}
      <div className="absolute inset-0 opacity-[0.04] grain-noise mix-blend-overlay" />

      {/* ── HORIZONTAL SCANLINES (STATIC BUT TEXTURED) ── */}
      <div className="absolute inset-0 scanline opacity-[0.12]" />

      {/* ── EMERGENCY GLITCH OVERLAY ── */}
      {emergency && (
        <motion.div
          animate={{
            opacity: [0.1, 0.25, 0.1],
            backgroundColor: ['rgba(255,0,0,0.05)', 'rgba(255,0,0,0.15)', 'rgba(255,0,0,0.05)']
          }}
          transition={{ duration: 0.15, repeat: Infinity }}
          className="absolute inset-0 mix-blend-color"
        />
      )}

      {/* ── LENS DUST / SCRATCHES (SUBTLE) ── */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/dust.png')] mix-blend-screen" />

      {/* ── HUD CORNER ACCENTS (Refined) ── */}
      <div className="absolute top-6 left-6   w-16 h-16 border-t border-l border-white/20" />
      <div className="absolute top-6 right-6  w-16 h-16 border-t border-r border-white/20" />
      <div className="absolute bottom-6 left-6  w-16 h-16 border-b border-l border-white/20" />
      <div className="absolute bottom-6 right-6 w-16 h-16 border-b border-r border-white/20" />

      {/* ── LIVE BROADCAST TICKER ── */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
        <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/80">LIVE FEED</span>
        <div className="w-[1px] h-3 bg-white/20 mx-1" />
        <span className="text-[9px] font-medium tracking-[0.2em] text-white/40 tabular-nums">00:14:52:08</span>
      </div>

    </div>
  );
}
