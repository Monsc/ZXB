module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#181A1B', // 主黑灰
          light: '#23272F',
          dark: '#101214',
        },
        accent: {
          blue: '#3B82F6', // 高亮蓝
          purple: '#8B5CF6', // 高亮紫
          red: '#EF4444', // 高亮红
        },
        muted: '#A0A4AB', // 辅助灰
        card: '#23272F',
        border: '#2D333B',
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.5rem',
        full: '9999px',
      },
      maxWidth: {
        'main': '600px',
      },
    },
  },
  plugins: [],
}; 