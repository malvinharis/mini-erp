import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // emit a self-contained server build (server.js + traced deps) for the Docker runtime
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['@mini-erp/ui', '@mini-erp/shared-types'],
  typedRoutes: true,
};

export default nextConfig;
