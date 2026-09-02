/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        // Heading sizes - using CSS variables for responsive scaling
        'h1': 'var(--fs-h1)',
        'h2': 'var(--fs-h2)',
        'h3': 'var(--fs-h3)',
        'h4': 'var(--fs-h4)',
        
        // Body text sizes
        'lg': 'var(--fs-body-lg)',
        'base': 'var(--fs-body)',
        'sm': 'var(--fs-body-sm)',
        'xs': 'var(--fs-body-xs)',
        'tiny': 'var(--fs-tiny)',
        
        // Extra sizes for specific use cases
        'display': 'clamp(2.5rem, 8vw, 4rem)',
        'subtitle': 'var(--fs-body-lg)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        serif: "'Playfair Display', Georgia, serif",
        arabic: 'var(--font-arabic)',
        amharic: 'var(--font-amharic)',
      },
      colors: {
        brand: {
          primary: 'var(--primary-color)',
          hover: 'var(--primary-hover)',
          light: 'var(--primary-light)',
          border: 'var(--primary-border)',
          dark: 'var(--dark-header-bg)',
        }
      }
    },
  },
  plugins: [],
}
