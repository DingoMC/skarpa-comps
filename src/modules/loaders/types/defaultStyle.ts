import { LoaderColor, LoaderSize, LoaderStyleStrategy } from ".";

export default class DefaultLoaderStyle implements LoaderStyleStrategy {
  getLogoSize(size: LoaderSize): number {
    if (size === 'sm') return 60;
    if (size === 'md') return 100;
    return 150;
  }
  getSpinnerSize(size: LoaderSize): string {
    if (size === 'sm') return 'h-[80px] w-[80px]';
    if (size === 'md') return 'h-[130px] w-[130px]';
    return 'w-[200px] h-[200px]';
  }
  getBorderColors(color: LoaderColor): string {
    if (color === 'red') return 'border-t-main border-gray-100';
    return 'border-white/20 border-t-white';
  }
  getBorderSize(size: LoaderSize): string {
    if (size === 'sm') return 'border-[3px]';
    if (size === 'md') return 'border-[4px]';
    return 'border-[5px]';
  }
}
