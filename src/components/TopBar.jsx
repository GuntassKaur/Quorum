import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

/**
 * TopBar Component v9.0 (Ultra-Slim Minimalist)
 * Focused on elegance and zero-clutter.
 */
export default function TopBar({ emergency, syncStatus }) {
    return (
        <header className="fixed top-0 left-0 right-0 z-[100] h-16 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md border-b border-white/5">
            
            {/* MINIMALIST LOGO */}
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#10b981] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <ShieldCheck size={18} className="text-black" />
                </div>
                <span className="text-lg font-black tracking-widest uppercase">Quorum</span>
            </div>

            {/* SLIM STATUS INDICATORS */}
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'LIVE' ? 'bg-[#10b981]' : 'bg-red-500'} animate-pulse`} />
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">{syncStatus}</span>
                </div>
                
                {emergency && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-4 py-1 bg-red-500/20 border border-red-500/30 rounded-full flex items-center gap-2"
                    >
                        <Activity size={10} className="text-red-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-red-500">Emergency Protocol Active</span>
                    </motion.div>
                )}
            </div>
        </header>
    );
}
