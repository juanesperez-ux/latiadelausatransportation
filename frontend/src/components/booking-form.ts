// ══════════════════════════════════════════════════════════════════════
// BOOKING FORM — La Tía de la USA Transportation
// Self-contained booking form logic. Handles service type toggling,
// add-on selection, form validation, and submission.
//
// To extract the booking system for reuse, take these files:
//   - booking-form.ts (this file)
//   - price-estimate.ts (pricing engine)
//   - ../data/vehicles.ts (vehicle rates)
//   - ../types/index.ts (type definitions)
//   - ../utils/dom.ts (DOM helpers)
//   - ../utils/api.ts (API submission)
//   - ../styles/booking.css (form styles)
// ══════════════════════════════════════════════════════════════════════

import type { Addon, BookingPayload } from '../types';
import { $, safeContent, safeDisplay } from '../utils/dom';
import { submitBookingToAPI } from '../utils/api';
import { updatePriceEstimate } from './price-estimate';

// ── State (only used within the booking module) ─────────────
let currentServiceType = 'airport';
export let selectedAddons: Addon[] = [];

/**
 * Get the currently selected service type.
 * Useful for other modules that need to check the service mode.
 */
export function getCurrentServiceType(): string {
  return currentServiceType;
}

// ── Service Type Toggling ──────────────────────────────────────

/**
 * Switch between service types (Airport, Meet & Greet, Hourly, Point-to-Point).
 * Shows/hides the appropriate form fields based on the selected type.
 *
 * Called from the service toggle buttons in the HTML.
 *
 * @param type - The service type key: 'airport', 'meetgreet', 'hourly', 'point'
 * @param btn  - The button element that was clicked (for toggling active state)
 */
export function selectServiceType(type: string, btn: HTMLElement): void {
  currentServiceType = type;

  // Toggle active state on all service toggle buttons
  document.querySelectorAll('.service-toggle').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Show/hide the appropriate form rows
  const tripFields = $('tripFields');
  const hourlyFields = $('hourlyFields');
  const milesGroup = $('estimatedMilesGroup');

  if (tripFields && hourlyFields && milesGroup) {
    if (type === 'hourly') {
      tripFields.style.display = 'none';
      hourlyFields.style.display = 'grid';
      milesGroup.style.display = 'none';
    } else {
      tripFields.style.display = 'grid';
      hourlyFields.style.display = 'none';
      milesGroup.style.display = 'block';
    }
  }

  updatePriceEstimate();
}

// ── Add-On Selection ──────────────────────────────────────────

/**
 * Toggle an add-on item on/off. Updates the visual state (selected class),
 * the hidden checkbox, and the selectedAddons array. Then recalculates price.
 *
 * Called from the add-on label elements in the HTML.
 *
 * @param el - The add-on label element that was clicked
 */
export function toggleAddon(el: HTMLElement): void {
  el.classList.toggle('selected');

  const checkbox = el.querySelector('input[type="checkbox"]') as HTMLInputElement;
  if (!checkbox) return;

  checkbox.checked = !checkbox.checked;
  const addonKey = el.getAttribute('data-addon');

  if (checkbox.checked) {
    // Add to selection if not already present
    if (!selectedAddons.find(a => a.key === addonKey) && addonKey) {
      selectedAddons.push({
        key: addonKey,
        price: parseFloat(el.getAttribute('data-price') || '0') || 0,
        label: el.textContent?.trim().replace(/\s*\+\$.*$/, '').replace(/\s*Quote$/, '') || '',
      });
    }
  } else {
    // Remove from selection
    selectedAddons = selectedAddons.filter(a => a.key !== addonKey);
  }

  updatePriceEstimate();
}

// ── Form Submission ───────────────────────────────────────────

/**
 * Main booking submission handler. Validates required fields,
 * builds the payload, and sends it to the backend API.
 *
 * If the backend is unreachable, shows a detailed alert with
 * booking details so the user can call to complete the reservation.
 *
 * Called from the "Request Booking" submit button in the HTML.
 */
