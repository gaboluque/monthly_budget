/**
 * Utility functions for validation
 */

/**
 * Checks if a value is null, undefined, or an empty string
 * @param value - The value to check
 * @returns true if the value is null, undefined, or an empty string; false otherwise
 */
export function isEmpty(value: unknown): boolean {
  return value === null || value === undefined || value === "";
}

/**
 * Checks if a value is not null, undefined, or an empty string
 * @param value - The value to check
 * @returns true if the value is not null, undefined, or an empty string; false otherwise
 */
export function isNotEmpty(value: unknown): boolean {
  return !isEmpty(value);
}
