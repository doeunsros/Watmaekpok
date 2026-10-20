"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import { allPhotos as defaultPhotos } from "@/lib/content";
import { fetchGalleryImages, isSupabaseConfigured, GalleryItem } from "@/lib/supabase";

export default function Gallery() {
  const [photos, setPhotos] = useState<any[]>(defaultPhotos);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getImages() {
      if (isSupabaseConfigured()) {
        const dbImages = await fetchGalleryImages(true);
        if (dbImages && dbImages.length > 0) {
          const formattedDbImages = dbImages.map((img) => ({
            src: img.image_url,
            title: img.title,
            desc: img.caption,
          }));
          // Put newest database images at the top
          setPhotos([...formattedDbImages, ...defaultPhotos]);
        }
      }
      setLoading(false);
    }
    getImages();
  }, []);

  return (
    <PageShell>
      <section className="pagehero">
        <div className="container">
          <h1 style={{ color: "var(--green)", fontSize: 42 }}>វិចិត្រសាលរូបភាព</h1>
          <p className="lead">
            រូបថតពិត សកម្មភាពពុទ្ធបរិស័ទ និងគំនូរប្លង់ស្ថាបត្យកម្មនៃវត្តមែកពក។
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container gallery">
          {photos.map((item, i) => (
            <div
              key={`${item.src}-${i}`}
              title={item.title}
              style={{
                borderRadius: 14,
                overflow: "hidden",
                position: "relative",
                height: 200,
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}