export async function submitBooking(): Promise<void> {
  // ── Get DOM elements ──
  const vehicleSelect = $<HTMLSelectElement>('vehicleSelect');
  const vehicleKey = vehicleSelect?.value || '';
  const vehicleName = vehicleSelect?.selectedOptions?.[0]?.textContent || 'Selected Vehicle';

  const nameInput = $<HTMLInputElement>('fullName');
  const emailInput = $<HTMLInputElement>('email');
  const phoneInput = $<HTMLInputElement>('phone');

  const name = nameInput?.value.trim() || '';
  const email = emailInput?.value.trim() || '';
  const phone = phoneInput?.value.trim() || '';

  // ── Validate required fields ──
  if (!name || !email || !phone) {
    alert('Please fill in your name, email, and phone number to submit a booking request.');
    return;
  }

  const total = $('summaryTotal')?.textContent || '$0.00';
  const submitBtn = document.querySelector('.form-submit');
  const originalHTML = submitBtn?.innerHTML || '';

  try {
    // ── Set loading state ──
    if (submitBtn) {
      submitBtn.textContent = 'Submitting...';
      (submitBtn as HTMLButtonElement).disabled = true;
    }

    // ── Build the payload ──
    const payload: BookingPayload = {
      vehicle: vehicleKey,
      vehicleName,
      name,
      email,
      phone,
      company: $<HTMLInputElement>('company')?.value.trim() || '',
      total,
      serviceType: currentServiceType,
      pickupLoc:
        $<HTMLInputElement>('pickupLoc')?.value.trim() ||
        $<HTMLInputElement>('pickupLocHourly')?.value.trim() ||
        '',
      dropoffLoc: $<HTMLInputElement>('dropoffLoc')?.value.trim() || '',
      date: $<HTMLInputElement>('pickupDate')?.value || '',
      time: $<HTMLInputElement>('pickupTime')?.value || '',
      passengers: $<HTMLSelectElement>('passengerCount')?.value || '1',
      luggage: $<HTMLSelectElement>('luggageCount')?.value || '0',
      estimatedMiles: $<HTMLInputElement>('estimatedMiles')?.value || '25',
      hours: $<HTMLSelectElement>('hoursCount')?.value || '2',
      specialRequests: $<HTMLTextAreaElement>('specialRequests')?.value.trim() || '',
      addons: selectedAddons,
    };

    // ── Submit to API ──
    const { ok, result } = await submitBookingToAPI(payload);

    if (ok && (result as { status: string }).status === 'success') {
      alert(
        `Thank you, ${name.split(' ')[0]}! 🎉\n\n` +
          `Your booking request for ${vehicleName} has been received.\n` +
          `Reference: ${(result as { booking_id: string }).booking_id}\n` +
          `Estimated Total: ${total}\n\n` +
          `We will confirm availability and final pricing within 30 minutes via email and phone.\n` +
          `For immediate assistance, call (305) 555-0100.`
      );
    } else if ((result as { errors?: string[] }).errors) {
      alert(
        'Please fix the following:\n\n• ' +
          ((result as { errors: string[] }).errors as string[]).join('\n• ')
      );
    } else {
      alert(
        'There was a problem submitting your request. Please try again or call us at (305) 555-0100.'
      );
    }
  } catch (error) {
    console.error('Error submitting booking:', error);
    alert(
      `We couldn't reach our booking server right now.\n\n` +
        `Your details: ${vehicleName} — ${total}\n\n` +
        `Please call us directly at (305) 555-0100 to complete your booking.\n` +
        `We're available 24/7.`
    );
  } finally {
    // ── Restore button state ──
    if (submitBtn) {
      submitBtn.innerHTML = originalHTML;
      (submitBtn as HTMLButtonElement).disabled = false;
    }
  }
}