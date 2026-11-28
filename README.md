# Tanggal Tua — Marketing Website

Static, zero-build marketing landing page ready to deploy to **Vercel** or **GitHub Pages** while preserving `/privacy.html` and `/app-ads.txt`.

## Quick Store Link Activation
Edit `SITE_CONFIG` at the top of `website/app.js`:
- `iosUrl`: paste your live App Store URL when public access opens (while empty, clicking `App Store (iOS)` opens the in-page waitlist modal).
- `androidUrl`: paste your live Google Play Store URL when public access opens (while empty, clicking `Google Play` opens the in-page named Closed Beta modal).
- `contactEmail`: official brand-native studio alias (`halo@tanggaltua.id`), routed centrally into **KAS Admin** (`admin.kasstudio.id/api/public/inquiries`).

## Local Preview
```bash
npx serve website
```

## Deploy to Vercel / GitHub Pages
- **Vercel:** Set Root Directory to `website` (Framework Preset: `Other`, zero build step).
- **GitHub Pages:** Publish the `website/` folder contents — `privacy.html` and `app-ads.txt` stay at root automatically.
