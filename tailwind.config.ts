import type { Config } from 'tailwindcss';

/**
 * Tailwind v4 CSS-first config. Design tokens live in
 * `src/components/ui/styles/preset.css` (@theme). This file only declares the
 * `content` sources (loaded via `@config` in globals.css); everything is under
 * `src/` now, so a single glob covers the app and its UI components.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
};

export default config;
