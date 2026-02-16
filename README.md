# EcoBala — production-grade adaptive eco platform

Refactored as a more professional full-stack style prototype: secure auth API (Express), responsive UX, eco content, and a browser 3D game.

## Technical audit improvements

- Refactored frontend styling to a consistent design system (glassmorphism + mobile-first).
- Improved modularity with separated backend files: `server/app.js`, `server/security.js`, `server/store.js`.
- Added basic security controls:
  - password hashing with `crypto.scrypt`,
  - CSRF protection token flow,
  - input sanitization for XSS mitigation,
  - timing-safe hash compare,
  - simple request rate limiting,
  - secure cookie flags (`HttpOnly`, `SameSite`).

## Full-stack features

- Registration + login endpoints (`/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`).
- Registration forms integrated in UI (`index.html`, `register.html`) and auth page (`auth.html`).
- Local activity/report features preserved for school demo flows.

## UX / UI

- Fully responsive layout from mobile (320px) to large desktop / 4K-friendly containers.
- Grid + Flex architecture and modern font stack (Inter, Poppins, Montserrat).
- Animated eco phrases, Kazakhstan eco news, FAQ section, smooth transitions.
- Improved visual hierarchy, cards, and navigation patterns.

## 3D Game

- Added browser 3D game (`game3d.js`, loaded from `games.html`) using Three.js:
  - WASD controls,
  - third-person camera follow,
  - dynamic lighting and shadows,
  - collectible scoring system,
  - win/lose conditions,
  - HUD with score and timer,
  - simple collision handling against obstacles.

## Pages

- `index.html` — landing, registration, eco news, FAQ.
- `auth.html` — email/password authentication UI.
- `tasks.html` — tasks + photo reports.
- `games.html` — mini games + 3D game module.
- `director.html` — director monitoring.
- `admin.html` — private admin panel.

## Run

### Frontend (static)
```bash
python -m http.server 4173
```

### Full-stack mode (Express)
```bash
npm install
npm run start
```

Open `http://localhost:4173`.
