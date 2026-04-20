/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        'space-dark': '#050508',
        'space-card': 'rgba(10, 15, 28, 0.7)',
        'neon-cyan': '#00F2FF',
        'neon-blue': '#0066FF',
        'neon-red': '#FF003C',
        'neon-green': '#00FF66',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-cyan': 'glowCyan 2s infinite alternate',
        'glow-red': 'glowRed 2s infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glowCyan: {
          '0%': { boxShadow: '0 0 5px rgba(0, 242, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 242, 255, 0.6)' },
        },
        glowRed: {
          '0%': { boxShadow: '0 0 5px rgba(255, 0, 60, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 0, 60, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
      }
    },
  },
  plugins: [],
}
