import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:       '#166534',
        secondary:     '#1e40af',
        accent:        '#ca8a04',
        background:    '#f8fafc',
        surface:       '#ffffff',
        textPrimary:   '#0f172a',
        textSecondary: '#475569',
        border:        '#e2e8f0',
        available:     '#166534',
        sold:          '#b91c1c',
        underOffer:    '#854d0e',
      },
    },
  },
  plugins: [],
}
export default config
