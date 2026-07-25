/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          DEFAULT: '#00FFFF'
        },
        pink: {
          DEFAULT: '#FF527C'
        },
        black: {
          DEFAULT: '#111111'
        },
        bg: {
          DEFAULT: '#F5F5F2'
        }
      },
      fontFamily: {
        sans: ['Inter', 'HarmonyOS Sans', 'Noto Sans SC', 'sans-serif']
      },
      borderRadius: {
        'card': '24px'
      }
    }
  },
  plugins: []
}
