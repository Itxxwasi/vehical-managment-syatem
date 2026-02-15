/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  outputFileTracingRoot: process.cwd(),
  webpack: (config, { isServer }) => {
    // Fix for MongoDB native modules
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'mongodb-client-encryption': 'commonjs mongodb-client-encryption',
      });
    }
    return config;
  },
};

export default nextConfig;
