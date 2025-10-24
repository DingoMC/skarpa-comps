export type LoaderSize = 'sm' | 'md' | 'lg';
export type LoaderColor = 'white' | 'red';

export interface LoaderStyleStrategy {
  getLogoSize(size: LoaderSize): number;
  getSpinnerSize(size: LoaderSize): string;
  getBorderSize(size: LoaderSize): string;
  getBorderColors(color: LoaderColor): string;
}
