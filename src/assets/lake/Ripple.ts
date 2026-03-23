import { LAKE_COLORS, RIPPLE_LIMIT } from "./constants.js";
import { Point, pushLimitedRipple } from "./logic.js";

interface RippleState {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  growth: number;
}

export class RippleSystem {
  private ripples: RippleState[] = [];

  add(point: Point, strength = 1): void {
    this.ripples = pushLimitedRipple(
      this.ripples,
      {
        x: point.x,
        y: point.y,
        radius: 4,
        alpha: Math.min(0.75, 0.35 + strength * 0.08),
        growth: 18 + strength * 2,
      },
      RIPPLE_LIMIT,
    );
  }

  update(deltaMs: number): void {
    const delta = deltaMs / 1000;

    this.ripples = this.ripples
      .map((ripple) => ({
        ...ripple,
        radius: ripple.radius + ripple.growth * delta,
        alpha: Math.max(0, ripple.alpha - delta * 0.22),
      }))
      .filter((ripple) => ripple.alpha > 0.02);
  }

  draw(
    context: CanvasRenderingContext2D,
    toRenderPoint: (point: Point) => Point,
  ): void {
    this.ripples.forEach((ripple) => {
      const point = toRenderPoint({ x: ripple.x, y: ripple.y });
      const radius = Math.max(1, ripple.radius / 2);
      context.strokeStyle = `${LAKE_COLORS.shimmer}${Math.round(ripple.alpha * 255)
        .toString(16)
        .padStart(2, "0")}`;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(point.x, point.y, radius, 0, Math.PI * 2);
      context.stroke();
    });
  }
}
