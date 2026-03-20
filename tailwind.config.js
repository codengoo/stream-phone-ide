const { heroui } = require('@heroui/react')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/renderer/**/*.{js,ts,jsx,tsx}',
    './src/renderer/index.html',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff4500',
        darkbg: '#0d0f1a'
      }
    }
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        dark: { colors: { primary: { DEFAULT: '#ff4500', foreground: '#ffffff' } } },
        light: { colors: { primary: { DEFAULT: '#ff4500', foreground: '#ffffff' } } }
      }
    })
  ]
}
