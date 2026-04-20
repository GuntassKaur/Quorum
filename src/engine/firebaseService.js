/**
 * QUORUM FIREBASE SERVICE
 * 
 * Firestore integration for real-time crowd data sync.
 * Structure:
 *   /crowdData/{zoneId}  → zone telemetry
 *   /alerts/{alertId}    → active AI alerts
 *   /emergencyState      → global emergency flag + metadata
 */

import { db } from '../firebase';
import {
  doc,
  collection,
  setDoc,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

// ─── WRITE OPERATIONS ─────────────────────────────────

/**
 * Sync all zone data to Firestore (batched write).
 */
export async function syncZonesToFirestore(zones) {
  try {
    const batch = writeBatch(db);
    zones.forEach(zone => {
      const ref = doc(db, 'crowdData', zone.id);
      batch.set(ref, {
        label: zone.label,
        type: zone.type,
        crowdPercent: zone.crowdPercent,
        density: zone.density,
        currentWait: zone.currentWait,
        oxygenRisk: zone.oxygenRisk,
        heatRisk: zone.heatRisk,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    });
    await batch.commit();
  } catch (err) {
    console.warn('[Firebase] Zone sync failed:', err.message);
  }
}

/**
 * Write a new AI alert to Firestore.
 */
export async function writeAlert(alert) {
  try {
    const ref = doc(collection(db, 'alerts'));
    await setDoc(ref, {
      ...alert,
      createdAt: serverTimestamp(),
      resolved: false,
    });
  } catch (err) {
    console.warn('[Firebase] Alert write failed:', err.message);
  }
}

/**
 * Set the global emergency state in Firestore.
 */
export async function setEmergencyState(active, metadata = {}) {
  try {
    await setDoc(doc(db, 'emergencyState', 'global'), {
      active,
      activatedAt: active ? serverTimestamp() : null,
      clearanceETA: active ? 150 : null,
      ...metadata,
    }, { merge: true });
  } catch (err) {
    console.warn('[Firebase] Emergency state write failed:', err.message);
  }
}

// ─── READ / LISTENERS ─────────────────────────────────

/**
 * Listen for real-time emergency state changes.
 * Calls onUpdate(data) whenever the state changes.
 */
export function listenEmergencyState(onUpdate) {
  const ref = doc(db, 'emergencyState', 'global');
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      onUpdate(snap.data());
    }
  }, (err) => {
    console.warn('[Firebase] Emergency listener error:', err.message);
  });
}

/**
 * Listen to all active (unresolved) alerts.
 */
export function listenAlerts(onUpdate) {
  const ref = collection(db, 'alerts');
  return onSnapshot(ref, (snap) => {
    const alerts = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(a => !a.resolved);
    onUpdate(alerts);
  }, (err) => {
    console.warn('[Firebase] Alerts listener error:', err.message);
  });
}
