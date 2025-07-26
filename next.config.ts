/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Adjust the limit as needed
    },
  },
};

module.exports = nextConfig;
