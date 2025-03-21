## Getting Started
Static Website built using `NextJS` for [StarLightTrader.github.io](https://starlighttrader.github.io/) . The site build and rendering happens automatically using Github Actions<br>

1. Install nextJS and other packages using `npm install`
2. Run the development server using `npm run dev`

### Steps to generate static site build for local testing
1. Run the static site build using `npm run build`
2. Render the static site locally using `npx serve ./out`

If you are making changes and want to start fresh with building a static site and remove any existing static site builds, execute the below steps:
```bash
rm -rf node_modules package-lock.json out .next
npm cache clean --force
npm install
npm run build
npx serve ./out -s --cors -l 3000
```

### Environment Variables

To run this project, you need to create a `.env.local` file in the root directory of the project. This file should contain the following fields and values:

```bash
NEXT_PUBLIC_SLT_TGBOT_TOKEN=<YOUR_TELEGRAM_BOT_TOKEN>
NEXT_PUBLIC_SLT_TG_CHANNEL_ID=<CHANNEL_ID_WHERE_YOUR_TELEGRAM_BOT_IS_AN_ADMIN>
NEXT_PUBLIC_MERCHANT_PAYEE_NAME="YOUR UPI NAME"
NEXT_PUBLIC_MERCHANT_VPA="7777777777@paytm"
NEXT_PUBLIC_MONGODB_URI="mongodb://localhost:27017/"
```

Make sure to replace the placeholder values with your actual credentials and configuration details. This is essential for the application to function correctly. When deploying to vercel, add these as environment variables with production values
