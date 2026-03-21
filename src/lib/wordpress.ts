// WordPress Headless CMS — REST API v2 client
// All fetches use ISR (revalidate: 300 = 5 min) so new posts appear automatically

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  author: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: Array<{
      name: string;
      link: string;
      avatar_urls?: { [key: string]: string };
    }>;
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
      media_details?: {
        sizes?: {
          medium_large?: { source_url: string };
          large?: { source_url: string };
          full?: { source_url: string };
        };
      };
    }>;
    "wp:term"?: Array<WPCategory[]>;
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
}

const WP_API = (process.env.WORDPRESS_API_URL ?? "").replace(/\/$/, "");

async function wpFetch<T>(path: string, revalidate = 300): Promise<T> {
  if (!WP_API) {
    console.warn("[WordPress] WORDPRESS_API_URL is not set — returning empty data.");
    return [] as unknown as T;
  }
  const url = `${WP_API}/wp-json/wp/v2${path}`;
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`WordPress API error ${res.status} for ${url}`);
  }
  return res.json() as Promise<T>;
}

/** Fetch paginated published posts, newest first */
export async function fetchPosts(page = 1, perPage = 12): Promise<WPPost[]> {
  try {
    return await wpFetch<WPPost[]>(
      `/posts?_embed&per_page=${perPage}&page=${page}&status=publish&orderby=date&order=desc`
    );
  } catch {
    return [];
  }
}

/** Fetch a single post by slug (returns null if not found) */
export async function fetchPost(slug: string): Promise<WPPost | null> {
  try {
    const posts = await wpFetch<WPPost[]>(
      `/posts?slug=${encodeURIComponent(slug)}&_embed&status=publish`
    );
    return posts[0] ?? null;
  } catch {
    return null;
  }
}

/** Fetch all categories (for sidebar / filters) */
export async function fetchCategories(): Promise<WPCategory[]> {
  try {
    return await wpFetch<WPCategory[]>(
      "/categories?per_page=50&orderby=count&order=desc&hide_empty=true"
    );
  } catch {
    return [];
  }
}

/** Fetch all post slugs for generateStaticParams */
export async function fetchAllPostSlugs(): Promise<string[]> {
  try {
    const posts = await wpFetch<Array<{ slug: string }>>(
      "/posts?per_page=100&_fields=slug&status=publish",
      3600 // 1 hour cache for slug list
    );
    return posts.map((p) => p.slug);
  } catch {
    return [];
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns the best available featured image URL */
export function getFeaturedImage(post: WPPost): string {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  return (
    media?.media_details?.sizes?.large?.source_url ??
    media?.media_details?.sizes?.medium_large?.source_url ??
    media?.source_url ??
    ""
  );
}

/** Returns the author display name */
export function getAuthorName(post: WPPost): string {
  return post._embedded?.author?.[0]?.name ?? "LuxEscape Team";
}

/** Returns the categories attached to a post */
export function getPostCategories(post: WPPost): WPCategory[] {
  return post._embedded?.["wp:term"]?.[0] ?? [];
}

/** Strip HTML tags and entities for plain-text excerpts */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/** Estimate reading time in minutes (200 wpm average) */
export function readingTime(html: string): number {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Format a WP date string to a readable display date */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
