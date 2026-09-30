/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "donpedrohabana.com" },
      { protocol: "https", hostname: "www.donpedrohabana.com" },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
