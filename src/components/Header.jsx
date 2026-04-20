import React from 'react'
import { Cpu, Wifi, Shield } from 'lucide-react'

export default function Header({ emergency }) {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${emergency ? 'bg-red-950/90' : 'bg-black/80'} backdrop-blur-xl border-b border-white/10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${emergency ? 'bg-red-500' : 'bg-emerald-500'} transition-colors duration-500`}>
            <Cpu size={20} className="text-black" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none text-white">QUORUM</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Smart Venue OS</p>
          </div>
        </div>

        {/* Status Pills */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5 glass-card px-3 py-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/70">Mesh Active</span>
          </div>
          <div className="flex items-center gap-1.5 glass-card px-3 py-1.5 text-xs">
            <Wifi size={12} className="text-emerald-400" />
            <span className="text-white/70">P2P Connected</span>
          </div>
          <div className="flex items-center gap-1.5 glass-card px-3 py-1.5 text-xs">
            <Shield size={12} className="text-violet-400" />
            <span className="text-white/70">Ghost Privacy ON</span>
          </div>
        </div>

        {/* Live Badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-500 ${emergency ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${emergency ? 'bg-white' : 'bg-emerald-400'} animate-pulse`} />
          {emergency ? '⚠ EMERGENCY' : 'LIVE'}
        </div>
      </div>
    </header>
  )
}
