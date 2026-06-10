// ══════════════════════════════════════════════════════════════════════
// API UTILITIES — La Tía de la USA Transportation
// Backend communication layer for booking submissions.
// ══════════════════════════════════════════════════════════════════════

import type { BookingPayload } from '../types';

/**
 * Base URL for the booking API backend.
 * Change this for production deployment.
 */
export const API_BASE_URL = 'http://localhost:5000';

/**
 * Submit a booking request to the backend API.
 * Returns the parsed JSON response or throws on network error.
 */
export async function submitBookingToAPI(
  payload: BookingPayload
): Promise<{ ok: boolean; result: Record<string, unknown> }> {
  const response = await fetch(`${API_BASE_URL}/api/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  return { ok: response.ok, result };
}