-- Enable Extensions
create extension if not exists "uuid-ossp";

-- Profiles Table (Admin Role Management)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  role text not null check (role in ('admin', 'user')) default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Assets Table (File Metadata)
create table assets (
  id uuid default uuid_generate_v4() primary key,
  bucket text not null,
  path text not null,
  mime_type text,
  size bigint,
  kind text not null check (kind in ('image', 'pdf', 'audio', 'other')),
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);
create unique index assets_bucket_path_idx on assets (bucket, path);

-- Site Settings (Singleton)
create table site_settings (
  singleton boolean primary key default true check (singleton),
  profile_asset_id uuid references assets(id),
  resume_asset_id uuid references assets(id),
  updated_at timestamptz default now()
);

-- Single Pages (Home, Intro, Contact)
create table pages (
  id uuid default uuid_generate_v4() primary key,
  slug text not null unique check (slug in ('home', 'introduction', 'contact')),
  title text,
  content jsonb not null default '{}'::jsonb,
  hero_asset_id uuid references assets(id),
  updated_at timestamptz default now()
);

-- Works (Projects)
create table works (
  id uuid default uuid_generate_v4() primary key,
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content jsonb not null default '{}'::jsonb,
  thumbnail_asset_id uuid references assets(id),
  year int,
  category text,
  tags text[] default array[]::text[],
  published boolean not null default true,
  published_at date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index works_published_idx on works (published, year, published_at);

-- Blogs (Articles)
create table blogs (
  id uuid default uuid_generate_v4() primary key,
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content jsonb not null default '{}'::jsonb,
  cover_asset_id uuid references assets(id),
  tags text[] default array[]::text[],
  published boolean not null default true,
  published_at date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index blogs_published_idx on blogs (published, published_at desc);

-- Page Views (Analytics)
create table page_views (
  id bigserial primary key,
  entity_type text not null check (entity_type in ('page', 'work', 'blog', 'resume')),
  entity_id uuid, -- nullable for resume/static pages if needed
  path text not null,
  session_id uuid not null,
  viewed_on date not null default current_date,
  user_agent text,
  referrer text,
  created_at timestamptz default now()
);
create index page_views_idx on page_views (entity_type, entity_id, viewed_on);
alter table page_views add constraint page_views_dedupe_unique unique (entity_type, coalesce(entity_id, '00000000-0000-0000-0000-000000000000'::uuid), path, session_id, viewed_on);


-- RLS Policies

-- Helper function to check if user is admin
create or replace function is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Enable RLS
alter table profiles enable row level security;
alter table assets enable row level security;
alter table site_settings enable row level security;
alter table pages enable row level security;
alter table works enable row level security;
alter table blogs enable row level security;
alter table page_views enable row level security;

-- Profiles: 
-- Public read (needed to verify admin status? No, verify via function). 
-- Actually, user can read own profile. Admin can read all.
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Admins can read all profiles" on profiles for select using (is_admin());
-- Only service role can create profiles (via trigger) or admin.
create policy "Admins can update profiles" on profiles for update using (is_admin());

-- Assets:
-- Public read
create policy "Public can view assets" on assets for select using (true);
-- Admin write
create policy "Admins can insert assets" on assets for insert with check (is_admin());
create policy "Admins can update assets" on assets for update using (is_admin());
create policy "Admins can delete assets" on assets for delete using (is_admin());

-- Site Settings:
-- Public read
create policy "Public read site settings" on site_settings for select using (true);
-- Admin write
create policy "Admins update site settings" on site_settings for update using (is_admin());
create policy "Admins insert site settings" on site_settings for insert with check (is_admin());

-- Pages:
-- Public read
create policy "Public read pages" on pages for select using (true);
-- Admin write
create policy "Admins write pages" on pages for all using (is_admin());

-- Works:
-- Public read published only
create policy "Public read published works" on works for select using (published = true);
-- Admin read all
create policy "Admins read all works" on works for select using (is_admin());
-- Admin write
create policy "Admins write works" on works for all using (is_admin());

-- Blogs:
-- Public read published only
create policy "Public read published blogs" on blogs for select using (published = true);
-- Admin read all
create policy "Admins read all blogs" on blogs for select using (is_admin());
-- Admin write
create policy "Admins write blogs" on blogs for all using (is_admin());

-- Page Views:
-- Public insert (Web analytics)
create policy "Public insert page views" on page_views for insert with check (true);
-- Admin read
create policy "Admins read page views" on page_views for select using (is_admin());


-- Triggers for Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Automatic updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_works_modtime before update on works for each row execute procedure update_updated_at_column();
create trigger update_blogs_modtime before update on blogs for each row execute procedure update_updated_at_column();
create trigger update_pages_modtime before update on pages for each row execute procedure update_updated_at_column();
create trigger update_site_settings_modtime before update on site_settings for each row execute procedure update_updated_at_column();

-- Initialize Site Settings
insert into site_settings (singleton) values (true) on conflict do nothing;

-- Initialize Pages
insert into pages (slug, title) values 
  ('home', 'Home'), 
  ('introduction', 'Introduction'), 
  ('contact', 'Contact') 
on conflict do nothing;
