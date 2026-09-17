import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const fail = (message) => {
  console.error(`\nVERIFY FAILED\n${message}\n`);
  process.exit(1);
};

const required = [
  "app/[lng]/layout.tsx",
  "app/[lng]/(site)/page.tsx",
  "app/[lng]/(site)/matcha/page.tsx",
  "app/[lng]/(site)/matcha/[slug]/page.tsx",
  "app/[lng]/(site)/brands/page.tsx",
  "app/[lng]/(site)/brands/[slug]/page.tsx",
  "app/[lng]/(site)/guide/page.tsx",
  "app/[lng]/(site)/about/page.tsx",
  "app/[lng]/(site)/contact/page.tsx",
  "app/[lng]/admin/page.tsx",
  "components/home/HomePage.tsx",
  "components/home/HomePage.module.css",
  "components/brands/BrandArchive.tsx",
  "components/brands/BrandArchive.module.css",
  "components/ui/SiteHeader.module.css",
  "components/admin/HomepageMediaEditor.module.css",
  "app/i18n/locales/vi/common.json",
  "app/i18n/locales/en/common.json",
  "i18n.config.ts",
  "proxy.ts",
  "supabase/schema.sql",
  "supabase/seed.sql",
  ".env.example",
  "vercel.json",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) fail(`Missing required files:\n${missing.join("\n")}`);

for (const locale of ["vi", "en"]) {
  const file = path.join(root, `app/i18n/locales/${locale}/common.json`);
  try {
    JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    fail(`Invalid JSON: ${file}\n${error instanceof Error ? error.message : String(error)}`);
  }
}

const homeEntry = fs.readFileSync(path.join(root, "app/[lng]/(site)/page.tsx"), "utf8");
if (!homeEntry.includes('@/components/home/HomePage')) {
  fail("Homepage entry is not using components/home/HomePage.");
}
const legacyHomeImports = [
  "@/components/home/HomeHero",
  "@/components/home/HomeDiscovery",
  "@/components/home/HomeFeaturedCard",
  "@/components/home/TastingSpectrum",
  "@/components/home/MatchaStoryBand",
  "@/components/home/BrewingRitual",
  "@/components/home/JournalSection",
  "@/components/home/MatchaIntro",
];
for (const legacyImport of legacyHomeImports) {
  if (homeEntry.includes(legacyImport)) fail(`Homepage entry still imports legacy module: ${legacyImport}`);
}

const homepageSource = fs.readFileSync(path.join(root, "components/home/HomePage.tsx"), "utf8");

const activeHomepageSources = [
  ["app/[lng]/(site)/page.tsx", homeEntry],
  ["components/home/HomePage.tsx", homepageSource],
];

function collectModulePaths(source) {
  const paths = [];

  const fromPattern = /\bfrom\s+["']([^"']+)["']/g;
  const sideEffectPattern = /^\s*import\s*["']([^"']+)["']/gm;
  const dynamicImportPattern = /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;

  for (const pattern of [
    fromPattern,
    sideEffectPattern,
    dynamicImportPattern,
  ]) {
    for (const match of source.matchAll(pattern)) {
      paths.push(match[1]);
    }
  }

  return [...new Set(paths)];
}

function isForbiddenHomepageModulePath(modulePath) {
  return (
    modulePath.includes(".backup-") ||
    modulePath.includes("MIE-MATCHA-") ||
    modulePath.includes("MATCHA-") ||
    /^@\/components\/home\/v\d+(?:\/|$)/i.test(modulePath)
  );
}

for (const [file, source] of activeHomepageSources) {
  for (const modulePath of collectModulePaths(source)) {
    if (isForbiddenHomepageModulePath(modulePath)) {
      fail(
        `Active Homepage imports forbidden legacy/patch source: ${file} -> ${modulePath}`,
      );
    }
  }
}
if (!/export\s+async\s+function\s+HomePage|export\s+function\s+HomePage/.test(homepageSource)) {
  fail("components/home/HomePage.tsx must export HomePage.");
}
if (!homepageSource.includes("getHomepageFeaturedMatcha") || !homepageSource.includes("resolveProductMedia")) {
  fail("Homepage must use curated product media resolution for featured Matcha photography.");
}
if (homepageSource.includes("function getProductImage(")) {
  fail("Legacy direct product.image_url homepage resolver is still present.");
}

