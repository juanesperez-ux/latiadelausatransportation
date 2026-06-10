// ══════════════════════════════════════════════════════════════════════
// PRICE ESTIMATE — La Tía de la USA Transportation
// Real-time price calculation engine for the booking form.
//
// Computes the estimated total based on:
//   - Selected vehicle (from vehicles.ts data)
//   - Current service type (airport, meet & greet, hourly, point-to-point)
//   - Trip distance or number of hours
//   - Meet & greet surcharge
//   - Selected add-ons
//   - 20% gratuity
//   - Vehicle minimum booking amounts
//
// Updates the price summary panel in the DOM in real time.
// ══════════════════════════════════════════════════════════════════════

import { vehicleRates } from '../data/vehicles';
import { $, safeContent, safeDisplay } from '../utils/dom';
import { getCurrentServiceType, selectedAddons } from './booking-form';

/**
 * Format a number as a USD currency string.
 * @example formatUSD(87.50) → "$87.50"
 */
function formatUSD(n: number): string {
  return '$' + n.toFixed(2);
}

/**
 * Main price estimate function. Reads the current form state and updates
 * the price summary panel with the calculated breakdown.
 *
 * Called automatically whenever the user changes:
 *   - Vehicle selection
 *   - Service type
 *   - Estimated miles
 *   - Number of hours
 *   - Add-ons (checked/unchecked)
 */
export function updatePriceEstimate(): void {
  const vehicleSelect = $<HTMLSelectElement>('vehicleSelect');
  if (!vehicleSelect) return;

  const vehicleKey = vehicleSelect.value;
  const rate = vehicleRates[vehicleKey];
  if (!rate) return;

  const serviceType = getCurrentServiceType();
  const isHourly = serviceType === 'hourly';
  const isMeetGreet = serviceType === 'meetgreet';

  // ── Calculate base amount ────────────────────────────
  let baseAmount = 0;

  if (isHourly) {
    const hoursSelect = $<HTMLSelectElement>('hoursCount');
    const hours = parseInt(hoursSelect?.value || '2') || 2;
    baseAmount = rate.hourly * hours;
  } else {
    const milesInput = $<HTMLInputElement>('estimatedMiles');
    const miles = parseFloat(milesInput?.value || '25') || 25;
    baseAmount = rate.perMile * miles;

    // Airport and Meet & Greet have a minimum (the airport flat rate)
    if (serviceType === 'airport' || serviceType === 'meetgreet') {
      baseAmount = Math.max(baseAmount, rate.airport);
    }
  }

  // Apply vehicle minimum booking (e.g., Rolls-Royce $450 min)
  if (rate.minBooking && baseAmount < rate.minBooking) {
    baseAmount = rate.minBooking;
  }

  // ── Calculate additions ──
  const meetGreetFee = isMeetGreet ? 30 : 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);

  // ── Subtotal + 20% gratuity ──
  const subtotal = baseAmount + meetGreetFee + addonsTotal;
  const gratuity = subtotal * 0.20;
  const total = subtotal + gratuity;

  // ── Update the DOM ──
  safeContent('summaryBase', formatUSD(baseAmount));

  safeDisplay('meetGreetLine', isMeetGreet ? 'flex' : 'none');
  safeContent('summaryMeetGreet', '+' + formatUSD(meetGreetFee));

  safeDisplay('addonsLine', selectedAddons.length > 0 ? 'flex' : 'none');
  safeContent('summaryAddons', '+' + formatUSD(addonsTotal));

  safeContent('summaryGratuity', formatUSD(gratuity));
  safeContent('summaryTotal', formatUSD(total));
  safeContent('submitEstimate', formatUSD(total));
}