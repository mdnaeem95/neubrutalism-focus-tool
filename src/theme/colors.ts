const lightColors = {
  // Primary accent colors
  hotPink: '#FF6B9D',
  electricBlue: '#4D96FF',
  brightYellow: '#FFD93D',
  limeGreen: '#6BCB77',
  coral: '#FF6B6B',
  lavender: '#C084FC',
  orange: '#FF8C42',

  // Neutrals
  black: '#1A1A2E',
  white: '#FEFEFE',
  cream: '#FFF8E7',

  // Semantic
  success: '#6BCB77',
  warning: '#FFD93D',
  error: '#FF6B6B',
  info: '#4D96FF',

  // Screen backgrounds
  bgPrimary: '#FFF8E7',
  bgCard: '#FFFFFF',
  bgTimer: '#FF6B9D',
  bgTasks: '#4D96FF',
  bgStats: '#6BCB77',
  bgSettings: '#FFD93D',
} as const;

const darkColors = {
  // Primary accent colors — adjusted for dark backgrounds
  hotPink: '#FF6B9D',
  electricBlue: '#4D96FF',
  brightYellow: '#E0A818',
  limeGreen: '#6BCB77',
  coral: '#FF6B6B',
  lavender: '#C084FC',
  orange: '#FF8C42',

  // Neutrals — inverted
  black: '#F0EDE6',
  white: '#1E1E2E',
  cream: '#141420',

  // Semantic
  success: '#6BCB77',
  warning: '#E0A818',
  error: '#FF6B6B',
  info: '#4D96FF',

  // Screen backgrounds — muted dark versions
  bgPrimary: '#141420',
  bgCard: '#1E1E2E',
  bgTimer: '#3D1A2A',
  bgTasks: '#1A2A3D',
  bgStats: '#1A3026',
  bgSettings: '#3D351A',
} as const;

export type ColorPalette = { [K in keyof typeof lightColors]: string };

/** Static light palette — used by StyleSheet.create and as the default. */
export const colors = lightColors;

export { lightColors, darkColors };
