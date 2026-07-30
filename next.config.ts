import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mini-erp/ui', '@mini-erp/shared-types'],
  typedRoutes: true,
};

export default nextConfig;
