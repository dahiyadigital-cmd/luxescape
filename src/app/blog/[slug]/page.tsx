import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  fetchPost,
  getFeaturedImage,
  getAuthorName,
  getPostCategories,
  stripHtml,
  readingTime,
  formatDate,
} from "@/lib/wordpress";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://luxescape.vercel.app";

// ── SEO metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) return { title: "Post Not Found – LuxEscape" };

  const img = getFeaturedImage(post);
  const description = stripHtml(post.excerpt.rendered).slice(0, 160);
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${stripHtml(post.title.rendered)} – LuxEscape`,
    description,
    keywords: `luxury travel, ${getPostCategories(post)
      .map((c) => c.name)
      .join(", ")}`,
    authors: [{ name: getAuthorName(post) }],
    openGraph: {
      title: stripHtml(post.title.rendered),
      description,
      type: "article",
      url: canonicalUrl,
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [getAuthorName(post)],
      images: img ? [{ url: img, width: 1200, height: 630, alt: stripHtml(post.title.rendered) }] : [],
      siteName: "LuxEscape",
    },
    twitter: {
      card: "summary_large_image",
      title: stripHtml(post.title.rendered),
      description,
      images: img ? [img] : [],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) notFound();

  const img = getFeaturedImage(post);
  const author = getAuthorName(post);
  const cats = getPostCategories(post);
  const mins = readingTime(post.content.rendered);
  const description = stripHtml(post.excerpt.rendered).slice(0, 160);
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  // JSON-LD — Article schema (SEO + LLM + agent friendly)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: stripHtml(post.title.rendered),
    description,
    image: img || undefined,
    datePublished: post.date,
    dateModified: post.modified,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "LuxEscape",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    keywords: cats.map((c) => c.name).join(", "),
    url: canonicalUrl,
    inLanguage: "en-US",
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div
        style={{ paddingTop: 96, minHeight: "100vh", background: "var(--clr-bg)" }}
        itemScope
        itemType="https://schema.org/Article"
      >
        {/* ── Hero image ── */}
        {img && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "clamp(240px, 45vw, 520px)",
              overflow: "hidden",
            }}
          >
            <Image
              src={img}
              alt={stripHtml(post.title.rendered)}
              fill
              style={{ objectFit: "cover" }}
              priority
              sizes="100vw"
              itemProp="image"
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(8,8,17,0.25) 0%, rgba(8,8,17,0.75) 100%)",
              }}
            />
          </div>
        )}

        {/* ── Article ── */}
        <article style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 80px" }}>
          {/* Back link */}
          <div style={{ padding: "28px 0 0" }}>
            <Link
              href="/blog"
              style={{
                fontSize: "0.78rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--clr-text-muted)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ← Journal
            </Link>
          </div>

          {/* Category */}
          {cats[0] && (
            <p
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--clr-gold)",
                marginTop: 28,
                marginBottom: 14,
              }}
            >
              {cats[0].name}
            </p>
          )}

          {/* Title */}
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.9rem, 4vw, 3rem)",
              color: "var(--clr-cream)",
              fontWeight: 300,
              lineHeight: 1.2,
              marginBottom: 20,
            }}
            itemProp="headline"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {/* Meta row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 10,
              paddingBottom: 24,
              borderBottom: "1px solid var(--clr-border)",
              marginBottom: 40,
              color: "var(--clr-text-muted)",
              fontSize: "0.82rem",
            }}
          >
            <span itemProp="author" itemScope itemType="https://schema.org/Person">
              <span itemProp="name">{author}</span>
            </span>
            <span style={{ opacity: 0.35 }}>·</span>
            <time
              dateTime={post.date}
              itemProp="datePublished"
            >
              {formatDate(post.date)}
            </time>
            {post.modified !== post.date && (
              <>
                <span style={{ opacity: 0.35 }}>·</span>
                <span>
                  Updated{" "}
                  <time dateTime={post.modified} itemProp="dateModified">
                    {formatDate(post.modified)}
                  </time>
                </span>
              </>
            )}
            <span style={{ opacity: 0.35 }}>·</span>
            <span>{mins} min read</span>
            {cats.length > 0 && (
              <>
                <span style={{ opacity: 0.35 }}>·</span>
                <span>{cats.map((c) => c.name).join(", ")}</span>
              </>
            )}
          </div>

          {/* WordPress content */}
          <div
            className="wp-content"
            itemProp="articleBody"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {/* Footer divider */}
          <div
            style={{
              marginTop: 60,
              paddingTop: 32,
              borderTop: "1px solid var(--clr-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <Link
              href="/blog"
              style={{
                fontSize: "0.82rem",
                color: "var(--clr-gold)",
                letterSpacing: "0.04em",
              }}
            >
              ← Back to Journal
            </Link>
            <Link
              href="/deals"
              className="btn-primary"
              style={{ padding: "10px 20px", fontSize: "0.82rem" }}
            >
              Explore Deals
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
