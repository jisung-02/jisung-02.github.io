export type PixelFrame = number[][];
export type ColorPalette = string[];

export interface SpriteSheet {
  palette: ColorPalette;
  scale: number;
  width: number;
  height: number;
  frames: {
    idle: PixelFrame[];
    swim: PixelFrame[];
    eat: PixelFrame[];
  };
}

export type CreatureType = "axolotl" | "betta" | "lungfish";
export type CreatureState = "idle" | "swimming" | "eating" | "breaching";

export interface SectionTheme {
  waterTop: string;
  waterMid: string;
  waterBottom: string;
  sandTop: string;
  sandBottom: string;
  sandDotColor: string;
  causticColor: string;
  bubbleColor: string;
  plantCountMin: number;
  plantCountMax: number;
}

export const SECTION_THEMES: Record<string, SectionTheme> = {
  posts: {
    waterTop: "#0a1a3d",
    waterMid: "#0d2050",
    waterBottom: "#1a2a6a",
    sandTop: "#8a8aaa",
    sandBottom: "#5a5a7a",
    sandDotColor: "#4a4a6a",
    causticColor: "#9088d8",
    bubbleColor: "#b8b0f0",
    plantCountMin: 5,
    plantCountMax: 7,
  },
  projects: {
    waterTop: "#0d1a0d",
    waterMid: "#122212",
    waterBottom: "#1e3a1e",
    sandTop: "#a09060",
    sandBottom: "#706040",
    sandDotColor: "#5a4a30",
    causticColor: "#c8a840",
    bubbleColor: "#d4c870",
    plantCountMin: 8,
    plantCountMax: 11,
  },
  default: {
    waterTop: "#0d2233",
    waterMid: "#0f2e3e",
    waterBottom: "#1a4a4a",
    sandTop: "#c4a86a",
    sandBottom: "#8a7040",
    sandDotColor: "#6a5030",
    causticColor: "#7fd4e8",
    bubbleColor: "#a8e0f0",
    plantCountMin: 6,
    plantCountMax: 9,
  },
};

export interface Vec2 {
  x: number;
  y: number;
}

export interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wobblePhase: number;
  wobbleAmp: number;
  opacity: number;
}

export interface FoodPellet {
  x: number;
  y: number;
  velocityY: number;
  active: boolean;
}

export interface EnvironmentElement {
  type: "plant" | "shell" | "snail";
  x: number;
  y: number;
  frameIndex: number;
  frameTimer: number;
}

export const PIXEL_SCALE = 3;
export const FOOD_FALL_SPEED = 120;
export const MAX_FOOD = 3;
export const MAX_BUBBLES = 15;
export const BUBBLE_SPAWN_INTERVAL_MIN = 2.0;
export const BUBBLE_SPAWN_INTERVAL_MAX = 4.0;
export const SAND_HEIGHT = 56;

export const CREATURE_SPEEDS: Record<CreatureType, number> = {
  axolotl: 80,
  betta: 140,
  lungfish: 60,
};

export const CREATURE_ARRIVE_THRESHOLD = 8;
export const FOOD_EAT_THRESHOLD = 14;
