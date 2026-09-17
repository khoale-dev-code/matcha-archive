# MIE MATCHA

A Japanese editorial matcha discovery website built with Next.js 16 App Router, React, TypeScript, Tailwind CSS v4, Supabase, Cloudinary, Lucide and Motion for React.

This project is intentionally **not ecommerce**. There is no cart, checkout, quantity, purchase CTA, discount system or stock UI. Price is informational only and stays secondary to tasting/origin/ritual.

## 1. Sitemap

Public routes:

- `/` — editorial homepage
- `/matcha` — Matcha Library with search/filter
- `/matcha/[slug]` — sourced matcha tasting profile
- `/brands` — Brand Archive
- `/brands/[slug]` — tea house profile + related tea profiles
- `/guide` — brewing / ritual education
- `/about` — archive philosophy
- `/contact` — editorial contact
- `/tea/[slug]` — separate route for non-matcha tea such as Hojicha, so Hojicha is never mislabeled as Matcha

Admin routes:

- `/admin`
- `/admin/matcha`
- `/admin/brands`
- `/admin/guide`
- `/admin/homepage`
- `/admin/about`
- `/admin/media`
- `/admin/settings`

## 2. User journey

Visitor → discovers tea houses → opens Matcha Library → searches/filters by sourced tasting language → opens a profile → reads the source tasting note → checks tasting score only when scored data exists → sees aroma/finish → checks brewing data only when verified → reads brand region context → continues to another profile.

Missing source data never becomes guessed content. The UI uses `Pending`, `Chưa cập nhật` or a source-aware empty state.

## 3. Design system

Primary page background: `#EDEAE5`.

- Soft matcha: `#D0E0B3`
- Matcha green: `#75A35B`
- Tea brown: `#3B2C19`
- Dark green: `#315C43`
- Olive: `#829A35`
- Warm off-white: `#F4F1EB`
- Muted stone: `#D9D6CF`

Typography is loaded with a non-blocking browser stylesheet:

- Cormorant Garamond — editorial display/headings
- Noto Serif JP — Japanese typography
- Be Vietnam Pro — body/UI/Admin

Visual language: asymmetric editorial grid, large typography, paper grain, tea-tool illustration, restrained geometric line art and purposeful negative space. Motion uses `motion/react` with `prefers-reduced-motion` support.

## 4. Source data policy

`matcha.docx` is the seed source. The project includes **13 tea profiles** and **5 brands** transcribed from the document:

- Marukyu Koyamaen: Isuzu, Chigi no Shiro, Yugen, Wako, Kinrin, Unkaku
- Ishimoto: Wako, Nishiki
- Shogyokuen: Izumi no Shiro
- Atami Tea Store: Seiyousha
- Waba Tea: Tsuki (MH2), Hana (MH3)
- Hojicha type A / Marukyu Koyamaen is stored as `tea_type = hojicha`, not as Matcha

The original Vietnamese and English tasting statements are preserved in the seed. Source spelling such as `bolied`, `bitterbess`, `subtie`, `sweetnes` and `reamarkable` is intentionally retained in source-preserved English tasting fields rather than silently corrected.

The source does **not** provide numeric 1–5 tasting scores, per-product brewing ratios or prices. Those fields are therefore `NULL` / empty in seed data. Admin sliders and forms are ready for verified additions later.

Brand region is shown separately from product origin. A brand being based in Uji does not automatically force a product-level origin value.

## 5. Database model

Supabase tables:

- `tea_brands`
- `tea_products`
- `tea_media`
- `tasting_notes`
- `brewing_guides`
- `homepage_content`
- `site_settings`

Run:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

Public RLS only exposes visible editorial content. Admin mutations use `SUPABASE_SERVICE_ROLE_KEY` **server-side only**.

## 6. Component architecture

- `components/home/*` — Hero, intro, tasting spectrum, brand archive, brewing ritual, journal
- `components/matcha/*` — Matcha card + interactive library/filter drawer
- `components/tasting/*` — profile meters / source-aware score state
- `components/brewing/*` — how-to-enjoy block
- `components/brands/*` — origin/brand context
- `components/admin/*` — CRUD editor, brand manager, media uploader, content editor
- `components/ui/*` — Header, Footer, buttons/headings, price reference, Motion reveal
- `lib/data/*` — seed + Supabase repository fallback
- `lib/supabase/*` — public/admin clients
- `lib/cloudinary/*` — Cloudinary URL optimization helper
- `lib/types/*` — typed data model

