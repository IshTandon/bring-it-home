/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'media.api-sports.io',
      pathname: '/football/players/**',
    }],
    formats: ['image/webp'],
    minimumCacheTTL: 86400,
  },
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          { key: 'Content-Type', value: 'application/manifest+json' },
        ],
      },
    ];
  },
};

export default nextConfig;
