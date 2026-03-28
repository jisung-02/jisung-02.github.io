import type { Vec2, FoodPellet, CreatureState, CreatureType, SpriteSheet } from "./types.js";
import { CREATURE_SPEEDS, CREATURE_ARRIVE_THRESHOLD, FOOD_EAT_THRESHOLD, SAND_HEIGHT } from "./types.js";
import { drawSprite } from "./utils.js";

const IDLE_FRAME_INTERVAL = 0.5;
const SWIM_FRAME_INTERVAL = 0.18;
const EAT_FRAME_INTERVAL = 0.2;
const IDLE_BOBSPEED = 1.4;
const IDLE_BOBAMP = 3;

export class Creature {
  position: Vec2;
  private target: Vec2 | null = null;
  private state: CreatureState = "idle";
  private facingLeft = false;
  private frameIndex = 0;
  private frameTimer = 0;
  private idleTime = 0;
  private readonly type: CreatureType;
  private readonly sprite: SpriteSheet;
  private readonly speed: number;

  constructor(sprite: SpriteSheet, type: CreatureType) {
    this.sprite = sprite;
    this.type = type;
    this.speed = CREATURE_SPEEDS[type];
    this.position = { x: 0, y: 0 };
  }

  moveTo(pos: Vec2): void {
    this.target = { ...pos };
    this.state = "swimming";
    this.frameIndex = 0;
    this.frameTimer = 0;
  }

  update(delta: number, food: FoodPellet[]): void {
    this.idleTime += delta;

    // Check for food if idle or swimming (food takes priority if idle)
    if (this.state === "idle") {
      const nearest = nearestActivePellet(food, this.position);
      if (nearest) {
        this.target = { x: nearest.x, y: nearest.y };
        this.state = "eating";
        this.frameIndex = 0;
        this.frameTimer = 0;
      }
    }

    if (this.state === "eating") {
      const target = this.target;
      if (!target) {
        this.state = "idle";
        return;
      }
      // Re-check food pellet still exists
      const foodPellet = food.find(p => p.active && Math.abs(p.x - target.x) < 2 && Math.abs(p.y - target.y) < 2);
      if (!foodPellet) {
        // Food was already eaten or removed
        const nearest = nearestActivePellet(food, this.position);
        if (nearest) {
          this.target = { x: nearest.x, y: nearest.y };
        } else {
          this.state = "idle";
          this.target = null;
          return;
        }
      }

      this.moveTowardTarget(delta);

      const dist = distance(this.position, target);
      if (dist < FOOD_EAT_THRESHOLD) {
        // Eat the pellet
        for (const p of food) {
          if (p.active && distance({ x: p.x, y: p.y }, this.position) < FOOD_EAT_THRESHOLD + 8) {
            p.active = false;
          }
        }
        this.target = null;
        this.state = "idle";
      }
    } else if (this.state === "swimming") {
      if (!this.target) {
        this.state = "idle";
        return;
      }
      this.moveTowardTarget(delta);
      if (distance(this.position, this.target) < CREATURE_ARRIVE_THRESHOLD) {
        this.state = "idle";
        this.target = null;
      }
    }

    // Clamp to viewport
    const w = window.innerWidth;
    const h = window.innerHeight;
    const sandY = h - SAND_HEIGHT;
    const halfW = this.sprite.width * this.sprite.scale / 2;
    const halfH = this.sprite.height * this.sprite.scale / 2;
    this.position.x = Math.max(halfW, Math.min(w - halfW, this.position.x));
    this.position.y = Math.max(halfH + 10, Math.min(sandY - halfH - 4, this.position.y));

    // Advance animation frame
    const interval = this.state === "idle" ? IDLE_FRAME_INTERVAL : this.state === "eating" ? EAT_FRAME_INTERVAL : SWIM_FRAME_INTERVAL;
    this.frameTimer += delta;
    if (this.frameTimer >= interval) {
      this.frameTimer = 0;
      const frames = this.sprite.frames[this.stateToFrameKey()];
      this.frameIndex = (this.frameIndex + 1) % frames.length;
    }
  }

  private moveTowardTarget(delta: number): void {
    if (!this.target) return;
    const dx = this.target.x - this.position.x;
    const dy = this.target.y - this.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) return;

    this.facingLeft = dx < 0;
    const step = Math.min(this.speed * delta, dist);
    this.position.x += (dx / dist) * step;
    this.position.y += (dy / dist) * step;
  }

  private stateToFrameKey(): "idle" | "swim" | "eat" {
    if (this.state === "swimming") return "swim";
    if (this.state === "eating") return "eat";
    return "idle";
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const frames = this.sprite.frames[this.stateToFrameKey()];
    const frame = frames[Math.min(this.frameIndex, frames.length - 1)];
    const scale = this.sprite.scale;
    const w = this.sprite.width * scale;
    const h = this.sprite.height * scale;

    // Gentle bob in idle
    const bobOffset = this.state === "idle" ? Math.sin(this.idleTime * IDLE_BOBSPEED) * IDLE_BOBAMP : 0;

    const drawX = this.position.x - w / 2;
    const drawY = this.position.y - h / 2 + bobOffset;

    drawSprite(ctx, frame, this.sprite.palette, drawX, drawY, scale, this.facingLeft);
  }
}

function distance(a: Vec2, b: Vec2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function nearestActivePellet(food: FoodPellet[], pos: Vec2): FoodPellet | null {
  let nearest: FoodPellet | null = null;
  let nearestDist = Infinity;
  for (const p of food) {
    if (!p.active) continue;
    const d = distance({ x: p.x, y: p.y }, pos);
    if (d < nearestDist) {
      nearestDist = d;
      nearest = p;
    }
  }
  return nearest;
}
