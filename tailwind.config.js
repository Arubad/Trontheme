/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        tron: { black: '#000000', surface: '#020810', panel: '#040f1c', white: '#FFFFFF', blue: '#00C8FF', cyan: '#00F5FF', dim: '#7AB8D4', muted: '#3A6678' },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'tron-glow': 'tronGlow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 4s linear infinite',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        tronGlow: { '0%': { boxShadow: '0 0 5px #00C8FF, 0 0 10px #00C8FF' }, '100%': { boxShadow: '0 0 20px #00C8FF, 0 0 40px #00F5FF' } },
        flicker: { '0%,19%,21%,23%,25%,54%,56%,100%': { opacity: '1' }, '20%,24%,55%': { opacity: '0.4' } },
      },
    },
  },
  plugins: [],
};
