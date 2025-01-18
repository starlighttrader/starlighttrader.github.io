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


