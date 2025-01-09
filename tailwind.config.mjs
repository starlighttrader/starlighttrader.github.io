/** @type {import('tailwindcss').Config} */
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'gemini-blue': '#4285f4',
        'gemini-pink': '#ea4335',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'fade-in-delay': 'fadeIn 0.5s ease-in 0.5s forwards',
        'fade-in-delay-2': 'fadeIn 0.5s ease-in 1s forwards',
        'fade-in-out': 'fadeInOut 5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInOut: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '10%': { opacity: '1', transform: 'translateY(0)' },
          '90%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100ch',
            color: '#000000',
            h1: {
              color: '#000000',
            },
            h2: {
              color: '#000000',
            },
            h3: {
              color: '#000000',
            },
            a: {
              color: '#3182ce',
              '&:hover': {
                color: '#2c5282',
              },
            },
          },
        },
        invert: {
          css: {
            color: '#ffffff !important',
            h1: {
              color: '#ffffff !important',
            },
            h2: {
              color: '#ffffff !important',
            },
            h3: {
              color: '#ffffff !important',
            },
            h4: {
              color: '#ffffff !important',
            },
            h5: {
              color: '#ffffff !important',
            },
            h6: {
              color: '#ffffff !important',
            },
            strong: {
              color: '#ffffff !important',
            },
            'h1, h2, h3, h4, h5, h6': {
              color: '#ffffff !important',
            },
            p: {
              color: '#d1d5db !important',
            },
            li: {
              color: '#d1d5db !important',
            },
            blockquote: {
              color: '#d1d5db',
              borderLeftColor: '#4b5563',
            },
            'li::marker': {
              color: '#ffffff !important',
            },
            'ul > li::marker': {
              color: '#ffffff !important',
            },
            'ol > li::marker': {
              color: '#ffffff !important',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    addVariablesForColors,
  ],
};

// This plugin adds each Tailwind color as a global CSS variable
function addVariablesForColors({ addBase, theme }) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}