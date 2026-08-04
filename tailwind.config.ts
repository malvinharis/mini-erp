import type { Config } from 'tailwindcss';

/**
 * Tailwind v4 CSS-first config. `content` sources are loaded via `@config`
 * in globals.css. Semantic color scales are registered here (light-only,
 * teal-primary design system) so utilities like `bg-primary-300`,
 * `text-primary-700`, and `bg-danger-600` resolve everywhere:
 *   primary → teal · success → emerald · warning → amber · danger → red.
 * `default` intentionally has no token — it uses stock neutral/gray.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['SourceSansPro'],
        'sans-regular': 'SourceSansPro',
        'sans-light': 'SourceSansPro-Light',
        'sans-semibold': 'SourceSansPro-SemiBold',
        'sans-bold': 'SourceSansPro-Bold',
        'family-bold': 'SourceSansPro-Bold',
      },
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
          DEFAULT: '#0d9488',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
          DEFAULT: '#059669',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
          DEFAULT: '#f59e0b',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
          DEFAULT: '#dc2626',
        },
      },
    },
  },
};

export default config;
