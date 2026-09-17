# Source audit — matcha.docx

Seed content was transcribed from the provided five-page document.

| Source page | Brand / section | Seeded profiles |
|---|---|---|
| 1 | Marukyu Koyamaen | Isuzu, Chigi no Shiro, Yugen, Wako |
| 2 | Marukyu Koyamaen / Ishimoto | Kinrin, Unkaku, Wako, Nishiki |
| 3 | Shogyokuen / Atami Tea Store | Izumi no Shiro, Seiyousha |
| 4 | Hojicha | Hojicha type A / Marukyu Koyamaen |
| 5 | Waba Tea | Tsuki (MH2), Hana (MH3) |

## Explicitly left blank

- Numeric body / umami / sweetness / bitterness / creaminess scores: source has prose, not a 1–5 scale.
- Per-profile brewing grams / water / temperature / whisk time: not supplied in source.
- Reference prices: not supplied in source.
- Product-level origin region: left null when the source only describes the brand/tea-house region rather than the specific product origin.

## Source-preserved English spelling

The seed intentionally keeps source spellings in the source-preserved English tasting field, including `subtie`, `bolied`, `bitterbess`, `sweetnes` and `reamarkable`. Display tags may normalize concepts for UI navigation, but do not replace the source tasting statement.

## Hojicha separation

Hojicha type A is stored with `tea_type = hojicha` and resolves to `/tea/[slug]`, not the `/matcha` library. This prevents Hojicha from being presented as Matcha.
