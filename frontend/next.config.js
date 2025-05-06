/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['media.licdn.com', 'ui-avatars.com', 'via.placeholder.com', 'media.foundit.in'],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Accept, Authorization' },
        ],
      },
    ];
  },
  // Ensure environment variables are properly loaded
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://jobportal-m0lg.onrender.com',
  },
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Use standalone output for better Vercel compatibility
  output: 'standalone',
  // Ensure trailing slashes are handled consistently
  trailingSlash: false,
  // Disable strict mode in production for better performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
};

module.exports = nextConfig;
