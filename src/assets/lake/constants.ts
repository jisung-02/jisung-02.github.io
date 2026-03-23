export const TARGET_FRAME_MS = 1000 / 30;
export const MOBILE_BREAKPOINT = 768;
export const MOBILE_RENDER_SCALE = 3;
export const DESKTOP_RENDER_SCALE = 2;
export const CARD_HIGHLIGHT_RADIUS = 150;
export const RIPPLE_LIMIT = 8;
export const AXOLOTL_FRAME_SIZE = 32;
export const AXOLOTL_ROW_COUNT = 6;
export const AXOLOTL_COLUMN_COUNT = 4;
export const AXOLOTL_DRAW_SIZE = 64;
export const HEADER_HEIGHT = 56;
export const CARD_SCAN_THROTTLE_MS = 100;
export const CARD_HIGHLIGHT_INTERVAL_MS = 100;

export const LAKE_COLORS = {
  deep: "#0a1628",
  mid: "#0f2038",
  surface: "#163050",
  highlight: "#1e4068",
  shimmer: "#2a5a8a",
  plantDark: "#1a3a2a",
  plantMid: "#2d5a3a",
  plantLight: "#4a8a5a",
  lilyWhite: "#e8e0d0",
  lilyPink: "#d4a0a0",
  axolotlBody: "#f0b8c8",
  axolotlGill: "#c85070",
  axolotlEye: "#1a1a2e",
  axolotlBelly: "#f8d8e0",
  axolotlSpot: "#d898a8",
} as const;
