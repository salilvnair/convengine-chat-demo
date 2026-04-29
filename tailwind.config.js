/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Reference convengine-chat tokens directly in Tailwind utilities.
      // e.g. bg-ce-accent → background: var(--ce-color-accent)
      colors: {
        'ce-accent':    'var(--ce-color-accent)',
        'ce-accent-hv': 'var(--ce-color-accent-hover)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
