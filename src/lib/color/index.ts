/**
 * @fileoverview This file contains Color class utilities to perform operations on colors.
 * @copyright Wiline Networks 2025
 * @author Marcin Basak
 */

/**
 * Limit color values
 */
function colorLimit(value: number) {
  if (value < 0) return 0;
  if (value > 255) return 255;
  return Math.floor(value);
}

function hexToRGB(hexString: string) {
  const colorStr = hexString.startsWith('#') ? hexString.substring(1) : hexString;
  if (colorStr.length !== 6) return { r: 0, g: 0, b: 0 };
  return {
    r: colorLimit(parseInt(colorStr[0] + colorStr[1], 16)),
    g: colorLimit(parseInt(colorStr[2] + colorStr[3], 16)),
    b: colorLimit(parseInt(colorStr[4] + colorStr[5], 16)),
  };
}

/**
 * Default RGB color class
 */
export default class Color {
  r: number = 0;

  g: number = 0;

  b: number = 0;

  /**
   * Empty color constructor. Black by default
   */
  constructor();
  /**
   * Create new color using HEX color
   * @param hexString
   */
  constructor(hexString?: string);
  /**
   * Create new color using RGB values in range `<0, 255>`
   * @param r
   * @param g
   * @param b
   */
  constructor(r?: number, g?: number, b?: number);
  constructor(hexStringR?: string | number, g?: number, b?: number) {
    let tempR = 0;
    let tempG = 0;
    let tempB = 0;
    if (typeof hexStringR === 'number') tempR = colorLimit(hexStringR);
    if (g) tempG = colorLimit(g);
    if (b) tempB = colorLimit(b);
    if (typeof hexStringR === 'string') {
      const rgb = hexToRGB(hexStringR);
      tempR = rgb.r;
      tempG = rgb.g;
      tempB = rgb.b;
    }
    this.r = tempR;
    this.g = tempG;
    this.b = tempB;
  }

  /**
   * Return HEX representation of the color
   * @param noHash Do not include # in the beginning. Default false
   * @returns HEX string
   */
  toHexString(noHash: boolean = false) {
    return (
      `${noHash ? '' : '#'}${this.r < 16 ? '0' : ''}${this.r.toString(16)}`
      + `${this.g < 16 ? '0' : ''}${this.g.toString(16)}${this.b < 16 ? '0' : ''}${this.b.toString(16)}`
    );
  }

  /**
   * Return RGB represntation of the color
   * @returns `rgb(r,g,b)` string
   */
  toRGBString() {
    return `rgb(${this.r},${this.g},${this.b})`;
  }

  /**
   * Compute color brightness
   * @returns HSL Lightness value in range `<0.0, 1.0>`
   */
  brightness() {
    return (Math.max(this.r, this.g, this.b) + Math.min(this.r, this.g, this.b)) / (2.0 * 255.0);
  }

  /**
   * Compute color intensity
   * @returns Color psychic intensity in range `<0.0, 1.0>`
   */
  intensity() {
    return (0.3 * this.r + 0.59 * this.g + 0.11 * this.b) / 255.0;
  }
}

export type ColorValue = {
  color: Color;
  value: number;
};
