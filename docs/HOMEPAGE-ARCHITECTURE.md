# Clean homepage architecture

Production code uses stable semantic names. Do not create `v13`, `v14`, `v15` folders or append version suffixes to CSS classes.

```text
components/
  home/
    HomePage.tsx
    HomePage.module.css
  brands/
    BrandArchive.tsx
    BrandArchive.module.css
    OriginStory.tsx
  ui/
    SiteHeader.tsx
    SiteHeader.module.css
    SiteFooter.tsx
  admin/
    HomepageMediaEditor.tsx
    HomepageMediaEditor.module.css
```

## Ownership rules

- `app/[lng]/(site)/page.tsx` is only the route entry and renders `HomePage`.
- Homepage-only layout/style belongs in `components/home/HomePage.*`.
- Brand archive UI belongs in `components/brands/BrandArchive.*`, because it is reused by the Brands route and is not Homepage-only.
- Header-only styling belongs in `components/ui/SiteHeader.module.css`.
- `app/globals.css` contains only shared site/Admin foundations that are truly cross-route.
- New production code must use semantic names, not `--v3`, `--v5`, `hero12`, or a version folder.

## Vietnamese text safety

Text source must be UTF-8 without BOM and NFC normalized.

Large Vietnamese editorial headings must keep words intact:

```css
word-break: keep-all;
overflow-wrap: normal;
hyphens: none;
```

Do not use a single `A-with-tilde`/`A-with-circumflex` character as a corruption detector because these can be legitimate Vietnamese characters. Verification checks suspicious mojibake byte-decoding sequences instead.

## Global CSS

The old stacked Homepage V3-V12 blocks are removed. Shared typography behavior that still affects About, Brand detail, Matcha detail and other routes is retained under the semantic marker:

```text
SITE FOUNDATION TUNING
```

The old V6 block is removed as well. `HomepageMediaEditor` owns its visual rules through `HomepageMediaEditor.module.css`, so `app/globals.css` no longer has to carry Homepage-specific Admin styling.

## Asset folders

New default Homepage media uses semantic folders:

```text
public/images/home/hero/
public/images/home/tasting/
public/images/home/story/
public/images/home/journal/
public/images/home/ritual/
```

The patch creates these as copies/aliases from the old `user` and `v10` paths, then updates `DEFAULT_HOMEPAGE_MEDIA`. The old files remain temporarily so URLs already persisted in Supabase `site_settings.payload.media` keep working. Remove the compatibility folders only after a deliberate database media-path migration.
