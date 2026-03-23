import {
  AXOLOTL_COLUMN_COUNT,
  AXOLOTL_DRAW_SIZE,
  AXOLOTL_FRAME_SIZE,
  HEADER_HEIGHT,
  LAKE_COLORS,
} from "./constants.js";
import { Bounds, Point, chooseWanderTarget, clamp, distance, lerp } from "./logic.js";

type AxolotlDirection = "idle" | "right" | "left" | "up" | "down";

interface AxolotlOptions {
  pageKind: string;
  reducedMotion: boolean;
  spriteUrl?: string;
  onRipple?: (point: Point, strength: number) => void;
}

export class Axolotl {
  private readonly reducedMotion: boolean;
  private readonly pageKind: string;
  private readonly onRipple?: (point: Point, strength: number) => void;
  private readonly sprite: HTMLImageElement | null;
  private spriteLoaded = false;
  private pointer: Point | null = null;
  private wanderTarget: Point | null = null;
  private animationClock = 0;
  private frame = 0;
  private lastRippleAt = 0;
  private direction: AxolotlDirection = "idle";

  position: Point = { x: 320, y: 240 };

  constructor({ pageKind, reducedMotion, spriteUrl, onRipple }: AxolotlOptions) {
    this.pageKind = pageKind;
    this.reducedMotion = reducedMotion;
    this.onRipple = onRipple;

    if (spriteUrl) {
      const sprite = new Image();
      sprite.decoding = "async";
      sprite.src = spriteUrl;
      sprite.addEventListener("load", () => {
        this.spriteLoaded = true;
      });
      this.sprite = sprite;
      return;
    }

    this.sprite = null;
  }

  resize(bounds: Bounds): void {
    this.position = {
      x: clamp(this.position.x, 48, bounds.width - 48),
      y: clamp(this.position.y, HEADER_HEIGHT + 32, bounds.height - 48),
    };
    this.wanderTarget = chooseWanderTarget(bounds, 84);
  }

  setPointer(point: Point | null): void {
    this.pointer = point;
  }

  update(deltaMs: number, nowMs: number, bounds: Bounds): void {
    if (this.reducedMotion) {
      this.direction = "idle";
      this.frame = 0;
      return;
    }

    if (!this.pointer) {
      if (!this.wanderTarget || distance(this.position, this.wanderTarget) < 18) {
        this.wanderTarget = chooseWanderTarget(bounds, this.pageKind === "page" ? 120 : 84);
      }
    }

    const target = this.pointer ?? this.wanderTarget ?? this.position;
    const dx = target.x - this.position.x;
    const dy = target.y - this.position.y;
    const speedFactor = this.pageKind === "page" ? 0.028 : 0.05;
    const factor = Math.min(0.12, speedFactor * (deltaMs / 16.6));
    const next = {
      x: lerp(this.position.x, target.x, factor),
      y: lerp(this.position.y, target.y, factor),
    };
    const movement = distance(this.position, next);

    this.position = {
      x: clamp(next.x, 36, bounds.width - 36),
      y: clamp(next.y, HEADER_HEIGHT + 28, bounds.height - 36),
    };

    if (movement < 0.3) {
      this.direction = "idle";
      this.frame = 0;
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      this.direction = dx >= 0 ? "right" : "left";
    } else {
      this.direction = dy >= 0 ? "down" : "up";
    }

    this.animationClock += deltaMs;
    if (this.animationClock >= 100) {
      this.animationClock = 0;
      this.frame = (this.frame + 1) % AXOLOTL_COLUMN_COUNT;
    }

    if (movement > 1.4 && nowMs - this.lastRippleAt > 220) {
      this.lastRippleAt = nowMs;
      this.onRipple?.(this.position, Math.min(4, movement * 1.5));
    }
  }

  draw(
    context: CanvasRenderingContext2D,
    toRenderPoint: (point: Point) => Point,
    renderScale: number,
  ): void {
    const point = toRenderPoint(this.position);
    const size = AXOLOTL_DRAW_SIZE / renderScale;

    if (this.spriteLoaded && this.sprite) {
      const row = this.resolveSpriteRow();
      context.drawImage(
        this.sprite,
        this.frame * AXOLOTL_FRAME_SIZE,
        row * AXOLOTL_FRAME_SIZE,
        AXOLOTL_FRAME_SIZE,
        AXOLOTL_FRAME_SIZE,
        point.x - size / 2,
        point.y - size / 2,
        size,
        size,
      );
      return;
    }

    this.drawFallback(context, point, size);
  }

  private resolveSpriteRow(): number {
    switch (this.direction) {
      case "right":
        return 1;
      case "left":
        return 2;
      case "up":
        return 3;
      case "down":
        return 4;
      default:
        return 0;
    }
  }

  private drawFallback(context: CanvasRenderingContext2D, point: Point, size: number): void {
    const unit = Math.max(1, Math.floor(size / 16));
    const originX = Math.floor(point.x - size / 2);
    const originY = Math.floor(point.y - size / 2);
    const wobble = this.frame % 2 === 0 ? 0 : unit;

    context.fillStyle = LAKE_COLORS.axolotlBody;
    context.fillRect(originX + unit * 4, originY + unit * 5, unit * 8, unit * 6);
    context.fillStyle = LAKE_COLORS.axolotlBelly;
    context.fillRect(originX + unit * 6, originY + unit * 7, unit * 4, unit * 3);
    context.fillStyle = LAKE_COLORS.axolotlGill;
    context.fillRect(originX + unit * 2, originY + unit * 5, unit * 2, unit * 2);
    context.fillRect(originX + unit * 12, originY + unit * 5, unit * 2, unit * 2);
    context.fillRect(originX + unit * 1, originY + unit * 7 + wobble, unit * 2, unit);
    context.fillRect(originX + unit * 13, originY + unit * 7 + wobble, unit * 2, unit);
    context.fillStyle = LAKE_COLORS.axolotlEye;
    context.fillRect(originX + unit * 6, originY + unit * 6, unit, unit);
    context.fillRect(originX + unit * 9, originY + unit * 6, unit, unit);
    context.fillStyle = LAKE_COLORS.axolotlSpot;
    context.fillRect(originX + unit * 5, originY + unit * 9, unit, unit);
    context.fillRect(originX + unit * 10, originY + unit * 9, unit, unit);
    context.fillStyle = LAKE_COLORS.axolotlBody;
    context.fillRect(originX + unit * 6, originY + unit * 11, unit * 4, unit * 2);
  }
}
