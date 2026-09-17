"use client";

import { CheckCircle2, CircleAlert, Save } from "lucide-react";
import { useT } from "next-i18next/client";
import { useEffect, useState } from "react";

type LocalizedContent = { titleVi: string; bodyVi: string; titleEn: string; bodyEn: string };

export function AdminContentEditor({
  contentKey,
  heading,
  helper,
  initial,
}: {
  contentKey: string;
  heading: string;
  helper: string;
  initial: LocalizedContent;
}) {
  const { t } = useT("common");
  const [tab, setTab] = useState<"vi" | "en">("vi");
  const [content, setContent] = useState(initial);
  const [baseline, setBaseline] = useState(JSON.stringify(initial));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const dirty = JSON.stringify(content) !== baseline;

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

  async function save() {
    setStatus("saving");
    try {
      const response = await fetch(`/api/admin/content/${contentKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: content.titleVi || null,
          body: content.bodyVi || null,
          payload: {
            i18n: {
              vi: { title: content.titleVi, body: content.bodyVi },
              en: { title: content.titleEn, body: content.bodyEn },
            },
          },
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? t("admin.saveError"));
      setBaseline(JSON.stringify(content));
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 2400);
    } catch {
      setStatus("error");
    }
  }

  const viReady = Boolean(content.titleVi.trim() && content.bodyVi.trim());
  const enReady = Boolean(content.titleEn.trim() && content.bodyEn.trim());

  return (
    <>
      <div className="admin-page-head admin-page-head--editor">
        <div><p className="admin-editor-kicker">{contentKey}</p><h1>{heading}</h1><p>{helper}</p></div>
        <div className="admin-editor-badges"><span className={dirty ? "is-warn" : "is-ok"}>{dirty ? <CircleAlert size={12} /> : <CheckCircle2 size={12} />}{dirty ? t("admin.unsaved") : t("admin.saved")}</span><span>VI {viReady ? "2/2" : "—"}</span><span>EN {enReady ? "2/2" : "—"}</span></div>
      </div>

      <section className="admin-form admin-form--editor admin-content-editor">
        <div className="admin-source-guard"><span>{t("admin.interfaceVsContent")}</span></div>
        <div className="admin-editor-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "vi"} data-active={tab === "vi" || undefined} onClick={() => setTab("vi")}>{t("admin.viTab")}<small>{viReady ? "2/2" : "0–1/2"}</small></button>
          <button type="button" role="tab" aria-selected={tab === "en"} data-active={tab === "en" || undefined} onClick={() => setTab("en")}>{t("admin.enTab")}<small>{enReady ? "2/2" : "0–1/2"}</small></button>
        </div>
        <div className="admin-tab-panel">
          <div className="admin-section">
            <div className="admin-section__head"><div><div className="admin-section__title-row"><h3>{tab === "vi" ? t("admin.viTab") : t("admin.enTab")}</h3><span>{tab.toUpperCase()}</span></div><p>{tab === "vi" ? t("admin.viHelp") : t("admin.enHelp")}</p></div></div>
            <div className="admin-form-grid">
              <div className="admin-form-field admin-form-field--full"><label>{t("admin.titleField")}</label><input value={tab === "vi" ? content.titleVi : content.titleEn} onChange={(e) => setContent((current) => ({ ...current, [tab === "vi" ? "titleVi" : "titleEn"]: e.target.value }))} /></div>
              <div className="admin-form-field admin-form-field--full"><label>{t("admin.bodyField")}</label><textarea rows={16} value={tab === "vi" ? content.bodyVi : content.bodyEn} onChange={(e) => setContent((current) => ({ ...current, [tab === "vi" ? "bodyVi" : "bodyEn"]: e.target.value }))} /></div>
            </div>
          </div>
        </div>
        <div className="admin-form-actions admin-form-actions--sticky"><div className="admin-save-state"><span data-dirty={dirty || undefined}>{dirty ? t("admin.unsaved") : t("admin.saved")}</span><small>{t("admin.shortcut")}</small></div><button type="button" className="admin-button" onClick={() => void save()} disabled={!dirty || status === "saving"}><Save size={14} />{status === "saving" ? t("admin.saving") : t("admin.save")}</button></div>
      </section>
      {(status === "saved" || status === "error") ? <div className="admin-snackbar" data-type={status}><strong>{status === "saved" ? `✓ ${t("admin.saveSuccess")}` : t("admin.saveError")}</strong><p>{status === "saved" ? t("admin.saveSuccessCopy") : t("admin.tryAgain")}</p></div> : null}
    </>
  );
}
