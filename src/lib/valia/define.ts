import type { Theme } from '../theme';
import { light } from '../theme';

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export function defineTheme(
  overrides: DeepPartial<Theme>,
  base: Theme = light,
): Theme {
  return {
    ...base,
    ...overrides,
    colors: { ...base.colors, ...overrides.colors },
    spacing: { ...base.spacing, ...overrides.spacing },
    borderRadii: { ...base.borderRadii, ...overrides.borderRadii },
    zIndices: { ...base.zIndices, ...overrides.zIndices },
    textVariants: { ...base.textVariants, ...overrides.textVariants },
  } as Theme;
}
