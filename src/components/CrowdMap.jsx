import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, ShieldAlert, Activity, Wind, Zap, Ambulance, Target, Cpu } from 'lucide-react';

const exits = [
  { x: 35, y: 0, label: 'EXIT ALPHA', type: 'primary' },
  { x: 65, y: 0, label: 'EXIT BETA', type: 'secondary' },
  { x: 50, y: 100, label: 'EXIT GAMMA', type: 'primary' }
];

class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4; // Slower, more realistic
    this.vy = (Math.random() - 0.5) * 0.4;
    this.radius = 0.5 + Math.random() * 0.8; // PRECISE POINTS, NOT INSECTS
    this.alpha = 0.4 + Math.random() * 0.4;
    this.color = '#00f3ff';
  }

  update(zones, emergency, themeColor) {
    const W = this.canvas.width;
    const H = this.canvas.height;

    // Movement toward exits in emergency
    if (emergency) {
      exits.forEach(ex => {
        const exX = (ex.x / 100) * W;
        const exY = (ex.y / 100) * H;
        const dx = exX - this.x;
        const dy = exY - this.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d > 0) {
          this.vx += (dx / d) * 0.08;
          this.vy += (dy / d) * 0.08;
        }
      });
    }

    const zone = zones.find(z => {
      const zx = (z.x / 100) * W;
      const zy = (z.y / 100) * H;
      const zw = (z.w / 100) * W;
      const zh = (z.h / 100) * H;
      return this.x > zx && this.x < zx + zw && this.y > zy && this.y < zy + zh;
    });

    if (zone) {
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.color = (zone.o2 < 18.5 || emergency) ? '#ff1e1e' : themeColor;
    } else {
      this.color = 'rgba(255,255,255,0.4)';
      this.vx += (Math.random() - 0.5) * 0.02;
      this.vy += (Math.random() - 0.5) * 0.02;
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) this.x = W; if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H; if (this.y > H) this.y = 0;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Occasional subtle pulse for high density zones
    if (Math.random() > 0.999) {
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.globalAlpha = 0.2;
      ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

export default function CrowdMap({ zones, selectedZone, setSelectedZone, emergency, eventMode }) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const requestRef = useRef(null);
  const parallaxRef1 = useRef(null);
  const parallaxRef2 = useRef(null);
  const parallaxRef3 = useRef(null);

  useEffect(() => {
    let mouse = { x: 0, y: 0 };
    let cameraZoom = 1.65;
    let zoomDir = 1;
    let animationFrameId;

    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 30;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 30;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    const updateLoop = () => {
      cameraZoom += (0.0002 * zoomDir);
      if (cameraZoom > 1.8) zoomDir = -1;
      if (cameraZoom < 1.6) zoomDir = 1;

      if (canvasRef.current) {
        canvasRef.current.style.transform = `perspective(2000px) rotateX(10deg) scale(${cameraZoom})`;
      }
      if (parallaxRef1.current) {
        parallaxRef1.current.style.transform = `rotateX(${60 + mouse.y * 0.05}deg) rotateY(${mouse.x * 0.05}deg) translateZ(-200px) scale(2)`;
      }
      if (parallaxRef2.current) {
        parallaxRef2.current.style.transform = `rotateX(${55 + mouse.y * 0.15}deg) rotateY(${mouse.x * 0.1}deg) translateY(-100px) scale(${cameraZoom})`;
      }
      if (parallaxRef3.current) {
        parallaxRef3.current.style.transform = `rotateX(${55 + mouse.y * 0.15}deg) rotateY(${mouse.x * 0.1}deg) translateY(-150px) scale(${cameraZoom + 0.05})`;
      }

      animationFrameId = requestAnimationFrame(updateLoop);
    };

    updateLoop();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const themeColor = {
    FOOTBALL: '#00f3ff', // Cyan
    CRICKET: '#fbbf24',  // Amber
    CONCERT: '#d946ef',  // Fuchsia
    ESPORTS: '#10b981',  // Emerald
    TENNIS: '#bef264'    // Lime
  }[eventMode] || '#00f3ff';
  

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.current = Array.from({ length: 1200 }, () => new Particle(canvas));
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      // CLEAR WITH TRANSPARENCY TO SHOW STADIUM IMAGE
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // OPTIONAL: ADD VERY SUBTLE TEXTURE OR COLOR WASH IF NEEDED
      // ctx.fillStyle = 'rgba(0, 243, 255, 0.02)';
      // ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.globalCompositeOperation = 'screen';
      particles.current.forEach(p => {
        p.update(zones, emergency, themeColor);
        p.draw(ctx);
      });
      requestRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(requestRef.current);
    };
  }, [zones, emergency, themeColor]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black theme-${eventMode}`}>
      {/* REAL STADIUM BACKGROUND LAYER */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-1000"
        style={{ 
          backgroundImage: `url('${eventMode === 'ESPORTS' ? '/realistic_esports_arena_interior_1776181720691.png' : '/realistic_football_stadium_topdown_1776181665952.png'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.8
        }}
      />
      <div className="absolute inset-0 bg-black/40 z-1" />

      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-10"
        style={{ 
          transformOrigin: 'center center',
          transform: `perspective(2000px) rotateX(10deg) scale(1.65)` 
        }}
      />
      {/* CINEMATIC FLOODLIGHT LENS FLARES */}
      <div className="absolute inset-0 pointer-events-none z-10">
         <div className="absolute top-0 left-0 w-[60%] h-[60%] opacity-20 blur-[120px]" style={{ background: `radial-gradient(circle at 0% 0%, ${themeColor}, transparent)` }} />
         <div className="absolute top-0 right-0 w-[60%] h-[60%] opacity-20 blur-[120px]" style={{ background: `radial-gradient(circle at 100% 0%, ${themeColor}, transparent)` }} />
      </div>

      {/* DYNAMIC STADIUM FLOODLIGHTS (FLOATING) */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-[-20%] left-[20%] w-[60%] h-[40%] rounded-full blur-[150px] pointer-events-none"
        style={{ background: themeColor }}
      />

      {/* SCANLINE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent bg-[length:100%_8px] opacity-20" />

      {/* 3D PERSPECTIVE ENVIRONMENT */}
      <div className="absolute inset-0 pointer-events-none" style={{ perspective: '2500px' }}>
        {/* BACKGROUND PARALLAX GRID */}
        <div 
          ref={parallaxRef1}
          className="absolute inset-[-20%] z-0"
          style={{ 
            transform: `rotateX(60deg) rotateY(0deg) translateZ(-200px) scale(2)`,
            background: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* STADIUM BORDER STRUCTURE */}
        <div 
          ref={parallaxRef2}
          className="absolute inset-x-0 bottom-[-30%] h-[140%] border-[2px] border-white/10 rounded-[400px] shadow-[0_0_100px_rgba(0,243,255,0.05)]"
          style={{ 
            transform: `rotateX(55deg) rotateY(0deg) translateY(-100px) scale(1.65)`,
            boxShadow: `0 0 150px ${themeColor}11`
          }}
        >
           <div className="absolute inset-0 grid-background opacity-[0.05] rounded-[inherit]" />
           <div className="absolute inset-10 border border-white/10 rounded-[350px] shadow-inner" />
           <div className="absolute inset-40 border border-white/5 rounded-[250px]" />
           
           {/* STADIUM GLOW RING */}
           <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_80px_rgba(255,255,255,0.02)]" />
        </div>
      </div>

      {/* INTERACTIVE ZONE LAYER */}

      {/* INTERACTIVE ZONE LAYER */}
      <div 
        ref={parallaxRef3}
        className="absolute inset-0 pointer-events-auto"
        style={{ 
          transformOrigin: 'center bottom',
          transform: `rotateX(55deg) rotateY(0deg) translateY(-150px) scale(1.70)` 
        }}
      >
        {zones.map(zone => (
          <button
            key={zone.id}
            onClick={() => setSelectedZone(zone)}
            className={`absolute transition-all duration-700 overflow-hidden group border border-white/0 hover:border-white/10 ${
              selectedZone?.id === zone.id ? 'bg-white/[0.04] shadow-[0_0_40px_rgba(255,255,255,0.03)]' : 'hover:bg-white/[0.02]'
            }`}
            style={{ 
              left: `${zone.x}%`, top: `${zone.y}%`, 
              width: `${zone.w}%`, height: `${zone.h}%`,
              borderRadius: zone.isPitch ? '4px' : '20px'
            }}
          >
            <div className={`w-full h-full flex flex-col items-center justify-center p-2`}>
                <span className={`text-[9px] font-black tracking-widest font-mono px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/20 uppercase text-white`}>
                  {zone.label}
                </span>
               
               {/* ZONE BREATHING EFFECT */}
               <motion.div 
                 animate={{ opacity: [0.1, 0.4, 0.1] }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="absolute inset-0 bg-white/[0.01] pointer-events-none" 
               />

               {zone.crowdPercent > 80 && (
                 <motion.div 
                   animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                   transition={{ duration: 1, repeat: Infinity }}
                   className="mt-2 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_15px_red]" 
                 />
               )}
            </div>
          </button>
        ))}
      </div>

      {/* EMERGENCY MODE: PULSE OVERLAY */}
      <AnimatePresence>
        {emergency && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{ transform: 'rotateX(55deg) translateY(-150px) scale(1.65)', transformOrigin: 'center bottom' }}
          >
             {/* FLASHING LIGHTS */}
             <motion.div 
               animate={{ opacity: [0, 0.2, 0] }}
               transition={{ duration: 0.5, repeat: Infinity }}
               className="absolute inset-0 bg-red-600 mix-blend-overlay"
             />
             
             {/* EVACUATION VECTOR FLOW */}
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[90%] h-32 border-y-2 border-red-500/30 flex items-center justify-center overflow-hidden">
                   <motion.div 
                     animate={{ x: ['-100%', '100%'] }}
                     transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                     className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent"
                   />
                   <span className="text-[12px] font-black tracking-[2em] text-red-500/60 uppercase">CRITICAL_EVACUATION_FLOW</span>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
