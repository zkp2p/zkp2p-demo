/**
 * Theme Index
 *
 * Central export for all theme tokens and components.
 * Imports from @zkp2p/brand as the single source of truth.
 */

import { colors, peer } from "./colors";

const theme = {
  // Color properties used in components
  neutral1: peer.white,
  backgroundInteractive: colors.iconButtonDefault,

  // All color exports
  ...colors,

  // Override with peer tokens
  textSecondary: peer.textSecondary,
};

// Re-export everything from colors
export { peer, gradients, colors, radii, opacify } from "./colors";

// Re-export brand tokens directly
export {
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
  typography,
  spacing,
  shadows,
  transitions,
  breakpoints,
  media,
  zIndices,
} from "@zkp2p/brand";

// Re-export typography components
export { PeerText, ThemedText } from "./text";

export default theme;
