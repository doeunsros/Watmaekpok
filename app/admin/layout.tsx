"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getAdminUser, adminSignOut, isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    getAdminUser().then((u) => {
      setUser(u);
      setLoading(false);
    });

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [configured]);

  async function handleLogout() {
    await adminSignOut();
    setUser(null);
    router.push("/admin/login");
  }

  // If on login page, just render the child login component directly
  if (isLoginPage) {
    return <main style={{ minHeight: "100vh", background: "#f5f5f0", display: "grid", placeItems: "center" }}>{children}</main>;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <Link href="/" style={{ fontWeight: 700, fontSize: 20 }}>
          ☸ វត្តមែកពក
        </Link>
        <p className="small" style={{ opacity: 0.8, marginTop: 4 }}>ផ្ទាំងគ្រប់គ្រងរដ្ឋបាល</p>

        <div style={{ margin: "16px 0", padding: "10px 12px", background: "rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 13 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: configured ? "#4ade80" : "#facc15" }}></span>
            <span>{configured ? "Supabase: ភ្ជាប់រួច" : "Supabase: Demo Mode"}</span>
          </div>
          {user ? (
            <div style={{ marginTop: 8, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 8 }}>
              <div style={{ fontSize: 12, opacity: 0.8, overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
              <button
                onClick={handleLogout}
                style={{
                  marginTop: 6,
                  background: "transparent",
                  color: "#f87171",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: 12,
                }}
              >
                ចាកចេញ (Sign Out)
              </button>
            </div>
          ) : (
            <div style={{ marginTop: 6 }}>
              <Link href="/admin/login" style={{ fontSize: 12, color: "#93c5fd" }}>
                ចូលគណនី (Login) →
              </Link>
            </div>
          )}
        </div>

        <nav className="admin-nav">
          <Link href="/admin" style={{ background: pathname === "/admin" ? "rgba(255,255,255,0.2)" : undefined }}>
            📊 ទិដ្ឋភាពទូទៅ
          </Link>
          <Link href="/admin/news" style={{ background: pathname === "/admin/news" ? "rgba(255,255,255,0.2)" : undefined }}>
            📰 ព័ត៌មាន (News)
          </Link>
          <Link href="/admin/events" style={{ background: pathname === "/admin/events" ? "rgba(255,255,255,0.2)" : undefined }}>
            📅 កម្មវិធីបុណ្យ (Events)
          </Link>
          <Link href="/admin/gallery" style={{ background: pathname === "/admin/gallery" ? "rgba(255,255,255,0.2)" : undefined }}>
            🖼️ វិចិត្រសាល (Gallery)
          </Link>
          <Link href="/" target="_blank" style={{ marginTop: 12, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 14 }}>
            🌐 មើលគេហទំព័រ ↗
          </Link>
        </nav>
      </aside>

      <main className="admin-main">
        {!configured && (
          <div className="notice" style={{ background: "#fffbeb", borderColor: "#fef3c7", marginBottom: 20 }}>
            <strong style={{ color: "#b45309" }}>💡 ចំណាំអំពីការភ្ជាប់ Database:</strong>
            <p className="small" style={{ margin: "4px 0 0", color: "#92400e" }}>
              ដើម្បីឱ្យការរក្សាទុកទិន្នន័យ និងរូបភាពដំណើរការចូលទៅកាន់ Supabase ដោយផ្ទាល់ សូមបញ្ចូល <code>NEXT_PUBLIC_SUPABASE_URL</code> និង <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> របស់អ្នកនៅក្នុងឯកសារ <code>.env.local</code>។
            </p>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}