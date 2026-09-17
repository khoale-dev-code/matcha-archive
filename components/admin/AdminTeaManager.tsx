"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2, CircleAlert, Plus, Save, Search, Trash2, WandSparkles } from "lucide-react";
import { useT } from "next-i18next/client";
import { useEffect, useMemo, useState } from "react";
import type { TeaBrand, TeaProduct, TeaType } from "@/lib/types/tea";
import { teaProfileHref } from "@/lib/routes";
import { withLocalePath } from "@/lib/i18n/routing";

type Tab = "overview" | "vi" | "en" | "taste" | "brew" | "publish";
type SaveStatus = "idle" | "saving" | "saved" | "error";

const emptyProduct = (brands: TeaBrand[], id = "draft-new"): TeaProduct => ({
  id,
  slug: "",
  name: "",
  japanese_name: null,
  brand_id: brands[0]?.id ?? "",
  tea_type: "matcha",
  origin_country: null,
  origin_region: null,
  description_vi: null,
  description_en: null,
  tasting_summary_vi: null,
  tasting_summary_en: null,
  aroma: null,
  body_score: null,
  umami_score: null,
  sweetness_score: null,
  bitterness_score: null,
  creaminess_score: null,
  finish: null,
  tasting_notes: [],
  recommended_for: [],
  brewing_matcha_grams: null,
  brewing_water_ml: null,
  brewing_temperature: null,
  brewing_time: null,
  price: null,
  price_unit: null,
  price_note: null,
  is_featured: false,
  is_visible: true,
  sort_order: 999,
  image_url: null,
  gallery: [],
  source_page: null,
  brand: brands[0] ?? null,
});

