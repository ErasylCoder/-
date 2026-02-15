# EcoBala — responsive multilingual school eco platform

Updated web prototype with improved UI, adaptive layout, registration-first flow, admin monitoring and director dashboard.

## What is implemented

- Registration-first entry page (`index.html`) with modern hero layout and EcoBala emblem.
- Logo + favicon added via `assets/ecobala-logo.svg` and `assets/favicon.svg`.
- Fully adaptive responsive layout for monitor, laptop, tablet and phone.
- RU / EN / KZ translations with language switcher (`i18n.js`).
- Admin dashboard with PIN gate (`2026`) and full monitoring:
  - users,
  - reports,
  - activity timeline (who did what and when).
- Director page with city selection and Chromtau schools list:
  - Chromtau School №1 ... Chromtau School №7.
- Registration data, tasks, reports and activity logs stored in browser LocalStorage.
- Founder line added at the top: **CEO Amirtay.E, Ermukhanov.M**.

## Pages

- `index.html` — main + registration first screen.
- `register.html` — dedicated registration page.
- `tasks.html` — tasks and photo reports.
- `games.html` — logic games.
- `admin.html` — admin-only monitoring panel.
- `director.html` — school director view.

## Run

```bash
python -m http.server 4173
```

Open `http://localhost:4173`.
