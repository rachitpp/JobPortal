/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['media.licdn.com', 'ui-avatars.com', 'via.placeholder.com', 'media.foundit.in'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Accept, Authorization',
          },
        ],
      },
    ];
  },
  output: 'standalone',
};

module.exports = nextConfig;
