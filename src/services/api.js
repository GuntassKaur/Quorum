// This file simulates a real IoT backend fetching data.
// In a real production scenario, this hooks up to Firebase/Firestore or a REST API
// to fetch real-time stadium node data.

export const fetchCrowdData = async () => {
  try {
    const response = await fetch('/api/stadium/telemetry');
    if (!response.ok) throw new Error('Neural sync failure.');
    const result = await response.json();
    if (result.success) {
      return result.data;
    }
    throw new Error('Signal malformed.');
  } catch (error) {
    console.warn("Using fallback telemetry data:", error.message);
    return {
      zones: [
        { id: 'gate-n', label: 'Gate North (Fallback)', type: 'Gate', baseWait: 5, currentWait: 5, density: 'low', x: 10, y: 10, w: 30, h: 20 },
        { id: 'food-a', label: 'Food Stall A', type: 'Food', baseWait: 8, currentWait: 8, density: 'med', x: 60, y: 10, w: 30, h: 20 },
        { id: 'concourse', label: 'Concourse', type: 'Area', baseWait: 0, currentWait: 0, density: 'high', x: 25, y: 35, w: 50, h: 30 }
      ],
      attendees: 42890,
      networkStatus: 'STANDBY'
    };
  }
};
