import { ISourceOptions } from '@tsparticles/engine';

export const particleOptions: ISourceOptions = {
  background: { opacity: 0 },
  fpsLimit: 30,
  detectRetina: true,
  particles: {
    color: { value: '#ffffff' },
    opacity: { value: 0.4 },
    shape: { type: 'circle' },
    size: { value: 3 },
    links: {
      color: '#ffffff',
      opacity: 0.7,
      enable: true,
      distance: 150,
      width: 1,
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: { default: 'bounce' },
      random: false,
      speed: 0.2,
      straight: false,
    },
    number: {
      density: { enable: false },
      value: 52,
    },
  },
};

// For widths < 720 px
export const particleOptionsMobile: ISourceOptions = {
  background: { opacity: 0 },
  fpsLimit: 30,
  detectRetina: true,
  particles: {
    color: { value: '#ffffff' },
    opacity: { value: 0.4 },
    shape: { type: 'circle' },
    size: { value: 3 },
    links: {
      color: '#ffffff',
      opacity: 0.7,
      enable: true,
      distance: 100,
      width: 1,
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: { default: 'bounce' },
      random: false,
      speed: 0.1,
      straight: false,
    },
    number: {
      density: { enable: false },
      value: 26,
    },
  },
};
