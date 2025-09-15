'use client';

import Image from 'next/image';

type Size = 'sm' | 'md' | 'lg';
type Color = 'white' | 'red';

type Props = {
  /**
   * Loader color (`white` or skarpa `red`)
   * @default 'white'
   */
  color?: Color;
  /**
   * Loader size (`sm` - 80px, `md` - 130px, `lg` - 200px)
   * @default 'md'
   */
  size?: Size;
};

const getLogoSize = (size: Size) => {
  if (size === 'sm') return 60;
  if (size === 'md') return 100;
  return 150;
};

const getSpinnerSize = (size: Size) => {
  if (size === 'sm') return 'h-[80px] w-[80px]';
  if (size === 'md') return 'h-[130px] w-[130px]';
  return 'w-[200px] h-[200px]';
};

const getBorderSize = (size: Size) => {
  if (size === 'sm') return 'border-[3px]';
  if (size === 'md') return 'border-[4px]';
  return 'border-[5px]';
};

const getBorderColors = (color: Color) => {
  if (color === 'red') return 'border-t-main border-gray-100';
  return 'border-white/20 border-t-white';
};

/**
 * Skarpa Loader component
 * @param props Skarpa Loader props
 */
const SkarpaLoader = (props: Props) => {
  const { color = 'white', size = 'md' } = props;

  const classes = {
    spinner: 'border-solid animate-spinner absolute rounded-[50%]',
  };

  return (
    <div className={`relative ${getSpinnerSize(size)} flex items-center justify-center`}>
      <Image
        priority
        width={getLogoSize(size)}
        height={getLogoSize(size)}
        src={`/images/skarpa-logo-v${color === 'white' ? '-white' : ''}.png`}
        alt="Skarpa logo"
      />
      <div className={`${classes.spinner} ${getBorderSize(size)} ${getBorderColors(color)} ${getSpinnerSize(size)}`} />
    </div>
  );
};

export default SkarpaLoader;
