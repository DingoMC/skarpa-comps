import { ISourceOptions } from '@tsparticles/engine';
import Particles from '@tsparticles/react';

type Props = {
  id: string;
  containerClassName?: `${string}`;
  particlesClassName?: `${string}`;
  textClassName?: `${string}`;
  options?: ISourceOptions;
  children: React.ReactNode;
};

export const SPARKLE_OPTIONS: ISourceOptions = {
  fullScreen: false,
  particles: {
    number: {
      value: 15,
      density: { enable: false },
    },
    color: { value: '#59168b' },
    shape: {
      type: 'star',
      options: {
        star: {
          sides: 6,
          inset: 1.8,
        },
      },
    },
    opacity: {
      value: { min: 0, max: 1 },
      animation: {
        enable: true,
        speed: 0.25,
        sync: false,
      },
    },
    size: {
      value: 1,
    },
    move: {
      enable: true,
      speed: 0.15,
      direction: 'none',
      outModes: 'destroy',
    },
    life: {
      duration: {
        value: 5,
      },
      count: 1,
    },
  },
  emitters: {
    position: { x: 50, y: 50 },
    rate: {
      delay: 0.4,
      quantity: 1,
    },
    size: {
      width: 100,
      height: 100,
    },
  },
};

export default function SparkleText({ id, options, children, containerClassName, particlesClassName, textClassName }: Props) {
  return (
    <div className={`relative inline-block ${containerClassName ?? ''}`}>
      <Particles
        id={id}
        className={`absolute inset-0 -top-1/4 pointer-events-none h-7 ${particlesClassName ?? ''}`}
        options={options ?? SPARKLE_OPTIONS}
      />
      <div className={`relative z-10 ${textClassName ?? ''}`}>{children}</div>
    </div>
  );
}
