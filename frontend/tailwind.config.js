/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: '#f5f5f7',
          subtle: '#fbfbfd',
          card: '#ffffff',
          text: '#1d1d1f',
          secondary: '#86868b',
          tertiary: '#a1a1a6',
          border: '#e5e5e7',
          borderLight: '#f0f0f2',
          blue: '#0071e3',
          blueHover: '#0077ed',
          blueLight: '#e8f2fc',
          surface: '#f5f5f7',
        },
        verdict: {
          credible: '#1b7a37',
          credibleBg: '#f0f9f3',
          credibleBorder: '#c3e8cd',

          misleading: '#a85a00',
          misleadingBg: '#fff8f0',
          misleadingBorder: '#fce0be',

          suspicious: '#c9251c',
          suspiciousBg: '#fff2f1',
          suspiciousBorder: '#fbcbc8',

          inconclusive: '#555558',
          inconclusiveBg: '#f4f4f6',
          inconclusiveBorder: '#dedee2',
        },
      },
      boxShadow: {
        'apple-sm': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'apple-card': '0 4px 20px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'apple-hover': '0 8px 30px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.02)',
        'apple-modal': '0 20px 60px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'apple-sm': '8px',
        'apple-md': '14px',
        'apple-lg': '20px',
        'apple-xl': '28px',
      },
    },
  },
  plugins: [],
};
