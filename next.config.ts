import type { NextConfig } from "next";

// Extract just the hostname from WORDPRESS_API_URL (if set) for the image allowlist.
// Falls back to a wildcard so the build doesn't fail before WordPress is connected.
function wordpressHostname(): string {
  const raw = process.env.WORDPRESS_API_URL ?? "";
  try {
    return new URL(raw).hostname;
  } catch {
    return "**"; // wildcard — works once a real URL is added
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // WordPress featured images
      {
        protocol: "https",
        hostname: wordpressHostname(),
        pathname: "/**",
      },
      // Allow http as well (common for local/Railway WordPress installs)
      {
        protocol: "http",
        hostname: wordpressHostname(),
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
