-- Matcha Archive / Supabase schema
-- Public website reads visible rows. Admin writes should use server-side service role only.

create extension if not exists pgcrypto;

create table if not exists public.tea_brands (
  id text primary key default gen_random_uuid()::text,
  slug text unique not null,
  name text not null,
  japanese_name text,
  description_vi text,
  description_en text,
  origin_country text,
  origin_region text,
  logo_url text,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tea_products (
  id text primary key default gen_random_uuid()::text,
  slug text unique not null,
  name text not null,
  japanese_name text,
  brand_id text not null references public.tea_brands(id) on delete restrict,
  tea_type text not null default 'matcha' check (tea_type in ('matcha','hojicha','sencha','other')),
  origin_country text,
  origin_region text,
  description_vi text,
  description_en text,
  tasting_summary_vi text,
  tasting_summary_en text,
  aroma text,
  body_score smallint check (body_score between 1 and 5),
  umami_score smallint check (umami_score between 1 and 5),
  sweetness_score smallint check (sweetness_score between 1 and 5),
  bitterness_score smallint check (bitterness_score between 1 and 5),
  creaminess_score smallint check (creaminess_score between 1 and 5),
  finish text,
  tasting_notes text[] not null default '{}',
  recommended_for text[] not null default '{}',
  brewing_matcha_grams numeric(6,2),
  brewing_water_ml integer,
  brewing_temperature text,
  brewing_time text,
  price numeric(12,2),
  price_unit text,
  price_note text,
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  image_url text,
  gallery text[] not null default '{}',
  source_page integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tea_media (
  id text primary key default gen_random_uuid()::text,
  tea_product_id text references public.tea_products(id) on delete cascade,
  brand_id text references public.tea_brands(id) on delete cascade,
  public_id text,
  url text not null,
  resource_type text not null default 'image' check (resource_type in ('image','video','gif')),
  alt_text text,
  is_cover boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.tasting_notes (
  id text primary key default gen_random_uuid()::text,
  tea_product_id text not null references public.tea_products(id) on delete cascade,
  label text not null,
  category text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.brewing_guides (
  id text primary key default gen_random_uuid()::text,
  slug text unique not null,
  title text not null,
  japanese_name text,
  intro text,
  steps jsonb not null default '[]'::jsonb,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.homepage_content (
  id text primary key default gen_random_uuid()::text,
  section_key text unique not null,
  title text,
  eyebrow text,
  body text,
  payload jsonb not null default '{}'::jsonb,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  title text,
  body text,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tea_brands_set_updated_at on public.tea_brands;
create trigger tea_brands_set_updated_at before update on public.tea_brands for each row execute function public.set_updated_at();
drop trigger if exists tea_products_set_updated_at on public.tea_products;
create trigger tea_products_set_updated_at before update on public.tea_products for each row execute function public.set_updated_at();
drop trigger if exists brewing_guides_set_updated_at on public.brewing_guides;
create trigger brewing_guides_set_updated_at before update on public.brewing_guides for each row execute function public.set_updated_at();

alter table public.tea_brands enable row level security;
alter table public.tea_products enable row level security;
alter table public.tea_media enable row level security;
alter table public.tasting_notes enable row level security;
alter table public.brewing_guides enable row level security;
alter table public.homepage_content enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "public read visible tea brands" on public.tea_brands;
create policy "public read visible tea brands" on public.tea_brands for select using (is_visible = true);
drop policy if exists "public read visible tea products" on public.tea_products;
create policy "public read visible tea products" on public.tea_products for select using (is_visible = true);
drop policy if exists "public read tea media" on public.tea_media;
create policy "public read tea media" on public.tea_media for select using (true);
drop policy if exists "public read tasting notes" on public.tasting_notes;
create policy "public read tasting notes" on public.tasting_notes for select using (true);
drop policy if exists "public read brewing guides" on public.brewing_guides;
create policy "public read brewing guides" on public.brewing_guides for select using (is_visible = true);
drop policy if exists "public read homepage" on public.homepage_content;
create policy "public read homepage" on public.homepage_content for select using (is_visible = true);
-- site_settings is intentionally not publicly readable by default; expose only safe values via server code when needed.

create index if not exists tea_products_brand_id_idx on public.tea_products(brand_id);
create index if not exists tea_products_type_visible_idx on public.tea_products(tea_type, is_visible, sort_order);
create index if not exists tea_products_featured_idx on public.tea_products(is_featured, is_visible);