const clean = (product: TeaProduct) => {
  const { brand: _brand, ...payload } = product;
  return payload;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function coverage(product: TeaProduct) {
  const vi = [product.description_vi, product.tasting_summary_vi].filter(Boolean).length;
  const en = [product.description_en, product.tasting_summary_en].filter(Boolean).length;
  return { vi, en, total: 2 };
}

export function AdminTeaManager({ initialProducts, brands }: { initialProducts: TeaProduct[]; brands: TeaBrand[] }) {
  const { t, i18n } = useT("common");
  const lng = i18n.resolvedLanguage ?? i18n.language ?? "vi";
  const fallback = initialProducts[0] ?? emptyProduct(brands);
  const [products, setProducts] = useState(initialProducts);
  const [selectedId, setSelectedId] = useState(fallback.id);
  const [draft, setDraft] = useState<TeaProduct>(fallback);
  const [baseline, setBaseline] = useState(() => JSON.stringify(clean(fallback)));
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState<Tab>("overview");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return products.filter((item) => !q || `${item.name} ${item.brand?.name ?? ""} ${item.japanese_name ?? ""} ${item.slug}`.toLowerCase().includes(q));
  }, [products, query]);

  const dirty = JSON.stringify(clean(draft)) !== baseline;
  const translation = coverage(draft);
  const publicUrl = draft.slug && !draft.id.startsWith("draft-") ? withLocalePath(teaProfileHref(draft), lng) : null;

  useEffect(() => {
    function beforeUnload(event: BeforeUnloadEvent) {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (dirty && status !== "saving") void save();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  function selectProduct(product: TeaProduct) {
    if (dirty && !window.confirm(t("admin.discardChanges"))) return;
    setSelectedId(product.id);
    setDraft(product);
    setBaseline(JSON.stringify(clean(product)));
    setStatus("idle");
    setMessage("");
    setTab("overview");
  }

  function update<K extends keyof TeaProduct>(key: K, value: TeaProduct[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    if (status === "saved") setStatus("idle");
  }

  function addNew() {
    if (dirty && !window.confirm(t("admin.discardChanges"))) return;
    const next = emptyProduct(brands, `draft-${Date.now()}`);
    setSelectedId(next.id);
    setDraft(next);
    setBaseline(JSON.stringify({}));
    setStatus("idle");
    setMessage("");
    setTab("overview");
  }

  async function save() {
    if (!draft.name.trim() || !draft.slug.trim() || !draft.brand_id) {
      setStatus("error");
      setMessage(t("admin.tryAgain"));
      return;
    }
    setStatus("saving");
    setMessage("");
    try {
      const isNew = draft.id.startsWith("draft-");
      const response = await fetch(isNew ? "/api/admin/tea-products" : `/api/admin/tea-products/${draft.id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clean(draft)),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? t("admin.saveError"));
      const saved = { ...(result.data as TeaProduct), brand: brands.find((item) => item.id === result.data.brand_id) ?? null };
      setProducts((current) => isNew ? [saved, ...current] : current.map((item) => item.id === saved.id ? saved : item));
      setDraft(saved);
      setSelectedId(saved.id);
      setBaseline(JSON.stringify(clean(saved)));
      setStatus("saved");
      setMessage(t("admin.saveSuccessCopy"));
      window.setTimeout(() => setStatus("idle"), 2600);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : t("admin.tryAgain"));
    }
  }

  async function remove() {
    if (draft.id.startsWith("draft-")) {
      const first = products[0] ?? emptyProduct(brands);
      setDraft(first);
      setSelectedId(first.id);
      setBaseline(JSON.stringify(clean(first)));
      return;
    }
    if (!window.confirm(t("admin.deleteConfirm", { name: draft.name }))) return;
    setStatus("saving");
    try {
      const response = await fetch(`/api/admin/tea-products/${draft.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? t("admin.saveError"));
      const next = products.filter((item) => item.id !== draft.id);
      setProducts(next);
      const first = next[0] ?? emptyProduct(brands);
      setDraft(first);
      setSelectedId(first.id);
      setBaseline(JSON.stringify(clean(first)));
      setStatus("saved");
      setMessage(t("admin.deleted"));
      window.setTimeout(() => setStatus("idle"), 2600);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : t("admin.tryAgain"));
    }
  }

  const tabs: Array<[Tab, string]> = [
    ["overview", t("admin.overviewTab")],
    ["vi", t("admin.viTab")],
    ["en", t("admin.enTab")],
    ["taste", t("admin.tasteTab")],
    ["brew", t("admin.brewTab")],
    ["publish", t("admin.publishTab")],
  ];

  return (
    <>
      <div className="admin-editor-layout admin-editor-layout--enhanced">
        <aside className="admin-list admin-list--profiles">
          <div className="admin-list__heading">
            <div><strong>{t("admin.profileList")}</strong><span>{t("admin.results", { count: filtered.length })}</span></div>
            <button type="button" className="admin-icon-action" onClick={addNew} aria-label={t("admin.new")}><Plus size={16} /></button>
          </div>
          <div className="admin-list__search">
            <Search size={15} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("admin.searchProfiles")} />
          </div>
          <div className="admin-list__items">
            {filtered.map((product) => {
              const c = coverage(product);
              return (
                <button key={product.id} type="button" data-active={selectedId === product.id} onClick={() => selectProduct(product)}>
                  <span className="admin-list__row-top"><strong>{product.japanese_name ? `${product.japanese_name} ` : ""}{product.name}</strong><i data-visible={product.is_visible || undefined} /></span>
                  <span>{product.brand?.name ?? t("admin.brandPending")} · {product.tea_type}</span>
                  <span className="admin-list__coverage"><b>VI {c.vi}/{c.total}</b><b>EN {c.en}/{c.total}</b></span>
                </button>
              );
            })}
            {!filtered.length ? <div className="admin-list__empty">{t("admin.noProfiles")}</div> : null}
          </div>
        </aside>

        <section className="admin-form admin-form--editor">
          <div className="admin-editor-head">
            <div className="admin-editor-head__copy">
              <span className="admin-editor-kicker">{t("admin.editProfile")}</span>
              <div className="admin-editor-title-row">
                {draft.japanese_name ? <span className="jp-name">{draft.japanese_name}</span> : null}
                <h2>{draft.name || t("admin.newTeaProfile")}</h2>
              </div>
              <div className="admin-editor-badges">
                <span className={dirty ? "is-warn" : "is-ok"}>{dirty ? <CircleAlert size={12} /> : <CheckCircle2 size={12} />}{dirty ? t("admin.unsaved") : t("admin.savedState")}</span>
                <span>VI {translation.vi}/{translation.total}</span>
                <span>EN {translation.en}/{translation.total}</span>
              </div>
            </div>
            <div className="admin-editor-head__actions">
              {publicUrl ? <Link href={publicUrl} target="_blank" className="admin-button admin-button--ghost">{t("admin.preview")} <ArrowUpRight size={14} /></Link> : null}
              <button type="button" className="admin-button admin-button--ghost" onClick={addNew}><Plus size={14} /> {t("admin.new")}</button>
            </div>
          </div>

          <div className="admin-source-guard"><WandSparkles size={15} /><span>{t("admin.sourceGuard")}</span></div>

          <div className="admin-editor-tabs" role="tablist" aria-label={t("admin.contentLanguage")}>
            {tabs.map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={tab === id} data-active={tab === id || undefined} onClick={() => setTab(id)}>{label}{id === "vi" ? <small>{translation.vi}/{translation.total}</small> : id === "en" ? <small>{translation.en}/{translation.total}</small> : null}</button>)}
          </div>

          <div className="admin-tab-panel">
            {tab === "overview" ? (
              <AdminSection title={t("admin.overviewTab")} helper={t("admin.overviewHelp")}>
                <div className="admin-form-grid">
                  <Field label={t("admin.name")}><input value={draft.name} onChange={(e) => update("name", e.target.value)} /></Field>
                  <Field label={t("admin.japaneseName")}><input value={draft.japanese_name ?? ""} onChange={(e) => update("japanese_name", e.target.value || null)} /></Field>
                  <Field label={t("admin.slug")}>
                    <div className="admin-inline-field"><input value={draft.slug} onChange={(e) => update("slug", e.target.value)} /><button type="button" onClick={() => update("slug", slugify(draft.name))}>{t("admin.generateSlug")}</button></div>
                  </Field>
                  <Field label={t("admin.brandCol")}><select value={draft.brand_id} onChange={(e) => update("brand_id", e.target.value)}>{brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select></Field>
                  <Field label={t("admin.teaType")}><select value={draft.tea_type} onChange={(e) => update("tea_type", e.target.value as TeaType)}><option value="matcha">{t("teaTypes.matcha")}</option><option value="hojicha">{t("teaTypes.hojicha")}</option><option value="sencha">{t("teaTypes.sencha")}</option><option value="other">{t("teaTypes.other")}</option></select></Field>
                  <Field label={t("admin.originCountry")}><input value={draft.origin_country ?? ""} onChange={(e) => update("origin_country", e.target.value || null)} /></Field>
                  <Field label={t("admin.originRegion")}><input value={draft.origin_region ?? ""} onChange={(e) => update("origin_region", e.target.value || null)} placeholder={t("admin.contentMissingHint")} /></Field>
                  <Field label={t("admin.sourcePage")}><input type="number" value={draft.source_page ?? ""} onChange={(e) => update("source_page", e.target.value ? Number(e.target.value) : null)} /></Field>
                </div>
              </AdminSection>
            ) : null}

            {tab === "vi" ? (
              <AdminSection title={t("admin.viTab")} helper={t("admin.viHelp")} badge="VI">
                <div className="admin-form-grid">
                  <Field label={t("admin.descriptionVi")} full><textarea rows={8} value={draft.description_vi ?? ""} onChange={(e) => update("description_vi", e.target.value || null)} /></Field>
                  <Field label={t("admin.tastingVi")} full><textarea rows={8} value={draft.tasting_summary_vi ?? ""} onChange={(e) => update("tasting_summary_vi", e.target.value || null)} /></Field>
                </div>
              </AdminSection>
            ) : null}

            {tab === "en" ? (
              <AdminSection title={t("admin.enTab")} helper={t("admin.enHelp")} badge="EN">
                <div className="admin-form-grid">
                  <Field label={t("admin.descriptionEn")} full><textarea rows={8} value={draft.description_en ?? ""} onChange={(e) => update("description_en", e.target.value || null)} /></Field>
                  <Field label={t("admin.tastingEn")} full><textarea rows={8} value={draft.tasting_summary_en ?? ""} onChange={(e) => update("tasting_summary_en", e.target.value || null)} /></Field>
                </div>
              </AdminSection>
            ) : null}

            {tab === "taste" ? (
              <AdminSection title={t("admin.tasteTab")} helper={t("admin.tastingHelp")}>
                <div className="admin-form-grid">
                  <Field label={t("admin.aroma")}><input value={draft.aroma ?? ""} onChange={(e) => update("aroma", e.target.value || null)} /></Field>
                  <Field label={t("admin.finish")}><input value={draft.finish ?? ""} onChange={(e) => update("finish", e.target.value || null)} /></Field>
                  <Field label={t("admin.notes")} full><input value={draft.tasting_notes.join(", ")} onChange={(e) => update("tasting_notes", e.target.value.split(",").map((v) => v.trim()).filter(Boolean))} /></Field>
                  <div className="admin-slider-grid">
                    <div className="admin-slider-grid__head"><strong>{t("admin.profileScore")}</strong><span>{t("admin.keepNull")}</span></div>
                    <Score label={t("tastingProfile.umami")} value={draft.umami_score} onChange={(value) => update("umami_score", value)} t={t} />
                    <Score label={t("tastingProfile.body")} value={draft.body_score} onChange={(value) => update("body_score", value)} t={t} />
                    <Score label={t("tastingProfile.sweetness")} value={draft.sweetness_score} onChange={(value) => update("sweetness_score", value)} t={t} />
                    <Score label={t("tastingProfile.bitterness")} value={draft.bitterness_score} onChange={(value) => update("bitterness_score", value)} t={t} />
                    <Score label={t("tastingProfile.creaminess")} value={draft.creaminess_score} onChange={(value) => update("creaminess_score", value)} t={t} />
                  </div>
                </div>
              </AdminSection>
            ) : null}

            {tab === "brew" ? (
              <AdminSection title={t("admin.brewTab")} helper={t("admin.brewHelp")}>
                <div className="admin-form-grid">
                  <Field label={t("admin.recommended")} full><input value={draft.recommended_for.join(", ")} onChange={(e) => update("recommended_for", e.target.value.split(",").map((v) => v.trim()).filter(Boolean))} placeholder="Usucha, Koicha, Latte" /></Field>
                  <Field label={t("admin.grams")}><input type="number" step="0.1" value={draft.brewing_matcha_grams ?? ""} onChange={(e) => update("brewing_matcha_grams", e.target.value ? Number(e.target.value) : null)} /></Field>
                  <Field label={t("admin.waterMl")}><input type="number" value={draft.brewing_water_ml ?? ""} onChange={(e) => update("brewing_water_ml", e.target.value ? Number(e.target.value) : null)} /></Field>
                  <Field label={t("admin.temperature")}><input value={draft.brewing_temperature ?? ""} onChange={(e) => update("brewing_temperature", e.target.value || null)} placeholder="70–75°C" /></Field>
                  <Field label={t("admin.whiskTime")}><input value={draft.brewing_time ?? ""} onChange={(e) => update("brewing_time", e.target.value || null)} placeholder="15–20 sec" /></Field>
                  <Field label={t("admin.referencePrice")}><input type="number" value={draft.price ?? ""} onChange={(e) => update("price", e.target.value ? Number(e.target.value) : null)} /></Field>
                  <Field label={t("admin.priceUnit")}><input value={draft.price_unit ?? ""} onChange={(e) => update("price_unit", e.target.value || null)} placeholder="20g" /></Field>
                  <Field label={t("admin.priceNote")} full><input value={draft.price_note ?? ""} onChange={(e) => update("price_note", e.target.value || null)} /></Field>
                </div>
              </AdminSection>
            ) : null}

            {tab === "publish" ? (
              <AdminSection title={t("admin.publishTab")} helper={t("admin.publishHelp")}>
                <div className="admin-form-grid">
                  <Field label={t("admin.coverUrl")} full><input value={draft.image_url ?? ""} onChange={(e) => update("image_url", e.target.value || null)} /></Field>
                  <div className="admin-media-hint admin-form-field--full">{t("admin.mediaNote")}</div>
                  <Field label={t("admin.sortOrder")}><input type="number" value={draft.sort_order} onChange={(e) => update("sort_order", Number(e.target.value))} /></Field>
                  <div className="admin-toggle-group">
                    <Toggle checked={draft.is_featured} label={t("admin.featured")} onChange={(value) => update("is_featured", value)} />
                    <Toggle checked={draft.is_visible} label={t("admin.visible")} onChange={(value) => update("is_visible", value)} />
                  </div>
                  {draft.slug ? <Field label={t("admin.seoPreview")} full><div className="admin-readonly-url">{withLocalePath(teaProfileHref(draft), lng)}</div></Field> : null}
                </div>
              </AdminSection>
            ) : null}
          </div>

          <div className="admin-form-actions admin-form-actions--sticky">
            <div className="admin-save-state">
              <span data-dirty={dirty || undefined}>{dirty ? t("admin.unsaved") : t("admin.saved")}</span>
              <small>{t("admin.shortcut")}</small>
            </div>
            <button type="button" className="admin-button admin-button--danger admin-delete-button" onClick={remove}><Trash2 size={14} /> {t("admin.delete")}</button>
            <button type="button" className="admin-button" onClick={() => void save()} disabled={!dirty || status === "saving"}><Save size={14} />{status === "saving" ? t("admin.saving") : t("admin.save")}</button>
          </div>
        </section>
      </div>

      {(status === "saved" || status === "error") ? (
        <div className="admin-snackbar" data-type={status}>
          <strong>{status === "saved" ? `✓ ${t("admin.saveSuccess")}` : t("admin.saveError")}</strong>
          <p>{message || (status === "saved" ? t("admin.saveSuccessCopy") : t("admin.tryAgain"))}</p>
        </div>
      ) : null}
    </>
  );
}

function AdminSection({ title, helper, badge, children }: { title: string; helper: string; badge?: string; children: React.ReactNode }) {
  return <div className="admin-section"><div className="admin-section__head"><div><div className="admin-section__title-row"><h3>{title}</h3>{badge ? <span>{badge}</span> : null}</div><p>{helper}</p></div></div>{children}</div>;
}

function Field({ label, full = false, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return <div className={`admin-form-field ${full ? "admin-form-field--full" : ""}`}><label>{label}</label>{children}</div>;
}

function Score({ label, value, onChange, t }: { label: string; value: number | null; onChange: (value: number | null) => void; t: (key: string, options?: Record<string, unknown>) => string }) {
  return (
    <div className="admin-slider">
      <label>{label}</label>
      <input type="range" min="1" max="5" value={value ?? 3} onChange={(e) => onChange(Number(e.target.value))} />
      <div className="admin-score-value"><strong>{value == null ? "—" : `${value}/5`}</strong><button type="button" onClick={() => onChange(null)}>{value == null ? t("admin.unset") : t("admin.clearScore")}</button></div>
    </div>
  );
}

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  return <label className="admin-toggle"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /><span aria-hidden="true" /><strong>{label}</strong></label>;
}
