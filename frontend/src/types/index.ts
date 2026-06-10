// ══════════════════════════════════════════════════════════════════════
// TYPES — La Tía de la USA Transportation
// All TypeScript interfaces and type declarations for the application.
// ══════════════════════════════════════════════════════════════════════

/** Pricing data for a single vehicle */
export interface VehicleRate {
  perMile: number;
  hourly: number;
  airport: number;
  minBooking?: number;
  name: string;
}

/** A selected add-on item */
export interface Addon {
  key: string;
  price: number;
  label: string;
}

/** Complete booking payload submitted to the API */
export interface BookingPayload {
  vehicle: string;
  vehicleName: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  total: string;
  serviceType: string;
  pickupLoc: string;
  dropoffLoc: string;
  date: string;
  time: string;
  passengers: string;
  luggage: string;
  estimatedMiles: string;
  hours: string;
  specialRequests: string;
  addons: Addon[];
}

/** A single icon definition from icon-config.json */
export interface IconDefinition {
  tabler: string;
  label: string;
}

/** Icon configuration file structure */
export interface IconConfig {
  icons: Record<string, IconDefinition>;
  vehicleIcons: Record<string, string>;
  serviceIcons: Record<string, string>;
  socialIcons: Record<string, string>;
}