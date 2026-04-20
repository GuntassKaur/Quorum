import React from 'react';
import { Clock, TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WaitTimes({ emergency, zones }) {
  const waitItems = zones.filter(z => z.type !== 'Area');

  return (
    <div className={`glass-panel p-5 h-full flex flex-col transition-all duration-500 hud-border ${emergency ? 'opacity-20 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Clock size={16} className="text-neon-cyan animate-pulse" />
          <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/90">Wait Vectors</h2>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {waitItems.map(item => {
          const diff = item.currentWait - item.baseWait;
          const waitVal = Math.max(0, item.currentWait);
          const barWidth = Math.min(100, (waitVal / 20) * 100);
          
          return (
            <div key={item.id} className="group relative">
               <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-[11px] font-black tracking-widest text-white group-hover:text-neon-cyan transition-colors uppercase italic">{item.label}</p>
                    <p className="text-[8px] uppercase tracking-[0.2em] text-white/30 font-mono mt-0.5">Prediction: {waitVal < 5 ? 'Dropping' : 'Peak Expected'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-display font-black text-white">{waitVal.toFixed(1)}<span className="text-[10px] text-white/20 ml-1 font-mono uppercase">m</span></p>
                  </div>
               </div>

               {/* Dynamic Queue Bar */}
               <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    className={`h-full rounded-full ${item.density === 'high' ? 'bg-neon-red shadow-[0_0_10px_#ff003c]' : item.density === 'med' ? 'bg-orange-500 shadow-[0_0_10px_#f97316]' : 'bg-neon-green shadow-[0_0_10px_#00ff66]'}`}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                  {/* Subtle filling animation */}
                  <motion.div 
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-y-0 w-1/3 bg-white/10 skew-x-12"
                  />
               </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center gap-3 p-3 bg-neon-cyan/5 border border-neon-cyan/10 rounded-xl">
         <Activity size={14} className="text-neon-cyan animate-pulse" />
         <p className="text-[8px] font-mono text-cyan-200/50 uppercase tracking-widest leading-relaxed">
            Neural model predicting wait drop-off in ~2.4 mins for North Block.
         </p>
      </div>
    </div>
  );
}
