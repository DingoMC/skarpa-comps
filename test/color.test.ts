import Color from '@/lib/color';
import { interpolateColor } from '@/lib/color/utils';

test('Test toHexString', () => {
  const c1 = new Color(112, 111, 150);
  expect(c1.toHexString()).toBe('#706f96');
  const c2 = new Color(104, 19, 70);
  expect(c2.toHexString(true)).toBe('681346');
});

test('Test toRGBString', () => {
  const c1 = new Color('#163544');
  expect(c1.toRGBString()).toBe('rgb(22,53,68)');
  const c2 = new Color('3f2a32');
  expect(c2.toRGBString()).toBe('rgb(63,42,50)');
});

test('Test brightness', () => {
  const c1 = new Color('#1c030a');
  expect(c1.brightness()).toBeCloseTo(0.060784, 6);
  const c2 = new Color('#dbd8ab');
  expect(c2.brightness()).toBeCloseTo(0.764706, 6);
});

test('Test intensity', () => {
  const c1 = new Color('#726c59');
  expect(c1.intensity()).toBeCloseTo(0.422392, 6);
  const c2 = new Color('#bc93c4');
  expect(c2.intensity()).toBeCloseTo(0.645843, 6);
});

test('Test interpolateColor', () => {
  const c0 = interpolateColor([], 0);
  expect(c0.toHexString()).toBe('#000000');
  const c1 = interpolateColor([{ color: new Color('#123456'), value: 7 }], 0);
  expect(c1.toHexString()).toBe('#123456');
  const c2 = interpolateColor(
    [
      { color: new Color('#131516'), value: 0 },
      { color: new Color('#01c67e'), value: 5 },
    ],
    2
  );
  expect(c2.toHexString()).toBe('#0b5b3f');
});
