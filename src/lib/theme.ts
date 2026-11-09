import { createTheme } from '@shopify/restyle';

const palette = {
  black: '#000000',
  white: '#FFFFFF',

  // dark: pitch black,muted whites, slate grays
  inkDark: '#E7E9EA',
  surfaceDark: '#16181C',
  slateDark: '#71808F',
  borderDark: '#2A323B',

  // light: muted white, pure black, slate grays
  paperLight: '#f4f5f6',
  surfaceLight: '#eceef0',
  slateLight: '#5b6b7a',
  borderLight: '#d5dae0',

  errorLight: '#d4202c',
  errorDark: '#f4505b',
};

const light = createTheme({
  colors: {
    background: palette.paperLight,
    card: palette.surfaceLight,
    primary: palette.black,
    onPrimary: palette.paperLight,
    accent: palette.black,
    success: palette.black,
    warning: palette.slateLight,
    error: palette.errorLight,
    text: palette.black,
    textMuted: palette.slateLight,
    border: palette.borderLight,
    navigation: palette.paperLight,
  },
  spacing: {
    none: 0,
    xxxs: 2,
    xxs: 4,
    xs: 8,
    s: 12,
    m: 16,
    ml: 20,
    l: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
    huge: 64,
    massive: 96,
  },
  borderRadii: {
    none: 0,
    xxs: 4,
    xs: 6,
    s: 8,
    sm: 10,
    m: 12,
    ml: 16,
    l: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 32,
    round: 40,
    full: 999,
  },
  zIndices: {
    behind: -1,
    base: 0,
    card: 1,
    stickyHeader: 10,
    floatingNav: 20,
    overlay: 30,
    modal: 40,
    toast: 50,
    tooltip: 60,
  },
  textVariants: {
    defaults: {
      fontFamily: 'OnestRegular',
      fontSize: 16,
      color: 'text',
    },
    handle: {
      fontSize: 12,
      fontFamily: 'CommitMono',
      color: 'textMuted',
    },
    formLabel: {
      fontFamily: 'OnestMedium',
      fontSize: 13,
      color: 'text',
    },
    formError: {
      fontFamily: 'OnestLight',
      fontSize: 12,
      color: 'accentMuted',
    },
  },
});

const dark: Theme = createTheme({
  ...light,
  colors: {
    ...light.colors,
    background: palette.black,
    card: palette.surfaceDark,
    primary: palette.inkDark,
    onPrimary: palette.black,
    accent: palette.inkDark,
    success: palette.inkDark,
    warning: palette.slateDark,
    error: palette.errorDark,
    text: palette.inkDark,
    textMuted: palette.slateDark,
    border: palette.borderDark,
    navigation: palette.black,
  },
});

type Theme = typeof light;

export { dark, light, type Theme };
