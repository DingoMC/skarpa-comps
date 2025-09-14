/**
 * Iterate over interface object keys, keeping key list as array type instead of generic `string`
 * @param obj Object with strictly typed properties
 * @template T Interface or defined type
 * @returns Typed array of keys
 */
export const objectKeys = <T extends object>(obj: T) => Object.keys(obj) as Array<keyof T>;

/**
 * Iterate over interface object values, keeping key list as array type instead of generic `any`
 * @param obj Object with strictly typed properties
 * @template T Interface or defined type
 * @returns Typed array of values
 */
export const objectValues = <T extends object>(obj: T) => Object.values(obj) as Array<typeof obj[keyof T]>;

/**
 * Iterate over interface object entries, keeping key list as array type instead of generic `string`
 * @param obj Object with strictly typed properties
 * @returns key, value pairs array
 */
export const objectEntries = <T extends object>(obj: T) => Object.entries(obj) as Array<[keyof T, typeof obj[keyof T]]>;

/**
 * Convert `string` key into typed key based on object it is referring to.
 * If `key` is not part of `obj` it might lead to unexpected behavior
 * @param obj Object with strictly typed properties
 * @param key Key that is part of an object
 * @returns Key with strict type
 */
export const typedKey = <T extends object>(obj: T, key: string) => key as keyof T;

/**
 * Deep equal compare two objects of same type
 * @param a
 * @param b
 */
export const objectDeepEqual = <T extends object>(a: T, b: T) => {
  if (a === b) return true;

  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!objectDeepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const aKeys = Object.keys(a as object);
  const bKeys = Object.keys(b as object);

  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    if (!bKeys.includes(key)) return false;
    if (!objectDeepEqual((a as any)[key], (b as any)[key])) return false;
  }

  return true;
};
