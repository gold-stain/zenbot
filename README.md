# ZenBot Employee Assistant

A region-aware HR copilot for Zensar. Three roles (Employee · HR · Admin), nine regions, voice in & out, source-cited replies, and human escalation when it matters.

> React 19 + TypeScript + Tailwind + shadcn/ui + Supabase (Auth · Postgres · Storage) · FastAPI · MongoDB (optional, kept for legacy template — unused by core flows).

---

## Table of contents
1. [Tech stack](#tech-stack)
2. [Repository layout](#repository-layout)
3. [Prerequisites](#prerequisites)
4. [Environment variables](#environment-variables)
5. [Supabase setup (one-time)](#supabase-setup-one-time)
6. [Running locally](#running-locally)
7. [Promoting your first admin](#promoting-your-first-admin)
8. [Connecting your n8n webhook (optional)](#connecting-your-n8n-webhook-optional)
9. [Common scripts](#common-scripts)
10. [Project surfaces](#project-surfaces)
11. [Troubleshooting](#troubleshooting)

---

## Tech stack

| Layer        | Choice                                                      |
|--------------|-------------------------------------------------------------|
| Frontend     | React 19 · TypeScript · Tailwind · shadcn/ui · framer-motion · react-router · react-markdown |
| Auth + DB    | Supabase (Postgres + Auth + Storage + RLS)                  |
| Backend      | FastAPI (intentionally minimal — placeholder endpoints)     |
| AI           | Pluggable n8n webhook for `/chat` (mock fallback shipped)   |
| Tooling      | Yarn 1 · craco · supervisor (in container) · uvicorn        |

---

## Repository layout
```
/app
├── backend/                      FastAPI server (intentionally minimal)
│   ├── server.py
│   ├── requirements.txt
│   └── .env                      (NOT in git — see below)
├── frontend/                     React + TypeScript SPA
│   ├── src/
│   │   ├── pages/                public · auth · employee · hr · admin
│   │   ├── components/
│   │   │   ├── ui/               shadcn primitives
│   │   │   ├── common/           AIOrb · CommandSpotlight · HeroChatDemo …
│   │   │   └── layout/           AppShell · PublicLayout · AuthShell
│   │   ├── services/             db.ts (Supabase CRUD) · chat.ts (n8n)
│   │   ├── context/              AuthContext
│   │   ├── hooks/                useAppTheme
│   │   ├── routes/               RequireAuth · RequireRole
│   │   ├── lib/                  supabaseClient.ts
│   │   ├── index.tsx
│   │   └── App.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── .env                      (NOT in git — see below)
├── supabase/
│   └── migrations/
│       └── 001_init_schema.sql   Tables · RLS · trigger · regions seed
├── memory/
│   ├── PRD.md
│   └── test_credentials.md
└── README.md                     (this file)
```

---

## Prerequisites

- **Node.js** ≥ 18 (LTS recommended)
- **Yarn 1** (`npm install --global yarn@1.22.x`) — *do not use npm, it will break lockfiles*
- **Python** ≥ 3.10
- **A Supabase project** (free tier is fine) — https://supabase.com
- (Optional) **MongoDB** — only if you want the legacy `MONGO_URL` checked; the core app does not use it

---

## Environment variables

> Both files are **gitignored**. Create them locally with the values below.

### `frontend/.env`
```bash
# --- Public web app ---
# Where the frontend calls FastAPI in dev.
# In production / preview, set this to the public URL of your backend.
REACT_APP_BACKEND_URL=http://localhost:8001

# --- Supabase (REQUIRED) ---
# From: Supabase Dashboard → Settings → API
REACT_APP_SUPABASE_URL=https://<your-project-ref>.supabase.co
REACT_APP_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxxxxxx

# Used as the email-redirect target for sign-up confirmation
# (must match a Redirect URL added in Supabase → Authentication → URL Configuration)
REACT_APP_SITE_URL=http://localhost:3000

# --- Optional ---
# If set at build time, the chat will call this instead of the mock
# (you can also set it at runtime via Admin → System Settings)
REACT_APP_N8N_CHAT_WEBHOOK=

# Hot-reload websocket port — leave as is unless your CRA dev server is behind a proxy
WDS_SOCKET_PORT=3000
```

### `backend/.env`
```bash
# --- MongoDB (legacy, unused by core flows — leave as is) ---
MONGO_URL="mongodb://localhost:27017"
DB_NAME="zensar_ai"

# --- CORS (FastAPI) ---
CORS_ORIGINS="*"

# --- Supabase service-side (for any future server-only code you add) ---
SUPABASE_URL="https://<your-project-ref>.supabase.co"
SUPABASE_PUBLISHABLE_KEY="sb_publishable_xxxxxxxxxxxxxxxxxxxxxxxx"
SUPABASE_SECRET_KEY="sb_secret_xxxxxxxxxxxxxxxxxxxxxxxx"     # KEEP PRIVATE
SUPABASE_JWKS_URL="https://<your-project-ref>.supabase.co/auth/v1/.well-known/jwks.json"
```

> **Never commit `SUPABASE_SECRET_KEY`** — it bypasses RLS.

Where to get the values:
1. Supabase Dashboard → **Project Settings → API**
   - `Project URL` → `SUPABASE_URL` / `REACT_APP_SUPABASE_URL`
   - `Publishable key` (the new one, starts with `sb_publishable_`) → `*_PUBLISHABLE_KEY`
   - `Secret key` (starts with `sb_secret_`) → `SUPABASE_SECRET_KEY`
2. Supabase Dashboard → **Authentication → URL Configuration**
   - Add `http://localhost:3000` (and any other env URLs) to **Redirect URLs**

---

## Supabase setup (one-time)

1. **Create a project** at https://supabase.com (any region).
2. Open **SQL Editor → New query**, paste the entire contents of `/app/supabase/migrations/001_init_schema.sql`, click **Run**.
   This creates: 12 tables, RLS policies for all roles, helper functions (`is_admin()`, `is_hr()`, `current_region_id()`), an `on_auth_user_created` trigger that auto-creates a `profiles` row on signup, the `policy_pdfs` storage bucket, and seeds the 9 regions (`IN`, `US`, `UK`, `ZA`, `AT`, `SG`, `CA`, `IE`, `GLOBAL`).
3. **Authentication → Providers → Email**
   - For local dev convenience you can turn **"Confirm email"** OFF (so signup logs you in immediately). Re-enable it before going to prod.
4. **Authentication → URL Configuration**
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: `http://localhost:3000/**` (so `/verify-email` and `/reset-password` work)
5. (Optional) **Storage → policy_pdfs** is already created by the migration. Inspect it under Storage.

That's it. The Supabase project is ready.

---

## Running locally

### 1) Install dependencies
From the repo root:

```bash
# Frontend
cd frontend
yarn install

# Backend (in another terminal)
cd ../backend
pip install -r requirements.txt
```

### 2) Add the env files
Create `frontend/.env` and `backend/.env` from the snippets above and fill in your Supabase values.

### 3) Start the backend
```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```
Health check: open http://localhost:8001/api/health — should return `{"status":"healthy","supabase_configured":true}`.

### 4) Start the frontend
```bash
cd frontend
yarn start
```
Opens http://localhost:3000.

### 5) Try it
- Landing page works immediately (orb + sticky nav + live HeroChatDemo on the right).
- Click **Get started**, sign up, confirm email (if enabled), then you'll land on `/app/dashboard`.

---

## Promoting your first admin

Out of the box every new user is created as an **Employee**. To unlock HR / Admin pages, run this in **Supabase → SQL Editor**:

```sql
-- Promote to Admin
update public.profiles
set role = 'admin'
where email = 'you@yourcompany.com';

-- Or promote to HR
update public.profiles
set role = 'hr'
where email = 'hr.member@yourcompany.com';
```

Refresh the browser; the sidebar will gain the **HR** and **Admin** sections.

> The app uses **strict role enforcement** — there is no in-app role switcher. Roles are changed only via the SQL above or the Admin → Users page (once an admin exists).

---

## Connecting your n8n webhook (optional)

Until you wire up your n8n RAG pipeline, the chat uses **mock keyword-routed replies** (leave / WFH / payslip / fallback). To go live:

1. Build an n8n workflow with a webhook trigger that accepts:
   ```json
   {
     "question": "string",
     "threadId": "uuid",
     "history": [{"role":"user|assistant","content":"…"}],
     "userId": "uuid",
     "regionId": "uuid|null",
     "role": "employee|hr|admin"
   }
   ```
   And returns:
   ```json
   {
     "answer": "markdown string",
     "citations": [{"title":"…","section":"§4.1","page":12}],
     "portals":   [{"label":"Open Leave Portal","url":"https://…"}],
     "followups": ["…","…"],
     "confidence": 0.78
   }
   ```
2. Inside the app: sign in as Admin → **Admin → System Settings** → paste the webhook URL → **Save**.
3. The chat instantly switches from mock to live. The setting persists in `settings` (Supabase) and `localStorage`.

---

## Common scripts

### Frontend (`/frontend`)
| Command         | What it does                                |
|-----------------|---------------------------------------------|
| `yarn start`    | Run CRA dev server on port 3000 with HMR    |
| `yarn build`    | Production build to `frontend/build/`       |
| `yarn lint`     | ESLint pass (if configured)                 |
| `yarn add <pkg>`| Install a new package (NEVER use npm)       |

### Backend (`/backend`)
| Command                                                | What it does                          |
|---------------------------------------------------------|---------------------------------------|
| `uvicorn server:app --reload --port 8001`              | Run FastAPI on port 8001               |
| `pip install -r requirements.txt`                      | Install Python deps                    |
| `pip freeze > requirements.txt`                        | Lock new deps (after adding any)       |

### Supabase CLI (optional — only if you prefer)
```bash
# Install: https://supabase.com/docs/guides/cli
supabase login
supabase link --project-ref <your-project-ref>
supabase db push   # applies anything in /supabase/migrations
```

---

## Project surfaces

### Public (unauthenticated)
- `/` – Landing page (orb + live 2-way chat under it, anchor nav: Capabilities · How it works · Pillars · Try it)
- `/sign-in` · `/sign-up` · `/forgot-password` · `/reset-password` · `/verify-email`
- `/unauthorized` · 404 catch-all

### Employee (any signed-in user)
- `/app/dashboard` – AI command center with stats, suggestion tabs, quick links
- `/app/chat` and `/app/chat/:threadId` – the assistant
- `/app/history` · `/app/policies` · `/app/tickets` · `/app/notifications`
- `/app/profile` · `/app/settings` · `/app/help`

### HR (role = `hr` or `admin`)
- `/app/hr` · `/app/hr/queue` · `/app/hr/tickets/:id` · `/app/hr/gaps`

### Admin (role = `admin`)
- `/app/admin` · `/app/admin/policies` · `/app/admin/policies/upload`
- `/app/admin/regions` · `/app/admin/users` · `/app/admin/roles`
- `/app/admin/analytics` · `/app/admin/audit` · `/app/admin/n8n` · `/app/admin/system`

---

## Troubleshooting

**Sign-up email never arrives**
- Either enable a real SMTP in Supabase → Authentication → SMTP, **or** turn off "Confirm email" while developing.

**`Permission denied / PGRST` errors in the console on `/app/*` pages**
- The Supabase migration wasn't applied. Run `001_init_schema.sql` in the SQL editor.

**I'm signed in but the sidebar doesn't show HR or Admin**
- Run the SQL in [Promoting your first admin](#promoting-your-first-admin). Then refresh the page.

**`Cannot find module '@/index.css'` or TypeScript path errors**
- Make sure `tsconfig.json` has `"baseUrl": "."` and `"paths": { "@/*": ["src/*"] }` (it does by default).

**`yarn start` complains about `WDS_SOCKET_PORT`**
- That env var is for the in-container preview. Locally you can omit it or set `WDS_SOCKET_PORT=3000`.

**Frontend keeps showing stale chunks after a code change**
- Stop the dev server, delete `frontend/node_modules/.cache`, restart with `yarn start`.

**Mongo error on backend start**
- The legacy template imported MongoDB. The current `server.py` doesn't require it. You can leave `MONGO_URL` set to a dummy value or comment out any mongo init in your local copy.

**Webhook returns 500 / chat falls back to mock**
- Open the browser console — `[supabase]` and `[chat]` errors are logged. Verify your n8n endpoint accepts CORS from `http://localhost:3000`, and that the response shape matches the schema above.

---

## License

Internal Zensar project. All trademarks (Zensar logo, brand colors) belong to their respective owners.

---

## Quick command cheat sheet

```bash
# One-time
git clone <repo>
cd <repo>
( cd frontend && yarn install )
( cd backend  && pip install -r requirements.txt )

# Every day
( cd backend  && uvicorn server:app --reload --port 8001 ) &
( cd frontend && yarn start )

# After editing the Supabase schema
psql <SUPABASE_DB_URL> -f supabase/migrations/001_init_schema.sql
# or paste it into the Supabase SQL editor and click Run

# Add a frontend package
( cd frontend && yarn add <pkg> )

# Add a backend package
( cd backend && pip install <pkg> && pip freeze > requirements.txt )
```
