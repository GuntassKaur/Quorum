import React, { useEffect, useRef } from 'react';

export default function ParticleBackground({ emergency }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const particles = [];
    const particleCount = 60;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.fillStyle = emergency ? `rgba(255, 0, 60, ${this.opacity})` : `rgba(0, 243, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background ambient glow
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, 0, 0,
        canvas.width / 2, 0, canvas.height
      );
      gradient.addColorStop(0, emergency ? 'rgba(50, 0, 0, 0.4)' : 'rgba(0, 20, 50, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [emergency]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020202]">
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* Stadium Beams (HUD depth layers) */}
      <div className={`stadium-beam -top-[200px] -left-[100px] ${emergency ? 'text-neon-red' : ''}`} style={{ filter: emergency ? 'hue-rotate(-150deg) brightness(0.8)' : '' }}></div>
      <div className={`stadium-beam -top-[200px] -right-[100px] ${emergency ? 'text-neon-red' : ''}`} style={{ filter: emergency ? 'hue-rotate(-150deg) brightness(0.8)' : '' }}></div>
      
      {/* Vantablack deep layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black"></div>
    </div>
  );
}
