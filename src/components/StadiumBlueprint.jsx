import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * StadiumBlueprint Component v6.0
 * High-fidelity tactical map with glowing route visualization and flow dynamics.
 */
const StadiumBlueprint = memo(({ zones, activeZone, navigationPath, onZoneSelect }) => {
    const [hoveredZone, setHoveredZone] = useState(null);

    const zonePaths = {
        A: "M 300,120 L 500,120 L 550,220 L 250,220 Z",
        B: "M 560,230 L 710,330 L 560,430 L 510,330 Z",
        C: "M 300,520 L 500,520 L 550,420 L 250,420 Z",
        D: "M 240,230 L 90,330 L 240,430 L 290,330 Z",
        E: "M 520,130 L 720,330 L 570,430 L 520,330 Z",
        F: "M 80,330 L 280,530 L 280,430 L 230,430 Z"
    };

    const zoneCenters = {
        A: { x: 400, y: 170 }, B: { x: 600, y: 330 }, C: { x: 400, y: 470 },
        D: { x: 200, y: 330 }, E: { x: 580, y: 240 }, F: { x: 220, y: 420 }
    };

    const getDensityColor = (density) => {
        if (density > 75) return '#ef4444';
        if (density > 40) return '#f59e0b';
        return '#10b981';
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center p-8 lg:p-16">
            <svg 
                viewBox="0 0 800 600" 
                className="w-full h-full max-w-[1200px] drop-shadow-[0_0_100px_rgba(0,0,0,0.8)]"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* AMBIENT ARCHITECTURE */}
                <rect x="50" y="50" width="700" height="500" rx="150" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.05" />
                <rect x="100" y="100" width="600" height="400" rx="100" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.03" />

                {/* DYNAMIC TACTICAL ZONES */}
                {Object.entries(zonePaths).map(([id, d]) => {
                    const zoneData = zones.find(z => z.id === id) || { density: 0 };
                    const color = getDensityColor(zoneData.density);
                    const isActive = activeZone === id;
                    const isHovered = hoveredZone === id;
                    const isDimmed = activeZone && !isActive;

                    return (
                        <motion.g 
                            key={id}
                            initial={{ opacity: 0 }} animate={{ opacity: isDimmed ? 0.2 : 1 }}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredZone(id)}
                            onMouseLeave={() => setHoveredZone(null)}
                            onClick={() => onZoneSelect(id)}
                        >
                            {/* GLOWING BASE SHAPE */}
                            <motion.path 
                                d={d}
                                fill={color}
                                fillOpacity={isActive ? 0.2 : isHovered ? 0.15 : 0.05}
                                stroke={color}
                                strokeWidth={isActive ? 4 : 2}
                                strokeOpacity={isActive ? 1 : isHovered ? 0.6 : 0.15}
                                transition={{ duration: 0.3 }}
                                className={isActive ? 'filter drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]' : ''}
                            />

                            {/* ACTIVE PULSE */}
                            {isActive && (
                                <motion.path 
                                    d={d}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="8"
                                    initial={{ opacity: 0, scale: 1 }}
                                    animate={{ opacity: [0, 0.3, 0], scale: [1, 1.02, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            )}

                            {/* FLOW DYNAMICS */}
                            {zoneData.density > 20 && !isDimmed && (
                                <motion.path 
                                    d={d}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="1.5"
                                    strokeDasharray="6 12"
                                    strokeOpacity={0.3}
                                    animate={{ strokeDashoffset: [0, -100] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                />
                            )}

                            {/* TACTICAL LABELS */}
                            {!isDimmed && (
                                <text 
                                    x={zoneCenters[id].x}
                                    y={zoneCenters[id].y}
                                    fill="white"
                                    fillOpacity={isActive || isHovered ? 1 : 0.15}
                                    fontSize="14"
                                    fontWeight="900"
                                    textAnchor="middle"
                                    className="pointer-events-none transition-all uppercase tracking-[0.4em]"
                                >
                                    {id}
                                </text>
                            )}
                        </motion.g>
                    );
                })}

                {/* GLOWING ROUTE VISUALIZATION (WOW EFFECT) */}
                <AnimatePresence>
                    {navigationPath && (
                        <g className="pointer-events-none">
                            {/* Main Glowing Path */}
                            <motion.path 
                                d={navigationPath.d}
                                stroke={navigationPath.color}
                                strokeWidth="8"
                                fill="none"
                                strokeLinecap="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                                className="filter blur-[8px] opacity-40"
                            />
                            <motion.path 
                                d={navigationPath.d}
                                stroke={navigationPath.color}
                                strokeWidth="4"
                                fill="none"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1, ease: "easeInOut" }}
                                className="drop-shadow-[0_0_20px_rgba(0,0,0,1)]"
                            />
                            {/* Directional Flow Particles */}
                            <motion.path 
                                d={navigationPath.d}
                                stroke="white"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray="15 30"
                                animate={{ strokeDashoffset: [0, -150] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                className="opacity-60"
                            />
                        </g>
                    )}
                </AnimatePresence>

                {/* TACTICAL MARKERS (GATES) */}
                <g className="pointer-events-none">
                    {[{ x: 400, y: 50, id: 'E1' }, { x: 400, y: 550, id: 'E2' }].map(gate => (
                        <g key={gate.id}>
                            <motion.circle 
                                cx={gate.x} cy={gate.y} r="8" 
                                fill="#10b981" 
                                initial={{ scale: 0.8 }} animate={{ scale: [0.8, 1.2, 0.8] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="filter drop-shadow-[0_0_10px_#10b981]"
                            />
                            <text x={gate.x} y={gate.y + (gate.id === 'E1' ? -20 : 30)} fill="#10b981" fontSize="10" fontWeight="900" textAnchor="middle" className="uppercase tracking-[0.4em] font-black">
                                GATE {gate.id}
                            </text>
                        </g>
                    ))}
                </g>
            </svg>

            {/* FLOATING TELEMETRY TOOLTIP */}
            <AnimatePresence>
                {hoveredZone && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute z-[100] bg-black/80 backdrop-blur-3xl border border-white/20 p-6 rounded-3xl shadow-2xl pointer-events-none"
                        style={{ 
                            left: zoneCenters[hoveredZone].x + 60,
                            top: zoneCenters[hoveredZone].y - 60
                        }}
                    >
                        <h4 className="text-[11px] font-black text-[#10b981] uppercase tracking-[0.4em] mb-4">Sector {hoveredZone} Stream</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between gap-12">
                                <span className="text-[10px] text-white/40 uppercase font-black">Load</span>
                                <span className="text-[10px] text-white font-black">{Math.round(zones.find(z => z.id === hoveredZone)?.density || 0)}%</span>
                            </div>
                            <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }} animate={{ width: `${zones.find(z => z.id === hoveredZone)?.density}%` }}
                                    className={`h-full ${getDensityColor(zones.find(z => z.id === hoveredZone)?.density)}`}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

export default StadiumBlueprint;
