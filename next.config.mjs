/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: isProd ? 'export' : undefined,
  images: { unoptimized: true},
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_SLT_TGBOT_TOKEN: process.env.NEXT_PUBLIC_SLT_TGBOT_TOKEN,
    NEXT_PUBLIC_SLT_TG_USERID: process.env.NEXT_PUBLIC_SLT_TG_USERID,
    NEXT_PUBLIC_PHONEPE_MERCHANT_ID: process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID,
    NEXT_PUBLIC_PHONEPE_SALT_KEY: process.env.NEXT_PUBLIC_PHONEPE_SALT_KEY,
    NEXT_PUBLIC_PHONEPE_SALT_INDEX: process.env.NEXT_PUBLIC_PHONEPE_SALT_INDEX,
    NEXT_PUBLIC_BASE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://starlighttrader.github.io'
      : 'http://localhost:3000'
  },
};

export default nextConfig;
