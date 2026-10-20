-- Run this in the Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  role text not null default 'editor' check (role in ('admin','editor')),
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text unique not null,
  setting_value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text not null default 'ព័ត៌មានវត្ត',
  excerpt text not null default '',
  body text not null default '',
  image_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  location text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz,
  image_url text,
  published boolean not null default false,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  caption text not null default '',
  image_url text not null,
  category_id uuid references public.gallery_categories(id) on delete set null,
  published boolean not null default false,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null,
  contact text not null,
  message text not null,
  status text not null default 'new' check (status in ('new','read','closed')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.news enable row level security;
alter table public.events enable row level security;
alter table public.gallery_categories enable row level security;
alter table public.gallery_images enable row level security;
alter table public.contact_messages enable row level security;

-- Public visitors can read published content only.
create policy "Public read published news" on public.news for select using (published = true);
create policy "Public read published events" on public.events for select using (published = true);
create policy "Public read published gallery" on public.gallery_images for select using (published = true);
create policy "Public read gallery categories" on public.gallery_categories for select using (true);

-- Admin/editor policies are role-based. Create a profile row for each trusted editor.
create or replace function public.is_editor()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','editor')) $$;

create policy "Editors manage news" on public.news for all using (public.is_editor()) with check (public.is_editor());
create policy "Editors manage events" on public.events for all using (public.is_editor()) with check (public.is_editor());
create policy "Editors manage gallery" on public.gallery_images for all using (public.is_editor()) with check (public.is_editor());
create policy "Editors manage categories" on public.gallery_categories for all using (public.is_editor()) with check (public.is_editor());
create policy "Editors manage settings" on public.site_settings for all using (public.is_editor()) with check (public.is_editor());
create policy "Editors read contact messages" on public.contact_messages for select using (public.is_editor());
create policy "Editors update contact messages" on public.contact_messages for update using (public.is_editor()) with check (public.is_editor());
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Admins manage profiles" on public.profiles for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- IMPORTANT:
-- Add a trusted admin profile manually after creating the user in Supabase Auth.
-- Do not expose a service_role key in frontend code.
-- Configure a private Storage bucket (e.g. temple-gallery) and storage policies separately.
