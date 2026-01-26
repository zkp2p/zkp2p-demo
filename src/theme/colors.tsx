/**
 * Peer Brand Color System
 *
 * This file re-exports colors from @zkp2p/brand and provides
 * backwards-compatible legacy color mappings.
 *
 * PREFER: Import directly from @zkp2p/brand for new code
 * USE: peer.* tokens over colors.* for new components
 */

// Re-export from brand package (single source of truth)
export {
  colors as brandColors,
  borders,
  text,
  gradientValues,
  buttonSizes,
  spinnerSizes,
  radii,
  opacify,
  fontFamilies,
  fontWeights,
  fontSizes,
  typography,
  mobileTypography,
  lineHeights,
  letterSpacing,
  transitions,
  zIndices,
} from "@zkp2p/brand";

// Import for local use
import { colors as brandColors, borders, opacify } from "@zkp2p/brand";

/*
 * Peer Brand Colors
 *
 * Maps brand package tokens to the existing `peer` object interface
 * for backwards compatibility with existing components.
 */
export const peer = {
  // Core
  black: brandColors.black,
  white: brandColors.white,
  richBlack: brandColors.richBlack,
  lightGrey: brandColors.lightGrey,

  // IGNITE Gradient colors
  igniteYellow: brandColors.igniteYellow,
  igniteRed: brandColors.igniteRed,

  // Borders
  borderDark: borders.dark,
  borderLight: borders.light,

  // Text
  textPrimary: brandColors.white,
  textSecondary: brandColors.grey,
  textPlaceholder: "#6C757D",

  // Status colors
  success: brandColors.success,
  warning: brandColors.warning,
  error: brandColors.error,

  // Interactive colors
  link: brandColors.link,
} as const;

// Re-export gradients (already correct in brand package)
export { gradients } from "@zkp2p/brand";

/*
 * Legacy Colors
 *
 * Backwards-compatible color mappings for existing components.
 * For new code, use `peer.*` or import directly from @zkp2p/brand.
 */
export const colors = {
  linkBlue: peer.link, // Brand: #1F95E2

  // Text colors → use peer.textPrimary, peer.textSecondary
  darkText: peer.white,
  grayText: peer.textPlaceholder,
  lightGrayText: peer.textSecondary, // Brand: #777777

  white: peer.white,
  black: peer.black,
  offWhite: peer.lightGrey, // Brand: #EEEEEE

  // Background → use peer.black (primary) or peer.richBlack (elevated)
  container: peer.black,

  // Buttons → use gradients.ignite for primary CTA
  buttonDefault: peer.igniteRed,
  buttonHover: peer.igniteRed,
  buttonDisabled: opacify(25, peer.igniteRed),

  iconButtonDefault: opacify(24, peer.white),
  iconButtonHover: opacify(33, peer.white),
  iconButtonActive: opacify(44, peer.white),

  // Inputs → use peer.black background, peer.borderDark border
  inputDefaultColor: peer.black,
  inputPlaceholderColor: peer.textPlaceholder,

  // Status colors (unchanged)
  connectionStatusRed: peer.error,
  connectionStatusGreen: peer.success,

  // Borders → use peer.borderDark
  defaultBorderColor: peer.borderDark,
  readOnlyBorderColor: peer.borderDark,

  defaultInputColor: peer.black,
  readOnlyInputColor: peer.black,

  // Selectors → use peer.richBlack (gray) per Figma
  selectorColor: peer.richBlack,
  selectorHover: opacify(80, peer.richBlack),
  selectorHoverBorder: opacify(15, peer.white),

  rowSelectorColor: peer.richBlack,
  rowSelectorHover: opacify(80, peer.richBlack),

  // Status colors (unchanged)
  warningRed: peer.error,
  warningYellow: peer.warning,
  validGreen: peer.success,
  invalidRed: peer.error,

  // Additional UI colors
  defaultBorder: peer.borderDark,
  backgroundSecondary: peer.richBlack,
  textPrimary: peer.textPrimary,
  textSecondary: peer.textSecondary,
};
