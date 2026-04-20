import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Utensils, DoorOpen } from 'lucide-react';

const FACILITIES = [
  { id: 'f1', type: 'WASHROOM', title: '🚻 WASHROOM — Gate A2', distance: '120m', queue: 'Low', recommended: 'Yes', x: 25, y: 35, Icon: Droplet },
  { id: 'f2', type: 'FOOD', title: '🍔 FOOD COURT — West Block', distance: '90m', queue: 'Medium', recommended: 'Yes', x: 18, y: 65, Icon: Utensils },
  { id: 'f3', type: 'EXIT', title: '🚪 EXIT GATES — North Wing', distance: '150m', queue: 'Low', recommended: 'Yes', x: 75, y: 25, Icon: DoorOpen },
  { id: 'f4', type: 'WASHROOM', title: '🚻 WASHROOM — South Block', distance: '300m', queue: 'High', recommended: 'No', x: 80, y: 75, Icon: Droplet },
  { id: 'f5', type: 'FOOD', title: '🍔 FAST FOOD — East Gate', distance: '120m', queue: 'Low', recommended: 'Yes', x: 85, y: 45, Icon: Utensils }
];

export default function BroadcastMap({ eventMode, zones, emergency, layerMode = 'CROWD', userZone }) {
  const [activeFacility, setActiveFacility] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const ZONE_EXIT_MAP = {
    'A1': { gate: 'Gate 4', x: 40, y: 5 },
    'B2': { gate: 'Gate 6', x: 60, y: 5 },
    'C3': { gate: 'Gate 2', x: 20, y: 5 },
    'D4': { gate: 'Gate 8', x: 80, y: 5 },
    'F6': { gate: 'Gate 5', x: 50, y: 5 },
    'Central': { gate: 'Gate 4', x: 40, y: 5 }
  };

  const getNearestExit = (zone) => {
    const rawZone = zone?.includes('-') ? zone.split('-')[1] : zone;
    return ZONE_EXIT_MAP[rawZone] || ZONE_EXIT_MAP['Central'];
  };

  const exitInfo = getNearestExit(userZone);
  const filteredFacilities = (FACILITIES || []).filter(f => filter === 'ALL' || f.type === filter);

  // Helper for crowd movement particles
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 20,
    pathIndex: Math.floor(Math.random() * 4)
  }));

  const flowPaths = [
    "M 15 25 Q 50 15 85 25",
    "M 15 75 Q 50 85 85 75",
    "M 15 25 Q 5 50 15 75",
    "M 85 25 Q 95 50 85 75"
  ];

  const userZoneObj = zones.find(z => z.label?.includes(userZone));

  return (
    <div className="absolute inset-0 z-10 overflow-hidden bg-[#050505]">
      {/* TOOLTIP TARGET */}
      <div id="map-tooltip" className="fixed zone-tooltip opacity-0 transition-opacity duration-300 pointer-events-none"></div>

      
      {/* SCANLINES & HUD */}
      <div className="absolute inset-0 z-[100] pointer-events-none opacity-[0.03] scanlines" />
      <div className="absolute inset-0 z-[90] pointer-events-none p-10 flex flex-col justify-between border-[20px] border-white/5">
         <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
               <div className="flex items-center gap-2 text-white/40">
                  <div className="w-2 h-2 rounded-full bg-[#ff3b3b] animate-pulse" />
                  <span className="text-[10px] font-black tracking-[0.3em]">REC</span>
               </div>
               <span className="text-[9px] font-mono text-white/20">CAM_04 // {eventMode}_VIEW</span>
            </div>
         </div>
      </div>

      <motion.div 
        animate={{ scale: [1, 1.01, 1], rotateX: [25, 26, 25] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 preserve-3d h-full w-full"
        style={{ perspective: '1200px' }}
      >
        {/* FIELD */}
        <div
          className="absolute z-[11] shadow-[0_100px_200px_rgba(0,0,0,1)]"
          style={{
            bottom: '10%', left: '15%', right: '15%', height: '40%',
            opacity: emergency ? 0.2 : 0.9,
            transition: 'opacity 1.5s ease',
            transform: 'perspective(1500px) rotateX(30deg)',
            background: 'linear-gradient(to bottom, #113311, #0a220a)',
            borderRadius: '40px',
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.08)'
          }}
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-leather.png')" }} />
          <div className="absolute inset-[15px] border-2 border-white/20" />
        </div>

        {/* CROWD FLOW PARTICLES */}
        <svg className="absolute inset-0 w-full h-full z-[15] pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
             <defs>
               <filter id="p-glow"><feGaussianBlur stdDeviation="0.4" /><feComposite in="SourceGraphic" /></filter>
               <filter id="route-glow-user"><feGaussianBlur stdDeviation="1.5" /><feComposite in="SourceGraphic" /></filter>
               <radialGradient id="user-highlight-glow">
                  <stop offset="0%" stopColor="#00ffc8" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#00ffc8" stopOpacity="0" />
               </radialGradient>
               <marker id="arrowhead" markerWidth="3" markerHeight="3" refX="0" refY="1.5" orient="auto">
                 <polygon points="0 0, 3 1.5, 0 3" fill="#00ffc8" opacity="0.3" />
               </marker>
             </defs>
          
          {/* FLOW DIRECTION ARROWS */}
          <path d="M 10 20 L 90 20" stroke="#00ffc8" strokeWidth="0.1" opacity="0.1" markerEnd="url(#arrowhead)" />
          <path d="M 10 50 L 90 50" stroke="#00ffc8" strokeWidth="0.1" opacity="0.1" markerEnd="url(#arrowhead)" />
          <path d="M 10 80 L 90 80" stroke="#00ffc8" strokeWidth="0.1" opacity="0.1" markerEnd="url(#arrowhead)" />

          {particles.map(p => (
            <motion.circle
              key={p.id}
              r="0.3"
              fill={emergency ? "#ff3b3b" : "#00ffc8"}
              filter="url(#p-glow)"
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
              style={{ motionPath: `path("${flowPaths[p.pathIndex]}")`, opacity: 0.3 }}
            />
          ))}

          {/* CROWD PULSE ZONES */}
          {(zones || []).map((zone) => (
            <g key={zone.id}>
              <motion.circle
                cx={zone.x}
                cy={zone.y}
                r={6}
                fill={zone.density > 0.8 ? '#ff3b3b' : zone.density > 0.5 ? '#ffcc00' : '#00ffc8'}
                className="animate-crowd-pulse mix-blend-screen"
                style={{ opacity: 0.3 }}
              />
              
              {/* HOVER HIT AREA */}
              <circle
                cx={zone.x}
                cy={zone.y}
                r={8}
                fill="transparent"
                className="cursor-crosshair pointer-events-auto"
                onMouseEnter={(e) => {
                  const tooltip = document.getElementById('map-tooltip');
                  if (tooltip) {
                    tooltip.style.opacity = '1';
                    tooltip.innerHTML = `
                      <div class="space-y-1">
                        <div class="text-[10px] font-black text-[#00ffc8] uppercase tracking-widest">${zone.id} Status</div>
                        <div class="flex justify-between gap-8 text-[11px] font-bold">
                          <span class="text-white/40">CROWD</span>
                          <span>${Math.round(zone.density * 100)}%</span>
                        </div>
                        <div class="flex justify-between gap-8 text-[11px] font-bold">
                          <span class="text-white/40">RISK</span>
                          <span class="${zone.density > 0.8 ? 'text-red-500' : 'text-white'}">${zone.density > 0.8 ? 'CRITICAL' : 'SAFE'}</span>
                        </div>
                      </div>
                    `;
                  }
                }}
                onMouseMove={(e) => {
                  const tooltip = document.getElementById('map-tooltip');
                  if (tooltip) {
                    tooltip.style.left = `${e.clientX + 20}px`;
                    tooltip.style.top = `${e.clientY - 20}px`;
                  }
                }}
                onMouseLeave={() => {
                  const tooltip = document.getElementById('map-tooltip');
                  if (tooltip) tooltip.style.opacity = '0';
                }}
              />
            </g>
          ))}

          {/* CROWD FLOW ARROWS (Subtle) */}
          <path
            d="M 20 25 L 50 20 M 50 20 L 80 25 M 20 75 L 50 80 M 50 80 L 80 75"
            fill="none"
            stroke="white"
            strokeWidth="0.2"
            strokeOpacity="0.1"
            className="animate-flow-arrows"
          />

          {/* USER ZONE HIGHLIGHT GLOW */}
          {userZone && (
            <motion.circle
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              cx={zones.find(z => z.id === userZone)?.x || 50}
              cy={zones.find(z => z.id === userZone)?.y || 50}
              r={12}
              fill="url(#user-highlight-glow)"
              className="mix-blend-screen"
            />
          )}

          {/* LIFE CORRIDOR — EMERGENCY ONLY */}
          {emergency && (
            <>
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, ease: "easeInOut" }}
                d="M 10 90 Q 50 85 90 90"
                fill="none"
                stroke="#00ff66"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#route-glow-user)"
                className="shadow-[0_0_30px_#00ff66] opacity-80"
              />
              {/* MOVING AMBULANCE/EMS DOT */}
              <motion.circle
                r="1.2"
                fill="#00ff66"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                style={{ motionPath: 'path("M 10 90 Q 50 85 90 90")', filter: "drop-shadow(0 0 10px #00ff66)" }}
              />
              <motion.text
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                x="50" y="80"
                fill="#00ff66"
                className="text-[1.5px] font-black uppercase tracking-widest"
                textAnchor="middle"
              >
                Life Corridor Active
              </motion.text>
            </>
          )}

          {/* USER ROUTE */}
          {userZone && userZoneObj && (
            <>
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d={`M ${userZoneObj.x} ${userZoneObj.y} Q 50 50 ${exitInfo.x} ${exitInfo.y}`}
                fill="none"
                stroke="#00ffc8"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeDasharray="3 3"
                filter="url(#route-glow-user)"
                className="animate-pulse"
              />
              {/* START MARKER */}
              <motion.circle 
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                cx={userZoneObj.x} cy={userZoneObj.y} r="0.8" fill="#00ffc8" shadow="0 0 10px #00ffc8" 
              />
              {/* EXIT MARKER */}
              <circle cx={exitInfo.x} cy={exitInfo.y} r="0.6" fill="#00ffc8" />
            </>
          )}
        </svg>

        {/* HEAT ZONES */}
        <div className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-1000 ${layerMode === 'FACILITIES' ? 'opacity-20' : 'opacity-100'}`}>
            {zones.map((zone) => {
              if (zone.isPitch) return null;
              const isUserHere = userZone && zone.label?.includes(userZone);
              const isCorridor = zone.x > 40 && zone.x < 60;
              const xOff = (emergency && isCorridor) ? (zone.x < 50 ? -120 : 120) : 0;
              const col = zone.density >= 0.8 || emergency ? '255, 59, 59' : zone.density >= 0.5 ? '255, 204, 0' : '0, 255, 200';
              return (
                <motion.div
                  key={`heat-${zone.id}`}
                  animate={isUserHere ? { x: xOff, scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] } : { x: xOff, scale: [1, 1.1, 1], filter: ['blur(35px)', 'blur(50px)', 'blur(35px)'] }}
                  transition={isUserHere ? { duration: 2, repeat: Infinity } : { x: { duration: 1.5, ease: "circOut" }, scale: { duration: 6, repeat: Infinity } }}
                  className={`absolute rounded-full shimmer-effect ${isUserHere ? 'z-[30]' : 'z-[20]'}`}
                  style={{
                    left: `${zone.x}%`, top: `${zone.y}%`, 
                    width: isUserHere ? `${zone.w * 4}%` : `${zone.w * 3}%`, height: isUserHere ? `${zone.h * 2.5}%` : `${zone.h * 1.8}%`,
                    background: `radial-gradient(circle, rgba(${isUserHere ? '255,255,255' : col}, ${isUserHere ? 0.6 : 0.5}) 0%, rgba(${isUserHere ? '255,255,255' : col}, 0) 70%)`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              );
            })}
        </div>

        {/* LABELS */}
        <div className="absolute inset-0 z-40  pointer-events-none">
           {zones.map(zone => {
              if(zone.isPitch) return null;
              const isCrit = emergency || zone.density >= 0.8;
              const isUserHere = userZone && zone.label?.includes(userZone);

              return (
                <motion.div key={`lbl-${zone.id}`} className="absolute" style={{ left: `${zone.x}%`, top: `${zone.y - 12}%` }}>
                   <div className="flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2">
                      {isUserHere && (
                        <div className="mb-2 px-3 py-1 bg-white text-black text-[8px] font-black rounded-full shadow-[0_0_15px_white]">
                          YOU ARE HERE
                        </div>
                      )}
                      <div className={`px-5 py-2.5 bg-black/95 border-2 rounded-3xl backdrop-blur-3xl flex items-center gap-4 transition-all duration-300 ${isUserHere ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : isCrit ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'border-[#00ffc8]/30 shadow-[0_0_15px_rgba(0,255,200,0.1)] hover:border-[#00ffc8]/60 hover:shadow-[0_0_25px_rgba(0,255,200,0.2)]'}`}>
                         <div className={`w-2.5 h-2.5 rounded-full ${isUserHere ? 'bg-white animate-pulse' : isCrit ? 'bg-red-500 animate-ping' : 'bg-[#00ffc8]'}`} />
                         <span className="text-[10px] font-black tracking-tighter text-white">{zone.label}</span>
                         <span className={`text-[10px] font-bold ${isUserHere ? 'text-white' : isCrit ? 'text-red-500' : 'text-[#00ffc8]'}`}>{Math.round(zone.density * 100)}%</span>
                      </div>
                      <div className={`w-px h-10 ${isUserHere ? 'bg-white/40 shadow-[0_0_10px_white]' : 'bg-white/10'}`} />
                   </div>
                </motion.div>
              );
           })}
        </div>

        {/* FACILITIES */}
        <AnimatePresence>
          {layerMode === 'FACILITIES' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 pointer-events-none">
              {filteredFacilities.map(fac => {
                const isSel = activeFacility?.id === fac.id;
                const col = fac.queue === 'High' ? 'text-[#ff3b3b] border-[#ff3b3b]/50' : fac.queue === 'Medium' ? 'text-yellow-400 border-yellow-500/50' : 'text-[#00ffc8] border-[#00ffc8]/50';
                return (
                  <div key={fac.id} className="absolute" style={{ left: `${fac.x}%`, top: `${fac.y}%` }}>
                    <button onClick={() => setActiveFacility(isSel ? null : fac)} className={`pointer-events-auto p-3 rounded-2xl border backdrop-blur-3xl transition-all ${col} ${isSel ? 'bg-white/20 scale-125' : 'bg-black/80'}`}>
                      <fac.Icon size={18} />
                    </button>
                  </div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* FILTER BUTTONS */}
      <div className="absolute bottom-10 left-10 z-[100] flex gap-3">
         {['ALL', 'FOOD', 'WASHROOM', 'EXIT'].map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`px-5 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all ${filter === t ? 'bg-[#00ffc8] border-[#00ffc8] text-black shadow-lg shadow-[#00ffc8]/20' : 'bg-black/60 border-white/10 text-white/50 hover:text-white'}`}>
               {t}
            </button>
         ))}
      </div>

      {/* DENSITY LEGEND */}
      <div className="absolute top-10 right-10 z-[100] glass-panel px-4 py-3 rounded-xl border-white/5 flex items-center gap-4">
         <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Density Scale</span>
         <div className="flex gap-1.5 items-center">
            <span className="text-[8px] font-bold text-white/20">LOW</span>
            <div className="flex gap-1">
               <div className="w-1.5 h-3 rounded-full bg-[#00ffc8]" />
               <div className="w-1.5 h-3 rounded-full bg-yellow-400" />
               <div className="w-1.5 h-3 rounded-full bg-red-500" />
            </div>
            <span className="text-[8px] font-bold text-white/20">HIGH</span>
         </div>
      </div>

      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        .scanlines { background: linear-gradient(to bottom, transparent 50%, rgba(255, 255, 255, 0.1) 50%); background-size: 100% 4px; }
        .shimmer-effect::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.05),
            transparent
          );
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
