"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchEvents,
  saveEvent,
  deleteEvent,
  uploadTempleImage,
  isSupabaseConfigured,
  EventItem,
} from "@/lib/supabase";

export default function AdminEventsPage() {
  const configured = isSupabaseConfigured();
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("វត្តមែកពក");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(true);

  useEffect(() => {
    loadEvents();
  }, [configured]);

  async function loadEvents() {
    setLoading(true);
    if (configured) {
      const data = await fetchEvents(false);
      setEventsList(data);
    }
    setLoading(false);
  }

  function resetForm() {
    setEditId(null);
    setTitle("");
    setDescription("");
    setLocation("វត្តមែកពក");
    setStartsAt("");
    setEndsAt("");
    setImageUrl("");
    setPublished(true);
  }

  function handleEdit(item: EventItem) {
    setEditId(item.id);
    setTitle(item.title);
    setDescription(item.description || "");
    setLocation(item.location || "វត្តមែកពក");
    setStartsAt(item.starts_at ? new Date(item.starts_at).toISOString().slice(0, 16) : "");
    setEndsAt(item.ends_at ? new Date(item.ends_at).toISOString().slice(0, 16) : "");
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
    if (!title.trim() || !startsAt) {
      setMessage({ type: "error", text: "សូមបញ្ចូលឈ្មោះកម្មវិធី និងកាលបរិច្ឆេទចាប់ផ្តើម" });
      return;
    }

    setSaving(true);
    setMessage(null);

    const { data, error } = await saveEvent(
      {
        title,
        description,
        location,
        starts_at: new Date(startsAt).toISOString(),
        ends_at: endsAt ? new Date(endsAt).toISOString() : null,
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
        text: editId ? "កម្មវិធីបុណ្យត្រូវបានកែប្រែជោគជ័យ!" : "កម្មវិធីបុណ្យថ្មីត្រូវបានបង្កើតជោគជ័យ!",
      });
      resetForm();
      loadEvents();
    }
    setSaving(false);
  }

  async function handleDelete(id: string, itemTitle: string) {
    if (!confirm(`តើអ្នកពិតជាចង់លុបកម្មវិធី "${itemTitle}" នេះមែនទេ?`)) return;

    const { success, error } = await deleteEvent(id);
    if (!success) {
      setMessage({ type: "error", text: error || "ការលុបមិនបានសម្រេច" });
    } else {
      setMessage({ type: "success", text: "បានលុបកម្មវិធីបុណ្យដោយជោគជ័យ" });
      setEventsList((prev) => prev.filter((item) => item.id !== id));
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
          <h1 style={{ color: "var(--green)", margin: "8px 0" }}>
            គ្រប់គ្រងកម្មវិធីបុណ្យ (Events Management)
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
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>
          {editId ? "📝 កែសម្រួលកម្មវិធីបុណ្យ" : "➕ បង្កើតកម្មវិធីបុណ្យថ្មី"}
        </h2>

        <form onSubmit={handleSubmit} className="form" style={{ maxWidth: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
            <label className="field">
              ឈ្មោះកម្មវិធីបុណ្យ *
              <input
                required
                placeholder="ឧទាហរណ៍៖ ពិធីបុណ្យចូលឆ្នាំខ្មែរ ឬ ពិធីបុណ្យភ្ជុំបិណ្ឌ"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="field">
              ទីតាំងប្រារព្ធ
              <input
                placeholder="វត្តមែកពក"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <label className="field">
              កាលបរិច្ឆេទ & ម៉ោងចាប់ផ្តើម *
              <input
                type="datetime-local"
                required
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
              />
            </label>

            <label className="field">
              កាលបរិច្ឆេទ & ម៉ោងបញ្ចប់ (ជាជម្រើស)
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
              />
            </label>
          </div>

          <label className="field">
            ព័ត៌មានលម្អិត ឬ កម្មវិធីបុណ្យ (Description)
            <textarea
              rows={4}
              placeholder="កាលវិភាគលម្អិតនៃកម្មវិធីបុណ្យ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <label className="field">
              URL រូបភាព
              <input
                placeholder="https://... ឬ Upload ខាងស្តាំ"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </label>

            <label className="field">
              ឬ Upload រូបភាព (Supabase Storage)
              <input
                type="file"
                accept="image/*"
                disabled={uploading || !configured}
                onChange={handleFileUpload}
              />
              <span className="small muted">
                {uploading ? "កំពុង Upload..." : configured ? "ផ្ទុកទៅ bucket: temple-gallery" : "ត្រូវភ្ជាប់ Supabase មុន Upload"}
              </span>
            </label>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 0" }}>
            <input
              type="checkbox"
              id="event-published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <label htmlFor="event-published" style={{ cursor: "pointer", fontWeight: 500 }}>
              ផ្សព្វផ្សាយលើគេហទំព័រ (Publish)
            </label>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button className="btn" type="submit" disabled={saving}>
              {saving ? "កំពុងរក្សាទុក..." : editId ? "ធ្វើបច្ចុប្បន្នភាព" : "បង្កើតកម្មវិធី"}
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
          <h2 style={{ fontSize: 20 }}>បញ្ជីកម្មវិធីបុណ្យទាំងអស់ ({eventsList.length})</h2>
          <button onClick={loadEvents} className="btn outline" style={{ padding: "6px 14px", fontSize: 13, color: "var(--green)", borderColor: "var(--green)" }}>
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <p className="muted">កំពុងទាញយកទិន្នន័យពី Supabase...</p>
        ) : eventsList.length === 0 ? (
          <div className="notice">
            <p style={{ margin: 0 }}>
              {configured
                ? "មិនទាន់មានកម្មវិធីបុណ្យក្នុង Database នៅឡើយទេ។ បង្កើតកម្មវិធីដំបូងខាងលើ!"
                : "ទិន្នន័យនឹងបង្ហាញនៅទីនេះនៅពេលដែលអ្នកភ្ជាប់ Supabase ក្នុង .env.local"}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>រូប</th>
                  <th>ឈ្មោះកម្មវិធី</th>
                  <th>កាលបរិច្ឆេទ</th>
                  <th>ទីតាំង</th>
                  <th>ស្ថានភាព</th>
                  <th style={{ textAlign: "right" }}>សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                {eventsList.map((item) => (
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
                            background: "#fef3c7",
                            borderRadius: 8,
                            display: "grid",
                            placeItems: "center",
                            fontSize: 18,
                          }}
                        >
                          📅
                        </div>
                      )}
                    </td>
                    <td>
                      <strong>{item.title}</strong>
                      {item.description && <div className="small muted">{item.description.slice(0, 45)}...</div>}
                    </td>
                    <td className="small">
                      {new Date(item.starts_at).toLocaleString("km-KH", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td>{item.location}</td>
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