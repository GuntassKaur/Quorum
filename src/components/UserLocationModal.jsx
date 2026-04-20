import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, MapPin, ChevronRight, HelpCircle, Search } from 'lucide-react';

export default function UserLocationModal({ onComplete }) {
  const [seatId, setSeatId] = useState('');
  const [isNotSure, setIsNotSure] = useState(false);

  const zones = ['A1', 'B2', 'C3', 'D4', 'F6'];

  const getMatchedZone = (id) => {
    const uppercaseId = id.toUpperCase();
    return zones.find(z => uppercaseId.includes(z)) || 'Central';
  };

  const handleContinue = () => {
    const userZone = isNotSure ? 'Central' : getMatchedZone(seatId);
    localStorage.setItem('userZone', userZone);
    localStorage.setItem('userSeatId', seatId || 'NOT_SET');
    onComplete(userZone);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md glass-panel p-8 rounded-[2.5rem] border-white/10 shadow-2xl flex flex-col items-center text-center gap-6"
      >
        <div className="w-20 h-20 rounded-full bg-[#00ffc8]/10 flex items-center justify-center border border-[#00ffc8]/20">
           <Ticket size={40} className="text-[#00ffc8]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white italic">🎟 ENTER SEAT</h2>
          <p className="text-sm text-white/50 font-medium">FOR SAFE ROUTING</p>
        </div>

        <div className="w-full space-y-4">
          <div className="relative">
             <input 
               type="text"
               value={seatId}
               disabled={isNotSure}
               placeholder="Enter Seat ID (e.g. A1-102)"
               onChange={(e) => {
                 setSeatId(e.target.value);
                 setIsNotSure(false);
               }}
               className={`w-full bg-white/5 border ${seatId && !isNotSure ? 'border-[#00ffc8] shadow-[0_0_15px_rgba(0,255,200,0.3)]' : 'border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.05)]'} rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#00ffc8] focus:shadow-[0_0_20px_rgba(0,255,200,0.4)] transition-all duration-300`}
             />
             <Search size={18} className={`absolute right-6 top-1/2 -translate-y-1/2 transition-colors duration-300 ${seatId ? 'text-[#00ffc8]' : 'text-white/20'}`} />
          </div>

          <button
            onClick={() => {
              setIsNotSure(!isNotSure);
              setSeatId('');
            }}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all ${isNotSure ? 'bg-[#00ffc8]/10 border-[#00ffc8] text-[#00ffc8]' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
          >
            <HelpCircle size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">I'm not sure</span>
          </button>
        </div>

        {seatId && !isNotSure && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-2 bg-[#00ffc8]/10 border border-[#00ffc8]/20 rounded-full">
                <span className="text-[10px] font-black tracking-widest text-[#00ffc8] uppercase">ZONE {getMatchedZone(seatId)}</span>
            </motion.div>
        )}

        <button
          disabled={!seatId.trim() && !isNotSure}
          onClick={handleContinue}
          className={`w-full group py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 overflow-hidden ${
            (seatId.trim() || isNotSure) 
            ? 'bg-[#00ffc8] text-black shadow-[0_0_30px_rgba(0,255,200,0.3)]' 
            : 'bg-white/5 text-white/20 cursor-not-allowed'
          }`}
        >
          <span className="text-sm font-black uppercase tracking-[0.3em]">CONFIRM</span>
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}
