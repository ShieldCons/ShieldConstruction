# Shield Construction LLC — Website

Static marketing site for [Shield Construction LLC](https://www.shield-cons.com), a Metro Atlanta restoration contractor (water damage, mold, storm repair, reconstruction, and insurance claim assistance).

## Stack

| Layer | Technology |
|-------|------------|
| Markup | HTML5 (multi-page) |
| Styles | `css/style.css` (CSS variables) |
| Scripts | `js/main.js`, `js/config.js` |
| Hosting | GitHub Pages (`main` branch) |
| Forms | Google Apps Script → Google Sheets |

No build step or npm dependencies.

## Local development

**Option A — VS Code / Cursor task**

`Terminal → Run Task → Live Preview` (live-server on port 5500)

**Option B — Python**

```bash
python -m http.server 5500
```

Open `http://localhost:5500/index.html`. After editing `css/style.css` or `js/main.js`, bump the `?v=` query string on all HTML pages (currently **v=22**) to avoid stale cache.

Detailed architecture, function map, and maintenance notes are in **`DEV-GUIDE.md`** (local only, listed in `.gitignore`).

## Project layout

```
├── index.html, about.html, services.html, …   # Pages
├── css/style.css                              # Global styles
├── js/main.js                                 # Layout, forms, gallery, carousel
├── js/config.js                               # Google Script URL (see config.example.js)
├── assets/images/                             # Logo, hero, gallery slots
├── scripts/                                   # Apps Script, DNS/Sheets setup guides
└── CNAME                                      # www.shield-cons.com
```

## Configuration

1. Copy `js/config.example.js` → `js/config.js` if needed.
2. Set `GOOGLE_SCRIPT_URL` to your deployed Apps Script web app URL.
3. Follow `scripts/setup-google-sheets.md` for the spreadsheet backend.

## Deploy

Push to `main`. GitHub Pages publishes automatically (usually 1–3 minutes). DNS: see `scripts/setup-dns.md`.

## Recent changes (2026-06)

- Header: left logo column with dynamic blue/white split aligned to top bar; compact blue info bar restored.
- Removed Emergency Response page flow (redirects to contact), emergency popup, floating call button, and related nav/CTAs.
- Removed Fire & Smoke service section and references site-wide.
- Homepage hero ticker shows **services** instead of city names.
- Emergency popup timing was 40s before removal; scroll-trigger removed earlier.
- About page “Our Story” copy updated.
