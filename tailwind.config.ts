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
      backgroundImage: {
        'main-gradient': 'radial-gradient(#210606, #120000)',
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
