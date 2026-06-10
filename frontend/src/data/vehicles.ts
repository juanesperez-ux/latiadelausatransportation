// ══════════════════════════════════════════════════════════════════════
// VEHICLES DATA — La Tía de la USA Transportation
// Vehicle pricing rates and metadata. Update rates here to reflect
// across the entire site (booking form, pricing page, vehicle details).
// ══════════════════════════════════════════════════════════════════════

import type { VehicleRate } from '../types';

/**
 * All vehicle pricing rates keyed by vehicle ID.
 * The `name` field is used for display in the booking summary and alerts.
 */
export const vehicleRates: Record<string, VehicleRate> = {
  'ct5':                { perMile: 3.50, hourly: 90,  airport: 75,  name: 'Cadillac CT5 · 350T' },
  's580':               { perMile: 4.50, hourly: 115, airport: 95,  name: 'Mercedes-Benz S 580' },
  'tahoe':              { perMile: 3.75, hourly: 95,  airport: 85,  name: 'Chevrolet Tahoe' },
  'suburban6':          { perMile: 4.25, hourly: 105, airport: 95,  name: 'Chevrolet Suburban 6 Pax' },
  'suburban7':          { perMile: 4.50, hourly: 110, airport: 100, name: 'Chevrolet Suburban 7 Pax' },
  'escalade6':          { perMile: 5.25, hourly: 125, airport: 115, name: 'Cadillac Escalade 6 Pax' },
  'escalade7':          { perMile: 5.50, hourly: 130, airport: 120, name: 'Cadillac Escalade 7 Pax' },
  'escalade-sport':     { perMile: 5.75, hourly: 140, airport: 130, name: 'Cadillac Escalade Sport Luxury' },
  'escalade-platinum':  { perMile: 6.50, hourly: 155, airport: 140, name: 'Cadillac Escalade Platinum Lux' },
  'sprinter':           { perMile: 5.50, hourly: 130, airport: 160, name: 'Sprinter Executive' },
  'sprinter-limo':      { perMile: 7.50, hourly: 180, airport: 250, name: 'Sprinter Limo' },
  'cullinan':           { perMile: 14.00, hourly: 300, airport: 450, minBooking: 450, name: 'Rolls-Royce Cullinan' },
  'phantom':            { perMile: 16.00, hourly: 350, airport: 550, minBooking: 550, name: 'Rolls-Royce Phantom' },
};