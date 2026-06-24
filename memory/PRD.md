# Zensar AI Employee Assistant — Product Requirements Document

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

## What's Implemented (as of 2026-02-24)
### Foundations
- TypeScript + tsconfig migration; shadcn UI shim for un-typed components
- Tailwind brand tokens (navy / coral / red), Outfit + IBM Plex Sans + JetBrains Mono fonts
- Light + dark theme CSS variables; per-page theme toggle
- Supabase client + AuthContext (session, profile, role, region)
- Route guards: `RequireAuth`, `RequireRole`
- Sonner toaster

### Pages (29/29 scaffolded with rich UI + data-testids)
**Public (1):** Landing
**Auth (5):** Sign in · Sign up · Forgot password · Reset password · Email verification
**Employee (9):** Dashboard · Chat (voice + citations + portals + thumbs + regenerate + escalate) · Chat history · Policy library · My tickets · Notifications · Profile · Settings · Help
**HR (4):** HR dashboard · Ticket queue · Ticket detail · Knowledge gaps
**Admin (10):** Admin dashboard · Policy manager · Policy upload wizard · Region & portal manager · User management · Role permissions · Analytics · Audit logs · n8n status · System settings
**Utility (2):** Unauthorized · 404

### Backend
- `/api/`, `/api/health`, `/api/config` (intentionally minimal)

### Database (SQL migration provided, NOT yet applied by user)
- 12 tables with RLS policies (regions, profiles, policies, policy_regions, policy_versions, chat_threads, chat_messages, tickets, ticket_messages, notifications, knowledge_gaps, portal_links, audit_logs, settings)
- Storage bucket `policy_pdfs` (private, RLS)
- Helper functions: `is_admin()`, `is_hr()`, `current_region_id()`, `handle_new_user()` trigger
- 9 regions seeded

## Backlog (prioritised)
### P0 — User to complete
- [ ] **Apply SQL migration** in Supabase SQL Editor (`001_init_schema.sql`)
- [ ] **Promote first admin** via `update public.profiles set role='admin' where email=…`
- [ ] **Decide email confirmation** policy (currently ON in Supabase)

### P1 — Functional wiring (deferred per user choice — user will do)
- [ ] `/api/chat` → POST to n8n `/chat` webhook (RAG response)
- [ ] `/api/policies/upload` → trigger n8n `/embed-policy`
- [ ] `/api/escalate` → create ticket + email regional HR via n8n `/escalate`
- [ ] Real chat persistence (chat_threads, chat_messages)
- [ ] Real policy library reads from Supabase + signed-URL downloads
- [ ] Real ticket CRUD with assignments and SLA timers
- [ ] Real-time notifications (Supabase Realtime)

### P2 — Nice-to-have
- [ ] Markdown rendering in chat (currently plain text)
- [ ] Light theme toggle in settings (currently dark-only on app shell)
- [ ] CSV export for analytics
- [ ] 2FA, GDPR data-delete
- [ ] SSO (Azure AD)

## Test Coverage
- Backend: 4/4 endpoints passing
- Frontend: 25/25 public + route-guard checks passing
- Auth-required UI deferred until DB migration is applied
