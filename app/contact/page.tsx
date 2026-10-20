"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { sendContactMessage, isSupabaseConfigured } from "@/lib/supabase";

export default function Contact() {
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const configured = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (!name.trim() || !contactInfo.trim() || !message.trim()) {
      setStatus({ type: "error", text: "សូមបំពេញព័ត៌មានគ្រប់ប្រអប់។" });
      return;
    }

    setLoading(true);

    if (!configured) {
      // Graceful demo notice
      setTimeout(() => {
        setStatus({
          type: "success",
          text: "សារគំរូត្រូវបានផ្ញើជោគជ័យ! (នៅពេលភ្ជាប់ Supabase ក្នុង .env.local សារនឹងត្រូវរក្សាទុកក្នុង Database ដោយស្វ័យប្រវត្តិ)",
        });
        setName("");
        setContactInfo("");
        setMessage("");
        setLoading(false);
      }, 500);
      return;
    }

    const { success, error } = await sendContactMessage(name, contactInfo, message);
    if (!success) {
      setStatus({ type: "error", text: error || "ការផ្ញើសារមិនបានសម្រេច។ សូមព្យាយាមម្តងទៀត។" });
    } else {
      setStatus({
        type: "success",
        text: "សូមអរគុណ! សាររបស់អ្នកត្រូវបានផ្ញើជូនគណៈកម្មការវត្តមែកពកដោយជោគជ័យ។",
      });
      setName("");
      setContactInfo("");
      setMessage("");
    }
    setLoading(false);
  }

  return (
    <PageShell>
      <section className="pagehero">
        <div className="container">
          <h1 style={{ color: "var(--green)", fontSize: 42 }}>ទំនាក់ទំនង</h1>
          <p className="lead">
            សម្រាប់ព័ត៌មានបន្ថែម ឬមានបំណងចូលរួមចំណែកកសាងវត្តមែកពក សូមទាក់ទងមកកាន់យើងខ្ញុំ។
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2>ទាក់ទងមកកាន់វត្ត</h2>
            <div style={{ display: "grid", gap: 14, margin: "20px 0" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 22 }}>📍</span>
                <div>
                  <strong>អាសយដ្ឋាន</strong>
                  <p className="small muted" style={{ margin: 0 }}>
                    ភូមិមែកពក ឃុំមែកពក ស្រុកមេមត់ ខេត្តត្បូងឃ្មុំ
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 22 }}>📞</span>
                <div>
                  <strong>លេខទូរស័ព្ទ</strong>
                  <p className="small muted" style={{ margin: 0 }}>
                    012 345 678 / 098 765 432
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 22 }}>✉️</span>
                <div>
                  <strong>អ៊ីមែល</strong>
                  <p className="small muted" style={{ margin: 0 }}>
                    contact@watmaekpok.org
                  </p>
                </div>
              </div>
            </div>

            <div className="notice" style={{ marginTop: 24, background: "#f8fafc" }}>
              <strong>☸ ម៉ោងចូលនមស្ការ និងទំនាក់ទំនង៖</strong>
              <p className="small muted" style={{ margin: "6px 0 0" }}>
                រាល់ថ្ងៃ ចាប់ពីម៉ោង ៦:០០ ព្រឹក ដល់ ៦:០០ ល្ងាច
              </p>
            </div>
          </div>

          <div>
            {status && (
              <div
                className="notice"
                style={{
                  background: status.type === "success" ? "#d4edda" : "#f8d7da",
                  borderColor: status.type === "success" ? "#c3e6cb" : "#f5c6cb",
                  color: status.type === "success" ? "#155724" : "#721c24",
                  marginBottom: 16,
                }}
              >
                {status.text}
              </div>
            )}

            <form className="form" onSubmit={handleSubmit}>
              <label className="field">
                ឈ្មោះរបស់អ្នក *
                <input
                  required
                  placeholder="សូមបញ្ចូលឈ្មោះរបស់អ្នក"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label className="field">
                លេខទូរស័ព្ទ ឬ អ៊ីមែល *
                <input
                  required
                  placeholder="012 xxx xxx ឬ email@example.com"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                />
              </label>

              <label className="field">
                សាររបស់អ្នក *
                <textarea
                  required
                  rows={5}
                  placeholder="សរសេរសារ ឬសំណួររបស់អ្នកនៅទីនេះ..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </label>

              <button className="btn" type="submit" disabled={loading}>
                {loading ? "កំពុងផ្ញើសារ..." : "ផ្ញើសារ"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </PageShell>
  );
}