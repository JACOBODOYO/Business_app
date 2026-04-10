# Copilot Instructions for Business_app

Purpose
- Help AI coding agents quickly understand and contribute to this repo (frontend + simple backend).

Big picture
- Frontend: React + Vite + Tailwind in `src/` (entry: `src/main.jsx`, router in `src/App.jsx`).
- Backend: small Express server in `my-backend/Server.js` (runs on port 3001). Frontend talks to it via `http://localhost:3001`.
- Data store: PostgreSQL (connection configured directly inside `my-backend/Server.js`).

Quick start (dev)
- Frontend: run `npm run dev` from repository root (uses Vite, serves on 5173).
- Backend: run `node my-backend/Server.js` (no start script in `my-backend/package.json`). Ensure Postgres is running and `.env` contains `JWT_SECRET` if you plan to authenticate.

Auth & API patterns
- Login endpoint: `POST /auth/login` (see `my-backend/Server.js`). Returns a JWT token; frontend stores it as `localStorage.setItem('token', token)` in `src/components/Login.jsx`.
- Protected API calls attach header `Authorization: Bearer <token>` (examples: `src/components/DashBoard.jsx`, `AllOpen.jsx`).

Important integrations
- Twilio: frontend calls `GET /token` to obtain a capability token for the Twilio Device (see `src/components/CallButton.jsx` and `my-backend/Server.js` — check for `/token` implementation if adding features).
- File uploads / Excel bulk import: `POST /leads/bulk` uses `multer` and `xlsx` on the backend (see `my-backend/Server.js`). Uploaded files land in `my-backend/uploads/`.

Conventions and notable patterns
- API base URL is hardcoded to `http://localhost:3001` across `src/components/*`. When updating API host, update those files or introduce a single `API_BASE` variable.
- JWT secret is expected from env (`process.env.JWT_SECRET`) in the backend — Server will crash or auth will fail without it.
- Database credentials are currently hardcoded in `my-backend/Server.js` (user: `postgres`, password: `5657`, host: `localhost`). Treat this as a discovery detail — prefer migrating to `.env` before production changes.
- Frontend router uses `basename="/Business_app"` in `src/App.jsx` — keep that in mind when testing routes or deploying to GitHub Pages.

Files to inspect for common tasks
- Start/login flow: `src/components/Login.jsx`
- Leads CRUD and bulk import: `my-backend/Server.js`, `src/components/LeadsManagement.jsx`, `src/components/ProfileDetails.jsx`
- Notes and follow-ups: `my-backend/Server.js` / `src/components/PopupNotes.jsx`
- Twilio call flow: `src/components/CallButton.jsx`

When making changes
- Preserve the hardcoded API host pattern unless you add a clear migration (create `src/config.js` or use `import.meta.env` and change all call sites).
- If you add backend scripts, update `my-backend/package.json` so developers can run `npm run start` or `npm run dev` instead of invoking `node` directly.

Security and environment hints
- Do not commit secrets. Move DB credentials and `JWT_SECRET` to `my-backend/.env` and update `my-backend/Server.js` to read them via `process.env`.
- CORS origins are explicitly listed in `my-backend/Server.js`. Add new dev origins there when testing from different ports or hosts.

Examples (common requests)
- Login request: `POST http://localhost:3001/auth/login` with JSON `{ email, password }` (see `src/components/Login.jsx`).
- Get leads (protected): `GET http://localhost:3001/leads` with header `Authorization: Bearer <token>` (see `src/components/DashBoard.jsx`).

If something's missing
- Ask the repo owner for the `my-backend/.env` values (especially `JWT_SECRET`) and confirmation about DB credentials before running integration tests.

If you want me to expand
- I can add an `API_BASE` refactor, add backend npm scripts, or create a `.env.example` in `my-backend/` — tell me which you'd prefer.
