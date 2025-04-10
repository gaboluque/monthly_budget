import { lowerCase } from "lodash";

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function sentenceCase(string: string) {
  return capitalize(lowerCase(string));
}
