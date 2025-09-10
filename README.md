PitchLense Demo (React + Node)

A dark, animated landing page for PitchLense that matches the provided Figma style, served by a small Express server. No login required.

Quickstart

1) Install backend deps

```bash
cd backend
npm i
```

2) Run the server (serves `frontend/` directly)

```bash
npm run start
# open http://localhost:5178
```

If you want to iterate on the frontend HTML/JS, edit files in `frontend/` and refresh.

Notes
- Tailwind is loaded via CDN and themed inline for simplicity.
- React and ReactDOM are loaded from CDN; JSX compiled in‑browser for demo only.
- Animations use GSAP.

Project Structure
- `frontend/index.html` — HTML shell, Tailwind theme, mounts React app
- `frontend/main.jsx` — React landing page components and animations
- `frontend/styles.css` — Minor custom styles
- `backend/server.js` — Express server serving static frontend

MIT License.

Auth setup (Cloud SQL MySQL)

Env variables (create `backend/.env` locally or set in GCP service vars):

```bash
# One of the two: either single DATABASE_URL or discrete PG* vars
DB_HOST=...
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
# optional for Cloud SQL connector
# INSTANCE_UNIX_SOCKET=/cloudsql/PROJECT:REGION:INSTANCE
# DB_SSL=true

# JWT for signing cookies
JWT_SECRET=change-me
```

Routes
- POST `/api/auth/signup` { email, password, name? } → sets httpOnly cookie
- POST `/api/auth/login` { email, password } → sets httpOnly cookie
- POST `/api/auth/logout` → clears cookie
- GET `/api/auth/me` → current user if cookie valid

UI
- Visit `/auth.html` for a dark themed sign-in/sign-up card (colors: background `#1E1E21`, card `#2E3137`, logo from `/static/logo.svg`).

