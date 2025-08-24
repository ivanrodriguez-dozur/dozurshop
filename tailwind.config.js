/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/home/**/*.{js,ts,jsx,tsx}',
    './src/app/styles/**/*.{css,scss}',
    './src/styles/**/*.{css,scss}',
    './src/app/globals.css',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          DEFAULT: '#B6FF00',
          50: '#F4FFE6',
          100: '#E9FFCC',
          200: '#D3FF99',
          300: '#BDFF66',
          400: '#A7FF33',
    plugins: [],
          600: '#9FE600',
          700: '#87CC00',
          800: '#6FB300',
          900: '#579900',
        },
        black: {
          DEFAULT: '#000000',
          50: '#0A0A0A',
          100: '#1A1A1A',
          200: '#2A2A2A',
          300: '#3A3A3A',
          400: '#4A4A4A',
          500: '#5A5A5A',
          600: '#6A6A6A',
          700: '#7A7A7A',
          800: '#8A8A8A',
          900: '#9A9A9A',
        },
        gray: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(182, 255, 0, 0.3)',
        'neon-sm': '0 0 10px rgba(182, 255, 0, 0.3)',
        'neon-lg': '0 0 30px rgba(182, 255, 0, 0.3)',
        'dark': '0 10px 30px rgba(0, 0, 0, 0.5)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
