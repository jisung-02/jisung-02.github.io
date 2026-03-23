import { LAKE_COLORS } from "./constants.js";
import { Bounds, Point, chooseWanderTarget, clamp } from "./logic.js";

interface Bubble {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
}

interface Lily {
  x: number;
  y: number;
  size: number;
}

export class Decorations {
  private lilies: Lily[] = [];
  private bubbles: Bubble[] = [];
  private lastBubbleAt = 0;
  private sprite: HTMLImageElement | null = null;
  private spriteLoaded = false;

  constructor(spriteUrl?: string) {
    if (spriteUrl) {
      const sprite = new Image();
      sprite.decoding = "async";
      sprite.src = spriteUrl;
      sprite.addEventListener("load", () => {
        this.spriteLoaded = true;
      });
      this.sprite = sprite;
    }
  }

  resize(bounds: Bounds): void {
    this.lilies = [
      { x: bounds.width * 0.18, y: bounds.height * 0.84, size: 18 },
      { x: bounds.width * 0.82, y: bounds.height * 0.79, size: 16 },
      { x: bounds.width * 0.62, y: bounds.height * 0.88, size: 14 },
    ];
  }

  update(deltaMs: number, nowMs: number, anchor: Point, bounds: Bounds, reducedMotion: boolean): void {
    if (!reducedMotion && nowMs - this.lastBubbleAt > 650) {
      this.lastBubbleAt = nowMs;
      const target = chooseWanderTarget({ width: 18, height: 12 }, 0);
      this.bubbles.push({
        x: anchor.x + target.x - 9,
        y: anchor.y + target.y - 6,
        size: 1 + Math.random() * 2,
        alpha: 0.48,
        speed: 14 + Math.random() * 12,
      });
    }

    const delta = deltaMs / 1000;
    this.bubbles = this.bubbles
      .map((bubble) => ({
        ...bubble,
        y: bubble.y - bubble.speed * delta,
        alpha: Math.max(0, bubble.alpha - delta * 0.18),
      }))
      .filter((bubble) => bubble.alpha > 0.05 && bubble.y > -8 && bubble.y < bounds.height + 8);
  }

  draw(
    context: CanvasRenderingContext2D,
    toRenderPoint: (point: Point) => Point,
    timeMs: number,
    bounds: Bounds,
    reducedMotion: boolean,
  ): void {
    this.drawPlants(context, bounds, timeMs, reducedMotion);

    this.lilies.forEach((lily, index) => {
      const point = toRenderPoint({
        x: lily.x,
        y: lily.y + (reducedMotion ? 0 : Math.sin(timeMs / 900 + index) * 3),
      });
      const size = Math.max(4, lily.size / 2);

      if (this.spriteLoaded && this.sprite) {
        context.drawImage(this.sprite, 0, 0, 16, 16, point.x - size / 2, point.y - size / 2, size, size);
        return;
      }

      context.fillStyle = LAKE_COLORS.plantLight;
      context.fillRect(point.x - size / 2, point.y - size / 4, size, size / 2);
      context.fillStyle = index % 2 === 0 ? LAKE_COLORS.lilyWhite : LAKE_COLORS.lilyPink;
      context.fillRect(point.x - 1, point.y - size / 2, 2, 2);
      context.fillRect(point.x - 3, point.y - size / 2 + 2, 2, 2);
      context.fillRect(point.x + 1, point.y - size / 2 + 2, 2, 2);
    });

    this.bubbles.forEach((bubble) => {
      const point = toRenderPoint({ x: bubble.x, y: bubble.y });
      const alpha = clamp(bubble.alpha, 0, 1);
      context.fillStyle = `rgba(232, 240, 255, ${alpha.toFixed(2)})`;
      context.fillRect(point.x, point.y, Math.max(1, bubble.size / 1.5), Math.max(1, bubble.size / 1.5));
    });
  }

  private drawPlants(context: CanvasRenderingContext2D, bounds: Bounds, timeMs: number, reducedMotion: boolean): void {
    const renderHeight = Math.max(12, bounds.height / 2);
    const renderWidth = Math.max(12, bounds.width / 2);

    for (const side of [0.12, 0.88]) {
      const baseX = renderWidth * side;
      for (let index = 0; index < 4; index += 1) {
        const sway = reducedMotion ? 0 : Math.sin(timeMs / 1200 + index + side * 10) * 2;
        const stemHeight = 12 + index * 4;
        context.fillStyle = index % 2 === 0 ? LAKE_COLORS.plantDark : LAKE_COLORS.plantMid;
        context.fillRect(baseX + sway + index * 3, renderHeight - stemHeight, 2, stemHeight);
        context.fillStyle = LAKE_COLORS.plantLight;
        context.fillRect(baseX + sway + index * 3 - 1, renderHeight - stemHeight + 3, 1, 4);
      }
    }
  }
}
