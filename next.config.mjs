/** @type {import('next').NextConfig} */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const nextConfig = {
  output: 'standalone',
  eslint: {
    // Prevent lint errors from failing the production build. Team can fix lint issues separately.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["lh3.googleusercontent.com","images.unsplash.com", "assets.aceternity.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        http: false,
        https: false,
        net: false,
        tls: false,
        fs: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        querystring: false,
      };
    }
    return config;
  },
};

export default nextConfig;
