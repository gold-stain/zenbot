-- ============================================================================
-- ZenBot Employee Assistant — Expanded Profile Metadata
-- Adds richer employee-service details used by the Profile section.
-- ============================================================================

alter table public.profiles
  add column if not exists preferred_name text,
  add column if not exists pronouns text,
  add column if not exists job_title text,
  add column if not exists manager_name text,
  add column if not exists manager_email text,
  add column if not exists phone text,
  add column if not exists work_location text,
  add column if not exists timezone text,
  add column if not exists language text,
  add column if not exists start_date date,
  add column if not exists employment_type text,
  add column if not exists cost_center text,
  add column if not exists skills text[] not null default '{}',
  add column if not exists working_hours text,
  add column if not exists emergency_contact_name text,
  add column if not exists emergency_contact_phone text,
  add column if not exists bio text;

create index if not exists profiles_manager_email_idx on public.profiles (manager_email);
create index if not exists profiles_job_title_idx on public.profiles (job_title);

-- Region is intentionally admin-managed. Employees can update their profile,
-- but cannot move themselves between region scopes.
create or replace function public.lock_profile_region_for_non_admin()
returns trigger
language plpgsql
security definer
set search_path = public as $$
begin
  if old.region_id is distinct from new.region_id and not public.is_admin() then
    raise exception 'Only admins can change a user region';
  end if;
  return new;
end;
$$;

drop trigger if exists lock_profile_region_for_non_admin on public.profiles;
create trigger lock_profile_region_for_non_admin
  before update of region_id on public.profiles
  for each row execute function public.lock_profile_region_for_non_admin();

-- Public avatar bucket. Object names are scoped by user id in the app.
insert into storage.buckets (id, name, public)
  values ('profile_avatars', 'profile_avatars', true)
  on conflict (id) do update set public = true;

drop policy if exists "profile_avatars read" on storage.objects;
create policy "profile_avatars read" on storage.objects for select to public
  using (bucket_id = 'profile_avatars');

drop policy if exists "profile_avatars user insert" on storage.objects;
create policy "profile_avatars user insert" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'profile_avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "profile_avatars user update" on storage.objects;
create policy "profile_avatars user update" on storage.objects for update to authenticated
  using (
    bucket_id = 'profile_avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'profile_avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "profile_avatars user delete" on storage.objects;
create policy "profile_avatars user delete" on storage.objects for delete to authenticated
  using (
    bucket_id = 'profile_avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
