module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    screens: {
      sm: '1280px',
      md: '1536px',
      lg: '2648px',
      xl: '2560px',
      '2xl': '3072px',
    },
    extend: {
      colors: {
        black: '#0a0a0a',
        white: '#ffffff',
        offwhite: '#fafafa',
        darkgray: '#1a1a1a',
        cream: '#f8f6f0',
        gold: '#fbbf24',
        lightgold: '#fde68a',
        darkgold: '#d97706',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
