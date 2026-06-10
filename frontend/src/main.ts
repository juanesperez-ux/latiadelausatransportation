// La Tía de la USA Transportation — Frontend Logic (TypeScript / Vite)
// =============================================================================

declare global {
  interface Window {
    switchPage: (pageName: string) => void;
    toggleMobileNav: () => void;
    selectServiceType: (type: string, btn: HTMLElement) => void;
    toggleAddon: (el: HTMLElement) => void;
    updatePriceEstimate: () => void;
    submitBooking: () => void;
    API_BASE_URL: string;
  }
}

// ── Types ──
interface VehicleRate {
  perMile: number;
  hourly: number;
  airport: number;
  minBooking?: number;
  name: string;
}

interface Addon {
  key: string;
  price: number;
  label: string;
}

interface BookingPayload {
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

// ── State ──
let currentServiceType = 'airport';
let selectedAddons: Addon[] = [];

// Backend API configuration — change this for production
window.API_BASE_URL = 'http://localhost:5000';

// ── Vehicle Data ──
const vehicleRates: Record<string, VehicleRate> = {
  'ct5': { perMile: 3.50, hourly: 90, airport: 75, name: 'Cadillac CT5 · 350T' },
  's580': { perMile: 4.50, hourly: 115, airport: 95, name: 'Mercedes-Benz S 580' },
  'tahoe': { perMile: 3.75, hourly: 95, airport: 85, name: 'Chevrolet Tahoe' },
  'suburban6': { perMile: 4.25, hourly: 105, airport: 95, name: 'Chevrolet Suburban 6 Pax' },
  'suburban7': { perMile: 4.50, hourly: 110, airport: 100, name: 'Chevrolet Suburban 7 Pax' },
  'escalade6': { perMile: 5.25, hourly: 125, airport: 115, name: 'Cadillac Escalade 6 Pax' },
  'escalade7': { perMile: 5.50, hourly: 130, airport: 120, name: 'Cadillac Escalade 7 Pax' },
  'escalade-sport': { perMile: 5.75, hourly: 140, airport: 130, name: 'Cadillac Escalade Sport Luxury' },
  'escalade-platinum': { perMile: 6.50, hourly: 155, airport: 140, name: 'Cadillac Escalade Platinum Lux' },
  'sprinter': { perMile: 5.50, hourly: 130, airport: 160, name: 'Sprinter Regular' },
  'sprinter-limo': { perMile: 7.50, hourly: 180, airport: 250, name: 'Sprinter Limo' },
  'cullinan': { perMile: 14.00, hourly: 300, airport: 450, minBooking: 450, name: 'Rolls-Royce Cullinan' },
  'phantom': { perMile: 16.00, hourly: 350, airport: 550, minBooking: 550, name: 'Rolls-Royce Phantom' },
};

// ── Helpers ──
function $<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

function safeContent(id: string, text: string): void {
  const el = $(id);
  if (el) el.textContent = text;
}

function safeDisplay(id: string, display: string): void {
  const el = $(id);
  if (el) el.style.display = display;
}

// ── Page Switching ─────────────────────────────────────────────────────────
window.switchPage = function (pageName: string) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageName);
  if (target) { target.classList.add('active'); }
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => a.classList.remove('active'));
  const navLink = document.querySelector('.nav-links a[data-page="' + pageName + '"]');
  if (navLink) navLink.classList.add('active');
  document.getElementById('navLinks')?.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (pageName === 'booking') window.updatePriceEstimate();
};

window.toggleMobileNav = function () {
  document.getElementById('navLinks')?.classList.toggle('open');
};

// ── Fleet Tab Filtering ────────────────────────────────────────────────────
document.getElementById('fleetTabs')?.addEventListener('click', function (e) {
  const target = e.target as HTMLElement;
  if (target.classList.contains('fleet-tab')) {
    document.querySelectorAll('.fleet-tab').forEach(t => t.classList.remove('active'));
    target.classList.add('active');
    const cat = target.getAttribute('data-cat');
    document.querySelectorAll('.fleet-category').forEach(c => c.classList.remove('active'));
    const catEl = document.querySelector('.fleet-category[data-cat="' + cat + '"]');
    if (catEl) catEl.classList.add('active');
  }
});

