export const COLORS = {
  // Brand palette — I'm Fenna Guidelines 2025
  ivory: '#F4F0EE',
  ivoryDeep: '#EDE8E5',
  rose: '#E2C4BA',
  roseLight: 'rgba(226, 196, 186, 0.25)',
  roseMid: 'rgba(226, 196, 186, 0.55)',
  cinnamon: '#7D463C',
  cinnamonLight: 'rgba(125, 70, 60, 0.12)',
  maroon: '#761415',
  maroonDark: '#5A0F10',
  maroonLight: 'rgba(118, 20, 21, 0.08)',
  gold: '#BFA07A',
  goldLight: 'rgba(191, 160, 122, 0.18)',
  goldMid: 'rgba(191, 160, 122, 0.45)',

  // Neutrals
  white: '#FFFFFF',
  black: '#0F0A0A',
  charcoal: '#2D2020',
  warmGray: '#6E5E5A',
  lightGray: '#C8BDB9',
  paleGray: '#F8F5F3',

  // Semantic tokens
  background: '#F4F0EE',
  surface: '#FFFFFF',
  surfaceElevated: '#FDFBFA',
  border: '#E2C4BA',
  borderSubtle: 'rgba(226, 196, 186, 0.4)',
  text: '#2D2020',
  textSecondary: '#7D463C',
  textMuted: '#A08880',
  textInverse: '#FFFFFF',
  primary: '#761415',
  primaryHover: '#5A0F10',
  accent: '#BFA07A',
  overlay: 'rgba(15, 10, 10, 0.45)',
  overlayLight: 'rgba(15, 10, 10, 0.2)',

  // Status
  success: '#4A7C59',
  successLight: 'rgba(74, 124, 89, 0.1)',
  error: '#C0392B',
  errorLight: 'rgba(192, 57, 43, 0.1)',
};

export const FONTS = {
  display: 'AbhayaLibre_700Bold',
  displayMedium: 'AbhayaLibre_500Medium',
  displayRegular: 'AbhayaLibre_400Regular',
  heading: 'Raleway_700Bold',
  subheading: 'Raleway_600SemiBold',
  body: 'Raleway_400Regular',
  bodyMedium: 'Raleway_500Medium',
  light: 'Raleway_300Light',
  italic: 'Raleway_400Regular_Italic',
};

export const SIZES = {
  // Spacing (8pt grid)
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,

  // Typography scale
  caption: 11,
  label: 12,
  small: 13,
  body: 15,
  bodyLarge: 17,
  subheading: 20,
  heading: 26,
  headingLarge: 34,
  display: 44,

  // Border radius
  radiusSm: 6,
  radiusMd: 12,
  radiusLg: 20,
  radiusXl: 32,
  radiusFull: 999,

  // Screen padding
  screenPadding: 20,
  cardPadding: 16,
};

export const SHADOWS = {
  none: {},
  soft: {
    shadowColor: '#7D463C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  medium: {
    shadowColor: '#7D463C',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.11,
    shadowRadius: 18,
    elevation: 5,
  },
  strong: {
    shadowColor: '#7D463C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 10,
  },
  gold: {
    shadowColor: '#BFA07A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};
