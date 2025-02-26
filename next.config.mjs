/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: isProd ? 'export' : undefined,
  images: { unoptimized: true},
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_SLT_TGBOT_TOKEN: process.env.NEXT_PUBLIC_SLT_TGBOT_TOKEN,
    NEXT_PUBLIC_SLT_TG_USERID: process.env.NEXT_PUBLIC_SLT_TG_USERID,
    NEXT_PUBLIC_EZPAYFLOW_MERCHANT_ID: process.env.NEXT_PUBLIC_EZPAYFLOW_MERCHANT_ID,
  },
};

export default nextConfig;
