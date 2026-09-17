"use client";

import { Filter, Search, X } from "lucide-react";
import { useT } from "next-i18next/client";
import { useMemo, useState } from "react";
import type { TeaProduct } from "@/lib/types/tea";
import { MatchaCard } from "@/components/matcha/MatchaCard";

function detectLevel(product: TeaProduct, dimension: "body" | "umami" | "bitterness" | "sweetness") {
  const text = `${product.tasting_summary_vi ?? ""} ${product.tasting_summary_en ?? ""}`.toLowerCase();
  if (dimension === "body") {
    if (/light body|light bodied|vị trà nhẹ/.test(text)) return "Light";
    if (/medium body|đậm trà trung bình|vừa phải/.test(text)) return "Medium";
    if (/dense body|đậm trà|body dày/.test(text)) return "Rich";
  }
  if (dimension === "umami") {
    if (/medium umami|umami trung bình|balanced umami/.test(text)) return "Medium";
    if (/thick umami|rich and thick umami|umami dày|umami đậm/.test(text)) return "High";
    if (/simple umami|umami đơn giản/.test(text)) return "Gentle";
  }
  if (dimension === "bitterness") {
    if (/little to no bitterness|gần như không đắng|không đắng chát/.test(text)) return "Very low";
    if (/low bitterness|đắng nhẹ|ít đắng/.test(text)) return "Low";
    if (/refined bitterness|đắng tinh tế/.test(text)) return "Refined";
  }
  if (dimension === "sweetness") {
    if (/soft sweet|ngọt dịu/.test(text)) return "Soft";
    if (/sweet finish|hậu ngọt|sweetness|ngọt kéo dài|ngọt mượt/.test(text)) return "Sweet";
  }
  return "Unspecified";
}

type Option = { value: string; label: string };

export function MatchaLibrary({ products }: { products: TeaProduct[] }) {
  const { t } = useT("common");
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("All");
  const [origin, setOrigin] = useState("All");
  const [body, setBody] = useState("All");
  const [umami, setUmami] = useState("All");
  const [bitterness, setBitterness] = useState("All");
  const [sweetness, setSweetness] = useState("All");
  const [drawer, setDrawer] = useState(false);

  const brands = useMemo(() => ["All", ...Array.from(new Set(products.map((item) => item.brand?.name).filter(Boolean) as string[]))], [products]);
  const origins = useMemo(() => ["All", ...Array.from(new Set(products.map((item) => item.brand?.origin_region).filter(Boolean) as string[]))], [products]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const haystack = [
        product.name,
        product.japanese_name,
        product.brand?.name,
        product.brand?.origin_region,
        product.tasting_summary_vi,
        product.tasting_summary_en,
        ...product.tasting_notes,
      ].filter(Boolean).join(" ").toLowerCase();
      return (
        (!normalized || haystack.includes(normalized)) &&
        (brand === "All" || product.brand?.name === brand) &&
        (origin === "All" || product.brand?.origin_region === origin) &&
        (body === "All" || detectLevel(product, "body") === body) &&
        (umami === "All" || detectLevel(product, "umami") === umami) &&
        (bitterness === "All" || detectLevel(product, "bitterness") === bitterness) &&
        (sweetness === "All" || detectLevel(product, "sweetness") === sweetness)
      );
    });
  }, [products, query, brand, origin, body, umami, bitterness, sweetness]);

  const clear = () => {
    setQuery("");
    setBrand("All");
    setOrigin("All");
    setBody("All");
    setUmami("All");
    setBitterness("All");
    setSweetness("All");
  };

  const namedOptions = (values: string[]): Option[] => values.map((value) => ({ value, label: value === "All" ? t("library.all") : value }));
  const levelOptions = (values: Array<[string, string]>): Option[] => [["All", t("library.all")], ...values.map(([value, key]) => [value, t(key)] as [string, string])].map(([value, label]) => ({ value, label }));

  const filters = (
    <div className="library-filters__stack">
      <FilterField label={t("library.brand")} value={brand} setValue={setBrand} options={namedOptions(brands)} />
      <FilterField label={t("library.origin")} value={origin} setValue={setOrigin} options={namedOptions(origins)} />
      <FilterField label={t("library.body")} value={body} setValue={setBody} options={levelOptions([["Light", "library.light"], ["Medium", "library.medium"], ["Rich", "library.rich"], ["Unspecified", "library.unspecified"]])} />
      <FilterField label={t("library.umami")} value={umami} setValue={setUmami} options={levelOptions([["Gentle", "library.gentle"], ["Medium", "library.medium"], ["High", "library.high"], ["Unspecified", "library.unspecified"]])} />
      <FilterField label={t("library.bitterness")} value={bitterness} setValue={setBitterness} options={levelOptions([["Very low", "library.veryLow"], ["Low", "library.low"], ["Refined", "library.refined"], ["Unspecified", "library.unspecified"]])} />
      <FilterField label={t("library.sweetness")} value={sweetness} setValue={setSweetness} options={levelOptions([["Soft", "library.soft"], ["Sweet", "library.sweet"], ["Unspecified", "library.unspecified"]])} />
      <div className="filter-field opacity-60">
        <label>{t("library.bestFor")}</label>
        <select disabled><option>{t("library.awaitingData")}</option></select>
        <p className="mt-2 text-xs leading-5">{t("library.bestForNote")}</p>
      </div>
      <button type="button" onClick={clear} className="text-link text-left">{t("library.clear")}</button>
    </div>
  );

  return (
    <section id="library-search" className="section-block pt-8 md:pt-12">
      <div className="section-shell">
        <div className="library-toolbar">
          <div className="search-box">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("library.searchPlaceholder")} aria-label={t("library.searchLabel")} />
          </div>
          <button type="button" className="button button--ghost library-filter-button" onClick={() => setDrawer(true)}>
            <Filter size={16} /> {t("library.filters")}
          </button>
          <span className="library-count">{t("library.profiles", { count: filtered.length })}</span>
        </div>

        <div className="library-layout mt-8">
          <aside className="library-filters">{filters}</aside>
          <div>
            {filtered.length ? (
              <div className="matcha-grid">{filtered.map((product, index) => <MatchaCard key={product.id} product={product} index={index} />)}</div>
            ) : (
              <div className="empty-state">
                <span className="jp-name">余白</span>
                <h2>{t("library.noResult")}</h2>
                <p>{t("library.noResultCopy")}</p>
                <button type="button" className="button button--dark" onClick={clear}>{t("library.reset")}</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {drawer ? (
        <div className="filter-drawer" role="dialog" aria-modal="true" aria-label={t("library.filters")}>
          <button className="filter-drawer__backdrop" aria-label={t("library.close")} onClick={() => setDrawer(false)} />
          <div className="filter-drawer__panel">
            <div className="filter-drawer__head"><strong>{t("library.filters")}</strong><button className="icon-button" onClick={() => setDrawer(false)} aria-label={t("library.close")}><X size={18} /></button></div>
            {filters}
            <button className="button button--dark w-full" onClick={() => setDrawer(false)}>{t("library.show", { count: filtered.length })}</button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function FilterField({ label, value, setValue, options }: { label: string; value: string; setValue: (value: string) => void; options: Option[] }) {
  return (
    <div className="filter-field">
      <label>{label}</label>
      <select value={value} onChange={(event) => setValue(event.target.value)}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );
}