## 7. Setup

```powershell
Copy-Item .env.example .env.local
npm install
npm run verify
npm run dev
```

Open `http://localhost:3000`.

Without Supabase environment variables, public pages automatically use local seed data and Admin opens in seed preview mode. Admin writes require Supabase configuration.

## 8. Supabase

Create a Supabase project, run `schema.sql`, then `seed.sql`, and fill:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Never expose the service role key in client components.

## 9. Cloudinary

Set:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=matcha-archive
```

Admin Media uses `/api/cloudinary/sign` for signed upload and `/api/cloudinary/delete` for server-side deletion. Secrets stay on the server. Use transformed delivery URLs (`f_auto,q_auto,c_limit`) when connecting uploaded assets to content.

## 10. Vercel

`vercel.json` pins the project region to `sin1`.

Add all environment variables in Vercel Project Settings and set:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

Public pages use ISR (`revalidate = 180`). Admin/API routes use dynamic/no-store behavior.

## 11. Windows PowerShell bootstrap

`CREATE-MATCHA-WEBSITE.ps1` creates a clean sibling copy of the project source, verifies the source tree, installs dependencies, clears cache and runs a production build.

```powershell
powershell -ExecutionPolicy Bypass -File .\CREATE-MATCHA-WEBSITE.ps1
```

To select a name:

```powershell
powershell -ExecutionPolicy Bypass -File .\CREATE-MATCHA-WEBSITE.ps1 -ProjectName "my-matcha-archive"
```

If the target exists, explicitly add `-Overwrite`.

## 12. Verification

`npm run verify` checks required routes, expected seed count and core public UI for ecommerce CTAs.

Production verification should finish with:

```powershell
npm run build
```

## 13. Content / accessibility / performance notes

- `next/image` is used for product and brand visuals.
- Cloudinary remote images are allowlisted in `next.config.ts`.
- Videos are only uploaded/previewed in Admin; public autoplay/preload is intentionally not introduced.
- Mobile filters become a drawer, detail grids collapse deliberately and Japanese display type is clamped to avoid overflow.
- Motion respects reduced-motion settings.
- SEO uses metadata, canonical URLs, OpenGraph, `sitemap.ts`, `robots.ts` and `Article` structured data for tasting profiles. Ecommerce `Product` schema is deliberately not used.

---

## Bilingual UI (VI / EN) - App Router

This version uses `next-i18next` v16 on top of `i18next` / `react-i18next`, adapted for Next.js 16 App Router.

### URL strategy

Vietnamese is the default language and keeps clean canonical URLs:

- `/`
- `/matcha`
- `/brands`
- `/admin`

English uses an explicit locale prefix:

- `/en`
- `/en/matcha`
- `/en/brands`
- `/en/admin`

The language switcher preserves the current route and query string. Public pages include locale-aware canonical / hreflang metadata and the sitemap emits both language versions.

### Translation resources

- `app/i18n/locales/vi/common.json`
- `app/i18n/locales/en/common.json`
- `i18n.config.ts`
- `i18n.server.ts`
- `proxy.ts`

Do not auto-translate source tasting facts. The public UI prefers the selected language and falls back only when source-backed content exists in the other language. Missing source facts may remain blank for Admin enrichment.

## Admin UX v2

The Admin workspace now includes:

- active sidebar state
- Supabase connection / seed-preview badge
- VI / EN interface switcher
- searchable Tea Profile and Brand lists
- content completeness indicators for VI and EN
- dedicated VI and EN content tabs
- tasting score tab with nullable 1-5 controls
- brewing / reference-price tab
- media / publish tab
- unsaved-changes state
- browser exit warning for dirty forms
- `Ctrl+S` / `Cmd+S` save shortcut
- success / error snackbar
- preview link to the public profile
- source-integrity reminder so missing facts are not invented
- bilingual Homepage / Guide / About / Settings content stored in `site_settings.payload.i18n`

## After applying the i18n/Admin patch

```powershell
npm install
Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
npm run verify
npm run build
npm run dev
```

Then check:

- VI website: `http://localhost:3000`
- EN website: `http://localhost:3000/en`
- VI Admin: `http://localhost:3000/admin`
- EN Admin: `http://localhost:3000/en/admin`
#   m a t c h a - a r c h i v e  
 