/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ["lh3.googleusercontent.com","images.unsplash.com", "assets.aceternity.com" ,'api.dicebear.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '**',
      }
    ],
  },
};

export default nextConfig;
