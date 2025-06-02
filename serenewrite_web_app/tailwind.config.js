/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        accent: '#A3CEF1',
        primary: '#F5F6FA',
        secondary: '#22223B',
      },
      boxShadow: {
        'soft': '0 1px 10px 0 rgba(163,206,241,0.08)',
        'card': '0 2px 16px 0 rgba(163,206,241,0.13)',
        'input': '0 0 0 2px #A3CEF1, 0 3px 12px 0 rgba(163,206,241,0.05)',
      },
      borderRadius: {
        'xl': '1.2rem',
        '2xl': '1.7rem'
      }
    },
  },
  plugins: [],
}

