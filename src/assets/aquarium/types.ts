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
export type CreatureState = "idle" | "swimming" | "eating";

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
