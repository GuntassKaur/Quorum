import { useState, useEffect, useMemo } from 'react';

/**
 * useGhostCrowd Hook
 * Simulates 'ghost' particles moving toward safety exits.
 */
export default function useGhostCrowd(zones, targetZoneId = 'A') {
    const [particles, setParticles] = useState([]);

    // Initialize particles
    useEffect(() => {
        const initialParticles = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            x: Math.random() * 800,
            y: Math.random() * 600,
            speed: 0.5 + Math.random() * 1,
            opacity: 0.1 + Math.random() * 0.4
        }));
        setParticles(initialParticles);
    }, []);

    // Animation Loop
    useEffect(() => {
        const targetZone = zones.find(z => z.id === targetZoneId) || { x: 400, y: 50 };
        const targetX = targetZone.x || 400;
        const targetY = targetZone.y || 50;

        let frameId;
        const animate = () => {
            setParticles(prev => prev.map(p => {
                const dx = targetX - p.x;
                const dy = targetY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 10) {
                    // Reset particle to random edge
                    return {
                        ...p,
                        x: Math.random() * 800,
                        y: 550 + Math.random() * 50,
                    };
                }

                return {
                    ...p,
                    x: p.x + (dx / dist) * p.speed,
                    y: p.y + (dy / dist) * p.speed,
                };
            }));
            frameId = requestAnimationFrame(animate);
        };

        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [zones, targetZoneId]);

    return particles;
}
