"use client";

import { CheckCircle2, CircleAlert, Plus, Save, Search, Trash2 } from "lucide-react";
import { useT } from "next-i18next/client";
import { useEffect, useMemo, useState } from "react";
import type { TeaBrand } from "@/lib/types/tea";

type Tab = "overview" | "vi" | "en" | "publish";
type Status = "idle" | "saving" | "saved" | "error";

const emptyBrand = (id = "draft-new"): TeaBrand => ({
  id,
  slug: "",
  name: "",
  japanese_name: null,
  description_vi: null,
  description_en: null,
  origin_country: null,
  origin_region: null,
  logo_url: null,
  is_visible: true,
  sort_order: 999,
});

function clean(brand: TeaBrand) {
  const { created_at: _created, updated_at: _updated, ...payload } = brand;
  return payload;
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function AdminBrandManager({ initialBrands }: { initialBrands: TeaBrand[] }) {
  const { t } = useT("common");
  const fallback = initialBrands[0] ?? emptyBrand();
  const [brands, setBrands] = useState(initialBrands);
  const [draft, setDraft] = useState<TeaBrand>(fallback);
  const [baseline, setBaseline] = useState(() => JSON.stringify(clean(fallback)));
  const [status, setStatus] = useState<Status>("idle");
  const [tab, setTab] = useState<Tab>("overview");
  const [query, setQuery] = useState("");
  const dirty = JSON.stringify(clean(draft)) !== baseline;

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return brands.filter((brand) => !q || `${brand.name} ${brand.japanese_name ?? ""} ${brand.origin_region ?? ""}`.toLowerCase().includes(q));
  }, [brands, query]);

  useEffect(() => {
    function beforeUnload(event: BeforeUnloadEvent) {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  const update = <K extends keyof TeaBrand>(key: K, value: TeaBrand[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    if (status === "saved") setStatus("idle");
  };

  function select(brand: TeaBrand) {
    if (dirty && !window.confirm(t("admin.discardChanges"))) return;
    setDraft(brand);
    setBaseline(JSON.stringify(clean(brand)));
    setStatus("idle");
    setTab("overview");
  }

  function addNew() {
    if (dirty && !window.confirm(t("admin.discardChanges"))) return;
    const next = emptyBrand(`draft-${Date.now()}`);
    setDraft(next);
    setBaseline(JSON.stringify({}));
    setStatus("idle");
    setTab("overview");
  }

  async function save() {
    setStatus("saving");
    try {
      const isNew = draft.id.startsWith("draft-");
      const response = await fetch(isNew ? "/api/admin/brands" : `/api/admin/brands/${draft.id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clean(draft)),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? t("admin.saveError"));
      const saved = result.data as TeaBrand;
      setBrands((current) => isNew ? [saved, ...current] : current.map((item) => item.id === saved.id ? saved : item));
      setDraft(saved);
      setBaseline(JSON.stringify(clean(saved)));
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 2200);
    } catch {
      setStatus("error");
    }
  }

  async function remove() {
    if (draft.id.startsWith("draft-")) { const next = brands[0] ?? emptyBrand(); setDraft(next); setBaseline(JSON.stringify(clean(next))); return; }
    if (!window.confirm(t("admin.deleteConfirm", { name: draft.name }))) return;
    const response = await fetch(`/api/admin/brands/${draft.id}`, { method: "DELETE" });
    if (!response.ok) { setStatus("error"); return; }
    const remaining = brands.filter((item) => item.id !== draft.id);
    setBrands(remaining);
    const next = remaining[0] ?? emptyBrand();
    setDraft(next);
    setBaseline(JSON.stringify(clean(next)));
    setStatus("saved");
  }

  return (
    <>
      <div className="admin-editor-layout admin-editor-layout--enhanced">
        <aside className="admin-list admin-list--profiles">
          <div className="admin-list__heading"><div><strong>{t("admin.brands")}</strong><span>{t("admin.results", { count: filtered.length })}</span></div><button type="button" className="admin-icon-action" onClick={addNew}><Plus size={16} /></button></div>
          <div className="admin-list__search"><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("admin.searchBrands")} /></div>
          <div className="admin-list__items">{filtered.map((brand) => <button type="button" key={brand.id} data-active={draft.id === brand.id} onClick={() => select(brand)}><span className="admin-list__row-top"><strong>{brand.japanese_name ? `${brand.japanese_name} ` : ""}{brand.name}</strong><i data-visible={brand.is_visible || undefined} /></span><span>{brand.origin_region ?? t("admin.regionPending")}</span><span className="admin-list__coverage"><b>VI {brand.description_vi ? "1/1" : "0/1"}</b><b>EN {brand.description_en ? "1/1" : "0/1"}</b></span></button>)}</div>
        </aside>

        <section className="admin-form admin-form--editor">
          <div className="admin-editor-head">
            <div className="admin-editor-head__copy"><span className="admin-editor-kicker">{t("admin.brandsTitle")}</span><div className="admin-editor-title-row">{draft.japanese_name ? <span className="jp-name">{draft.japanese_name}</span> : null}<h2>{draft.name || t("admin.newBrand")}</h2></div><div className="admin-editor-badges"><span className={dirty ? "is-warn" : "is-ok"}>{dirty ? <CircleAlert size={12} /> : <CheckCircle2 size={12} />}{dirty ? t("admin.unsaved") : t("admin.savedState")}</span><span>VI {draft.description_vi ? "1/1" : "0/1"}</span><span>EN {draft.description_en ? "1/1" : "0/1"}</span></div></div>
            <button className="admin-button admin-button--ghost" type="button" onClick={addNew}><Plus size={14} /> {t("admin.new")}</button>
          </div>

          <div className="admin-editor-tabs" role="tablist">
            {([['overview', t('admin.brandOverviewTab')], ['vi', t('admin.viTab')], ['en', t('admin.enTab')], ['publish', t('admin.logoAndPublishTab')]] as Array<[Tab,string]>).map(([id,label]) => <button key={id} type="button" role="tab" data-active={tab === id || undefined} aria-selected={tab === id} onClick={() => setTab(id)}>{label}</button>)}
          </div>

          <div className="admin-tab-panel">
            {tab === "overview" ? <AdminSection title={t("admin.brandOverviewTab")} helper={t("admin.overviewHelp")}><div className="admin-form-grid"><Field label={t("admin.name")}><input value={draft.name} onChange={(e) => update("name", e.target.value)} /></Field><Field label={t("admin.japaneseName")}><input value={draft.japanese_name ?? ""} onChange={(e) => update("japanese_name", e.target.value || null)} /></Field><Field label={t("admin.slug")}><div className="admin-inline-field"><input value={draft.slug} onChange={(e) => update("slug", e.target.value)} /><button type="button" onClick={() => update("slug", slugify(draft.name))}>{t("admin.generateSlug")}</button></div></Field><Field label={t("admin.originCountry")}><input value={draft.origin_country ?? ""} onChange={(e) => update("origin_country", e.target.value || null)} /></Field><Field label={t("admin.originRegion")}><input value={draft.origin_region ?? ""} onChange={(e) => update("origin_region", e.target.value || null)} /></Field></div></AdminSection> : null}
            {tab === "vi" ? <AdminSection title={t("admin.viTab")} helper={t("admin.viHelp")} badge="VI"><Field label={t("admin.descriptionVi")} full><textarea rows={12} value={draft.description_vi ?? ""} onChange={(e) => update("description_vi", e.target.value || null)} /></Field></AdminSection> : null}
            {tab === "en" ? <AdminSection title={t("admin.enTab")} helper={t("admin.enHelp")} badge="EN"><Field label={t("admin.descriptionEn")} full><textarea rows={12} value={draft.description_en ?? ""} onChange={(e) => update("description_en", e.target.value || null)} /></Field></AdminSection> : null}
            {tab === "publish" ? <AdminSection title={t("admin.logoAndPublishTab")} helper={t("admin.publishHelp")}><div className="admin-form-grid"><Field label={t("admin.logoUrl")} full><input value={draft.logo_url ?? ""} onChange={(e) => update("logo_url", e.target.value || null)} /></Field><Field label={t("admin.sortOrder")}><input type="number" value={draft.sort_order} onChange={(e) => update("sort_order", Number(e.target.value))} /></Field><label className="admin-toggle"><input type="checkbox" checked={draft.is_visible} onChange={(e) => update("is_visible", e.target.checked)} /><span aria-hidden="true" /><strong>{t("admin.visible")}</strong></label></div></AdminSection> : null}
          </div>

          <div className="admin-form-actions admin-form-actions--sticky"><span className="admin-status">{dirty ? t("admin.unsaved") : t("admin.saved")}</span><button className="admin-button admin-button--danger" type="button" onClick={remove}><Trash2 size={14} /> {t("admin.delete")}</button><button className="admin-button" type="button" onClick={() => void save()} disabled={!dirty || status === "saving"}><Save size={14} />{status === "saving" ? t("admin.saving") : t("admin.save")}</button></div>
        </section>
      </div>
      {(status === "saved" || status === "error") ? <div className="admin-snackbar" data-type={status}><strong>{status === "saved" ? `✓ ${t("admin.saveSuccess")}` : t("admin.saveError")}</strong><p>{status === "saved" ? t("admin.saveSuccessCopy") : t("admin.tryAgain")}</p></div> : null}
    </>
  );
}

function AdminSection({ title, helper, badge, children }: { title: string; helper: string; badge?: string; children: React.ReactNode }) { return <div className="admin-section"><div className="admin-section__head"><div><div className="admin-section__title-row"><h3>{title}</h3>{badge ? <span>{badge}</span> : null}</div><p>{helper}</p></div></div><div className="admin-form-grid">{children}</div></div>; }
function Field({ label, full = false, children }: { label: string; full?: boolean; children: React.ReactNode }) { return <div className={`admin-form-field ${full ? "admin-form-field--full" : ""}`}><label>{label}</label>{children}</div>; }
