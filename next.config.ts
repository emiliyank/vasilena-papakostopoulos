import type { NextConfig } from "next";

const projectSlugs = [
  "form",
  "balance",
  "rhythm",
  "variations",
  "scale",
  "heritage",
  "unity",
  "potential",
] as const;

const blogSlugs = [
  "where-do-we-start",
  "interior-design-and-3d-visualisation-what-is-the-diference",
  "interior-styling-why-the-smallest-details-turn-a-space-into-a-true-home",
  "how-the-process-of-creating-an-interior-design-works",
] as const;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "dl.airtable.com",
      },
      {
        protocol: "https",
        hostname: "v5.airtableusercontent.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/portfolio",
        destination: "/en",
        permanent: true,
      },
      {
        source: "/portfolio/blog",
        destination: "/en/blog",
        permanent: true,
      },
      {
        source: "/vassilena-papakost-1/services-4",
        destination: "/en/prices",
        permanent: true,
      },
      ...projectSlugs.map((slug) => ({
        source: `/portfolio/portfolio-collections/portfolio/${slug}`,
        destination: `/en/projects/${slug}`,
        permanent: true as const,
      })),
      ...blogSlugs.map((slug) => ({
        source: `/portfolio/post/${slug}`,
        destination: `/en/blog/${slug}`,
        permanent: true as const,
      })),
    ];
  },
};

export default nextConfig;
