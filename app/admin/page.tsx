"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchNews,
  fetchEvents,
  fetchGalleryImages,
  isSupabaseConfigured,
  getAdminUser,
} from "@/lib/supabase";

export default function AdminHome() {
  const configured = isSupabaseConfigured();
  const [newsCount, setNewsCount] = useState<number | null>(null);
  const [eventsCount, setEventsCount] = useState<number | null>(null);
  const [galleryCount, setGalleryCount] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (configured) {
      fetchNews(false).then((data) => setNewsCount(data.length));
      fetchEvents(false).then((data) => setEventsCount(data.length));
      fetchGalleryImages(false).then((data) => setGalleryCount(data.length));
      getAdminUser().then((u) => setUser(u));
    }
  }, [configured]);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ color: "var(--green)", fontSize: 32, margin: "0 0 6px" }}>
            ផ្ទាំងគ្រប់គ្រង (Admin Dashboard)
          </h1>
          <p style={{ margin: 0, color: "var(--ink)", opacity: 0.8 }}>
            ប្រព័ន្ធគ្រប់គ្រងមាតិកា និងទិន្នន័យគេហទំព័រវត្តមែកពក
          </p>
        </div>

        <div>
          {user ? (
            <div style={{ background: "#e0f2fe", border: "1px solid #bae6fd", padding: "8px 16px", borderRadius: 12, fontSize: 13, color: "#0369a1" }}>
              👤 អ្នកគ្រប់គ្រង៖ <strong>{user.email}</strong>
            </div>
          ) : (
            <Link
              href="/admin/login"
              className="btn"
              style={{ padding: "8px 16px", fontSize: 14 }}
            >
              🔐 ចូលគណនី (Login)
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid" style={{ marginTop: 24 }}>
        <article className="admin-box" style={{ margin: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 28 }}>📰</span>
            <span style={{ fontSize: 26, fontWeight: 700, color: "var(--green)" }}>
              {newsCount !== null ? newsCount : "—"}
            </span>
          </div>
          <h2 style={{ fontSize: 18, margin: "12px 0 4px" }}>ព័ត៌មាន (News)</h2>
          <p className="small muted">គ្រប់គ្រងសេចក្តីជូនដំណឹង និងសកម្មភាព</p>
          <Link className="btn" href="/admin/news" style={{ marginTop: 12, width: "100%", padding: "8px 14px", fontSize: 14 }}>
            គ្រប់គ្រងព័ត៌មាន →
          </Link>
        </article>

        <article className="admin-box" style={{ margin: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 28 }}>📅</span>
            <span style={{ fontSize: 26, fontWeight: 700, color: "var(--green)" }}>
              {eventsCount !== null ? eventsCount : "—"}
            </span>
          </div>
          <h2 style={{ fontSize: 18, margin: "12px 0 4px" }}>កម្មវិធីបុណ្យ (Events)</h2>
          <p className="small muted">កាលវិភាគពិធីបុណ្យ និងព្រឹត្តិការណ៍នានា</p>
          <Link className="btn" href="/admin/events" style={{ marginTop: 12, width: "100%", padding: "8px 14px", fontSize: 14 }}>
            គ្រប់គ្រងកម្មវិធីបុណ្យ →
          </Link>
        </article>

        <article className="admin-box" style={{ margin: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 28 }}>🖼️</span>
            <span style={{ fontSize: 26, fontWeight: 700, color: "var(--green)" }}>
              {galleryCount !== null ? galleryCount : "—"}
            </span>
          </div>
          <h2 style={{ fontSize: 18, margin: "12px 0 4px" }}>វិចិត្រសាល (Gallery)</h2>
          <p className="small muted">រូបភាពព្រះវិហារ និងសកម្មភាពពុទ្ធបរិស័ទ</p>
          <Link className="btn" href="/admin/gallery" style={{ marginTop: 12, width: "100%", padding: "8px 14px", fontSize: 14 }}>
            គ្រប់គ្រងរូបភាព →
          </Link>
        </article>
      </div>

      {/* Supabase Connection Setup Card */}
      <div className="admin-box" style={{ marginTop: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 24 }}>⚡</span>
          <h2 style={{ fontSize: 20, margin: 0 }}>
            ស្ថានភាពតភ្ជាប់ Supabase (Connection Status)
          </h2>
        </div>

        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
            <span>{configured ? "✅" : "⚠️"}</span>
            <div style={{ flex: 1 }}>
              <strong>1. ការកំណត់ Environment Variables</strong>
              <div className="small muted">
                {configured
                  ? "បានកំណត់ NEXT_PUBLIC_SUPABASE_URL និង NEXT_PUBLIC_SUPABASE_ANON_KEY រួចរាល់"
                  : "កំពុងប្រើប្រាស់តម្លៃ Placeholder ក្នុង .env.local — ត្រូវការបញ្ចូល URL និង Public Key ពិតប្រាកដ"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
            <span>📋</span>
            <div style={{ flex: 1 }}>
              <strong>2. បង្កើត Tables ក្នុង Supabase</strong>
              <div className="small muted">
                ចូល Supabase SQL Editor រួច Run កូដក្នុងឯកសារ <code>supabase/schema.sql</code> ដើម្បីបង្កើត tables (news, events, gallery_images, profiles, contact_messages)
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
            <span>🗂️</span>
            <div style={{ flex: 1 }}>
              <strong>3. បង្កើត Supabase Storage Bucket</strong>
              <div className="small muted">
                បង្កើត Bucket ឈ្មោះ <code>temple-gallery</code> និងកំណត់ Public Access ឬ Policy សម្រាប់ផ្ទុករូបភាពពីកុំព្យូទ័រ
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
            <span>👤</span>
            <div style={{ flex: 1 }}>
              <strong>4. បង្កើតគណនី Admin</strong>
              <div className="small muted">
                បង្កើត User ក្នុង Supabase Authentication រួចបញ្ចូល id ទៅក្នុងតារាង <code>public.profiles</code> ជាមួយ role: <code>admin</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}