const productMediaSource = fs.readFileSync(path.join(root, "lib/data/product-media.ts"), "utf8");
for (const asset of [
  "isuzu.webp",
  "chigi-no-shiro.webp",
  "yugen.webp",
  "wako.webp",
  "kinrin.webp",
  "unkaku.webp",
]) {
  const file = path.join(root, "public/images/tea/marukyu", asset);
  if (!fs.existsSync(file)) fail(`Missing curated homepage product photo: ${file}`);
  if (!productMediaSource.includes(`/images/tea/marukyu/${asset}`)) {
    fail(`Product media resolver is not using optimized asset: ${asset}`);
  }
}

const homepageCss = fs.readFileSync(path.join(root, "components/home/HomePage.module.css"), "utf8");
for (const rule of ["word-break: keep-all", "overflow-wrap: normal", "hyphens: none"]) {
  if (!homepageCss.includes(rule)) fail(`Homepage typography guard missing: ${rule}`);
}

const globals = fs.readFileSync(path.join(root, "app/globals.css"), "utf8");
const removedLegacyMarkers = [
  "MATCHA HOME V3",
  "MATCHA HOME V4",
  "MATCHA HOME V5 MOCKUP",
  "MATCHA HOME V5.1",
  "MATCHA HOME V6",
  "MATCHA HOME V8",
  "MATCHA HOME V9",
  "MATCHA HOME V10",
  "MATCHA HOME V11",
  "MATCHA HOME V12",
  "MATCHA HOME V12.1",
];
for (const marker of removedLegacyMarkers) {
  if (globals.includes(marker)) fail(`Legacy homepage CSS marker still present: ${marker}`);
}
if (/MATCHA HOME V\d/i.test(globals)) fail("A versioned MATCHA HOME CSS marker is still present in app/globals.css.");
if (!globals.includes("/* SITE FOUNDATION TUNING START */")) {
  fail("Stable site foundation tuning block is missing from app/globals.css.");
}
if (!globals.includes('html[lang="vi"] .page-title') || !globals.includes("word-break: keep-all")) {
  fail("Global Vietnamese typography safety rules are missing.");
}



const homepageMediaConfig = fs.readFileSync(path.join(root, "lib/data/homepage-media.shared.ts"), "utf8");
const homepageDefaultMediaBlock = homepageMediaConfig.split("const LEGACY_DEFAULT_URLS")[0];
if (homepageDefaultMediaBlock.includes("/images/home/v10/") || homepageDefaultMediaBlock.includes("/images/home/user/")) {
  fail("Homepage default media still uses versioned/user asset folders instead of semantic asset paths.");
}

const homepageMediaEditorSource = fs.readFileSync(path.join(root, "components/admin/HomepageMediaEditor.tsx"), "utf8");
if (!homepageMediaEditorSource.includes('import styles from "./HomepageMediaEditor.module.css"')) {
  fail("HomepageMediaEditor is not using HomepageMediaEditor.module.css.");
}
if (homepageMediaEditorSource.includes("admin-home-media")) {
  fail("HomepageMediaEditor still contains legacy admin-home-media class names.");
}
if (globals.includes("admin-home-media") || globals.includes("admin-page--homepage")) {
  fail("Legacy Homepage Admin CSS is still present in app/globals.css.");
}

const siteHeaderSource = fs.readFileSync(path.join(root, "components/ui/SiteHeader.tsx"), "utf8");
if (siteHeaderSource.includes("site-header-v5")) fail("SiteHeader still contains versioned V5 class names.");
if (!siteHeaderSource.includes('import styles from "./SiteHeader.module.css"')) {
  fail("SiteHeader is not using SiteHeader.module.css.");
}
if (globals.includes("site-header-v5")) fail("Versioned SiteHeader V5 CSS is still present in app/globals.css.");

