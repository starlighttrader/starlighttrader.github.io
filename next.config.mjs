/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  poweredByHeader: false,
  assetPrefix: isProd ? '/starlighttrader.github.io/' : '',
  basePath: isProd ? '/starlighttrader.github.io' : '',
};

export default nextConfig;
