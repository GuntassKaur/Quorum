import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, AlertTriangle } from 'lucide-react';

export default function PredictiveNexus({ onSimulate }) {
    const [sliderValue, setSliderValue] = useState(0);

    const handleChange = (e) => {
        const val = parseInt(e.target.value);
        setSliderValue(val);
        // Pass simulation delta to parent (App.jsx)
        onSimulate(val);
    };

    return (
        <div className="p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
                <Brain className="text-[#10b981]" size={18} />
                <span className="text-[10px] font-black text-[#10b981] tracking-[0.3em] uppercase">Predictive Nexus</span>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic">Simulation Time Offset</span>
                    <span className="text-xl font-black text-white">+{sliderValue}m</span>
                </div>

                <div className="relative group">
                    <input 
                        type="range" 
                        min="0" 
                        max="60" 
                        value={sliderValue} 
                        onChange={handleChange}
                        className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#10b981] hover:bg-white/10 transition-all"
                    />
                </div>

                <div className="p-4 bg-[#10b981]/5 border border-[#10b981]/10 rounded-2xl flex gap-3 items-start animate-pulse">
                    <AlertTriangle className="text-[#10b981] shrink-0" size={16} />
                    <p className="text-[10px] text-white/70 leading-relaxed italic">
                        {sliderValue === 0 
                            ? "AI Status: Monitoring current telemetry. All sectors nominal." 
                            : `AI Forecast: Sector ${sliderValue > 30 ? 'C' : 'A'} will hit 92% density in ${sliderValue} minutes. Recommendation: Redirect flow to Gate 2.`}
                    </p>
                </div>
            </div>
        </div>
    );
}
