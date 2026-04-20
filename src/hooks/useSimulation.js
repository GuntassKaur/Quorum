import { useState, useEffect, useRef } from 'react';
import { initZones, computeVitals, computeWaitTime } from '../engine/zones';
import { runDecisionEngine } from '../engine/aiEngine';

export default function useSimulation() {
  const [eventMode, setEventMode] = useState('STADIUM');
  const [zones, setZones] = useState([]);
  const [emergency, setEmergency] = useState(false);
  const [decisions, setDecisions] = useState([]);
  const [ambientTemp, setAmbientTemp] = useState(26);

  useEffect(() => {
    setZones(initZones(eventMode));
    setDecisions([]);
    setEmergency(false);
  }, [eventMode]);

  useEffect(() => {
    if (zones.length === 0) return;

    const interval = setInterval(() => {
      setZones(prevZones => {
        const newZones = prevZones.map(zone => {
          if (zone.isPitch) return zone;

          let delta = (Math.random() - 0.5) * 4; // ±2% variation
          if (emergency) {
            delta = zone.isGate ? +3 : -5;
          }

          const newDensity = Math.max(0, Math.min(100, zone.crowdPercent + delta));
          const vitals = computeVitals(zone, newDensity, ambientTemp);
          
          return {
            ...zone,
            crowdPercent: parseFloat(newDensity.toFixed(1)),
            density: newDensity / 100,
            currentWait: computeWaitTime(zone, newDensity),
            ...vitals,
          };
        });

        const newDecisions = runDecisionEngine(newZones, { emergency });
        
        // Add new decisions, keep max 5
        setDecisions(prev => {
          const fresh = newDecisions.filter(nd => !prev.find(p => p.id === nd.id));
          return [...fresh, ...prev].slice(0, 5);
        });

        return newZones;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [eventMode, emergency, ambientTemp]);

  return {
    eventMode, setEventMode,
    zones, setZones,
    emergency, setEmergency,
    decisions
  };
}
