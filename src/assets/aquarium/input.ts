import type { Vec2, FoodPellet } from "./types.js";
import { MAX_FOOD } from "./types.js";
import type { Creature } from "./creatures.js";

export function setupInput(
  canvas: HTMLCanvasElement,
  creature: Creature,
  food: FoodPellet[],
): void {
  let longPressTimer: ReturnType<typeof setTimeout> | null = null;
  let longPressPos: Vec2 | null = null;

  function spawnFood(pos: Vec2): void {
    const active = food.filter(p => p.active).length;
    if (active >= MAX_FOOD) return;
    food.push({ x: pos.x, y: pos.y, velocityY: 120, active: true });
  }

  // Left-click and touch tap → move creature
  canvas.addEventListener("pointerdown", (e: PointerEvent) => {
    if (e.button !== 0 && e.button !== -1) return; // only primary button

    const pos = { x: e.clientX, y: e.clientY };

    if (e.pointerType === "touch") {
      // Start long-press timer for food
      longPressPos = pos;
      longPressTimer = setTimeout(() => {
        if (longPressPos) {
          spawnFood(longPressPos);
        }
        longPressTimer = null;
      }, 500);
    } else {
      // Desktop left-click → move creature
      creature.moveTo(pos);
    }
  });

  canvas.addEventListener("pointerup", () => {
    if (longPressTimer !== null) {
      clearTimeout(longPressTimer);
      // Short tap on mobile → move creature
      if (longPressPos) {
        creature.moveTo(longPressPos);
      }
      longPressTimer = null;
    }
    longPressPos = null;
  });

  canvas.addEventListener("pointercancel", () => {
    if (longPressTimer !== null) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    longPressPos = null;
  });

  // Right-click → spawn food
  canvas.addEventListener("contextmenu", (e: MouseEvent) => {
    e.preventDefault();
    spawnFood({ x: e.clientX, y: e.clientY });
  });
}
