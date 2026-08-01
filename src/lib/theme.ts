import { createTheme } from '@shopify/restyle';

// Change ONLY these two lines to swap the accent hue.
// Everything else in the palette is neutral grayscale.
const ACCENT_LIGHT = '#0C7C8C'; // deep teal — reads well on warm white
const ACCENT_DARK = '#4DD8E0'; // bright sky-teal — pops on near-black

const palette = {
  // ---- light neutrals (true neutral gray, 0% saturation — just dialed-down lightness, no hue) ----
  warmWhite: '#F5F5F5',
  cardLight: '#FCFCFC',
  borderLight: '#E5E5E5',
  mutedLight: '#8C8C8C',
  textLight: '#1A1A1A',

  // ---- dark neutrals (true neutral gray, not pitch black) ----
  deepBlack: '#0A0A0A',
  cardDark: '#161616',
  borderDark: '#272727',
  mutedDark: '#8F8F8F',
  textDark: '#F2F2F2',

  // ---- the one accent, per-mode for contrast ----
  accentLight: ACCENT_LIGHT,
  accentDark: ACCENT_DARK,

  // subtle accent-tinted fill for badges / selected states
  accentMutedLight: '#0C7C8C1A', // 10% alpha
  accentMutedDark: '#4DD8E01F', // 12% alpha, accent stays the only hue in dark mode too
};

const light = createTheme({
  colors: {
    background: palette.warmWhite,
    card: palette.cardLight,
    text: palette.textLight,
    textMuted: palette.mutedLight,
    border: palette.borderLight,
    accent: palette.accentLight,
    accentMuted: palette.accentMutedLight,
    accentText: palette.warmWhite, // text placed on top of a solid accent fill
    navigation: palette.textLight,
    textAlt: palette.textDark,
  },
  spacing: {
    '-1': -1,
    none: 0,
    px: 1,
    '0.5': 2,
    xxxs: 2,
    '1': 4,
    xxs: 4,
    '1.5': 6,
    '2': 8,
    xs: 8,
    '2.5': 10,
    '3': 12,
    s: 12,
    '3.5': 14,
    '4': 16,
    m: 16,
    '5': 20,
    ml: 20,
    '6': 24,
    l: 24,
    '7': 28,
    '8': 32,
    xl: 32,
    '9': 36,
    '10': 40,
    xxl: 40,
    '11': 44,
    '12': 48,
    xxxl: 48,
    '14': 56,
    '16': 64,
    huge: 64,
    '20': 80,
    '24': 96,
    massive: 96,
    '28': 112,
    '32': 128,
    '36': 144,
    '40': 160,
    '44': 176,
    '48': 192,
    '52': 208,
    '56': 224,
    '60': 240,
    '64': 256,
    '72': 288,
    '80': 320,
    '96': 384,
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
    xxl: 28,
    xxxl: 32,
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
      fontFamily: 'SatoshiMedium',
      fontSize: 16,
      color: 'text',
    },
  },
});

const dark: Theme = createTheme({
  ...light,
  colors: {
    ...light.colors,
    background: palette.deepBlack,
    card: palette.cardDark,
    text: palette.textDark,
    textMuted: palette.mutedDark,
    border: palette.borderDark,
    accent: palette.accentDark,
    accentMuted: palette.accentMutedDark,
    accentText: palette.deepBlack,
    navigation: '#000000',
  },
});

type Theme = typeof light;

export { dark, light, type Theme };
