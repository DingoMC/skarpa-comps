import Color from ".";

export default class ColorFactory {
  private static cache: Record<string, Color> = {};

  static getColor(hex: string): Color {
    if (!this.cache[hex]) {
      this.cache[hex] = new Color(hex);
    }
    return this.cache[hex];
  }
}
