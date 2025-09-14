/**
 * @class ObjectWithFallback class instance.
 *
 * Example usage:
 * ```ts
 * const obj = new ObjectWithFallback<number>(
 *  { key1: 1, key2: 2, }, 0);
 *
 * obj.get('key1'); // 1
 * obj.get('keyUnknown'); // 0
 * ```
 */
export default class ObjectWithFallback<T> {
  /**
   * Create Object with Fallback
   * @param obj Object with known keys and corresponding values
   * @param fallback Fallback value when no known key is found
   */
  constructor(private obj: { [key: string]: T }, private fallback: T) {}

  /**
   * Get value by key
   * @param key
   */
  get(key: string): T {
    return this.obj[key] ?? this.fallback;
  }

  /**
   * Get Fallback value for this object
   */
  getFallback(): T {
    return this.fallback;
  }

  /**
   * Check if key exists in the object
   * @param searchKey
   */
  keyExists(searchKey: string): boolean {
    return this.obj[searchKey] !== undefined;
  }

  /**
   * Check if value exists in the object
   * @param searchValue
   */
  valueExists(searchValue: T): boolean {
    return Object.values(this.obj).includes(searchValue);
  }

  /**
   * Get all object keys as an array of strings
   * @param predicate Custom Filter applied to each entry filtering the result
   * @returns Object Keys
   */
  keys(predicate?: ([key, value]: [string, T]) => boolean): string[] {
    if (predicate !== undefined) {
      return Object.entries(this.obj).filter(predicate).map(([k]) => k);
    }
    return Object.keys(this.obj);
  }

  /**
   * Get all object values as an array of `T`
   * @param predicate Custom Filter applied to each entry filtering the result
   * @returns Object values (not including fallback value)
   */
  values(predicate?: ([key, value]: [string, T]) => boolean): T[] {
    if (predicate !== undefined) {
      return Object.entries(this.obj).filter(predicate).map(([,v]) => v);
    }
    return Object.values(this.obj);
  }

  /**
   * Get all object entries as a `[string, T][]`
   * @returns Object entries
   */
  entries(predicate?: ([key, value]: [string, T]) => boolean): [string, T][] {
    if (predicate !== undefined) {
      return Object.entries(this.obj).filter(predicate);
    }
    return Object.entries(this.obj);
  }
}