// ── Booking Form Logic ─────────────────────────────────────────────────────
window.selectServiceType = function (type: string, btn: HTMLElement) {
  currentServiceType = type;
  document.querySelectorAll('.service-toggle').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
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
  window.updatePriceEstimate();
};

window.toggleAddon = function (el: HTMLElement) {
  el.classList.toggle('selected');
  const checkbox = el.querySelector('input[type="checkbox"]') as HTMLInputElement;
  if (checkbox) {
    checkbox.checked = !checkbox.checked;
    const addonKey = el.getAttribute('data-addon');
    if (checkbox.checked) {
      if (!selectedAddons.find(a => a.key === addonKey) && addonKey) {
        selectedAddons.push({
          key: addonKey,
          price: parseFloat(el.getAttribute('data-price') || '0') || 0,
          label: el.textContent?.trim().replace(/\s*\+\$.*$/, '').replace(/\s*Quote$/, '') || '',
        });
      }
    } else {
      selectedAddons = selectedAddons.filter(a => a.key !== addonKey);
    }
    window.updatePriceEstimate();
  }
};

window.updatePriceEstimate = function () {
  const vehicleSelect = $<HTMLSelectElement>('vehicleSelect');
  if (!vehicleSelect) return;
  const vehicleKey = vehicleSelect.value;
  const rate = vehicleRates[vehicleKey];
  if (!rate) return;

  let baseAmount = 0;
  const isHourly = currentServiceType === 'hourly';
  const isMeetGreet = currentServiceType === 'meetgreet';

  if (isHourly) {
    const hoursSelect = $<HTMLSelectElement>('hoursCount');
    const hours = parseInt(hoursSelect?.value || '2') || 2;
    baseAmount = rate.hourly * hours;
  } else {
    const milesInput = $<HTMLInputElement>('estimatedMiles');
    const miles = parseFloat(milesInput?.value || '25') || 25;
    baseAmount = rate.perMile * miles;
    if (currentServiceType === 'airport' || currentServiceType === 'meetgreet') {
      baseAmount = Math.max(baseAmount, rate.airport);
    }
  }

  if (rate.minBooking && baseAmount < rate.minBooking) {
    baseAmount = rate.minBooking;
  }

  const meetGreetFee = isMeetGreet ? 30 : 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const subtotal = baseAmount + meetGreetFee + addonsTotal;
  const gratuity = subtotal * 0.20;
  const total = subtotal + gratuity;

  const fmt = (n: number) => '$' + n.toFixed(2);

  safeContent('summaryBase', fmt(baseAmount));
  safeDisplay('meetGreetLine', isMeetGreet ? 'flex' : 'none');
  safeContent('summaryMeetGreet', '+' + fmt(meetGreetFee));
  safeDisplay('addonsLine', selectedAddons.length > 0 ? 'flex' : 'none');
  safeContent('summaryAddons', '+' + fmt(addonsTotal));
  safeContent('summaryGratuity', fmt(gratuity));
  safeContent('summaryTotal', fmt(total));
  safeContent('submitEstimate', fmt(total));
};

