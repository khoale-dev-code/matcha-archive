"use client";

import { ImagePlus, RotateCcw, Save, UploadCloud } from "lucide-react";
import { useT } from "next-i18next/client";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./HomepageMediaEditor.module.css";
import {
  DEFAULT_HOMEPAGE_MEDIA,
  type HomepageMedia,
  type HomepageMediaKey,
} from "@/lib/data/homepage-media.shared";

const slotOrder: HomepageMediaKey[] = [
  "heroMain",
  "heroRitual",
  "heroOrigin",
  "spectrumBowl",
  "spectrumLeaves",
  "storyBowl",
  "storyLandscape",
  "ritualPoster",
  "journalFeature",
  "tasteUmami",
  "tasteSweet",
  "tasteFloral",
  "tasteDaily",
  "ritualSift",
  "ritualWater",
  "ritualWhisk",
  "ritualEnjoy",
];

const positionOptions = [
  ["50% 50%", "Center"],
  ["50% 30%", "Top"],
  ["50% 70%", "Bottom"],
  ["30% 50%", "Left"],
  ["70% 50%", "Right"],
  ["35% 35%", "Top left"],
  ["65% 35%", "Top right"],
  ["35% 65%", "Bottom left"],
  ["65% 65%", "Bottom right"],
] as const;

function slotLabel(key: HomepageMediaKey, vi: boolean) {
  const labels: Record<HomepageMediaKey, [string, string]> = {
    heroMain: ["Hero - ảnh chính", "Hero - main photo"],
    heroRitual: ["Hero - thẻ nghi thức", "Hero - ritual card"],
    heroOrigin: ["Hero - thẻ nguồn gốc", "Hero - origin card"],
    spectrumBowl: ["Phổ hương vị - chén trà", "Spectrum - matcha bowl"],
    spectrumLeaves: ["Phổ hương vị - lá trà", "Spectrum - tea leaves"],
    storyBowl: ["Story band - chén trà", "Story band - matcha bowl"],
    storyLandscape: ["Story band - đồi trà", "Story band - tea fields"],
    ritualPoster: ["Nghi thức - ảnh lớn", "Ritual - main photo"],
    journalFeature: ["Nhật ký - ảnh nổi bật", "Journal - featured photo"],
    tasteUmami: ["Khám phá vị - Umami dày", "Taste discovery - rich umami"],
    tasteSweet: ["Khám phá vị - Ngọt dịu", "Taste discovery - soft sweetness"],
    tasteFloral: ["Khám phá vị - Hương hoa", "Taste discovery - floral aroma"],
    tasteDaily: ["Khám phá vị - Daily ritual", "Taste discovery - daily ritual"],
    ritualSift: ["Nghi thức - Rây bột", "Ritual - sift"],
    ritualWater: ["Nghi thức - Thêm nước", "Ritual - add water"],
    ritualWhisk: ["Nghi thức - Đánh trà", "Ritual - whisk"],
    ritualEnjoy: ["Nghi thức - Thưởng thức", "Ritual - enjoy"],
  };
  return labels[key][vi ? 0 : 1];
}

