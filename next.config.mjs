/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  poweredByHeader: false,  
  images: { unoptimized: true},  
  output: isProd ? 'export' : undefined,
  assetPrefix: isProd ? '/starlighttrader.github.io/' : '',
  basePath: isProd ? '/starlighttrader.github.io' : '',
};

export default nextConfig;