// ── Booking Submission ─────────────────────────────────────────────────────
window.submitBooking = async function () {
  const vehicleSelect = $<HTMLSelectElement>('vehicleSelect');
  const vehicleKey = vehicleSelect?.value || '';
  const rate = vehicleRates[vehicleKey];
  const vehicleName = rate?.name || 'Selected Vehicle';

  const nameInput = $<HTMLInputElement>('fullName');
  const emailInput = $<HTMLInputElement>('email');
  const phoneInput = $<HTMLInputElement>('phone');

  const name = nameInput?.value.trim() || '';
  const email = emailInput?.value.trim() || '';
  const phone = phoneInput?.value.trim() || '';

  if (!name || !email || !phone) {
    alert('Please fill in your name, email, and phone number to submit a booking request.');
    return;
  }

  const total = $('summaryTotal')?.textContent || '$0.00';
  const submitBtn = document.querySelector('.form-submit');
  const originalHTML = submitBtn?.innerHTML || '';

  try {
    if (submitBtn) {
      submitBtn.textContent = 'Submitting...';
      (submitBtn as HTMLButtonElement).disabled = true;
    }

    // Build comprehensive payload
    const payload: BookingPayload = {
      vehicle: vehicleKey,
      vehicleName,
      name,
      email,
      phone,
      company: $<HTMLInputElement>('company')?.value.trim() || '',
      total,
      serviceType: currentServiceType,
      pickupLoc: $<HTMLInputElement>('pickupLoc')?.value.trim() || $<HTMLInputElement>('pickupLocHourly')?.value.trim() || '',
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

    const response = await fetch(`${window.API_BASE_URL}/api/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok && result.status === 'success') {
      alert(
        `Thank you, ${name.split(' ')[0]}! 🎉\n\n` +
        `Your booking request for ${vehicleName} has been received.\n` +
        `Reference: ${result.booking_id}\n` +
        `Estimated Total: ${total}\n\n` +
        `We will confirm availability and final pricing within 30 minutes via email and phone.\n` +
        `For immediate assistance, call (305) 555-0100.`
      );
    } else if (result.errors) {
      alert('Please fix the following:\n\n• ' + result.errors.join('\n• '));
    } else {
      alert('There was a problem submitting your request. Please try again or call us at (305) 555-0100.');
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
    if (submitBtn) {
      submitBtn.innerHTML = originalHTML;
      (submitBtn as HTMLButtonElement).disabled = false;
    }
  }
};

// ── Icon Configuration Loader ──────────────────────────────────────────
interface IconConfig {
  icons: Record<string, { tabler: string; label: string }>;
  vehicleIcons: Record<string, string>;
  serviceIcons: Record<string, string>;
  socialIcons: Record<string, string>;
}

async function loadIconConfig(): Promise<IconConfig | null> {
  try {
    const response = await fetch('/icon-config.json');
    if (!response.ok) return null;
    return await response.json();
  } catch {
    console.warn('Icon config not loaded — using defaults');
    return null;
  }
}

async function applyIconConfig(): Promise<void> {
  const config = await loadIconConfig();
  if (!config || !config.icons) return;

  document.querySelectorAll<HTMLElement>('[data-icon]').forEach((el) => {
    const iconKey = el.getAttribute('data-icon');
    if (!iconKey || !config.icons[iconKey]) return;

    const expectedClass = 'ti-' + config.icons[iconKey].tabler;
    // Remove all existing ti- classes and add the configured one
    const classes = el.className.split(' ').filter(
      (c) => !c.startsWith('ti-') || c === 'ti'
    );
    el.className = [...classes, 'ti', expectedClass].join(' ');

    // Update title/tooltip from config
    if (config.icons[iconKey].label) {
      el.setAttribute('title', config.icons[iconKey].label);
    }
  });
}

// ── Image Fallback Handler ────────────────────────────────────────────
function initImageFallbacks(): void {
  document.querySelectorAll<HTMLImageElement>('img[onerror]').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) {
      const wrapper = img.parentElement;
      if (wrapper && wrapper.classList.contains('fpc-img-wrap')) {
        wrapper.classList.add('fallback-icon');
      } else if (wrapper && wrapper.classList.contains('fcs-vc-img')) {
        wrapper.classList.add('has-image');
      }
    }
  });

  // Handle VD hero placeholder images
  document.querySelectorAll('.vd-visual-placeholder img.vd-hero-img').forEach((img) => {
    const htmlImg = img as HTMLImageElement;
    const placeholder = htmlImg.parentElement;
    if (htmlImg.complete && htmlImg.naturalWidth === 0) {
      placeholder?.classList.remove('has-image');
    } else if (htmlImg.complete && htmlImg.naturalWidth > 0) {
      placeholder?.classList.add('has-image');
    }
  });
}

// ── Init ──
document.addEventListener('DOMContentLoaded', function () {
  window.updatePriceEstimate();

  // Set minimum date to today
  const dateInput = $<HTMLInputElement>('pickupDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Apply icon configuration from icon-config.json
  applyIconConfig();

  // Initialize image fallback handling
  initImageFallbacks();

  // Expose icon config reloader for manual updates
  (window as any).reloadIcons = applyIconConfig;
  console.log('🚗 La Tía de la USA Transportation — Ready');
  console.log('   Icon config: edit public/icon-config.json to change icons');
  console.log('   Call reloadIcons() in console after editing icon config');
});
