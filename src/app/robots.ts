import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://luxescape.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      // Allow major LLM/AI crawlers full access for agent-friendliness
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/admin"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/admin"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/admin"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
