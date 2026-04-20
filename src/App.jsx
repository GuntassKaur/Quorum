import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, onSnapshot, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, logEvent } from './firebase';

// Components
import StadiumBlueprint from './components/StadiumBlueprint';
import SentinelChatbot from './components/SentinelChatbot';
import TopBar from './components/TopBar';
import StadiumBackground from './components/StadiumBackground';
import Notifications from './components/Notifications';

// Icons
import { 
    Zap, MapPin, ArrowRight, LogOut, Coffee, Droplets, Info, Search, Move
} from 'lucide-react';

/**
 * QUORUM — Crowd Safety OS v7.0.0 (Simplified Cinematic Build)
 * FOCUS: Maximum Clarity, High-Fidelity Stadium Experience.
 */
export default function App() {
    // --- CORE STATES ---
    const [view, setView] = useState('landing'); // landing | dashboard
    const [mode, setMode] = useState('user');
    const [zones, setZones] = useState([]);
    const [emergency, setEmergency] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    // --- USER SESSION ---
    const [seatInput, setSeatInput] = useState('');
    const [userSession, setUserSession] = useState({
        seat: null,
        zone: null,
        action: 'IDLE',
        suggestedPath: 'NONE',
        rationale: '',
        status: 'NOMINAL'
    });
    
    // --- TACTICAL STATES ---
    const [navigationPath, setNavigationPath] = useState(null);
    const [blockedGates, setBlockedGates] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [syncStatus, setSyncStatus] = useState('SYNCING');

    // --- ANALYTICS: PAGE VIEW ---
    useEffect(() => {
        logEvent('page_view', { page_title: 'Quorum Home' });
    }, []);

    // --- ALERTS ENGINE ---
    const addAlert = (message, type = 'info') => {
        const id = Date.now();
        setAlerts(prev => [{ id, message, type }, ...prev].slice(0, 3));
        setTimeout(() => setAlerts(prev => prev.filter(a => a.id !== id)), 6000);
    };

    // --- FIRESTORE SYNC ---
    useEffect(() => {
        const q = query(collection(db, 'stadium_data'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = [];
            snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
            setZones(data);
            setSyncStatus('LIVE');
            if (data.filter(z => z.density > 90).length >= 2 && !emergency) setEmergency(true);
        }, () => setSyncStatus('OFFLINE'));
        return () => unsubscribe();
    }, [emergency]);

    // --- HERO SUBMIT: SHOW MY WAY ---
    const handleHeroSubmit = (e) => {
        if (e) e.preventDefault();
        const input = seatInput.trim().toUpperCase();
        const seatRegex = /^[A-F][0-9]{1,3}$/;
        
        if (!seatRegex.test(input)) {
            addAlert("Invalid seat. Example: A12", "danger");
            return;
        }

        const sector = input.charAt(0);
        setUserSession(prev => ({ ...prev, seat: input, zone: sector, status: 'SAFE' }));
        setView('dashboard');
        logEvent('hero_submit', { seat: input, sector: sector });
        addAlert(`Sector ${sector} Identified. Welcome.`, "info");
    };

    // --- ACTION TRIGGER ---
    const handleAction = (type) => {
        if (!userSession.zone || isAnalyzing) return;
        setIsAnalyzing(true);
        setTimeout(() => {
            const targets = {
                exit: [{ id: 'E1', name: 'North Gate E1', d: 'M 400,50', zone: 'A' }, { id: 'E2', name: 'South Gate E2', d: 'M 400,550', zone: 'C' }],
                washroom: [{ id: 'W1', name: 'East Wing W1', d: 'M 750,300', zone: 'B' }, { id: 'W2', name: 'West Wing W2', d: 'M 50,300', zone: 'D' }],
                food: [{ id: 'F1', name: 'Concourse F1', d: 'M 600,100', zone: 'E' }, { id: 'F2', name: 'Concourse F2', d: 'M 200,500', zone: 'F' }]
            };
            const potential = targets[type].filter(t => !blockedGates.includes(t.id));
            if (potential.length === 0) {
                addAlert("Facility Closed. Please wait.", "danger");
                setIsAnalyzing(false);
                return;
            }
            let selected = potential[0];
            let rationale = `Gate ${selected.id} is the best and fastest way.`;
            if (potential.length > 1) {
                const zA = zones.find(z => z.id === potential[0].zone);
                const zB = zones.find(z => z.id === potential[1].zone);
                if (zA && zB && zB.density < zA.density) {
                    selected = potential[1];
                    rationale = `Recalculated: ${selected.id} is least crowded.`;
                }
            }
            const zoneOrigins = { A: 'M 400,150', B: 'M 540,300', C: 'M 400,450', D: 'M 260,300', E: 'M 530,150', F: 'M 270,450' };
            setNavigationPath({
                d: `${zoneOrigins[userSession.zone]} L ${selected.d.slice(2)}`,
                color: type === 'exit' ? '#10b981' : type === 'washroom' ? '#3b82f6' : '#f59e0b',
                label: selected.id,
                targetName: selected.name,
                type: type.toUpperCase()
            });
            setUserSession(prev => ({ ...prev, action: `${type.toUpperCase()} -> ${selected.id}`, suggestedPath: selected.name, rationale: rationale }));
            setIsAnalyzing(false);
            logEvent('tactical_action', { action_type: type, target: selected.id });
        }, 800);
    };

    return (
        <div id="quorum-root" className="w-screen h-screen bg-[#020617] text-white overflow-hidden relative selection:bg-[#10b981] selection:text-black">
            
            {/* REAL STADIUM BACKGROUND LAYER */}
            <StadiumBackground />
            
            <AnimatePresence>
                {view === 'dashboard' && (
                    <motion.div initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }}>
                        <TopBar emergency={emergency} syncStatus={syncStatus} mode={mode} onToggleMode={setMode} />
                    </motion.div>
                )}
            </AnimatePresence>

            <Notifications alerts={alerts} removeAlert={(id) => setAlerts(a => a.filter(x => x.id !== id))} />

            <AnimatePresence mode="wait">
                {view === 'landing' ? (
                    <motion.div 
                        key="landing"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                        className="relative z-50 w-full h-full flex flex-col items-center justify-center p-6 text-center"
                    >
                        {/* DARK OVERLAY FOR READABILITY */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
                        
                        <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">
                            <motion.h1 
                                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                                className="text-[70px] md:text-[140px] font-black tracking-tighter leading-none mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                            >
                                QUORUM
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                                className="text-xl md:text-3xl font-bold text-white mb-2"
                            >
                                "Find your way in a crowded stadium"
                            </motion.p>
                            
                            <motion.p 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                                className="text-sm md:text-lg font-medium text-white/40 uppercase tracking-[0.2em] mb-16"
                            >
                                Enter your seat and get the best route
                            </motion.p>

                            {/* BIG INPUT & GLOWING BUTTON */}
                            <motion.form 
                                onSubmit={handleHeroSubmit}
                                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
                                className="w-full max-w-2xl"
                            >
                                <div className="flex flex-col gap-6 items-center">
                                    <input 
                                        type="text" 
                                        value={seatInput}
                                        onChange={(e) => setSeatInput(e.target.value)}
                                        placeholder="Enter your seat (example: A12)"
                                        className="w-full h-16 md:h-24 bg-white/5 backdrop-blur-3xl border-2 border-white/10 rounded-[2rem] px-10 text-xl md:text-2xl font-bold text-white text-center placeholder:text-white/20 focus:outline-none focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/20 transition-all shadow-2xl"
                                        autoFocus
                                    />
                                    <button 
                                        type="submit"
                                        className="w-full md:w-auto px-20 py-6 bg-[#10b981] text-black font-black uppercase tracking-[0.3em] rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(16,185,129,0.4)] relative group"
                                    >
                                        <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                                        Show My Way
                                    </button>
                                </div>
                            </motion.form>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="dashboard"
                        initial={{ opacity: 0, filter: 'blur(20px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }}
                        className="relative z-10 w-full h-full flex flex-col pt-24"
                    >
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 p-6 md:p-10 overflow-hidden">
                            <aside className="flex flex-col gap-8 overflow-y-auto scrollbar-hide pb-20">
                                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col gap-8 shadow-2xl">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">My Location</h3>
                                        <span className="text-2xl font-black uppercase">Sector {userSession.zone}2</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <button onClick={() => handleAction('exit')} className="group relative h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center px-8 gap-6 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all"><LogOut size={20} /></div>
                                            <span className="text-xs font-black uppercase tracking-[0.2em]">EXIT</span>
                                        </button>
                                        <button onClick={() => handleAction('washroom')} className="group relative h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center px-8 gap-6 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-black transition-all"><Droplets size={20} /></div>
                                            <span className="text-xs font-black uppercase tracking-[0.2em]">WASHROOM</span>
                                        </button>
                                        <button onClick={() => handleAction('food')} className="group relative h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center px-8 gap-6 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-all"><Coffee size={20} /></div>
                                            <span className="text-xs font-black uppercase tracking-[0.2em]">FOOD</span>
                                        </button>
                                    </div>
                                </div>

                                {userSession.rationale && (
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] p-8 flex flex-col gap-4">
                                        <div className="flex items-center gap-4"><Info size={18} className="text-[#10b981]" /><span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#10b981]">Route Advice</span></div>
                                        <p className="text-sm font-bold text-white leading-relaxed">{userSession.rationale}</p>
                                    </div>
                                )}
                            </aside>

                            <div className="relative flex items-center justify-center overflow-hidden rounded-[3rem] md:rounded-[4rem] bg-black/20 border border-white/5 group shadow-2xl">
                                <div className="absolute top-10 left-10 z-10 flex items-center gap-3 px-6 py-2 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full">
                                    <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/80">LIVE VIEW — CROWD ACTIVE</span>
                                </div>
                                <StadiumBlueprint zones={zones} activeZone={userSession.zone} navigationPath={navigationPath} onZoneSelect={(id) => setUserSession(prev => ({ ...prev, zone: id }))} />
                            </div>
                        </div>
                        <SentinelChatbot zones={zones} userZone={userSession.zone} emergency={emergency} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
