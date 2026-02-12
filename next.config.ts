import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        // Legend Cinema CDN (Vista)
        protocol: "https",
        hostname: "legen-digital-cdn.app.vista.co",
      },
      {
        // Vista CDN wildcard — Legend may use other subdomains
        protocol: "https",
        hostname: "*.app.vista.co",
      },
      {
        // Legend main domain
        protocol: "https",
        hostname: "legend.com.kh",
      },
      {
        // Legend subdomains (e.g. cdn.legend.com.kh)
        protocol: "https",
        hostname: "*.legend.com.kh",
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
