import Color, { ColorValue } from ".";
import ColorFactory from "./factory";

/**
 * Perform linear color interpolation on target value and known color points
 * @param colorPoints Color-Points list. If it's empty, color will be black.
 * If it has exactly 1 element, result will be the color of that element
 * @param value Target value.
 * If `value` is out of `min` and `max` values in `colorPoints`,
 * it will be bounded by color corresponding to `min` and `max`
 * @returns Interpolated color
 * @example
 * ```ts
 * // Define color table
 * const points = [
 *  {color: new Color('#000000'), value: 0},
 *  {color: new Color('#ff0000'), value: 1},
 *  {color: new Color('#ffaaff'), value: 10},
 * ];
 * // Interpolate between 3 colors
 * const color1 = interpolateColor(points, 0.5); // #7f0000
 * const color2 = interpolateColor(points, 4); // #ff3855
 * const color3 = interpolateColor(points, 15); // Out of bounds - #ffaaff
 * // Edge cases
 * const color4 = interpolateColor([], 1); // Always black - #000000
 * const color5 = interpolateColor([{
 *  color: new Color('#555555'), value: 1
 * }], 5); // Only one color - #555555
 * ```
 */
export function interpolateColor(colorPoints: ColorValue[], value: number) {
  const result = new Color();
  if (colorPoints.length === 0) return result; // No colors -> return black
  if (colorPoints.length === 1) return colorPoints[0].color; // One color -> return that color
  const sorted = colorPoints.toSorted((a, b) => a.value - b.value);
  // Check if value is out of bounds. If so return bound color
  if (value <= sorted[0].value) return sorted[0].color;
  if (value >= sorted[sorted.length - 1].value) return sorted[sorted.length - 1].color;
  // Otherwise perform linear interpolation
  for (let i = 0; i < sorted.length - 1; i++) {
    if (value >= sorted[i].value && value <= sorted[i + 1].value) {
      const ar = (sorted[i].color.r - sorted[i + 1].color.r) / (sorted[i].value - sorted[i + 1].value);
      const ag = (sorted[i].color.g - sorted[i + 1].color.g) / (sorted[i].value - sorted[i + 1].value);
      const ab = (sorted[i].color.b - sorted[i + 1].color.b) / (sorted[i].value - sorted[i + 1].value);
      return new Color(
        Math.floor(ar * (value - sorted[i].value) + sorted[i].color.r),
        Math.floor(ag * (value - sorted[i].value) + sorted[i].color.g),
        Math.floor(ab * (value - sorted[i].value) + sorted[i].color.b)
      );
    }
  }
  return result;
}

/**
 * Create color palette with equally spaced colors between `begin` and `end` color
 * @param begin Color which begins the palette
 * @param end Color which ends the palette
 * @param steps Number of colors in the palette
 * (Note that both `begin` and `end` colors are **included**)
 * @returns Array of colors
 */
export function colorPalette(begin: Color, end: Color, steps: number) {
  if (steps === 0) return [];
  if (steps === 1) return [begin];
  if (steps === 2) return [begin, end];
  const palette: Color[] = [begin];
  for (let i = 1; i < steps - 1; i++) {
    palette.push(
      interpolateColor(
        [
          { value: 0, color: begin },
          { value: steps - 1, color: end },
        ],
        i
      )
    );
  }
  palette.push(end);
  return palette;
}

/**
 * Distribute equally `colors` by number of `steps`
 * @param colors Colors equally spaced by interpolated value
 * @param steps Number of interpolation steps (colors)
 * @returns Color array of lentgh equal to `steps`
 */
export function interpolateColorRange(colors: Color[], steps: number): Color[] {
  if (colors.length === 0) return [ColorFactory.getColor('#000000')]; // No colors -> return black
  if (colors.length === 1) return [colors[0]]; // One color -> return that color
  // No steps -> empty array
  if (steps === 0) return [];
  const colorPoints: ColorValue[] = colors.map((c, idx) => ({ color: c, value: idx }));
  // 1 step -> color in the middle
  if (steps === 1) return [interpolateColor(colorPoints, 0.5 * (colors.length - 1))];
  const result: Color[] = [];
  for (let i = 0; i < steps; i++) {
    result.push(interpolateColor(colorPoints, i * ((colors.length - 1.0) / (steps - 1.0))));
  }
  return result;
}

/**
 * Mix colors according to their weights
 * @param colorsWithWeights Colors with weights list. If it's empty, color will be black.
 * If it has exactly 1 element, result will be the color of that element
 * @returns Mixed Color
 * @example
 * ```ts
 * const points = [
 *  { color: new Color('#ff0011'), value: 1 },
 *  { color: new Color('#00ff33'), value: 3 },
 * ];
 * // R = (0xff * 1 + 0x00 * 3) / (1 + 3) = 0x3f
 * // G = (0x00 * 1 + 0xff * 3) / (1 + 3) = 0xbf
 * // B = (0x11 * 1 + 0x33 * 3) / (1 + 3) = 0x2a
 * const mixed = mixColors(points); // #3fbf2a
 * ```
 */
export function mixColors(colorsWithWeights: ColorValue[]): Color {
  const filtered = colorsWithWeights.filter((cv) => cv.value > 0);
  if (!filtered.length) return ColorFactory.getColor('#000000');
  if (filtered.length === 1) return filtered[0].color;
  const { avgR, avgG, avgB, weightSum } = filtered.reduce(
    (acc, cv) => ({
      weightSum: acc.weightSum + cv.value,
      avgR: acc.avgR + cv.color.r * cv.value,
      avgG: acc.avgG + cv.color.g * cv.value,
      avgB: acc.avgB + cv.color.b * cv.value,
    }),
    { avgR: 0, avgG: 0, avgB: 0, weightSum: 0 }
  );
  return new Color(avgR / weightSum, avgG / weightSum, avgB / weightSum);
}
