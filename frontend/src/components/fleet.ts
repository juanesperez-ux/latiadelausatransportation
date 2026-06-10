// ══════════════════════════════════════════════════════════════════════
// FLEET — La Tía de la USA Transportation
// Fleet directory tab filtering logic.
// ══════════════════════════════════════════════════════════════════════

/**
 * Initialize fleet tab click handlers.
 * Attaches a single event listener to the fleetTabs container
 * and delegates clicks to individual .fleet-tab buttons.
 */
export function initFleetTabs(): void {
  document.getElementById('fleetTabs')?.addEventListener('click', function (e) {
    const target = e.target as HTMLElement;
    if (target.classList.contains('fleet-tab')) {
      // Deactivate all tabs and categories
      document.querySelectorAll('.fleet-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.fleet-category').forEach(c => c.classList.remove('active'));

      // Activate the clicked tab
      target.classList.add('active');

      // Show the corresponding category
      const cat = target.getAttribute('data-cat');
      const catEl = document.querySelector('.fleet-category[data-cat="' + cat + '"]');
      if (catEl) catEl.classList.add('active');
    }
  });
}