/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#123B5D',
          50: '#F0F5FA',
          100: '#E0EBF4',
          200: '#B8D3E6',
          300: '#8FBAD8',
          400: '#478CBF',
          500: '#1B5E94',
          600: '#154B76',
          700: '#123B5D',
          800: '#0E2C46',
          900: '#091E30',
        },
        brand: {
          blue: '#2563EB',
          teal: '#0F766E',
          tealLight: '#CCFBF1',
        },
        surface: {
          bg: '#F6F8FB',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
        text: {
          main: '#172033',
          secondary: '#64748B',
          muted: '#94A3B8',
        },
        status: {
          success: '#16A34A',
          'success-bg': '#DCFCE7',
          warning: '#D97706',
          'warning-bg': '#FEF3C7',
          critical: '#DC2626',
          'critical-bg': '#FEE2E2',
          info: '#2563EB',
          'info-bg': '#DBEAFE',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      screens: {
        xs: '360px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
    },
  },
  plugins: [],
};
