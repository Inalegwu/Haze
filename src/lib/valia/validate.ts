import type { Theme } from '../theme';
import { light } from '../theme';

const HEX_COLOR = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

function sameKeys(
  reference: object,
  candidate: unknown,
): candidate is Record<string, unknown> {
  if (typeof candidate !== 'object' || candidate === null) return false;
  const refKeys = Object.keys(reference).sort();
  const candKeys = Object.keys(candidate).sort();
  return (
    refKeys.length === candKeys.length &&
    refKeys.every((k, i) => k === candKeys[i])
  );
}

function validateColors(candidate: unknown): candidate is Theme['colors'] {
  if (!sameKeys(light.colors, candidate)) return false;
  return Object.values(candidate as Record<string, unknown>).every(
    (value) => typeof value === 'string' && HEX_COLOR.test(value),
  );
}

function validateNumericScale(reference: object, candidate: unknown): boolean {
  if (!sameKeys(reference, candidate)) return false;
  return Object.values(candidate as Record<string, unknown>).every(
    (value) => typeof value === 'number',
  );
}

function validateTextVariants(
  candidate: unknown,
): candidate is Theme['textVariants'] {
  return (
    typeof candidate === 'object' &&
    candidate !== null &&
    'defaults' in candidate &&
    typeof (candidate as { defaults: unknown }).defaults === 'object'
  );
}

export type ThemeValidationResult =
  | { valid: true; theme: Theme }
  | { valid: false; errors: string[] };

export function validateTheme(candidate: unknown): ThemeValidationResult {
  const errors: string[] = [];

  if (typeof candidate !== 'object' || candidate === null) {
    return { valid: false, errors: ['Theme must be an object'] };
  }

  const c = candidate as Record<string, unknown>;

  if (!validateColors(c.colors))
    errors.push("colors: keys or values don't match the expected color shape");
  if (!validateNumericScale(light.spacing, c.spacing))
    errors.push("spacing: keys or values don't match");
  if (!validateNumericScale(light.borderRadii, c.borderRadii))
    errors.push("borderRadii: keys or values don't match");
  if (!validateNumericScale(light.zIndices, c.zIndices))
    errors.push("zIndices: keys or values don't match");
  if (!validateTextVariants(c.textVariants))
    errors.push("textVariants: must include a 'defaults' variant");

  return errors.length > 0
    ? { valid: false, errors }
    : { valid: true, theme: candidate as Theme };
}
