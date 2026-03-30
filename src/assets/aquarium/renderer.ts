import type { FoodPellet, SectionTheme } from "./types.js";
import type { Environment } from "./environment.js";
import type { Creature } from "./creatures.js";
import { FOOD_SPRITE } from "./sprites.js";
import { drawSprite } from "./utils.js";

export interface RendererHandle {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  startLoop: (env: Environment, creature: Creature, food: FoodPellet[]) => void;
  renderStatic: (env: Environment, creature: Creature, food: FoodPellet[]) => void;
  stopLoop: () => void;
}

export function createRenderer(theme: SectionTheme): RendererHandle {
  const canvas = document.getElementById("aquarium-canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;

  let animId = 0;
  let lastTime = 0;

  function resize(): void {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
  }

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    }, 100);
  });

  resize();

  function drawWaterBackground(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, theme.waterTop);
    grad.addColorStop(0.4, theme.waterMid);
    grad.addColorStop(1, theme.waterBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // subtle light caustics
    ctx.save();
    ctx.globalAlpha = 0.04;
    const now = Date.now() / 4000;
    for (let i = 0; i < 6; i++) {
      const cx = w * ((i * 0.17 + now * 0.03) % 1);
      const cy = h * 0.2 + Math.sin(now + i) * h * 0.12;
      const rx = 60 + Math.sin(now * 1.3 + i) * 20;
      const ry = 40 + Math.cos(now + i * 0.7) * 15;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, Math.sin(now + i) * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = theme.causticColor;
      ctx.fill();
    }
    ctx.restore();
  }

  function drawFoodPellets(food: FoodPellet[]): void {
    for (const pellet of food) {
      if (!pellet.active) continue;
      const fx = pellet.x - FOOD_SPRITE.width * FOOD_SPRITE.scale / 2;
      const fy = pellet.y - FOOD_SPRITE.height * FOOD_SPRITE.scale / 2;
      drawSprite(ctx, FOOD_SPRITE.frames.idle[0], FOOD_SPRITE.palette, fx, fy, FOOD_SPRITE.scale, false);
    }
  }

  function drawFrame(env: Environment, creature: Creature, food: FoodPellet[]): void {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    drawWaterBackground();
    env.draw(ctx);
    drawFoodPellets(food);
    creature.draw(ctx);
  }

  function startLoop(env: Environment, creature: Creature, food: FoodPellet[]): void {
    function loop(timestamp: number): void {
      const rawDelta = (timestamp - lastTime) / 1000;
      const delta = Math.min(rawDelta, 0.1); // cap at 100ms to avoid large jumps
      lastTime = timestamp;

      env.update(delta);
      creature.update(delta, food);

      // Update falling food
      const sandY = window.innerHeight - 56;
      for (const pellet of food) {
        if (!pellet.active) continue;
        pellet.y += pellet.velocityY * delta;
        if (pellet.y >= sandY) {
          pellet.y = sandY;
          pellet.velocityY = 0;
        }
      }

      drawFrame(env, creature, food);
      animId = requestAnimationFrame(loop);
    }

    lastTime = performance.now();
    animId = requestAnimationFrame(loop);
  }

  function renderStatic(env: Environment, creature: Creature, food: FoodPellet[]): void {
    drawFrame(env, creature, food);
  }

  function stopLoop(): void {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = 0;
    }
  }

  return { canvas, ctx, startLoop, renderStatic, stopLoop };
}
