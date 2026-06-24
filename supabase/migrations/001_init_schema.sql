-- ============================================================================
-- Zensar AI Employee Assistant — Initial Schema Migration
-- Tables, RLS policies, helper functions, region seed, storage bucket
-- Run this in Supabase SQL Editor (or via supabase db push)
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. EXTENSIONS
-- --------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- --------------------------------------------------------------------------
-- 2. REGIONS
-- --------------------------------------------------------------------------
create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  flag text,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- 3. PROFILES (1:1 with auth.users)
-- --------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  employee_id text,
  department text,
  role text not null default 'employee' check (role in ('employee','hr','admin')),
  region_id uuid references public.regions (id),
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_user_id_idx on public.profiles (user_id);
create index if not exists profiles_region_id_idx on public.profiles (region_id);
create index if not exists profiles_role_idx on public.profiles (role);

-- --------------------------------------------------------------------------
-- 4. POLICIES + VERSIONS
-- --------------------------------------------------------------------------
create table if not exists public.policies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  tags text[] default '{}',
  current_version int not null default 1,
  is_active boolean not null default true,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.policy_regions (
  policy_id uuid not null references public.policies (id) on delete cascade,
  region_id uuid not null references public.regions (id) on delete cascade,
  primary key (policy_id, region_id)
);

create table if not exists public.policy_versions (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid not null references public.policies (id) on delete cascade,
  version int not null,
  file_path text,
  summary text,
  uploaded_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create index if not exists policy_regions_region_idx on public.policy_regions (region_id);
create index if not exists policy_versions_policy_idx on public.policy_versions (policy_id);

-- --------------------------------------------------------------------------
-- 5. CHAT THREADS + MESSAGES
-- --------------------------------------------------------------------------
create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'New chat',
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads (id) on delete cascade,
  author text not null check (author in ('user','assistant')),
  content text not null,
  citations jsonb default '[]'::jsonb,
  portals jsonb default '[]'::jsonb,
  feedback text check (feedback in ('up','down')),
  confidence numeric,
  created_at timestamptz not null default now()
);

create index if not exists chat_threads_user_idx on public.chat_threads (user_id);
create index if not exists chat_messages_thread_idx on public.chat_messages (thread_id);

-- --------------------------------------------------------------------------
-- 6. TICKETS
-- --------------------------------------------------------------------------
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default ('TKT-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  subject text not null,
  description text,
  status text not null default 'open' check (status in ('open','in_progress','awaiting_employee','resolved','closed')),
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  region_id uuid references public.regions (id),
  created_by uuid not null references auth.users (id),
  assigned_to uuid references auth.users (id),
  thread_id uuid references public.chat_threads (id),
  sla_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  author_id uuid not null references auth.users (id),
  body text not null,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists tickets_region_idx on public.tickets (region_id);
create index if not exists tickets_creator_idx on public.tickets (created_by);
create index if not exists ticket_messages_ticket_idx on public.ticket_messages (ticket_id);

-- --------------------------------------------------------------------------
-- 7. NOTIFICATIONS
-- --------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications (user_id);

-- --------------------------------------------------------------------------
-- 8. KNOWLEDGE GAPS
-- --------------------------------------------------------------------------
create table if not exists public.knowledge_gaps (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  occurrences int not null default 1,
  region_id uuid references public.regions (id),
  last_user_id uuid references auth.users (id),
  resolved boolean not null default false,
  resolved_by uuid references auth.users (id),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- 9. PORTAL LINKS (region-specific links: Leave, Payroll, ESS …)
-- --------------------------------------------------------------------------
create table if not exists public.portal_links (
  id uuid primary key default gen_random_uuid(),
  region_id uuid references public.regions (id) on delete cascade,
  key text not null,
  label text not null,
  url text not null,
  icon text,
  created_at timestamptz not null default now(),
  unique (region_id, key)
);

-- --------------------------------------------------------------------------
-- 10. AUDIT LOGS
-- --------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id),
  action text not null,
  entity_type text,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- 11. SYSTEM SETTINGS
-- --------------------------------------------------------------------------
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  updated_by uuid references auth.users (id),
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- 12. HELPER FUNCTIONS
-- --------------------------------------------------------------------------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.profiles where user_id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_hr() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.profiles where user_id = auth.uid() and role in ('hr','admin')
  );
