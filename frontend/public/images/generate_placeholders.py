#!/usr/bin/env python3
"""
Generate elegant SVG placeholder images for all vehicles and services.
Run: python3 generate_placeholders.py
These are self-contained SVG files used as fallback images.
"""

import os
import base64

IMAGES_DIR = os.path.dirname(os.path.abspath(__file__))

# Vehicle placeholders - dark luxury theme with gold accents
VEHICLES = {
    "ct5": {"name": "Cadillac CT5 350T", "color": "#2C2C3A", "accent": "#C9A84C", "icon": "🚗"},
    "s580": {"name": "Mercedes-Benz S 580", "color": "#1A1A2E", "accent": "#C9A84C", "icon": "🚙"},
    "tahoe": {"name": "Chevrolet Tahoe", "color": "#1E2A1E", "accent": "#C9A84C", "icon": "🚐"},
    "suburban": {"name": "Chevrolet Suburban", "color": "#222230", "accent": "#C9A84C", "icon": "🚙"},
    "escalade": {"name": "Cadillac Escalade", "color": "#1A1A28", "accent": "#C9A84C", "icon": "🚙"},
    "escalade-sport": {"name": "Escalade Sport Luxury", "color": "#12121F", "accent": "#C9A84C", "icon": "🏎️"},
    "escalade-platinum": {"name": "Escalade Platinum Lux", "color": "#0D0D1A", "accent": "#C9A84C", "icon": "👑"},
    "sprinter": {"name": "Mercedes-Benz Sprinter", "color": "#1C2230", "accent": "#C9A84C", "icon": "🚌"},
    "sprinter-limo": {"name": "Sprinter Limousine", "color": "#151520", "accent": "#C9A84C", "icon": "🚌"},
    "cullinan": {"name": "Rolls-Royce Cullinan", "color": "#0A0A14", "accent": "#C9A84C", "icon": "💎"},
    "phantom": {"name": "Rolls-Royce Phantom", "color": "#050510", "accent": "#C9A84C", "icon": "💎"},
}

SERVICES = {
    "service-airport": {"name": "Airport Transfers", "icon": "🛬"},
    "service-cruise": {"name": "Cruise Port Pickup", "icon": "🚢"},
    "service-corporate": {"name": "Corporate Executive Travel", "icon": "🏢"},
    "service-events": {"name": "Concerts & Event Transport", "icon": "🎵"},
    "service-hourly": {"name": "Hourly Charter", "icon": "⏱️"},
    "service-rollsroyce": {"name": "Rolls-Royce Experience", "icon": "👑"},
}


def make_vehicle_svg(name, bg_color, accent_color, icon):
    """Create an elegant vehicle placeholder SVG."""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{bg_color};stop-opacity:1" />
      <stop offset="50%" style="stop-color:#111118;stop-opacity:1" />
      <stop offset="100%" style="stop-color:{bg_color};stop-opacity:1" />
    </linearGradient>
    <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:{accent_color};stop-opacity:0" />
      <stop offset="30%" style="stop-color:{accent_color};stop-opacity:0.6" />
      <stop offset="70%" style="stop-color:{accent_color};stop-opacity:0.6" />
      <stop offset="100%" style="stop-color:{accent_color};stop-opacity:0" />
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#bg)" rx="12"/>
  <!-- Top gold line -->
  <rect x="100" y="0" width="600" height="2" fill="url(#goldLine)" opacity="0.8"/>
  <!-- Icon -->
  <text x="400" y="175" text-anchor="middle" font-size="72" fill="{accent_color}" opacity="0.3">{icon}</text>
  <!-- Vehicle silhouette hint -->
  <text x="400" y="220" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="{accent_color}" opacity="0.5" letter-spacing="8">{name.upper()}</text>
  <!-- Bottom gold bar -->
  <rect x="200" y="350" width="400" height="2" fill="{accent_color}" opacity="0.3" rx="1"/>
  <text x="400" y="385" text-anchor="middle" font-family="serif" font-size="12" fill="{accent_color}" opacity="0.4">LA TÍA DE LA USA</text>
</svg>'''


def make_service_svg(name, icon):
    """Create a service placeholder SVG."""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340" width="600" height="340">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#13131C;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1A1A28;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="600" height="340" fill="url(#bg)" rx="8"/>
  <text x="300" y="130" text-anchor="middle" font-size="64" fill="#C9A84C" opacity="0.35">{icon}</text>
  <text x="300" y="175" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="#C9A84C" opacity="0.55" letter-spacing="4">{name.upper()}</text>
  <rect x="120" y="260" width="360" height="1.5" fill="#C9A84C" opacity="0.25" rx="1"/>
  <text x="300" y="290" text-anchor="middle" font-family="serif" font-size="11" fill="#C9A84C" opacity="0.35">LA TÍA DE LA USA TRANSPORTATION</text>
</svg>'''


def main():
    count = 0

    # Generate vehicle SVGs
    for slug, info in VEHICLES.items():
        path = os.path.join(IMAGES_DIR, f"{slug}.svg")
        svg = make_vehicle_svg(info["name"], info["color"], info["accent"], info["icon"])
        with open(path, "w") as f:
            f.write(svg)
        print(f"  ✓ Created {slug}.svg")
        count += 1

    # Generate service SVGs
    for slug, info in SERVICES.items():
        path = os.path.join(IMAGES_DIR, f"{slug}.svg")
        svg = make_service_svg(info["name"], info["icon"])
        with open(path, "w") as f:
            f.write(svg)
        print(f"  ✓ Created {slug}.svg")
        count += 1

    print(f"\n✅ Generated {count} SVG placeholder images in {IMAGES_DIR}")
    print("⚠️  Replace these SVGs with real photos in production.")
    print("   Supported formats: PNG, JPG, WebP, SVG")


if __name__ == "__main__":
    main()