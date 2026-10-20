"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import { news as defaultNews } from "@/lib/content";
import { fetchNews, NewsItem, isSupabaseConfigured } from "@/lib/supabase";

export default function News() {
  const [newsList, setNewsList] = useState<any[]>(defaultNews);
  const [isFromDb, setIsFromDb] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getNews() {
      if (isSupabaseConfigured()) {
        const data = await fetchNews(true);
        if (data && data.length > 0) {
          setNewsList(
            data.map((item) => ({
              title: item.title,
              category: item.category,
              date: new Date(item.created_at).toLocaleDateString("km-KH"),
              image: item.image_url || "/images/854934495_122308186736068902_8102044061152390446_n.jpg",
              description: item.excerpt || item.body,
            }))
          );
          setIsFromDb(true);
        }
      }
      setLoading(false);
    }
    getNews();
  }, []);

  return (
    <PageShell>
      <section className="pagehero">
        <div className="container">
          <h1 style={{ color: "var(--green)", fontSize: 42 }}>ព័ត៌មាន និងសេចក្តីជូនដំណឹង</h1>
          <p className="lead">
            តាមដានព័ត៌មានថ្មីៗ សេចក្តីជូនដំណឹង និងសកម្មភាពនានារបស់វត្តមែកពក។
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid">
          {newsList.map((n, idx) => (
            <article className="card" key={`${n.title}-${idx}`}>
              <div style={{ position: "relative", width: "100%", height: 220 }}>
                <Image
                  src={n.image}
                  alt={n.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="card-body">
                <span className="pill">{n.category}</span>
                <h3>{n.title}</h3>
                <p>{n.description}</p>
                <span className="muted">{n.date}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}