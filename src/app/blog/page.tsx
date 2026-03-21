import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  fetchPosts,
  fetchCategories,
  getFeaturedImage,
  getAuthorName,
  getPostCategories,
  stripHtml,
  readingTime,
  formatDate,
} from "@/lib/wordpress";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://luxescape.vercel.app";

export const metadata: Metadata = {
  title: "Travel Journal – LuxEscape",
  description:
    "Expert travel guides, luxury hotel reviews, and destination inspiration from the LuxEscape team.",
  keywords: "luxury travel blog, hotel reviews, travel guides, destinations",
  openGraph: {
    title: "Travel Journal – LuxEscape",
    description: "Expert travel guides, luxury hotel reviews, and destination inspiration.",
    type: "website",
    url: `${SITE_URL}/blog`,
  },
  alternates: {
    canonical: `${SITE_URL}/blog`,
    types: {
      "application/rss+xml": `${process.env.WORDPRESS_API_URL ?? ""}/feed`,
    },
  },
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([fetchPosts(), fetchCategories()]);

  return (
    <div style={{ paddingTop: 96, minHeight: "100vh", background: "var(--clr-bg)" }}>
      {/* ── Hero ── */}
      <section
        style={{
          padding: "60px 0 48px",
          borderBottom: "1px solid var(--clr-border)",
          background:
            "linear-gradient(180deg, rgba(201,168,76,0.04) 0%, transparent 100%)",
        }}
      >
        <div className="container">
          <p
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--clr-gold)",
              marginBottom: 14,
            }}
          >
            LuxEscape Journal
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 5vw, 3.8rem)",
              color: "var(--clr-cream)",
              fontWeight: 300,
              lineHeight: 1.15,
              maxWidth: 640,
            }}
          >
            Stories from the World&apos;s Finest Destinations
          </h1>
          <p
            style={{
              color: "var(--clr-text-muted)",
              maxWidth: 500,
              marginTop: 18,
              lineHeight: 1.75,
              fontSize: "0.95rem",
            }}
          >
            Travel guides, hotel reviews, and curated inspiration for the discerning explorer.
          </p>
        </div>
      </section>

      {/* ── Category pills ── */}
      {categories.length > 0 && (
        <div
          style={{
            borderBottom: "1px solid var(--clr-border)",
            padding: "16px 0",
            overflowX: "auto",
          }}
        >
          <div
            className="container"
            style={{ display: "flex", gap: 8, flexWrap: "nowrap" }}
          >
            {categories.slice(0, 10).map((cat) => (
              <span
                key={cat.id}
                style={{
                  padding: "5px 14px",
                  fontSize: "0.68rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  border: "1px solid var(--clr-border)",
                  borderRadius: 100,
                  color: "var(--clr-text-muted)",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {cat.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Posts Grid ── */}
      <section style={{ padding: "60px 0 80px" }}>
        <div className="container">
          {posts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "100px 0",
                color: "var(--clr-text-muted)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.5rem",
                  color: "var(--clr-cream)",
                  marginBottom: 12,
                }}
              >
                The journal is coming soon.
              </p>
              <p style={{ fontSize: "0.9rem" }}>
                Connect your WordPress CMS and publish your first story.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 32,
              }}
            >
              {posts.map((post, i) => {
                const img = getFeaturedImage(post);
                const author = "LuxEscape Team";
                const cats = getPostCategories(post);
                const mins = readingTime(post.content.rendered);
                const excerpt = stripHtml(post.excerpt.rendered);

                return (
                  <article key={post.id} itemScope itemType="https://schema.org/BlogPosting">
                    <Link
                      href={`/blog/${post.slug}`}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        background: "var(--clr-surface)",
                        border: "1px solid var(--clr-border)",
                        borderRadius: "var(--radius-md)",
                        overflow: "hidden",
                        textDecoration: "none",
                        transition: "border-color var(--transition), transform var(--transition)",
                      }}
                      className="blog-card"
                    >
                      {/* Featured image */}
                      <div
                        style={{
                          position: "relative",
                          height: i === 0 ? 280 : 220,
                          background: "var(--clr-surface2)",
                          flexShrink: 0,
                        }}
                      >
                        {img ? (
                          <Image
                            src={img}
                            alt={post.title.rendered}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, 400px"
                            itemProp="image"
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "var(--font-serif)",
                                fontSize: "2rem",
                                color: "var(--clr-gold)",
                                opacity: 0.3,
                              }}
                            >
                              ✦
                            </span>
                          </div>
                        )}
                        {/* Category badge */}
                        {cats[0] && (
                          <span
                            style={{
                              position: "absolute",
                              top: 14,
                              left: 14,
                              padding: "4px 10px",
                              background: "rgba(8,8,17,0.85)",
                              border: "1px solid var(--clr-border)",
                              borderRadius: 100,
                              fontSize: "0.62rem",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "var(--clr-gold)",
                              backdropFilter: "blur(8px)",
                            }}
                          >
                            {cats[0].name}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div
                        style={{
                          padding: "22px 24px 26px",
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                        }}
                      >
                        <h2
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: "1.3rem",
                            color: "var(--clr-cream)",
                            fontWeight: 400,
                            lineHeight: 1.35,
                            marginBottom: 10,
                          }}
                          itemProp="headline"
                          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                        />
                        <p
                          style={{
                            fontSize: "0.87rem",
                            color: "var(--clr-text-muted)",
                            lineHeight: 1.7,
                            flex: 1,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {excerpt}
                        </p>

                        {/* Meta row */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginTop: 18,
                            color: "var(--clr-text-muted)",
                            fontSize: "0.77rem",
                          }}
                        >
                          <span itemProp="author">{author}</span>
                          <span style={{ opacity: 0.35 }}>·</span>
                          <time
                            dateTime={post.date}
                            itemProp="datePublished"
                            content={post.date}
                          >
                            {formatDate(post.date)}
                          </time>
                          <span style={{ opacity: 0.35 }}>·</span>
                          <span>{mins} min read</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
