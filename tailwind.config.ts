import { mtConfig } from '@material-tailwind/react';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [mtConfig],
  theme: {
    extend: {
      colors: {
        main: '#e3001b',
        skarpa: {
          50: '#fce5e7',
          100: '#f9ccd0',
          200: '#f399a2',
          300: '#ed6675',
          400: '#e93348',
          500: '#e3001b',
          600: '#b60016',
          700: '#890011',
          800: '#5b000b',
          900: '#2e0006',
          950: '#170003',
        },
      },
      backgroundImage: {
        'main-gradient': 'radial-gradient(#2e0006, #170003)',
      },
      animation: {
        spinner: 'spinner 1.2s cubic-bezier(0.98, 0.26, 0.34, 0.93) infinite',
      },
      keyframes: {
        spinner: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      transitionProperty: {
        height: 'height, max-height',
        width: 'width',
      },
    },
  },
};
export default config;
