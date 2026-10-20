"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchGalleryImages,
  saveGalleryImage,
  deleteGalleryImage,
  uploadTempleImage,
  isSupabaseConfigured,
  GalleryItem,
} from "@/lib/supabase";

export default function AdminGalleryPage() {
  const configured = isSupabaseConfigured();
  const [imagesList, setImagesList] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(true);

  useEffect(() => {
    loadGallery();
  }, [configured]);

  async function loadGallery() {
    setLoading(true);
    if (configured) {
      const data = await fetchGalleryImages(false);
      setImagesList(data);
    }
    setLoading(false);
  }

  function resetForm() {
    setTitle("");
    setCaption("");
    setImageUrl("");
    setPublished(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);
    const { url, error } = await uploadTempleImage(file);
    if (error) {
      setMessage({ type: "error", text: error });
    } else if (url) {
      setImageUrl(url);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
      setMessage({ type: "success", text: "រូបភាពត្រូវបាន Upload ទៅ Supabase Storage ដោយជោគជ័យ!" });
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      setMessage({ type: "error", text: "សូមបញ្ចូលចំណងជើង និងរូបភាព (ឬ Upload រូបភាព)" });
      return;
    }

    setSaving(true);
    setMessage(null);

    const { data, error } = await saveGalleryImage({
      title,
      caption,
      image_url: imageUrl,
      published,
    });

    if (error) {
      setMessage({ type: "error", text: `កំហុស៖ ${error}` });
    } else {
      setMessage({
        type: "success",
        text: "រូបភាពត្រូវបានបញ្ចូលទៅកាន់វិចិត្រសាលដោយជោគជ័យ!",
      });
      resetForm();
      loadGallery();
    }
    setSaving(false);
  }

  async function handleDelete(id: string, itemTitle: string) {
    if (!confirm(`តើអ្នកពិតជាចង់លុបរូបភាព "${itemTitle}" នេះមែនទេ?`)) return;

    const { success, error } = await deleteGalleryImage(id);
    if (!success) {
      setMessage({ type: "error", text: error || "ការលុបមិនបានសម្រេច" });
    } else {
      setMessage({ type: "success", text: "បានលុបរូបភាពដោយជោគជ័យ" });
      setImagesList((prev) => prev.filter((item) => item.id !== id));
    }
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Link href="/admin" className="muted">
            ← ត្រឡប់ទៅផ្ទាំងគ្រប់គ្រង
          </Link>
          <h1 style={{ color: "var(--green)", margin: "8px 0" }}>
            គ្រប់គ្រងវិចិត្រសាល (Gallery Management)
          </h1>
        </div>
      </div>

      {message && (
        <div
          className="notice"
          style={{
            background: message.type === "success" ? "#d4edda" : "#f8d7da",
            borderColor: message.type === "success" ? "#c3e6cb" : "#f5c6cb",
            color: message.type === "success" ? "#155724" : "#721c24",
            marginTop: 14,
          }}
        >
          {message.text}
        </div>
      )}

      {/* Form Section */}
      <div className="admin-box">
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>➕ បន្ថែមរូបភាពទៅវិចិត្រសាល</h2>

        <form onSubmit={handleSubmit} className="form" style={{ maxWidth: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <label className="field">
              ចំណងជើងរូបភាព *
              <input
                required
                placeholder="ចំណងជើងរូបភាព ឬ សកម្មភាព"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="field">
              ការពិពណ៌នាខ្លី (Caption)
              <input
                placeholder="អត្ថបទពិពណ៌នារូបភាព..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <label className="field">
              ជ្រើសរើសរូបភាពផ្ទាល់ពីម៉ាស៊ីន (Supabase Storage)
              <input
                type="file"
                accept="image/*"
                disabled={uploading || !configured}
                onChange={handleFileUpload}
              />
              <span className="small muted">
                {uploading
                  ? "កំពុង Upload រូបភាព..."
                  : configured
                  ? "នឹងត្រូវផ្ទុកទៅ bucket: temple-gallery"
                  : "តម្រូវឱ្យភ្ជាប់ Supabase មុននឹង Upload"}
              </span>
            </label>

            <label className="field">
              ឬ បញ្ចូល URL រូបភាពផ្ទាល់ *
              <input
                required
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </label>
          </div>

          {imageUrl && (
            <div style={{ marginTop: 8 }}>
              <div className="small muted" style={{ marginBottom: 4 }}>គំរូរូបភាព (Preview):</div>
              <img
                src={imageUrl}
                alt="Preview"
                style={{ height: 120, objectFit: "cover", borderRadius: 10, border: "1px solid #ddd" }}
              />
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 0" }}>
            <input
              type="checkbox"
              id="gallery-published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <label htmlFor="gallery-published" style={{ cursor: "pointer", fontWeight: 500 }}>
              បង្ហាញក្នុងវិចិត្រសាលសាធារណៈ (Publish)
            </label>
          </div>

          <button className="btn" type="submit" disabled={saving || uploading} style={{ marginTop: 8 }}>
            {saving ? "កំពុងរក្សាទុក..." : "បញ្ចូលរូបភាព"}
          </button>
        </form>
      </div>

      {/* Gallery Grid Section */}
      <div className="admin-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontSize: 20 }}>រូបភាពទាំងអស់ក្នុង Database ({imagesList.length})</h2>
          <button onClick={loadGallery} className="btn outline" style={{ padding: "6px 14px", fontSize: 13, color: "var(--green)", borderColor: "var(--green)" }}>
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <p className="muted">កំពុងទាញយកទិន្នន័យពី Supabase...</p>
        ) : imagesList.length === 0 ? (
          <div className="notice">
            <p style={{ margin: 0 }}>
              {configured
                ? "មិនទាន់មានរូបភាពក្នុង Database នៅឡើយទេ។ បន្ថែមរូបភាពដំបូងខាងលើ!"
                : "ទិន្នន័យនឹងបង្ហាញនៅទីនេះនៅពេលដែលអ្នកភ្ជាប់ Supabase ក្នុង .env.local"}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {imagesList.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  style={{ width: "100%", height: 150, objectFit: "cover" }}
                />
                <div style={{ padding: 12, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <strong style={{ display: "block", fontSize: 14, marginBottom: 4 }}>{item.title}</strong>
                    {item.caption && <p className="small muted" style={{ margin: 0 }}>{item.caption}</p>}
                  </div>
                  <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "2px 6px",
                        borderRadius: 99,
                        background: item.published ? "#dcfce7" : "#f1f5f9",
                        color: item.published ? "#166534" : "#64748b",
                      }}
                    >
                      {item.published ? "បង្ហាញ" : "លាក់"}
                    </span>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        border: "1px solid #fecaca",
                        background: "#fff1f2",
                        color: "#b91c1c",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      🗑️ លុប
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}