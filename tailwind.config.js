/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#E8ECF5',
          100: '#C5CEE0',
          200: '#9CABCB',
          300: '#6E83AC',
          400: '#445A8A',
          500: '#2A3F6E',
          600: '#1A2D5A',
          700: '#122247',
          800: '#0B1F4B',
          900: '#06143A',
        },
        accent: {
          50: '#FFF8E6',
          100: '#FFEDB3',
          200: '#FFE080',
          300: '#FFD24D',
          400: '#FFC72B',
          500: '#F5A623',
          600: '#D98E1A',
          700: '#B8751A',
        },
        brand: {
          blue: '#0B1F4B',
          light: '#F5F7FA',
          amber: '#F5A623',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(11, 31, 75, 0.06)',
        'card': '0 4px 20px rgba(11, 31, 75, 0.08)',
        'nav': '0 -2px 12px rgba(11, 31, 75, 0.08)',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'confetti': 'confetti 3s ease-out forwards',
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'progress': 'progress 1.5s ease-out forwards',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(400px) rotate(720deg)', opacity: '0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
};
