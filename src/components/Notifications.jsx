import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, AlertTriangle, X, Terminal } from 'lucide-react';

/**
 * Notifications Component v6.0
 * Premium glassmorphic toasts for tactical alerts.
 */
export default function Notifications({ alerts, removeAlert }) {
    return (
        <div className="fixed top-24 right-6 md:right-10 z-[1000] flex flex-col gap-4 w-full md:w-[380px] pointer-events-none">
            <AnimatePresence>
                {alerts.map((alert) => (
                    <motion.div
                        key={alert.id}
                        initial={{ x: 50, opacity: 0, scale: 0.95 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        exit={{ x: 50, opacity: 0, scale: 0.95 }}
                        layout
                        className="pointer-events-auto relative overflow-hidden"
                    >
                        <div className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] p-5 shadow-2xl flex items-start gap-4 group">
                            
                            {/* TACTICAL STATUS BAR */}
                            <div className={`absolute top-0 left-0 w-1 h-full ${
                                alert.type === 'danger' ? 'bg-red-500 shadow-[0_0_15px_#ef4444]' : 'bg-[#10b981] shadow-[0_0_15px_#10b981]'
                            }`} />

                            <div className={`mt-1 shrink-0 ${alert.type === 'danger' ? 'text-red-500' : 'text-[#10b981]'}`}>
                                {alert.type === 'danger' ? <AlertTriangle size={18} /> : <Terminal size={18} />}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-[9px] font-black tracking-[0.3em] uppercase text-white/30">
                                        {alert.type === 'danger' ? 'Priority Alert' : 'System Update'}
                                    </h4>
                                    <button 
                                        onClick={() => removeAlert(alert.id)}
                                        className="text-white/20 hover:text-white transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                                <p className="text-[12px] font-bold text-white/90 leading-relaxed">{alert.message}</p>
                            </div>
                        </div>

                        {/* AUTO-PROGRESS BAR */}
                        <motion.div 
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: 6, ease: "linear" }}
                            className={`absolute bottom-0 left-0 h-[2px] ${
                                alert.type === 'danger' ? 'bg-red-500/40' : 'bg-[#10b981]/40'
                            }`}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
