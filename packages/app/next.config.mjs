/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@playlink/shared'],
  async headers() {
    const allowedOrigins =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'
        : 'https://admin.playlink.app';
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: allowedOrigins },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
