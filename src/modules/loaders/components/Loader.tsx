'use client';

import Image from 'next/image';
import { LoaderColor, LoaderSize } from '../types';
import DefaultLoaderStyle from '../types/defaultStyle';

type Props = {
  /**
   * Loader color (`white` or skarpa `red`)
   * @default 'white'
   */
  color?: LoaderColor;
  /**
   * Loader size (`sm` - 80px, `md` - 130px, `lg` - 200px)
   * @default 'md'
   */
  size?: LoaderSize;
};

/**
 * Skarpa Loader component
 * @param props Skarpa Loader props
 */
const SkarpaLoader = (props: Props) => {
  const { color = 'white', size = 'md' } = props;
  const styleStrategy = new DefaultLoaderStyle();

  const classes = {
    spinner: 'border-solid animate-spinner absolute rounded-[50%]',
  };

  return (
    <div className={`relative ${styleStrategy.getSpinnerSize(size)} flex items-center justify-center`}>
      <Image
        priority
        width={styleStrategy.getLogoSize(size)}
        height={styleStrategy.getLogoSize(size)}
        src={`/images/skarpa-logo-v${color === 'white' ? '-white' : ''}.png`}
        alt="Skarpa logo"
      />
      <div
        className={`
          ${classes.spinner} ${styleStrategy.getBorderSize(size)} ${styleStrategy.getBorderColors(color)}
          ${styleStrategy.getSpinnerSize(size)}
        `}
      />
    </div>
  );
};

export default SkarpaLoader;
