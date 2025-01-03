import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';

export default [
  js.configs.recommended,
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'public/**'
    ],
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        alert: 'readonly',
        console: 'readonly',
        URLSearchParams: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        // Next.js globals
        Image: 'readonly',
        Link: 'readonly',
        Component: 'readonly',
        Html: 'readonly',
        Head: 'readonly',
        Main: 'readonly',
        NextScript: 'readonly'
      }
    },
    rules: {
      '@next/next/no-html-link-for-pages': 'error',
      // Turn off no-unused-vars warning
      'no-unused-vars': 'off',
      'no-undef': 'error',
      // Add specific Next.js rules
      '@next/next/no-img-element': 'off',
      '@next/next/no-sync-scripts': 'warn'
    }
  }
];
