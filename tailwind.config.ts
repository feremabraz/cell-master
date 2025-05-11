import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class', '[data-mode=dark]'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: '#22c55e',
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: '#f59e0b',
          foreground: '#000000',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#000000',
        },
        muted: {
          DEFAULT: '#374151',
          foreground: '#d1d5db',
        },
        accent: {
          DEFAULT: '#1e293b',
          foreground: '#f8fafc',
        },
        popover: {
          DEFAULT: '#000000',
          foreground: '#22c55e',
        },
        card: {
          DEFAULT: '#000000',
          foreground: '#22c55e',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-mono)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
} satisfies Config;

export default config;
