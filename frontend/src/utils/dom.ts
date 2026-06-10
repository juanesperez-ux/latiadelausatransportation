// ══════════════════════════════════════════════════════════════════════
// DOM UTILITIES — La Tía de la USA Transportation
// Helper functions for type-safe DOM manipulation.
// ══════════════════════════════════════════════════════════════════════

/**
 * Type-safe getElementById. Returns null if the element
 * with the given id doesn't exist in the DOM.
 */
export function $<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * Safely set textContent on an element by ID.
 * Silently no-ops if the element doesn't exist.
 */
export function safeContent(id: string, text: string): void {
  const el = $(id);
  if (el) el.textContent = text;
}

/**
 * Safely set display style on an element by ID.
 * Silently no-ops if the element doesn't exist.
 */
export function safeDisplay(id: string, display: string): void {
  const el = $(id);
  if (el) el.style.display = display;
}