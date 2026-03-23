import {
  CARD_HIGHLIGHT_RADIUS,
  CARD_HIGHLIGHT_INTERVAL_MS,
  HEADER_HEIGHT,
  LAKE_COLORS,
  TARGET_FRAME_MS,
} from "./constants.js";
import { Axolotl } from "./Axolotl.js";
import { Decorations } from "./Decorations.js";
import { RippleSystem } from "./Ripple.js";
import {
  Bounds,
  Point,
  computeCardHighlights,
  normalizePointerPosition,
  resolveRenderScale,
  resolveSceneTime,
  shouldSyncHighlights,
} from "./logic.js";

export interface CardElementSnapshot {
  element: HTMLElement;
  id: string;
  center: Point;
}

interface LakeRendererOptions {
  canvas: HTMLCanvasElement;
  siteRoot: string;
  pageKind: string;
  reducedMotion: boolean;
}

export class LakeRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly reducedMotion: boolean;
  private readonly rippleSystem = new RippleSystem();
  private readonly decorations: Decorations;
  private readonly axolotl: Axolotl;
  private cards: CardElementSnapshot[] = [];
  private frameId = 0;
  private lastFrameAt = 0;
  private lastHighlightSyncAt = -CARD_HIGHLIGHT_INTERVAL_MS;
  private bounds: Bounds = { width: 0, height: 0 };
  private renderScale = 2;
  private cardsDirty = true;
  private appliedHighlights = new Map<string, { intensity: string; isNearest: boolean }>();

  constructor({ canvas, siteRoot, pageKind, reducedMotion }: LakeRendererOptions) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("2D canvas context is unavailable.");
    }

    this.canvas = canvas;
    this.context = context;
    this.reducedMotion = reducedMotion;
    const axolotlUrl = `${siteRoot}assets/sprites/axolotl.png`;
    const decorationsUrl = `${siteRoot}assets/sprites/decorations.png`;

    this.decorations = new Decorations(decorationsUrl);
    this.axolotl = new Axolotl({
      pageKind,
      reducedMotion,
      spriteUrl: axolotlUrl,
      onRipple: (point, strength) => {
        this.rippleSystem.add(point, strength);
      },
    });
  }

  start(): void {
    this.resize();
    this.refresh(true);
    if (!this.reducedMotion) {
      this.frameId = window.requestAnimationFrame(this.render);
    }
  }

  destroy(): void {
    if (this.frameId !== 0) {
      window.cancelAnimationFrame(this.frameId);
    }
  }

  resize(): void {
    this.bounds = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.renderScale = resolveRenderScale(this.bounds.width);
    this.canvas.width = Math.max(1, Math.floor(this.bounds.width / this.renderScale));
    this.canvas.height = Math.max(1, Math.floor(this.bounds.height / this.renderScale));
    this.axolotl.resize(this.bounds);
    this.decorations.resize(this.bounds);
    this.cardsDirty = true;
    if (this.reducedMotion) {
      this.refresh(true);
    }
  }

  setPointer(point: Point | null): void {
    if (this.reducedMotion) {
      return;
    }

    if (!point) {
      this.axolotl.setPointer(null);
      return;
    }

    this.axolotl.setPointer(normalizePointerPosition(point.x, point.y, this.bounds));
  }

  setCards(cards: CardElementSnapshot[]): void {
    this.cards = cards;
    this.cardsDirty = true;
  }

  refresh(force = false): void {
    this.syncCardHighlights(this.lastFrameAt || 0, force);
    if (this.reducedMotion) {
      this.drawScene(0);
    }
  }

  private syncCardHighlights(nowMs: number, force = false): void {
    if (!shouldSyncHighlights(nowMs, this.lastHighlightSyncAt, this.cardsDirty, force)) {
      return;
    }

    this.lastHighlightSyncAt = nowMs;
    this.cardsDirty = false;
    const highlights = computeCardHighlights(this.cards, this.axolotl.position, CARD_HIGHLIGHT_RADIUS);
    const highlightMap = new Map(highlights.map((highlight) => [highlight.id, highlight]));

    this.cards.forEach(({ element, id }) => {
      const highlight = highlightMap.get(id);
      const nextState = highlight
        ? {
            intensity: highlight.intensity.toFixed(3),
            isNearest: highlight.isNearest,
          }
        : null;
      const previousState = this.appliedHighlights.get(id);

      if (
        previousState &&
        nextState &&
        previousState.intensity === nextState.intensity &&
        previousState.isNearest === nextState.isNearest
      ) {
        return;
      }

      if (!previousState && !nextState) {
        return;
      }

      const isHighlighted = Boolean(nextState);
      element.classList.toggle("post-card--highlighted", isHighlighted);
      element.classList.toggle("post-card--nearest", nextState?.isNearest === true);

      if (!nextState) {
        element.style.removeProperty("--glow-intensity");
        this.appliedHighlights.delete(id);
        return;
      }

      element.style.setProperty("--glow-intensity", nextState.intensity);
      this.appliedHighlights.set(id, nextState);
    });
  }

  private readonly render = (nowMs: number): void => {
    if (this.lastFrameAt === 0) {
      this.lastFrameAt = nowMs;
    }

    const deltaMs = nowMs - this.lastFrameAt;
    if (deltaMs < TARGET_FRAME_MS) {
      this.frameId = window.requestAnimationFrame(this.render);
      return;
    }

    this.lastFrameAt = nowMs;
    this.axolotl.update(deltaMs, nowMs, this.bounds);
    this.rippleSystem.update(deltaMs);
    this.decorations.update(deltaMs, nowMs, this.axolotl.position, this.bounds, this.reducedMotion);
    this.syncCardHighlights(nowMs);
    this.drawScene(resolveSceneTime(nowMs, this.reducedMotion));
    this.frameId = window.requestAnimationFrame(this.render);
  };

  private drawScene(sceneTimeMs: number): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground(sceneTimeMs);
    this.decorations.draw(this.context, this.toRenderPoint, sceneTimeMs, this.bounds, this.reducedMotion);
    this.rippleSystem.draw(this.context, this.toRenderPoint);
    this.axolotl.draw(this.context, this.toRenderPoint, this.renderScale);
  }

  private drawBackground(nowMs: number): void {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const bandHeight = Math.max(1, Math.floor(height / 14));
    const palette = [
      LAKE_COLORS.surface,
      "#17365a",
      LAKE_COLORS.highlight,
      "#15304f",
      LAKE_COLORS.mid,
      "#102541",
      LAKE_COLORS.deep,
    ];

    for (let y = 0; y < height; y += bandHeight) {
      const color = palette[Math.min(palette.length - 1, Math.floor((y / height) * palette.length))];
      this.context.fillStyle = color;
      this.context.fillRect(0, y, width, bandHeight + 1);
    }

    const waveBase = HEADER_HEIGHT / this.renderScale + 12;
    this.context.fillStyle = "rgba(255,255,255,0.08)";
    for (let x = 0; x < width; x += 4) {
      const wave =
        Math.sin(x / 9 + nowMs / 900) * 1.4 +
        Math.sin(x / 17 + nowMs / 1300) * 1.2 +
        Math.sin(x / 31 + nowMs / 1700) * 0.8;
      this.context.fillRect(x, waveBase + wave, 2, 1);
    }

    this.context.fillStyle = "rgba(106, 176, 216, 0.35)";
    for (let index = 0; index < 28; index += 1) {
      const shimmerX = (index * 17 + Math.floor(nowMs / 50)) % Math.max(1, width);
      const shimmerY = waveBase + ((index % 3) - 1) * 2 + Math.sin(nowMs / 600 + index) * 2;
      this.context.fillRect(shimmerX, shimmerY, 1, 1);
    }
  }

  private readonly toRenderPoint = (point: Point): Point => ({
    x: point.x / this.renderScale,
    y: point.y / this.renderScale,
  });
}
