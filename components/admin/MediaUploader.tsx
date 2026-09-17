"use client";

import { GripVertical, ImagePlus, Star, Trash2, UploadCloud } from "lucide-react";
import { useT } from "next-i18next/client";
import { useRef, useState } from "react";

type MediaItem = {
  id: string;
  url: string;
  publicId: string;
  resourceType: "image" | "video";
  cover: boolean;
};

export function MediaUploader() {
  const { t } = useT("common");
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length) return;
    setUploading(true);
    setMessage(t("admin.mediaUploading"));
    try {
      for (const file of list) {
        const signed = await fetch("/api/cloudinary/sign", { method: "POST" }).then(async (r) => {
          const data = await r.json();
          if (!r.ok) throw new Error(data.error ?? "Cloudinary signing unavailable");
          return data;
        });
        const form = new FormData();
        form.append("file", file);
        form.append("api_key", signed.apiKey);
        form.append("timestamp", String(signed.timestamp));
        form.append("signature", signed.signature);
        form.append("folder", signed.folder);
        const result = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/auto/upload`, { method: "POST", body: form }).then(async (r) => {
          const data = await r.json();
          if (!r.ok) throw new Error(data.error?.message ?? "Upload failed");
          return data;
        });
        setItems((current) => [...current, { id: crypto.randomUUID(), url: result.secure_url, publicId: result.public_id, resourceType: result.resource_type === "video" ? "video" : "image", cover: current.length === 0 }]);
      }
      setMessage(t("admin.mediaUploaded"));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("admin.mediaUploadError"));
    } finally {
      setUploading(false);
    }
  }

  async function remove(item: MediaItem) {
    try {
      const response = await fetch("/api/cloudinary/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ publicId: item.publicId, resourceType: item.resourceType }) });
      if (!response.ok) throw new Error("Delete failed");
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      setMessage(t("admin.mediaDeleted"));
    } catch {
      setMessage(t("admin.mediaDeleteError"));
    }
  }

  function makeCover(id: string) {
    setItems((current) => current.map((item) => ({ ...item, cover: item.id === id })));
  }

  function onDropAt(index: number) {
    if (dragIndex == null || dragIndex === index) return;
    setItems((current) => {
      const next = [...current];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(null);
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel__head"><strong>{t("admin.mediaCloudinary")}</strong><span className="text-[9px]">{t("admin.mediaKinds")}</span></div>
      <div className="p-4">
        <div className="media-dropzone" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); void uploadFiles(e.dataTransfer.files); }}>
          <div>
            <UploadCloud size={28} className="mx-auto" strokeWidth={1.4} />
            <strong className="mt-3 block font-serif text-3xl">{t("admin.mediaDrop")}</strong>
            <p className="mt-2 text-[10px] text-neutral-500">{t("admin.mediaFeatures")}</p>
            <button type="button" className="admin-button mt-4" onClick={() => inputRef.current?.click()} disabled={uploading}><ImagePlus size={14} />{uploading ? t("admin.mediaUploading") : t("admin.mediaChoose")}</button>
            <input ref={inputRef} type="file" hidden multiple accept="image/*,video/*,.gif" onChange={(e) => e.target.files && void uploadFiles(e.target.files)} />
          </div>
        </div>
        {message ? <p className="mt-3 text-[10px]">{message}</p> : null}
        {items.length ? (
          <div className="media-grid mt-4">
            {items.map((item, index) => (
              <div key={item.id} className="media-item" draggable onDragStart={() => setDragIndex(index)} onDragOver={(e) => e.preventDefault()} onDrop={() => onDropAt(index)}>
                {item.resourceType === "video" ? <video src={item.url} muted playsInline /> : <img src={item.url} alt="Uploaded preview" />}
                <div className="media-item__actions">
                  <button type="button" title={t("admin.mediaReorder")}><GripVertical size={12} /></button>
                  <button type="button" onClick={() => makeCover(item.id)}>{item.cover ? `${t("admin.mediaCover")} ✓` : <Star size={12} />}</button>
                  <button type="button" onClick={() => void remove(item)} aria-label={t("admin.delete")}><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
