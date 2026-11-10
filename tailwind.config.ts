import type { Config } from 'tailwindcss';
const config: Config = { content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { ink: '#20251f', moss: '#53634d', paper: '#f7f7f2', lime: '#d8ef76' }, fontFamily: { sans: ['Arial', 'Helvetica', 'sans-serif'] } } }, plugins: [] };
export default config;