$$;

create or replace function public.current_region_id() returns uuid
language sql stable security definer set search_path = public as $$
  select region_id from public.profiles where user_id = auth.uid();
$$;

-- Trigger: auto-create profile row when an auth user is created
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_region_id uuid;
  v_region_code text;
begin
  v_region_code := coalesce(new.raw_user_meta_data->>'region_code', 'GLOBAL');
  select id into v_region_id from public.regions where code = v_region_code limit 1;

  insert into public.profiles (user_id, email, full_name, employee_id, department, role, region_id)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'employee_id',
    new.raw_user_meta_data->>'department',
    coalesce(new.raw_user_meta_data->>'role', 'employee'),
    v_region_id
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --------------------------------------------------------------------------
-- 13. RLS — Enable on all tables
-- --------------------------------------------------------------------------
alter table public.regions          enable row level security;
alter table public.profiles         enable row level security;
alter table public.policies         enable row level security;
alter table public.policy_regions   enable row level security;
alter table public.policy_versions  enable row level security;
alter table public.chat_threads     enable row level security;
alter table public.chat_messages    enable row level security;
alter table public.tickets          enable row level security;
alter table public.ticket_messages  enable row level security;
alter table public.notifications    enable row level security;
alter table public.knowledge_gaps   enable row level security;
alter table public.portal_links     enable row level security;
alter table public.audit_logs       enable row level security;
alter table public.settings         enable row level security;

-- Regions: readable by everyone authenticated
drop policy if exists "regions read" on public.regions;
create policy "regions read" on public.regions for select to authenticated using (true);
drop policy if exists "regions admin write" on public.regions;
create policy "regions admin write" on public.regions for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Profiles: self + admin
drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read" on public.profiles for select to authenticated
  using (user_id = auth.uid() or public.is_admin() or public.is_hr());
drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles for update to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
drop policy if exists "profiles admin insert" on public.profiles;
create policy "profiles admin insert" on public.profiles for insert to authenticated
  with check (public.is_admin() or user_id = auth.uid());

-- Policies: read by anyone whose region is in policy_regions OR GLOBAL; admin all
drop policy if exists "policies read scoped" on public.policies;
create policy "policies read scoped" on public.policies for select to authenticated using (
  public.is_admin()
  or exists (
    select 1
    from public.policy_regions pr
    join public.regions r on r.id = pr.region_id
    where pr.policy_id = policies.id
      and (r.id = public.current_region_id() or r.code = 'GLOBAL')
  )
);
drop policy if exists "policies admin write" on public.policies;
create policy "policies admin write" on public.policies for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "policy_regions read" on public.policy_regions;
create policy "policy_regions read" on public.policy_regions for select to authenticated using (true);
drop policy if exists "policy_regions admin write" on public.policy_regions;
create policy "policy_regions admin write" on public.policy_regions for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "policy_versions read" on public.policy_versions;
create policy "policy_versions read" on public.policy_versions for select to authenticated using (
  public.is_admin() or exists (
    select 1 from public.policy_regions pr
    join public.regions r on r.id = pr.region_id
    where pr.policy_id = policy_versions.policy_id
      and (r.id = public.current_region_id() or r.code = 'GLOBAL')
  )
);
drop policy if exists "policy_versions admin write" on public.policy_versions;
create policy "policy_versions admin write" on public.policy_versions for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Chat threads + messages: owner only (+ admin/HR may view when escalated via ticket)
drop policy if exists "threads owner" on public.chat_threads;
create policy "threads owner" on public.chat_threads for all to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "messages owner" on public.chat_messages;
create policy "messages owner" on public.chat_messages for all to authenticated
  using (
    public.is_admin() or exists (
      select 1 from public.chat_threads t
      where t.id = chat_messages.thread_id and t.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.chat_threads t
      where t.id = chat_messages.thread_id and t.user_id = auth.uid()
    )
  );

