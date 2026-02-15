# EcoBala — Multilingual Adaptive Eco Platform

Updated prototype with a beautiful responsive design, multilingual UI (RU/EN/KZ), admin panel, registration zone, tasks, games and photo reports.

## Implemented

- Fully adaptive interface for desktop/tablet/mobile.
- Modern typography (`Manrope`, `Nunito`) and refreshed CSS across all pages.
- Multilingual switcher (Russian, English, Kazakh).
- Mobile bottom navigation with **Home** item.
- Registration page with local DB (`localStorage`).
- Tasks page with image upload and local photo report saving.
- Games page with logic mini-games.
- Admin panel for users and reports monitoring.
- Removed the previous “Ecological contribution today” block from homepage.

## Pages

- `index.html` — home page.
- `register.html` — registration.
- `tasks.html` — tasks and photo upload.
- `games.html` — logic games.
- `admin.html` — admin panel.

## Scripts

- `database.js` — local data storage layer.
- `i18n.js` — multilingual translation layer.
- `register.js`, `tasks.js`, `games.js`, `admin.js` — page logic.

## Run

```bash
python -m http.server 4173
```

Open `http://localhost:4173`.
