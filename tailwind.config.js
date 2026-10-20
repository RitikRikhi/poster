/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wf: {
          bg: '#eae9ee',
          surface: '#ffffff',
          surfaceMuted: '#f6f5f9',
          ink: '#2c2531',
          inkMuted: '#716979',
          border: 'rgba(44, 37, 49, 0.12)',
          borderDark: '#2c2531',
          pink: '#fd92fe',
          pinkHover: '#fb73fd',
          blue: '#5bbeeb',
          blueHover: '#38a8e0',
          yellow: '#fde047',
          mint: '#34d399',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Syne', 'sans-serif'],
        tech: ['Space Grotesk', 'monospace'],
        cinematic: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        'wf-flat': '0 4px 0 #2c2531',
        'wf-flat-lg': '0 6px 0 #2c2531',
        'wf-card': '0 10px 30px -5px rgba(44, 37, 49, 0.08), 0 2px 4px rgba(44, 37, 49, 0.04)',
        'wf-card-hover': '0 16px 36px -4px rgba(44, 37, 49, 0.14), 0 4px 8px rgba(44, 37, 49, 0.06)',
      }
    },
  },
  plugins: [],
}
