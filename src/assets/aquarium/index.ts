import { createRenderer } from "./renderer.js";
import { Environment } from "./environment.js";
import { Creature } from "./creatures.js";
import { setupInput } from "./input.js";
import { PretextEffect } from "./pretext.js";
import { AXOLOTL_SPRITE, BETTA_SPRITE, LUNGFISH_SPRITE } from "./sprites.js";
import type { FoodPellet, CreatureType, SpriteSheet } from "./types.js";
import { SAND_HEIGHT, SECTION_THEMES } from "./types.js";

export let aquariumCreature: Creature | null = null;
export let aquariumRenderer: ReturnType<typeof createRenderer> | null = null;

export function initAquarium(): void {
  const canvasEl = document.getElementById("aquarium-canvas");
  if (!canvasEl) return;

  // Determine creature and theme from page section
  const section = (document.body.dataset.section ?? "").toLowerCase();
  let creatureType: CreatureType;
  let sprite: SpriteSheet;

  if (section === "posts") {
    creatureType = "betta";
    sprite = BETTA_SPRITE;
  } else if (section === "projects") {
    creatureType = "lungfish";
    sprite = LUNGFISH_SPRITE;
  } else {
    creatureType = "axolotl";
    sprite = AXOLOTL_SPRITE;
  }

  const theme = SECTION_THEMES[section] ?? SECTION_THEMES.default;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = createRenderer(theme);
  const { canvas, startLoop, renderStatic } = renderer;
  const env = new Environment(theme);
  const creature = new Creature(sprite, creatureType);
  const food: FoodPellet[] = [];

  // Position creature in the aquarium zone (left side on desktop, center otherwise)
  const w = window.innerWidth;
  const h = window.innerHeight;
  const isDesktop = w >= 960;
  const aquariumZoneWidth = isDesktop ? w * 0.35 : w;

  env.init(w, h);
  creature.position = {
    x: aquariumZoneWidth * 0.5,
    y: h - SAND_HEIGHT - sprite.height * sprite.scale / 2 - 20,
  };

  setupInput(canvas, creature, food);

  // Export for external access
  aquariumCreature = creature;
  aquariumRenderer = renderer;

  if (reducedMotion) {
    renderStatic(env, creature, food);
  } else {
    startLoop(env, creature, food);
  }

  // Setup Pretext fish-through-text effect (only on article pages)
  const overlayEl = document.getElementById("pretext-overlay") as HTMLCanvasElement | null;
  const hasProse = document.querySelector(".prose") !== null;
  if (overlayEl && hasProse && !reducedMotion) {
    const pretext = new PretextEffect(creature, overlayEl);
    pretext.setup();
  }
}
