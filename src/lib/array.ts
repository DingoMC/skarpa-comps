/**
 * Returns new array with all unique elements
 * @param array Input array
 * @returns Unique array
 */
export function uniqueArray<T>(array: T[]) {
  const seen = new Set<T>();
  return array.filter((item) => {
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}
