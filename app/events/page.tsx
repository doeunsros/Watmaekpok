"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import { fetchEvents, EventItem, isSupabaseConfigured } from "@/lib/supabase";

export default function Events() {
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getEvents() {
      if (isSupabaseConfigured()) {
        const data = await fetchEvents(true);
        setEventsList(data);
      }
      setLoading(false);
    }
    getEvents();
  }, []);

  return (
    <PageShell>
      <section className="pagehero">
        <div className="container">
          <h1 style={{ color: "var(--green)", fontSize: 42 }}>កម្មវិធីបុណ្យ និងព្រឹត្តិការណ៍</h1>
          <p className="lead">
            កាលវិភាគពិធីបុណ្យប្រពៃណី សាសនា និងកម្មវិធីជួបជុំពុទ្ធបរិស័ទនៅវត្តមែកពក។
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {eventsList.length === 0 ? (
            <div className="notice" style={{ textAlign: "center", padding: "48px 24px" }}>
              <span style={{ fontSize: 48 }}>📅</span>
              <h2 style={{ marginTop: 16 }}>មិនទាន់មានកម្មវិធីបុណ្យថ្មីនៅឡើយទេ</h2>
              <p className="lead" style={{ margin: "8px auto" }}>
                សូមតាមដានសេចក្តីជូនដំណឹងពីវត្ត ឬទាក់ទងមកកាន់គណៈកម្មការវត្តដើម្បីទទួលព័ត៌មានលម្អិត។
              </p>
            </div>
          ) : (
            <div className="grid">
              {eventsList.map((e) => (
                <article className="card" key={e.id}>
                  {e.image_url ? (
                    <div style={{ position: "relative", width: "100%", height: 220 }}>
                      <Image
                        src={e.image_url}
                        alt={e.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        height: 160,
                        background: "linear-gradient(135deg, #174a36, #2d7a5b)",
                        display: "grid",
                        placeItems: "center",
                        color: "#fff",
                        fontSize: 48,
                      }}
                    >
                      ☸
                    </div>
                  )}
                  <div className="card-body">
                    <span className="pill">
                      📍 {e.location || "វត្តមែកពក"}
                    </span>
                    <h3>{e.title}</h3>
                    {e.description && <p>{e.description}</p>}
                    <div className="muted small" style={{ marginTop: 12 }}>
                      🕒{" "}
                      {new Date(e.starts_at).toLocaleString("km-KH", {
                        dateStyle: "full",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}