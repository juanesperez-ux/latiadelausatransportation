// ══════════════════════════════════════════════════════════════════════
// IMAGE UTILITIES — La Tía de la USA Transportation
// Image fallback handling for SVG/PNG images that fail to load.
// ══════════════════════════════════════════════════════════════════════

/**
 * Initialize image fallback handling.
 * Checks all images with onerror handlers and applies fallback styling
 * to any that failed to load (naturalWidth === 0).
 *
 * Also handles vehicle detail hero placeholder images.
 */
export function initImageFallbacks(): void {
  // Handle fleet preview card images
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