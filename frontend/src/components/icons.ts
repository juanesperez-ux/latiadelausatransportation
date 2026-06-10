// ══════════════════════════════════════════════════════════════════════
// ICONS — La Tía de la USA Transportation
// Dynamic icon configuration loader and applier.
// Reads icon-config.json and applies the configured Tabler icon classes
// to all elements with [data-icon] attributes.
// ══════════════════════════════════════════════════════════════════════

import type { IconConfig } from '../types';

/**
 * Load the icon configuration from /public/icon-config.json.
 * Returns null if the file can't be fetched or parsed.
 */
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

/**
 * Apply the icon configuration to the DOM.
 * Replaces Tabler icon classes on all [data-icon] elements
 * with the configured icon from icon-config.json.
 */
export async function applyIconConfig(): Promise<void> {
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