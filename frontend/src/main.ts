// ══════════════════════════════════════════════════════════════════════
// MAIN ENTRY POINT — La Tía de la USA Transportation
// Bootstraps the application by importing all modules and wiring up
// global event handlers exposed on window for the HTML onclick bindings.
// ══════════════════════════════════════════════════════════════════════

// ── Navigation ──────────────────────────────────────────
import { switchPage, toggleMobileNav } from './components/navigation';

// ── Booking Form ────────────────────────────────────────
import {
  selectServiceType,
  toggleAddon,
  submitBooking,
} from './components/booking-form';

// ── Price Estimate ──────────────────────────────────────
import { updatePriceEstimate } from './components/price-estimate';

// ── Fleet Tabs ──────────────────────────────────────────
import { initFleetTabs } from './components/fleet';

// ── Icon Configuration ──────────────────────────────────
import { applyIconConfig } from './components/icons';

// ── Image Fallback ──────────────────────────────────────
import { initImageFallbacks } from './utils/images';

// ═══ Expose functions globally for inline HTML onclick handlers ═══

// These are needed because the HTML uses onclick="switchPage('home')" etc.
// In a fully component-based app, these would be replaced with addEventListener
// bindings, but for this project we maintain backward compatibility.

declare global {
  interface Window {
    switchPage: typeof switchPage;
    toggleMobileNav: typeof toggleMobileNav;
    selectServiceType: typeof selectServiceType;
    toggleAddon: typeof toggleAddon;
    updatePriceEstimate: typeof updatePriceEstimate;
    submitBooking: typeof submitBooking;
    reloadIcons: () => Promise<void>;
  }
}

window.switchPage = switchPage;
window.toggleMobileNav = toggleMobileNav;
window.selectServiceType = selectServiceType;
window.toggleAddon = toggleAddon;
window.updatePriceEstimate = updatePriceEstimate;
window.submitBooking = submitBooking;
window.reloadIcons = applyIconConfig;

// ═══ Initialization ═══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function () {
  // Calculate initial price estimate for the booking form
  updatePriceEstimate();

  // Set minimum date to today on the pickup date picker
  const dateInput = document.getElementById('pickupDate') as HTMLInputElement | null;
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Initialize fleet tab filtering (if fleetTabs element exists)
  initFleetTabs();

  // Apply icon configuration from icon-config.json
  applyIconConfig();

  // Initialize image fallback handling for SVG/png images
  initImageFallbacks();

  console.log('🚗 La Tía de la USA Transportation — Ready');
  console.log('   Modular architecture loaded:');
  console.log('   ├── types/index.ts');
  console.log('   ├── data/vehicles.ts');
  console.log('   ├── utils/dom.ts, api.ts, images.ts');
  console.log('   ├── components/booking-form.ts');
  console.log('   ├── components/price-estimate.ts');
  console.log('   ├── components/navigation.ts');
  console.log('   ├── components/fleet.ts');
  console.log('   ├── components/icons.ts');
  console.log('   └── styles/ (15 modular CSS files)');
});