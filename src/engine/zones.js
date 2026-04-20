export const SPORT_CONFIGS = {
  STADIUM: {
    label: 'Stadium Control',
    icon: '🏟️',
    bgTint: 'rgba(0, 180, 80, 0.12)',
    accentColor: '#00d4ff',
    pitch: { label: 'PITCH', x: 20, y: 30, w: 60, h: 40 },
    zones: [
      { id: 'sec-a1', label: 'Sector A1',  x: 22, y: 15,  w: 26, h: 12, density: 0.78, o2: 20.4, heat: 31.2 },
      { id: 'sec-b2', label: 'Sector B2',  x: 52, y: 15,  w: 26, h: 12, density: 0.91, o2: 19.1, heat: 33.8 },
      { id: 'sec-c3', label: 'Sector C3',  x: 22, y: 75,  w: 26, h: 12, density: 0.65, o2: 20.8, heat: 29.5 },
      { id: 'sec-d4', label: 'Sector D4',  x: 52, y: 75,  w: 26, h: 12, density: 0.55, o2: 21.0, heat: 28.9 },
      { id: 'gate-7', label: 'Gate 7 →',     x: 40, y: 5,  w: 8,  h: 5,  density: 0.42, o2: 20.9, heat: 27.0, isGate: true },
    ]
  },

  CONCERT: {
    label: 'Concert Safety System',
    icon: '🎸',
    bgTint: 'rgba(217, 70, 239, 0.12)',
    accentColor: '#d946ef',
    pitch: { label: 'MEGA STAGE', x: 30, y: 5, w: 40, h: 15 },
    zones: [
      { id: 'stage-front', label: 'STAGE FRONT', x: 30, y: 22, w: 40, h: 15, density: 0.98, o2: 17.5, heat: 42.0 },
      { id: 'mosh-pit',   label: 'Mosh Pit',     x: 35, y: 40, w: 30, h: 15, density: 0.85, o2: 18.2, heat: 39.5 },
      { id: 'rear-ga',   label: 'Rear GA',       x: 20, y: 60, w: 60, h: 20, density: 0.45, o2: 20.8, heat: 29.8 },
      { id: 'vip-deck',  label: 'VIP DECK',      x: 5,  y: 30, w: 15, h: 40, density: 0.25, o2: 21.0, heat: 28.0 },
      { id: 'exit-west', label: '← MAIN EXIT',   x: 5,  y: 85, w: 15, h: 7,  density: 0.30, o2: 21.0, heat: 26.0, isGate: true },
    ]
  },

  FESTIVAL: {
    label: 'Festival Crowd Intelligence',
    icon: '🎡',
    bgTint: 'rgba(251, 191, 36, 0.10)',
    accentColor: '#fbbf24',
    pitch: { label: 'MAIN PLAZA', x: 40, y: 40, w: 20, h: 20 },
    zones: [
      { id: 'food-court', label: 'FOOD COURT',   x: 15, y: 20, w: 25, h: 20, density: 0.82, o2: 19.8, heat: 34.5 },
      { id: 'washroom-a', label: 'WASHROOM',     x: 70, y: 15, w: 20, h: 15, density: 0.75, o2: 20.2, heat: 32.0 },
      { id: 'entry-gate', label: 'ENTRY GATE',   x: 45, y: 85, w: 10, h: 10, density: 0.60, o2: 20.9, heat: 29.0, isGate: true },
      { id: 'beer-tent',  label: 'BEER TENT',     x: 70, y: 55, w: 20, h: 25, density: 0.90, o2: 18.5, heat: 36.8 },
      { id: 'art-zone',   label: 'ART ZONE',      x: 10, y: 60, w: 25, h: 30, density: 0.35, o2: 21.0, heat: 27.5 },
    ]
  },

  PUBLIC_EVENT: {
    label: 'Public Event Safety',
    icon: '📢',
    bgTint: 'rgba(59, 130, 246, 0.10)',
    accentColor: '#3b82f6',
    pitch: { label: 'INFO DESK', x: 48, y: 45, w: 4, h: 10 },
    zones: [
      { id: 'walkway-l',  label: 'WALKWAY L',    x: 10, y: 40, w: 30, h: 20, density: 0.65, o2: 20.4, heat: 30.2 },
      { id: 'walkway-r',  label: 'WALKWAY R',    x: 60, y: 40, w: 30, h: 20, density: 0.88, o2: 19.0, heat: 33.5 },
      { id: 'entry-sec',  label: 'ENTRY',        x: 40, y: 10, w: 20, h: 10, density: 0.50, o2: 20.9, heat: 28.0, isGate: true },
      { id: 'exit-sec',   label: 'EXIT',         x: 40, y: 80, w: 20, h: 10, density: 0.45, o2: 21.0, heat: 27.5, isGate: true },
    ]
  },
};

export function initZones(sport) {
  const config = SPORT_CONFIGS[sport] || SPORT_CONFIGS.STADIUM;
  const baseZones = config.zones.map(z => ({
    ...z,
    crowdPercent: Math.round(z.density * 100),
  }));

  if (config.pitch) {
    baseZones.push({
      ...config.pitch,
      id: 'pitch-area',
      isPitch: true,
      density: 0,
      crowdPercent: 0,
      o2: 21.0,
      heat: 25.0
    });
  }

  return baseZones;
}

export function computeVitals(zone, newPercent, tempC) {
  const heat = tempC + (newPercent / 100) * 8;
  const o2 = 21.0 - (newPercent / 100) * 2.8;
  return {
    heat: parseFloat(heat.toFixed(1)),
    o2: parseFloat(o2.toFixed(1)),
    oxygenRisk: o2 < 18.5 ? 'critical' : o2 < 19.5 ? 'warning' : 'ok',
    heatRisk: heat > 35 ? 'critical' : heat > 32 ? 'warning' : 'ok',
  };
}

export function computeWaitTime(zone, percent) {
  return Math.round((percent / 100) * 12 + 1);
}
