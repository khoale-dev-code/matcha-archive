"use client";

import { Check, ChevronDown, Globe2 } from "lucide-react";
import { useT } from "next-i18next/client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { normalizeLocale, withLocalePath } from "@/lib/i18n/routing";

type LanguageSwitcherProps = {
  compact?: boolean;
  admin?: boolean;
};

export function LanguageSwitcher({ compact = false, admin = false }: LanguageSwitcherProps) {
  const { t, i18n } = useT("common");
  const lng = i18n.resolvedLanguage ?? i18n.language ?? "vi";
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = normalizeLocale(lng);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function select(next: "vi" | "en") {
    setOpen(false);
    if (next === current) return;

    document.cookie = `matcha_locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    const query = window.location.search;
    const target = withLocalePath(`${pathname}${query}`, next);
    startTransition(() => router.push(target));
  }

  return (
    <div
      ref={rootRef}
      className={`language-switcher ${compact ? "language-switcher--compact" : ""} ${admin ? "language-switcher--admin" : ""}`}
      data-pending={pending || undefined}
    >
      <button
        type="button"
        className="language-switcher__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("language.label")}
        onClick={() => setOpen((value) => !value)}
      >
        <Globe2 size={16} strokeWidth={1.7} />
        <span className="language-switcher__current">
          {compact ? current.toUpperCase() : current === "vi" ? t("language.vi") : t("language.en")}
        </span>
        <ChevronDown size={14} className={open ? "rotate-180" : ""} />
      </button>

      {open ? (
        <div className="language-switcher__menu" role="menu" aria-label={t("language.label")}>
          <p className="language-switcher__label">{t("language.label")}</p>
          <button type="button" role="menuitemradio" aria-checked={current === "vi"} onClick={() => select("vi")}>
            <span className="language-switcher__option-copy"><strong>VI</strong><span>{t("language.vi")}</span></span>
            {current === "vi" ? <Check size={14} /> : null}
          </button>
          <button type="button" role="menuitemradio" aria-checked={current === "en"} onClick={() => select("en")}>
            <span className="language-switcher__option-copy"><strong>EN</strong><span>{t("language.en")}</span></span>
            {current === "en" ? <Check size={14} /> : null}
          </button>
        </div>
      ) : null}
    </div>
  );
}
