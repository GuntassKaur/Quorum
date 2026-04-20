import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Network, Fingerprint, Lock } from 'lucide-react';

/**
 * Animated mesh network canvas showing nodes + signal pulses.
 */
function MeshCanvas({ nodes, emergency }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const signalRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;
    const ctx = canvas.getContext('2d');

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    // Map node % coords to pixels
    const mapped = nodes.map(n => ({
      ...n,
      px: (n.x / 100) * W,
      py: (n.y / 100) * H,
    }));

    // Find edges (connect nodes within 35% proximity)
    const edges = [];
    for (let i = 0; i < mapped.length; i++) {
      for (let j = i + 1; j < mapped.length; j++) {
        const dx = mapped[i].px - mapped[j].px;
        const dy = mapped[i].py - mapped[j].py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < W * 0.35) {
          edges.push({ a: mapped[i], b: mapped[j], dist });
        }
      }
    }

    let t = 0;
    const render = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.015;

      // Draw edges
      edges.forEach(({ a, b }) => {
        const alpha = a.active && b.active ? 0.15 : 0.04;
        ctx.beginPath();
        ctx.moveTo(a.px, a.py);
        ctx.lineTo(b.px, b.py);
        ctx.strokeStyle = emergency
          ? `rgba(255,0,60,${alpha})`
          : `rgba(0,243,255,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Animated signal pulse along edge
        if (a.active && b.active && Math.random() < 0.008) {
          const progress = (Math.sin(t * 3 + a.id) + 1) / 2;
          const sx = a.px + (b.px - a.px) * progress;
          const sy = a.py + (b.py - a.py) * progress;
          ctx.beginPath();
          ctx.arc(sx, sy, 2, 0, Math.PI * 2);
          ctx.fillStyle = emergency ? 'rgba(255,136,0,0.8)' : 'rgba(0,243,255,0.8)';
          ctx.shadowBlur = 6;
          ctx.shadowColor = emergency ? '#ff8800' : '#00f3ff';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw nodes
      mapped.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.px, node.py, node.active ? 3 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = node.active
          ? emergency ? '#ff003c' : '#00f3ff'
          : 'rgba(255,255,255,0.15)';
        if (node.active) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = emergency ? '#ff003c' : '#00f3ff';
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      rafRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(rafRef.current);
  }, [nodes, emergency]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-24 rounded-lg"
      style={{ display: 'block' }}
    />
  );
}

export default function MeshStatus({ meshNodes, emergency }) {
  const active = meshNodes.filter(n => n.active).length;
  const total  = meshNodes.length;
  const health = total > 0 ? Math.round((active / total) * 100) : 100;

  return (
    <div className={`glass-panel p-5 relative overflow-hidden transition-all duration-500 ${
      emergency ? 'border-neon-red/20 opacity-60 pointer-events-none' : ''
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Network size={14} className="text-neon-cyan" />
          <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-white/90">
            Mesh Network
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-neon-cyan"
          />
          <span className="text-[8px] font-mono text-neon-cyan uppercase tracking-widest">
            {active}/{total} NODES
          </span>
        </div>
      </div>

      {/* Canvas visualization */}
      <MeshCanvas nodes={meshNodes} emergency={emergency} />

      {/* Stats row */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { label: 'Health',    value: `${health}%`,     color: health > 90 ? 'text-neon-green' : 'text-orange-400' },
          { label: 'Latency',  value: '0.02ms',          color: 'text-neon-cyan' },
          { label: 'Packet ∆', value: '0%',              color: 'text-neon-green' },
        ].map((s, i) => (
          <div key={i} className="text-center p-2 rounded-lg bg-white/5 border border-white/5">
            <p className="text-[8px] font-mono text-white/30 uppercase">{s.label}</p>
            <p className={`text-[11px] font-black italic ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Privacy row */}
      <div className="mt-3 flex items-center justify-between p-2.5 rounded-lg bg-white/3 border border-white/5">
        <div className="flex items-center gap-2">
          <Fingerprint size={12} className="text-neon-green" />
          <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest">
            Ghost Mode
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
          <Lock size={10} className="text-white/30" />
          <span className="text-[8px] font-black text-neon-green uppercase">Enabled</span>
        </div>
      </div>
    </div>
  );
}
