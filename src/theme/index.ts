export { colors } from './colors';
export type { ColorKey } from './colors';

export { fontSizes, fontWeights, lineHeights, typography } from './typography';
export type { TypographyKey } from './typography';

export { spacing, borderRadius, layout } from './spacing';
export type { SpacingKey, BorderRadiusKey } from './spacing';

// Combined theme object for convenience
import { colors } from './colors';
import { typography, fontSizes, fontWeights, lineHeights } from './typography';
import { spacing, borderRadius, layout } from './spacing';

export const theme = {
  colors,
  typography,
  fontSizes,
  fontWeights,
  lineHeights,
  spacing,
  borderRadius,
  layout,
} as const;

export type Theme = typeof theme;
