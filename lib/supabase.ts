import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    url &&
    key &&
    !url.includes("YOUR_PROJECT") &&
    !key.includes("YOUR_SUPABASE_ANON_KEY") &&
    url.startsWith("http")
  );
}

export const supabase = url && key ? createClient(url, key) : null;

// ==================== INTERFACES ====================

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  body: string;
  image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  starts_at: string;
  ends_at: string | null;
  image_url: string | null;
  published: boolean;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  image_url: string;
  category_id?: string | null;
  published: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  sender_name: string;
  contact: string;
  message: string;
  status: "new" | "read" | "closed";
  created_at: string;
}

// ==================== HELPER FUNCTIONS ====================

export function generateSlug(text: string): string {
  const clean = text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s\u1780-\u17FF-]/g, "")
    .replace(/\s+/g, "-");
  return `${clean || "post"}-${Date.now().toString(36)}`;
}

// ---------------- NEWS CRUD ----------------

export async function fetchNews(publishedOnly = false): Promise<NewsItem[]> {
  if (!supabase || !isSupabaseConfigured()) return [];
  let query = supabase.from("news").select("*").order("created_at", { ascending: false });
  if (publishedOnly) {
    query = query.eq("published", true);
  }
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching news:", error);
    return [];
  }
  return data || [];
}

export async function saveNews(
  item: Partial<NewsItem> & { title: string },
  id?: string
): Promise<{ data: NewsItem | null; error: string | null }> {
  if (!supabase || !isSupabaseConfigured()) {
    return { data: null, error: "សូមភ្ជាប់ Supabase ជាមុនសិនក្នុងឯកសារ .env.local" };
  }

  const payload: any = {
    title: item.title,
    category: item.category || "ព័ត៌មានវត្ត",
    excerpt: item.excerpt || "",
    body: item.body || "",
    image_url: item.image_url || null,
    published: item.published ?? false,
    published_at: item.published ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  if (!id) {
    payload.slug = item.slug || generateSlug(item.title);
  }

  if (id) {
    const { data, error } = await supabase.from("news").update(payload).eq("id", id).select().single();
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } else {
    const { data, error } = await supabase.from("news").insert(payload).select().single();
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  }
}

export async function deleteNews(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!supabase || !isSupabaseConfigured()) {
    return { success: false, error: "សូមភ្ជាប់ Supabase ជាមុនសិន" };
  }
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

// ---------------- EVENTS CRUD ----------------

export async function fetchEvents(publishedOnly = false): Promise<EventItem[]> {
  if (!supabase || !isSupabaseConfigured()) return [];
  let query = supabase.from("events").select("*").order("starts_at", { ascending: true });
  if (publishedOnly) {
    query = query.eq("published", true);
  }
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }
  return data || [];
}

export async function saveEvent(
  item: Partial<EventItem> & { title: string; starts_at: string },
  id?: string
): Promise<{ data: EventItem | null; error: string | null }> {
  if (!supabase || !isSupabaseConfigured()) {
    return { data: null, error: "សូមភ្ជាប់ Supabase ជាមុនសិនក្នុងឯកសារ .env.local" };
  }

  const payload = {
    title: item.title,
    description: item.description || "",
    location: item.location || "វត្តមែកពក",
    starts_at: item.starts_at,
    ends_at: item.ends_at || null,
    image_url: item.image_url || null,
    published: item.published ?? false,
  };

  if (id) {
    const { data, error } = await supabase.from("events").update(payload).eq("id", id).select().single();
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } else {
    const { data, error } = await supabase.from("events").insert(payload).select().single();
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  }
}

export async function deleteEvent(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!supabase || !isSupabaseConfigured()) {
    return { success: false, error: "សូមភ្ជាប់ Supabase ជាមុនសិន" };
  }
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

// ---------------- GALLERY CRUD ----------------

export async function fetchGalleryImages(publishedOnly = false): Promise<GalleryItem[]> {
  if (!supabase || !isSupabaseConfigured()) return [];
  let query = supabase.from("gallery_images").select("*").order("created_at", { ascending: false });
  if (publishedOnly) {
    query = query.eq("published", true);
  }
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching gallery images:", error);
    return [];
  }
  return data || [];
}

export async function saveGalleryImage(
  item: { title: string; caption?: string; image_url: string; published?: boolean },
  id?: string
): Promise<{ data: GalleryItem | null; error: string | null }> {
  if (!supabase || !isSupabaseConfigured()) {
    return { data: null, error: "សូមភ្ជាប់ Supabase ជាមុនសិនក្នុងឯកសារ .env.local" };
  }

  const payload = {
    title: item.title,
    caption: item.caption || "",
    image_url: item.image_url,
    published: item.published ?? true,
  };

  if (id) {
    const { data, error } = await supabase.from("gallery_images").update(payload).eq("id", id).select().single();
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } else {
    const { data, error } = await supabase.from("gallery_images").insert(payload).select().single();
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  }
}

export async function deleteGalleryImage(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!supabase || !isSupabaseConfigured()) {
    return { success: false, error: "សូមភ្ជាប់ Supabase ជាមុនសិន" };
  }
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

// ---------------- IMAGE STORAGE UPLOAD ----------------

export async function uploadTempleImage(
  file: File,
  bucket = "temple-gallery"
): Promise<{ url: string | null; error: string | null }> {
  if (!supabase || !isSupabaseConfigured()) {
    return { url: null, error: "សូមភ្ជាប់ Supabase និងបង្កើត Storage Bucket ជាមុនសិន។" };
  }

  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || "មានបញ្ហាក្នុងការ Upload រូបភាព" };
  }
}

// ---------------- CONTACT MESSAGES ----------------

export async function sendContactMessage(
  sender_name: string,
  contact: string,
  message: string
): Promise<{ success: boolean; error: string | null }> {
  if (!supabase || !isSupabaseConfigured()) {
    return {
      success: false,
      error: "សូមភ្ជាប់ Supabase ក្នុង .env.local ជាមុនសិនដើម្បីផ្ញើសារពិតប្រាកដ។",
    };
  }

  const { error } = await supabase.from("contact_messages").insert({
    sender_name,
    contact,
    message,
    status: "new",
  });

  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

// ---------------- AUTHENTICATION ----------------

export async function getAdminUser() {
  if (!supabase || !isSupabaseConfigured()) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function adminSignIn(email: string, password: string) {
  if (!supabase || !isSupabaseConfigured()) {
    return { data: null, error: { message: "សូមភ្ជាប់ Supabase ជាមុនសិន" } };
  }
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function adminSignOut() {
  if (!supabase || !isSupabaseConfigured()) return;
  return await supabase.auth.signOut();
}