/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: isProd ? 'export' : undefined,
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SLT_TGBOT_TOKEN: process.env.NEXT_PUBLIC_SLT_TGBOT_TOKEN,
    NEXT_PUBLIC_SLT_TG_CHANNELID: process.env.NEXT_PUBLIC_SLT_TG_CHANNELID,
  },
};

export default nextConfig;