-- Tickets: creator OR HR/Admin in same region OR assigned_to
drop policy if exists "tickets read" on public.tickets;
create policy "tickets read" on public.tickets for select to authenticated using (
  created_by = auth.uid()
  or assigned_to = auth.uid()
  or public.is_admin()
  or (public.is_hr() and region_id = public.current_region_id())
);
drop policy if exists "tickets insert" on public.tickets;
create policy "tickets insert" on public.tickets for insert to authenticated
  with check (created_by = auth.uid());
drop policy if exists "tickets update" on public.tickets;
create policy "tickets update" on public.tickets for update to authenticated using (
  created_by = auth.uid()
  or assigned_to = auth.uid()
  or public.is_admin()
  or (public.is_hr() and region_id = public.current_region_id())
);

drop policy if exists "ticket_messages access" on public.ticket_messages;
create policy "ticket_messages access" on public.ticket_messages for all to authenticated
  using (
    public.is_admin() or exists (
      select 1 from public.tickets t
      where t.id = ticket_messages.ticket_id
        and (t.created_by = auth.uid() or t.assigned_to = auth.uid()
             or (public.is_hr() and t.region_id = public.current_region_id()))
    )
  )
  with check (author_id = auth.uid());

-- Notifications: self
drop policy if exists "notif self" on public.notifications;
create policy "notif self" on public.notifications for all to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- Knowledge gaps: admin/HR
drop policy if exists "kg read" on public.knowledge_gaps;
create policy "kg read" on public.knowledge_gaps for select to authenticated
  using (public.is_hr());
drop policy if exists "kg write admin" on public.knowledge_gaps;
create policy "kg write admin" on public.knowledge_gaps for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Portal links: read by region or GLOBAL
drop policy if exists "portal read" on public.portal_links;
create policy "portal read" on public.portal_links for select to authenticated using (
  public.is_admin()
  or region_id is null
  or region_id = public.current_region_id()
  or exists (select 1 from public.regions r where r.id = portal_links.region_id and r.code = 'GLOBAL')
);
drop policy if exists "portal admin write" on public.portal_links;
create policy "portal admin write" on public.portal_links for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Audit logs: admin only read
drop policy if exists "audit admin read" on public.audit_logs;
create policy "audit admin read" on public.audit_logs for select to authenticated
  using (public.is_admin());
drop policy if exists "audit insert" on public.audit_logs;
create policy "audit insert" on public.audit_logs for insert to authenticated
  with check (actor_id = auth.uid() or public.is_admin());

-- Settings: admin only
drop policy if exists "settings admin" on public.settings;
create policy "settings admin" on public.settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- --------------------------------------------------------------------------
-- 14. STORAGE BUCKET: policy_pdfs (private)
-- --------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
  values ('policy_pdfs', 'policy_pdfs', false)
  on conflict (id) do nothing;

drop policy if exists "policy_pdfs read" on storage.objects;
create policy "policy_pdfs read" on storage.objects for select to authenticated
  using (bucket_id = 'policy_pdfs');

drop policy if exists "policy_pdfs admin write" on storage.objects;
create policy "policy_pdfs admin write" on storage.objects for insert to authenticated
  with check (bucket_id = 'policy_pdfs' and public.is_admin());

drop policy if exists "policy_pdfs admin update" on storage.objects;
create policy "policy_pdfs admin update" on storage.objects for update to authenticated
  using (bucket_id = 'policy_pdfs' and public.is_admin());

drop policy if exists "policy_pdfs admin delete" on storage.objects;
create policy "policy_pdfs admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'policy_pdfs' and public.is_admin());

-- --------------------------------------------------------------------------
-- 15. SEED REGIONS
-- --------------------------------------------------------------------------
insert into public.regions (code, name, flag) values
  ('IN',     'India',         '🇮🇳'),
  ('US',     'United States', '🇺🇸'),
  ('UK',     'United Kingdom','🇬🇧'),
  ('ZA',     'South Africa',  '🇿🇦'),
  ('AT',     'Austria',       '🇦🇹'),
  ('SG',     'Singapore',     '🇸🇬'),
  ('CA',     'Canada',        '🇨🇦'),
  ('IE',     'Ireland',       '🇮🇪'),
  ('GLOBAL', 'Global',        '🌐')
on conflict (code) do nothing;
