"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchNews,
  saveNews,
  deleteNews,
  uploadTempleImage,
  isSupabaseConfigured,
  NewsItem,
} from "@/lib/supabase";

export default function AdminNewsPage() {
  const configured = isSupabaseConfigured();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("ព័ត៌មានវត្ត");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(true);

  useEffect(() => {
    loadNews();
  }, [configured]);

  async function loadNews() {
    setLoading(true);
    if (configured) {
      const data = await fetchNews(false);
      setNewsList(data);
    }
    setLoading(false);
  }

  function resetForm() {
    setEditId(null);
    setTitle("");
    setCategory("ព័ត៌មានវត្ត");
    setExcerpt("");
    setBody("");
    setImageUrl("");
    setPublished(true);
  }

  function handleEdit(item: NewsItem) {
    setEditId(item.id);
    setTitle(item.title);
    setCategory(item.category || "ព័ត៌មានវត្ត");
    setExcerpt(item.excerpt || "");
    setBody(item.body || "");
    setImageUrl(item.image_url || "");
    setPublished(item.published);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      setMessage({ type: "success", text: "រូបភាពត្រូវបាន Upload ទៅកាន់ Supabase Storage ដោយជោគជ័យ!" });
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setMessage({ type: "error", text: "សូមបញ្ចូលចំណងជើងព័ត៌មាន" });
      return;
    }

    setSaving(true);
    setMessage(null);

    const { data, error } = await saveNews(
      {
        title,
        category,
        excerpt,
        body,
        image_url: imageUrl || null,
        published,
      },
      editId || undefined
    );

    if (error) {
      setMessage({ type: "error", text: `កំហុស៖ ${error}` });
    } else {
      setMessage({
        type: "success",
        text: editId ? "ព័ត៌មានត្រូវបានកែសម្រួលដោយជោគជ័យ!" : "ព័ត៌មានថ្មីត្រូវបានបន្ថែមដោយជោគជ័យ!",
      });
      resetForm();
      loadNews();
    }
    setSaving(false);
  }

  async function handleDelete(id: string, itemTitle: string) {
    if (!confirm(`តើអ្នកពិតជាចង់លុបព័ត៌មាន "${itemTitle}" នេះមែនទេ?`)) return;

    const { success, error } = await deleteNews(id);
    if (!success) {
      setMessage({ type: "error", text: error || "ការលុបមិនបានសម្រេច" });
    } else {
      setMessage({ type: "success", text: "បានលុបព័ត៌មានដោយជោគជ័យ" });
      setNewsList((prev) => prev.filter((item) => item.id !== id));
      if (editId === id) resetForm();
    }
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Link href="/admin" className="muted">
            ← ត្រឡប់ទៅផ្ទាំងគ្រប់គ្រង
          </Link>
          <h1 style={{ color: "var(--green)", margin: "8px 0" }}>គ្រប់គ្រងព័ត៌មាន (News Management)</h1>
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
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>
          {editId ? "📝 កែសម្រួលព័ត៌មាន" : "➕ បន្ថែមព័ត៌មានថ្មី"}
        </h2>

        <form onSubmit={handleSubmit} className="form" style={{ maxWidth: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
            <label className="field">
              ចំណងជើងព័ត៌មាន *
              <input
                required
                placeholder="ចំណងជើងជាភាសាខ្មែរ"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="field">
              ប្រភេទ
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="ព័ត៌មានវត្ត">ព័ត៌មានវត្ត</option>
                <option value="សេចក្តីជូនដំណឹង">សេចក្តីជូនដំណឹង</option>
                <option value="សកម្មភាពសង្គម">សកម្មភាពសង្គម</option>
                <option value="គម្រោងកសាង">គម្រោងកសាង</option>
              </select>
            </label>
          </div>

          <label className="field">
            សេចក្តីសង្ខេប (Excerpt)
            <input
              placeholder="ខ្លឹមសារសង្ខេប ១-២ ជួរ"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </label>

          <label className="field">
            ខ្លឹមសារព័ត៌មានពិស្តារ (Body Text)
            <textarea
              rows={6}
              placeholder="សរសេរខ្លឹមសារព័ត៌មានលម្អិតនៅទីនេះ..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <label className="field">
              URL រូបភាពតំណាង
              <input
                placeholder="https://... ឬ Upload ខាងស្តាំ"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </label>

            <label className="field">
              ឬ Upload ពីរូបភាពក្នុងម៉ាស៊ីន (Supabase Storage)
              <input
                type="file"
                accept="image/*"
                disabled={uploading || !configured}
                onChange={handleFileUpload}
              />
              <span className="small muted">
                {uploading ? "កំពុង Upload រូបភាព..." : configured ? "ផ្ទុកទៅ bucket: temple-gallery" : "ត្រូវភ្ជាប់ Supabase មុន Upload"}
              </span>
            </label>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 0" }}>
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <label htmlFor="published" style={{ cursor: "pointer", fontWeight: 500 }}>
              ផ្សព្វផ្សាយជាសាធារណៈ (Publish)
            </label>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button className="btn" type="submit" disabled={saving}>
              {saving ? "កំពុងរក្សាទុក..." : editId ? "ធ្វើបច្ចុប្បន្នភាព" : "រក្សាទុកព័ត៌មាន"}
            </button>
            {editId && (
              <button
                type="button"
                className="btn outline"
                style={{ color: "var(--ink)", borderColor: "#bbb" }}
                onClick={resetForm}
              >
                បោះបង់
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="admin-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontSize: 20 }}>បញ្ជីព័ត៌មានទាំងអស់ ({newsList.length})</h2>
          <button onClick={loadNews} className="btn outline" style={{ padding: "6px 14px", fontSize: 13, color: "var(--green)", borderColor: "var(--green)" }}>
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <p className="muted">កំពុងទាញយកទិន្នន័យពី Supabase...</p>
        ) : newsList.length === 0 ? (
          <div className="notice">
            <p style={{ margin: 0 }}>
              {configured
                ? "មិនទាន់មានព័ត៌មាននៅក្នុង Database នៅឡើយទេ។ សូមបន្ថែមព័ត៌មានដំបូងរបស់អ្នកខាងលើ!"
                : "ទិន្នន័យនឹងបង្ហាញនៅទីនេះនៅពេលដែលអ្នកភ្ជាប់ Supabase ក្នុង .env.local"}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>រូប</th>
                  <th>ចំណងជើង</th>
                  <th>ប្រភេទ</th>
                  <th>ស្ថានភាព</th>
                  <th>កាលបរិច្ឆេទ</th>
                  <th style={{ textAlign: "right" }}>សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                {newsList.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt=""
                          style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8 }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            background: "#e2e8f0",
                            borderRadius: 8,
                            display: "grid",
                            placeItems: "center",
                            fontSize: 18,
                          }}
                        >
                          📰
                        </div>
                      )}
                    </td>
                    <td>
                      <strong>{item.title}</strong>
                      {item.excerpt && <div className="small muted">{item.excerpt.slice(0, 50)}...</div>}
                    </td>
                    <td>
                      <span className="pill" style={{ margin: 0 }}>
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          borderRadius: 999,
                          fontSize: 12,
                          background: item.published ? "#dcfce7" : "#f1f5f9",
                          color: item.published ? "#166534" : "#64748b",
                        }}
                      >
                        {item.published ? "បានផ្សព្វផ្សាយ" : "សេចក្តីព្រាង"}
                      </span>
                    </td>
                    <td className="small muted">
                      {new Date(item.created_at).toLocaleDateString("km-KH")}
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button
                        onClick={() => handleEdit(item)}
                        style={{
                          marginRight: 8,
                          padding: "6px 12px",
                          borderRadius: 8,
                          border: "1px solid #cbd5e1",
                          background: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        ✏️ កែប្រែ
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 8,
                          border: "1px solid #fecaca",
                          background: "#fff1f2",
                          color: "#b91c1c",
                          cursor: "pointer",
                        }}
                      >
                        🗑️ លុប
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}