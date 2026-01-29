import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      colors: {
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        'rose-gold': {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
        },
        background: "var(--background)",
        surface: "var(--surface)",
        'surface-elevated': "var(--surface-elevated)",
      },
      borderRadius: {
        'xl': '12px',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(236, 72, 153, 0.1), 0 10px 20px -2px rgba(236, 72, 153, 0.04)',
      },
    },
  },
  plugins: [],
} satisfies Config;