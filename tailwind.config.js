/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        foreground: '#0f172a',
        primary: {
          DEFAULT: '#0f172a',
          foreground: '#ffffff',
          light: '#1e293b',
          muted: '#334155',
        },
        accent: {
          blue: '#2563eb',
          'blue-light': '#eff6ff',
          'blue-border': '#bfdbfe',
          emerald: '#059669',
          'emerald-light': '#ecfdf5',
          'emerald-border': '#a7f3d0',
          amber: '#d97706',
          'amber-light': '#fffbeb',
          'amber-border': '#fde68a',
          rose: '#e11d48',
          'rose-light': '#fff1f2',
          'rose-border': '#fecdd3',
        },
        msme: {
          micro: '#0284c7',
          'micro-bg': '#f0f9ff',
          'micro-border': '#bae6fd',
          small: '#4f46e5',
          'small-bg': '#eef2ff',
          'small-border': '#c7d2fe',
          medium: '#d97706',
          'medium-bg': '#fffbeb',
          'medium-border': '#fde68a',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        heading: ['var(--font-hanken)', 'Hanken Grotesk', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.03)',
        card: '0 4px 6px -1px rgba(15, 23, 42, 0.04), 0 2px 4px -2px rgba(15, 23, 42, 0.02)',
        flyout: '0 10px 25px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)',
      }
    },
  },
  plugins: [],
}
