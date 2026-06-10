# Vehicle & Service Images

This directory contains placeholder images for the fleet and services. Replace these with real photographs before production deployment.

## Current State

**SVG Placeholders** — Elegant dark-themed placeholder SVGs have been generated. The HTML uses `<img>` tags with `onerror` fallbacks, so pages work gracefully even without real photos.

## Image Files Needed

### Fleet Images (13 vehicles, 11 unique)
| Filename | Vehicle | Suggested Size |
|----------|---------|---------------|
| `ct5.png` | Cadillac CT5 · 350T | 800×450 |
| `s580.png` | Mercedes-Benz S 580 | 800×450 |
| `tahoe.png` | Chevrolet Tahoe | 800×450 |
| `suburban.png` | Chevrolet Suburban | 800×450 |
| `escalade.png` | Cadillac Escalade | 800×450 |
| `escalade-sport.png` | Cadillac Escalade Sport Luxury | 800×450 |
| `escalade-platinum.png` | Cadillac Escalade Platinum Lux | 800×450 |
| `sprinter.png` | Mercedes-Benz Sprinter Regular | 800×450 |
| `sprinter-limo.png` | Mercedes-Benz Sprinter Limo | 800×450 |
| `cullinan.png` | Rolls-Royce Cullinan | 800×450 |
| `phantom.png` | Rolls-Royce Phantom | 800×450 |

### Service Images (6)
| Filename | Service |
|----------|---------|
| `service-airport.png` | Airport Transfers |
| `service-cruise.png` | Cruise Port Pickup |
| `service-corporate.png` | Corporate Executive Travel |
| `service-events.png` | Concerts & Event Transport |
| `service-hourly.png` | Hourly Charter |
| `service-rollsroyce.png` | Rolls-Royce Experience |

## How to Add Real Photos

### Option 1: Manual Upload
1. Source high-quality photos of each vehicle (preferably uniform angle, dark background)
2. Resize to 800×450px (16:9 for vehicles) and 600×340px for services
3. Save as `.png` or `.webp` with the filenames above
4. Drop them into this folder — the HTML automatically uses them

### Option 2: API Integration

**Unsplash API** — Free for up to 50 requests/hour
```javascript
// In main.ts, replace image src with:
const UNSPLASH_ACCESS_KEY = 'YOUR_KEY_HERE';
img.src = `https://api.unsplash.com/photos/random?query=cadillac+escalade+black&client_id=${UNSPLASH_ACCESS_KEY}`;
```

**Pexels API** — Free for up to 200 requests/hour
```javascript
const PEXELS_API_KEY = 'YOUR_KEY_HERE';
fetch(`https://api.pexels.com/v1/search?query=mercedes+sprinter+van&per_page=1`, {
  headers: { Authorization: PEXELS_API_KEY }
}).then(r => r.json()).then(data => img.src = data.photos[0].src.medium);
```

**Suggested Image Sources:**
- [Unsplash](https://unsplash.com/developers) — Free, high-quality stock photos
- [Pexels](https://www.pexels.com/api/) — Free stock photos & videos  
- [Pixabay](https://pixabay.com/api/docs/) — Free images, no attribution required
- Manufacturer press kits: cadillac.com, mercedes-benz.com, rolls-roycemotorcars.com
- Professional automotive photography services

### Option 3: Generate with AI
- Use Midjourney/DALL·E to generate consistent vehicle photos
- Prompt example: "Professional automotive photography, black Cadillac Escalade 2024, dark studio background, luxury car, golden lighting, product shot, 16:9 ratio"

## Supported Formats
- **PNG** — Best quality, supports transparency
- **JPG** — Smaller file size
- **WebP** — Best compression-to-quality ratio (recommended)
- **SVG** — Currently used for placeholders

## Notes
- Images are loaded with `loading="lazy"` for performance
- Missing images are hidden via `onerror="this.style.display='none'"` — the page degrades gracefully
- All images should match the dark luxury aesthetic of the site (dark backgrounds, gold/champagne accents)