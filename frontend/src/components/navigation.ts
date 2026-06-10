// ══════════════════════════════════════════════════════════════════════
// NAVIGATION — La Tía de la USA Transportation
// Page switching and mobile navigation toggle.
// ══════════════════════════════════════════════════════════════════════

import { updatePriceEstimate } from './price-estimate';

/**
 * Switch between application pages (home, fleet, services, pricing, booking,
 * and all vehicle detail pages). Updates the active state on the current
 * page div, the nav link, and closes the mobile menu if open.
 *
 * @param pageName - The page identifier (e.g., 'home', 'fleet', 'booking', 'vehicle-ct5')
 */
export function switchPage(pageName: string): void {
  // Hide all pages, then show only the target
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageName);
  if (target) {
    target.classList.add('active');
  }

  // Update active state on nav links
  document
    .querySelectorAll('.nav-links a[data-page]')
    .forEach(a => a.classList.remove('active'));
  const navLink = document.querySelector('.nav-links a[data-page="' + pageName + '"]');
  if (navLink) navLink.classList.add('active');

  // Close mobile menu
  document.getElementById('navLinks')?.classList.remove('open');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // If switching to the booking page, recalculate the price estimate
  if (pageName === 'booking') updatePriceEstimate();
}

/**
 * Toggle the mobile navigation menu open/closed.
 */
export function toggleMobileNav(): void {
  document.getElementById('navLinks')?.classList.toggle('open');
}