export function HomepageMediaEditor({ initial }: { initial: HomepageMedia }) {
  const { i18n } = useT("common");
  const vi = (i18n.resolvedLanguage ?? i18n.language ?? "vi").startsWith("vi");
  const [media, setMedia] = useState(initial);
  const [baseline, setBaseline] = useState(JSON.stringify(initial));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [uploading, setUploading] = useState<HomepageMediaKey | null>(null);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingSlot, setPendingSlot] = useState<HomepageMediaKey | null>(null);

  const dirty = useMemo(() => JSON.stringify(media) !== baseline, [media, baseline]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s" && dirty) {
        event.preventDefault();
        void save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  function update(key: HomepageMediaKey, patch: Partial<HomepageMedia[HomepageMediaKey]>) {
    setMedia((current) => ({ ...current, [key]: { ...current[key], ...patch } }));
  }

  async function save() {
    setStatus("saving");
    setMessage("");
    try {
      const response = await fetch("/api/admin/content/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: { media } }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to save homepage media");
      setBaseline(JSON.stringify(media));
      setStatus("saved");
      setMessage(vi ? "Đã lưu hình ảnh trang chủ." : "Homepage imagery saved.");
      window.setTimeout(() => setStatus("idle"), 2200);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Save failed");
    }
  }

  function chooseFile(key: HomepageMediaKey) {
    setPendingSlot(key);
    inputRef.current?.click();
  }

  async function uploadFile(key: HomepageMediaKey, file: File) {
    setUploading(key);
    setMessage(vi ? "Đang tải ảnh lên Cloudinary..." : "Uploading image to Cloudinary...");
    try {
      const signedResponse = await fetch("/api/cloudinary/sign", { method: "POST" });
      const signed = await signedResponse.json();
      if (!signedResponse.ok) throw new Error(signed.error ?? "Cloudinary signing unavailable");

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", signed.apiKey);
      form.append("timestamp", String(signed.timestamp));
      form.append("signature", signed.signature);
      form.append("folder", signed.folder);

      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`, {
        method: "POST",
        body: form,
      });
      const uploaded = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(uploaded.error?.message ?? "Upload failed");

      update(key, { url: uploaded.secure_url });
      setMessage(vi ? "Ảnh đã tải lên. Nhấn Lưu để áp dụng cho website." : "Image uploaded. Save to publish it on the website.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(null);
      setPendingSlot(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <section className={`admin-form ${styles.root}`}>
      <div className={styles.head}>
        <div>
          <p className="admin-editor-kicker">homepage / media</p>
          <h2>{vi ? "Hình ảnh trang chủ" : "Homepage imagery"}</h2>
          <p>
            {vi
              ? "Thay ảnh trực tiếp tại đây. Ảnh upload lên Cloudinary, giữ nguyên bố cục và tự tối ưu khi hiển thị."
              : "Replace imagery here. Uploads go to Cloudinary while the layout and responsive treatment stay intact."}
          </p>
        </div>
        <button type="button" className={`admin-button ${styles.saveButton}`} onClick={() => void save()} disabled={!dirty || status === "saving"}>
          <Save size={14} />
          {status === "saving" ? (vi ? "Đang lưu" : "Saving") : (vi ? "Lưu hình ảnh" : "Save imagery")}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file && pendingSlot) void uploadFile(pendingSlot, file);
        }}
      />

      <div className={styles.grid}>
        {slotOrder.map((key) => {
          const item = media[key];
          return (
            <article className={styles.card} key={key}>
              <div className={styles.preview}>
                <img src={item.url} alt={item.altVi || slotLabel(key, true)} style={{ objectPosition: item.position }} />
                <span>{slotLabel(key, vi)}</span>
              </div>

              <div className={styles.fields}>
                <label>
                  <span>Image URL</span>
                  <input value={item.url} onChange={(event) => update(key, { url: event.target.value })} />
                </label>
                <div className={styles.row}>
                  <label>
                    <span>{vi ? "Tiêu điểm ảnh" : "Focal point"}</span>
                    <select value={item.position} onChange={(event) => update(key, { position: event.target.value })}>
                      {positionOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </label>
                  <button type="button" className={styles.upload} onClick={() => chooseFile(key)} disabled={uploading === key}>
                    {uploading === key ? <UploadCloud size={14} /> : <ImagePlus size={14} />}
                    {uploading === key ? (vi ? "Đang tải" : "Uploading") : (vi ? "Thay ảnh" : "Replace")}
                  </button>
                </div>
                <label>
                  <span>Alt VI</span>
                  <input value={item.altVi} onChange={(event) => update(key, { altVi: event.target.value })} />
                </label>
                <label>
                  <span>Alt EN</span>
                  <input value={item.altEn} onChange={(event) => update(key, { altEn: event.target.value })} />
                </label>
                <button type="button" className={styles.reset} onClick={() => update(key, DEFAULT_HOMEPAGE_MEDIA[key])}>
                  <RotateCcw size={12} /> {vi ? "Ảnh mặc định" : "Restore default"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.foot}>
        <span data-dirty={dirty || undefined}>{dirty ? (vi ? "Có thay đổi chưa lưu" : "Unsaved changes") : (vi ? "Đã đồng bộ" : "Synced")}</span>
        <small>{vi ? "Khuyên dùng WEBP/JPG từ 1600px trở lên, dưới 2MB." : "Recommended: WEBP/JPG, 1600px or wider, under 2MB."}</small>
        {message ? <p data-error={status === "error" || undefined}>{message}</p> : null}
      </div>
    </section>
  );
}
