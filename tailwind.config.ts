import type { Config } from 'tailwindcss';

/**
 * Tailwind v4 CSS-first config. No custom @theme tokens — components use
 * Tailwind's built-in color/radius/shadow scale directly. This file only
 * declares the `content` sources (loaded via `@config` in globals.css);
 * everything is under `src/` now, so a single glob covers the app and its
 * UI components.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
};

export default config;
