"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminSignIn, isSupabaseConfigured } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const configured = isSupabaseConfigured();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!configured) {
      setErrorMsg("Supabase មិនទាន់ត្រូវបានកំណត់ក្នុង .env.local នៅឡើយទេ។ សូមពិនិត្យមើល URL និង Key។");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await adminSignIn(email, password);
      if (error) {
        setErrorMsg(error.message || "ការចូលប្រើប្រាស់មិនជោគជ័យ។ សូមពិនិត្យ Email ឬ ពាក្យសម្ងាត់។");
      } else if (data?.user) {
        setSuccessMsg("ចូលប្រព័ន្ធជោគជ័យ! កំពុងបញ្ជូនបន្ត...");
        setTimeout(() => {
          router.push("/admin");
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "មានបញ្ហាក្នុងការភ្ជាប់");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 440, margin: "60px auto", padding: "0 16px" }}>
      <div className="admin-box" style={{ padding: "32px 28px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <span style={{ fontSize: 44 }}>☸</span>
          <h1 style={{ color: "var(--green)", fontSize: 26, margin: "8px 0" }}>
            ចូលកាន់ប្រព័ន្ធគ្រប់គ្រង
          </h1>
          <p className="small" style={{ color: "var(--ink)", opacity: 0.7 }}>
            វត្តមែកពក — ផ្ទាំងគ្រប់គ្រងរដ្ឋបាល
          </p>
        </div>

        {!configured && (
          <div className="notice" style={{ background: "#fff3cd", borderColor: "#ffeeba", marginBottom: 20 }}>
            <strong>⚠️ ការជូនដំណឹង៖</strong>
            <p className="small" style={{ margin: "6px 0 0" }}>
              Supabase មិនទាន់ត្រូវបានភ្ជាប់ពិតប្រាកដក្នុង <code>.env.local</code> ទេ។
              អ្នកនៅតែអាចចូលពិនិត្យ UI ផ្ទាំងគ្រប់គ្រងបានដោយចុចតំណភ្ជាប់ខាងក្រោម។
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="notice" style={{ background: "#f8d7da", borderColor: "#f5c6cb", color: "#721c24", marginBottom: 16 }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="notice" style={{ background: "#d4edda", borderColor: "#c3e6cb", color: "#155724", marginBottom: 16 }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="form">
          <label className="field">
            អ៊ីមែល (Email)
            <input
              type="email"
              required
              placeholder="admin@watmaekpok.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="field">
            ពាក្យសម្ងាត់ (Password)
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button
            type="submit"
            className="btn"
            disabled={loading}
            style={{ width: "100%", marginTop: 8 }}
          >
            {loading ? "កំពុងត្រួតពិនិត្យ..." : "ចូលគណនី (Sign In)"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 14 }}>
          <Link href="/admin" className="muted" style={{ display: "block", marginBottom: 8 }}>
            ចូលទៅកាន់ផ្ទាំងគ្រប់គ្រងផ្ទាល់ (Demo / Preview) →
          </Link>
          <Link href="/" className="muted">
            ← ត្រឡប់ទៅគេហទំព័រដើម
          </Link>
        </div>
      </div>
    </div>
  );
}
