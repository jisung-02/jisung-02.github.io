import { createRenderer } from "./renderer.js";
import { Environment } from "./environment.js";
import { Creature } from "./creatures.js";
import { setupInput } from "./input.js";
import { AXOLOTL_SPRITE, BETTA_SPRITE, LUNGFISH_SPRITE } from "./sprites.js";
import type { FoodPellet, CreatureType, SpriteSheet } from "./types.js";
import { SAND_HEIGHT } from "./types.js";

export function initAquarium(): void {
  const canvasEl = document.getElementById("aquarium-canvas");
  if (!canvasEl) return;

  // Determine creature from page section
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

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const { canvas, startLoop, renderStatic } = createRenderer();
  const env = new Environment();
  const creature = new Creature(sprite, creatureType);
  const food: FoodPellet[] = [];

  const w = window.innerWidth;
  const h = window.innerHeight;

  env.init(w, h);
  creature.position = {
    x: w / 2,
    y: h - SAND_HEIGHT - sprite.height * sprite.scale / 2 - 20,
  };

  setupInput(canvas, creature, food);

  if (reducedMotion) {
    renderStatic(env, creature, food);
  } else {
    startLoop(env, creature, food);
  }
}