const legacyPaths = [
  "components/home/v13",
  "components/home/HomeHero.tsx",
  "components/home/HomeDiscovery.tsx",
  "components/home/HomeFeaturedCard.tsx",
  "components/home/TastingSpectrum.tsx",
  "components/home/MatchaStoryBand.tsx",
  "components/home/BrewingRitual.tsx",
  "components/home/JournalSection.tsx",
  "components/home/MatchaIntro.tsx",
];
const leftovers = legacyPaths.filter((item) => fs.existsSync(path.join(root, item)));
if (leftovers.length) fail(`Legacy homepage source still present:\n${leftovers.join("\n")}`);

const textExtensions = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".css", ".md", ".sql"]);
const ignoredDirs = new Set(["node_modules", ".next", ".git", ".vercel", "out"]);

function shouldIgnoreDirectory(name) {
  return (
    ignoredDirs.has(name) ||
    name.startsWith(".backup-") ||
    name.startsWith("MIE-MATCHA-") ||
    name.startsWith("MATCHA-")
  );
}
const suspicious = [
  "\uFFFD",
  "\u00C3\u00A1",
  "\u00C3\u00A0",
  "\u00C3\u00A2",
  "\u00C3\u00A3",
  "\u00C3\u00A9",
  "\u00C3\u00AA",
  "\u00C3\u00AD",
  "\u00C3\u00B3",
  "\u00C3\u00B4",
  "\u00C3\u00BA",
  "\u00C4\u2018",
  "\u00C4\u2010",
  "\u00C6\u00A1",
  "\u00C6\u00B0",
  "\u00E1\u00BA",
  "\u00E1\u00BB",
  "\u00E2\u20AC\u2122",
  "\u00E2\u20AC\u0153",
  "\u00E2\u20AC\u009D",
  "\u00E2\u20AC\u201C",
  "\u00E2\u20AC\u201D",
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (shouldIgnoreDirectory(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (textExtensions.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}


const brandArchiveSource = fs.readFileSync(path.join(root, "components/brands/BrandArchive.tsx"), "utf8");
if (!brandArchiveSource.includes('import styles from "./BrandArchive.module.css"')) {
  fail("BrandArchive is not using BrandArchive.module.css.");
}
if (brandArchiveSource.includes("--v3") || brandArchiveSource.includes("brand-row--v3")) {
  fail("BrandArchive still contains versioned V3 class names.");
}

const appAndComponents = walk(path.join(root, "app")).concat(walk(path.join(root, "components")));
for (const file of appAndComponents) {
  const content = fs.readFileSync(file, "utf8");
  if (content.includes("@/components/home/BrandArchive")) {
    fail(`Legacy BrandArchive import remains in ${path.relative(root, file)}`);
  }
}
for (const file of walk(root)) {
  const content = fs.readFileSync(file, "utf8");
  if (content !== content.normalize("NFC")) {
    fail(`Non-NFC Unicode found: ${path.relative(root, file)}`);
  }
  for (const token of suspicious) {
    if (content.includes(token)) {
      fail(`Suspicious Unicode/mojibake token ${JSON.stringify(token)} in ${path.relative(root, file)}`);
    }
  }
}

const seed = fs.readFileSync(path.join(root, "lib/data/seed.ts"), "utf8");
const productCount = [...seed.matchAll(/id: "tea-/g)].length;
const brandCount = [...seed.matchAll(/id: "brand-/g)].length;
if (productCount !== 13 || brandCount < 5) {
  fail(`Unexpected seed counts: ${productCount} tea profiles, ${brandCount} brand refs.`);
}

const publicFiles = [
  "components/matcha/MatchaCard.tsx",
  "components/ui/SiteHeader.tsx",
  "components/home/HomePage.tsx",
  "app/[lng]/(site)/matcha/page.tsx",
];
const banned = [/Add to Cart/i, /Buy Now/i, /Checkout/i];
for (const file of publicFiles) {
  const content = fs.readFileSync(path.join(root, file), "utf8");
  for (const pattern of banned) {
    if (pattern.test(content)) fail(`Ecommerce CTA found in ${file}: ${pattern}`);
  }
}

console.log(
  `Source verification passed: ${productCount} tea profiles, ${brandCount} source brands, clean homepage architecture, NFC Unicode and Vietnamese typography guards present.`,
);
