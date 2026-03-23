import {
  CARD_HIGHLIGHT_INTERVAL_MS,
  CARD_HIGHLIGHT_RADIUS,
  DESKTOP_RENDER_SCALE,
  MOBILE_BREAKPOINT,
  MOBILE_RENDER_SCALE,
  RIPPLE_LIMIT,
} from "./constants.js";

export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  width: number;
  height: number;
}

export interface CardSnapshot {
  id: string;
  center: Point;
}

export interface CardHighlight {
  id: string;
  intensity: number;
  isNearest: boolean;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export function distance(left: Point, right: Point): number {
  return Math.hypot(left.x - right.x, left.y - right.y);
}

export function normalizePointerPosition(clientX: number, clientY: number, bounds: Bounds): Point {
  return {
    x: clamp(clientX, 0, bounds.width),
    y: clamp(clientY, 0, bounds.height),
  };
}

export function resolveRenderScale(viewportWidth: number): number {
  return viewportWidth < MOBILE_BREAKPOINT ? MOBILE_RENDER_SCALE : DESKTOP_RENDER_SCALE;
}

export function pushLimitedRipple<T>(items: T[], item: T, limit = RIPPLE_LIMIT): T[] {
  if (limit <= 1) {
    return [item];
  }

  const next = items.concat(item);
  return next.slice(Math.max(0, next.length - limit));
}

export function computeCardHighlights(
  cards: CardSnapshot[],
  point: Point,
  radius = CARD_HIGHLIGHT_RADIUS,
): CardHighlight[] {
  const highlighted = cards
    .map((card) => {
      const cardDistance = distance(card.center, point);
      if (cardDistance > radius) {
        return null;
      }

      return {
        id: card.id,
        intensity: Number((1 - cardDistance / radius).toFixed(4)),
        cardDistance,
      };
    })
    .filter((card): card is { id: string; intensity: number; cardDistance: number } => Boolean(card));

  if (highlighted.length === 0) {
    return [];
  }

  let nearestId = highlighted[0].id;
  let nearestDistance = highlighted[0].cardDistance;

  highlighted.forEach((card) => {
    if (card.cardDistance < nearestDistance) {
      nearestDistance = card.cardDistance;
      nearestId = card.id;
    }
  });

  return highlighted.map((card) => ({
    id: card.id,
    intensity: card.intensity,
    isNearest: card.id === nearestId,
  }));
}

export function chooseWanderTarget(bounds: Bounds, inset = 72): Point {
  const safeInset = Math.min(inset, Math.floor(Math.min(bounds.width, bounds.height) / 3));

  return {
    x: safeInset + Math.random() * Math.max(1, bounds.width - safeInset * 2),
    y: safeInset + Math.random() * Math.max(1, bounds.height - safeInset * 2),
  };
}

export function resolveSceneTime(nowMs: number, reducedMotion: boolean): number {
  return reducedMotion ? 0 : nowMs;
}

export function shouldSyncHighlights(
  nowMs: number,
  lastSyncAt: number,
  isDirty: boolean,
  force = false,
): boolean {
  if (force || isDirty) {
    return true;
  }

  return nowMs - lastSyncAt >= CARD_HIGHLIGHT_INTERVAL_MS;
}
