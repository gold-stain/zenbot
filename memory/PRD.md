# ZenBot Employee Assistant — Product Requirements Document

**Last updated:** 2026-02-24
**Tech:** React 19 + TypeScript + Tailwind + shadcn UI · Supabase (Auth · Postgres · Storage) · FastAPI (minimal)

---

## Original Problem Statement (verbatim, condensed)
Region-aware HR chatbot for Zensar. 29 pages across Public, Employee, HR, Admin.
Three roles (Employee / HR / Admin). Nine regions (India, USA, UK, South Africa, Austria,
Singapore, Canada, Ireland, Global). Chat assistant is the centrepiece: text + voice I/O,
streaming, citations, portal chips, escalation. Region-scoped via RLS. Brand colours:
navy `#1A1A6B`, coral `#FF6B5B`, red `#E11D2C`, white.

## User Choices (explicit)
- React + **TypeScript** (no JavaScript anywhere)
- **Hybrid theme**: light public/auth pages + dark futuristic authenticated app
- Backend kept **mostly empty** — user is wiring it themselves
- Roles assigned **strictly via admin panel** (no profile-level role switcher)
- DB tables / Supabase set up (no policy seed — user will add)

## Personas
1. **Employee** — chats, raises tickets, reads policies for their region + Global
2. **HR** — sees regional ticket queue, knowledge gaps, ticket detail with chat context
3. **Admin** — global, manages policies, users, regions, n8n, analytics, audit

## Architecture
- Frontend: CRA + craco + TS + Tailwind + shadcn UI + Supabase JS v2
- Backend: FastAPI (minimal) — /api/, /api/health, /api/config
- DB / Auth / Storage: Supabase (project `odxbsejhrptfxykkqfkb`)
- Migrations: `/app/supabase/migrations/001_init_schema.sql` (12 tables, RLS, storage bucket, regions seed, profile auto-create trigger)

## What's Implemented (as of 2026-02-24 — iter 2)
### Foundations
- TypeScript + tsconfig migration; shadcn UI shim for un-typed components
- Tailwind brand tokens (navy / coral / red), Outfit + IBM Plex Sans + JetBrains Mono fonts
- Light + dark theme CSS variables; per-page theme toggle + persisted user preference (`useAppTheme`)
- Supabase client + AuthContext (session, profile, role, region)
- Route guards: `RequireAuth`, `RequireRole`
- Sonner toaster
- **Service layer** `src/services/db.ts` — typed query helpers for every table
- **Resilient wrapper** `src/services/safe.ts` — pages never crash if RLS / migration missing
- **n8n integration** `src/services/chat.ts` — POSTs to configurable webhook (System Settings → URL → localStorage), falls back to mock
- **Markdown rendering** `src/components/common/Markdown.tsx` (react-markdown + remark-gfm)

### Data wiring (iter 2)
- Chat: thread + message persistence, real n8n webhook integration, markdown, escalation creates a real ticket
- ChatHistory: list/rename/archive/delete from `chat_threads`
- PolicyLibrary: reads `policies` + `policy_regions` with signed-URL downloads from `policy_pdfs` bucket
- MyTickets: list + create via `tickets`
- Notifications: list + mark single/all read via `notifications`
- Profile: editable, persists name/empid/department to `profiles`
- Settings: localStorage prefs + dark/light theme toggle
- HR pages: TicketQueue (region-scoped), TicketDetail (status + reply), KnowledgeGaps (mark resolved)
- Admin pages: AdminDashboard (live counts), PolicyManager (list/delete), PolicyUploadWizard (storage upload + insert), RegionPortalManager (real regions + portals), UserManagement (role change + disable), AuditLogs, SystemSettings (persists to `settings` + webhook URL)

### Pages (29/29)
All page surfaces remain identical; underlying data is now live where Supabase is configured.

### Backend
- `/api/`, `/api/health`, `/api/config` (intentionally minimal)

### Database (SQL migration provided, NOT yet applied by user)
- 12 tables with RLS policies, storage bucket `policy_pdfs`, helper functions, 9-region seed

## Test Coverage (iter 2)
- Backend: 4/4 endpoints passing
- Frontend: 10/10 public + route-guard checks passing, zero console errors after data wiring
