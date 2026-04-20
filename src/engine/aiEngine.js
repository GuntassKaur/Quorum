export function runDecisionEngine(zones, context) {
  const decisions = [];
  const { emergency } = context;

  if (emergency) {
    decisions.push({
      id: 'emg-1',
      type: 'LIFE SAFETY',
      title: 'CRITICAL: EVACUATION PROTOCOL INITIATED',
      logic: 'Life safety algorithms overriding standard routing. Activating dynamic exit vectors and deploying emergency lighting.',
      severity: 'critical'
    });
    return decisions;
  }

  const criticalO2 = zones.filter(z => z.o2 < 18.5);
  if (criticalO2.length > 0) {
    decisions.push({
      id: `o2-${Date.now()}`,
      type: 'VENTILATION OVERRIDE',
      title: `OXYGEN DROP: ${criticalO2.map(z => z.label).join(', ')}`,
      logic: `AI detected physiological risk (O2 < 18.5%). Initiating localized forced ventilation and restricting area influx.`,
      severity: 'critical'
    });
  }

  const highHeat = zones.filter(z => z.heat > 34.0);
  if (highHeat.length > 0) {
    decisions.push({
      id: `heat-${Date.now()}`,
      type: 'THERMAL LOAD',
      title: `HIGH HEAT: ${highHeat.map(z => z.label).join(', ')}`,
      logic: `Heat index exceeded safe physiological threshold. Activating cooling mist systems and prompting hydration alerts.`,
      severity: 'warning'
    });
  }

  if (decisions.length === 0) {
    decisions.push({
      id: `sync-${Date.now()}`,
      type: 'SYSTEM OK',
      title: 'TELEMETRY SYNC STABLE',
      logic: 'Mesh nodes reporting nominal crowd variance. Predictive routing optimization active.',
      severity: 'info'
    });
  }

  return decisions;
}
