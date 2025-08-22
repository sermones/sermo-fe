/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'iphone16': '393px', // iPhone 16 CSS 픽셀 너비
        'iphone16-landscape': '852px', // iPhone 16 가로 모드
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      maxWidth: {
        'iphone16': '393px',
      },
      minHeight: {
        'iphone16': '100dvh', // dynamic viewport height for mobile
      },
      height: {
        'iphone16': '100dvh',
      },
    },
  },
  plugins: [],
}

