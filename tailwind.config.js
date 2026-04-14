/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['var(--font-nunito)', 'sans-serif'],
        dm: ['var(--font-dm)', 'sans-serif'],
      },
      colors: {
        primary: '#00B4D8',
        secondary: '#7B2FBE',
        accent: '#FFD93D',
        orange: '#FF6B35',
        success: '#06D6A0',
        danger: '#EF4444',
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
      },
      animation: {
        'fadeUp': 'fadeUp 0.4s ease both',
        'bounceIn': 'bounceIn 0.5s ease both',
        'pulse-cta': 'pulse 2.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
