import { prepareWithSegments, layoutNextLine } from "@chenglou/pretext";
import type { PreparedTextWithSegments, LayoutCursor } from "@chenglou/pretext";
import type { Vec2 } from "./types.js";
import type { Creature } from "./creatures.js";

const LINE_HEIGHT_RATIO = 1.72;
const MIN_SLOT_WIDTH = 40; // px — don't render text in slots narrower than this
const FISH_PADDING = 18; // px — extra clearance around the fish obstacle
const DURATION = 3.2; // seconds for full enter + exit cycle

// ─── Bezier helpers ────────────────────────────────────────────────────────
function cubicBezier(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
  const mt = 1 - t;
  return {
    x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
    y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
  };
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// ─── PretextEffect ─────────────────────────────────────────────────────────
export class PretextEffect {
  private creature: Creature;
  private overlay: HTMLCanvasElement;
  private overlayCtx: CanvasRenderingContext2D;

  private isActive = false;
  private t = 0; // overall animation progress 0 → 1
  private fishScreenPos: Vec2 = { x: 0, y: 0 };
  private lastTime = 0;
  private rafId = 0;

  // Bezier control points for the two phases
  private enterBez: [Vec2, Vec2, Vec2, Vec2] | null = null;
  private exitBez: [Vec2, Vec2, Vec2, Vec2] | null = null;

  // Pretext per-paragraph data (lazily populated)
  private preparedMap = new Map<HTMLParagraphElement, PreparedTextWithSegments>();
  private activePara: HTMLParagraphElement | null = null;
  private lineSpans: HTMLSpanElement[] = [];

  constructor(creature: Creature, overlay: HTMLCanvasElement) {
    this.creature = creature;
    this.overlay = overlay;
    this.overlayCtx = overlay.getContext("2d")!;
  }

  /** Attach click listener to all .prose elements on the page */
  setup(): void {
    const proseEls = document.querySelectorAll<HTMLElement>(".prose");
    for (const el of proseEls) {
      el.addEventListener("click", (e) => this.handleClick(e));
    }
  }

  private handleClick(e: MouseEvent): void {
    if (this.isActive) return;

    // Find the clicked paragraph, or use the first visible one
    const clicked = (e.target as HTMLElement).closest("p");
    const prose = (e.target as HTMLElement).closest(".prose");
    if (!prose) return;

    const para = (clicked instanceof HTMLParagraphElement ? clicked : null)
      ?? prose.querySelector("p");
    if (!para) return;

    this.trigger(para as HTMLParagraphElement);
  }

  private trigger(para: HTMLParagraphElement): void {
    // Prepare text if first time
    if (!this.preparedMap.has(para)) {
      const text = para.textContent?.trim() ?? "";
      if (!text) return;

      const style = window.getComputedStyle(para);
      const font = `${style.fontSize} ${style.fontFamily}`;
      try {
        this.preparedMap.set(para, prepareWithSegments(text, font));
      } catch {
        return; // Font not ready / unsupported — fail silently
      }
    }

    // Calculate paths
    const creaturePos = this.creature.getPosition();
    const paraRect = para.getBoundingClientRect();
    const isDesktop = window.innerWidth >= 960;

    // Entry start: creature's current position (in aquarium, left side or top)
    const start = { ...creaturePos };

    // Traversal center: mid-height of the paragraph, inside content area
    const traverseY = paraRect.top + paraRect.height * 0.45;
    const traverseX = paraRect.left + paraRect.width * 0.6;
    const end: Vec2 = { x: traverseX, y: traverseY };

    if (isDesktop) {
      // Enter from left → traverse right
      const mid: Vec2 = { x: paraRect.left - 30, y: (start.y + traverseY) / 2 };
      this.enterBez = [
        start,
        { x: mid.x, y: start.y },
        { x: paraRect.left + paraRect.width * 0.15, y: traverseY },
        end,
      ];
      this.exitBez = [
        end,
        { x: paraRect.left + paraRect.width * 0.15, y: traverseY },
        { x: mid.x, y: start.y },
        start,
      ];
    } else {
      // Mobile: enter from top
      const topEntry: Vec2 = { x: paraRect.left + paraRect.width * 0.5, y: paraRect.top - 40 };
      this.enterBez = [
        start,
        { x: start.x, y: paraRect.top - 60 },
        { x: topEntry.x, y: paraRect.top - 20 },
        { x: topEntry.x, y: traverseY },
      ];
      this.exitBez = [
        { x: topEntry.x, y: traverseY },
        { x: topEntry.x, y: paraRect.top - 20 },
        { x: start.x, y: paraRect.top - 60 },
        start,
      ];
    }

    // Begin
    this.isActive = true;
    this.t = 0;
    this.activePara = para;
    // Make para a positioning context for absolute spans
    para.style.position = "relative";
    this.creature.setBreach(true);
    this.setupOverlay();
    this.overlay.classList.add("is-active");

    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame((ts) => this.step(ts));
  }

  private step(timestamp: number): void {
    const delta = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;
    this.t = Math.min(this.t + delta / DURATION, 1);

    // Update fish position along bezier path
    const half = 0.5;
    if (this.t <= half) {
      const tNorm = easeInOut(this.t / half);
      if (this.enterBez) {
        this.fishScreenPos = cubicBezier(...this.enterBez, tNorm);
      }
    } else {
      const tNorm = easeInOut((this.t - half) / (1 - half));
      if (this.exitBez) {
        this.fishScreenPos = cubicBezier(...this.exitBez, tNorm);
      }
    }

    // Update creature facing direction
    if (this.t <= half && this.enterBez) {
      const tNext = easeInOut(Math.min(this.t / half + 0.01, 1));
      const nextPos = cubicBezier(...this.enterBez, tNext);
      this.creature.facingLeft = nextPos.x < this.fishScreenPos.x;
    }

    // Render
    this.renderOverlay();
    if (this.activePara) {
      const prepared = this.preparedMap.get(this.activePara);
      if (prepared) this.reflowParagraph(this.activePara, prepared);
    }

    if (this.t < 1) {
      this.rafId = requestAnimationFrame((ts) => this.step(ts));
    } else {
      this.finish();
    }
  }

  private reflowParagraph(para: HTMLParagraphElement, prepared: PreparedTextWithSegments): void {
    // Remove previous spans
    for (const s of this.lineSpans) s.remove();
    this.lineSpans = [];

    const paraRect = para.getBoundingClientRect();
    const style = window.getComputedStyle(para);
    const fontSize = parseFloat(style.fontSize);
    const lineHeight = parseFloat(style.lineHeight) || fontSize * LINE_HEIGHT_RATIO;
    const proseWidth = paraRect.width;
    const proseLeft = paraRect.left;

    // Fish bounding box in viewport coordinates
    const { w: fishW, h: fishH } = this.creature.getScaledDimensions();
    const fishL = this.fishScreenPos.x - fishW / 2 - FISH_PADDING;
    const fishR = this.fishScreenPos.x + fishW / 2 + FISH_PADDING;
    const fishT = this.fishScreenPos.y - fishH / 2 - FISH_PADDING;
    const fishB = this.fishScreenPos.y + fishH / 2 + FISH_PADDING;

    // Check if fish overlaps paragraph area at all
    const fishNearProse = fishR > proseLeft
      && fishL < proseLeft + proseWidth
      && fishB > paraRect.top
      && fishT < paraRect.bottom;

    if (!fishNearProse) {
      // Restore normal text
      para.style.color = "";
      return;
    }

    // Hide original text
    para.style.color = "transparent";

    let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
    let y = paraRect.top;
    const maxIterations = Math.ceil(paraRect.height / lineHeight) + 8;

    for (let i = 0; i < maxIterations; i++) {
      const bandTop = y;
      const bandBottom = y + lineHeight;
      const fishHere = fishB > bandTop && fishT < bandBottom;

      if (fishHere) {
        // Compute fish interval in prose-local X
        const fishLocalL = fishL - proseLeft;
        const fishLocalR = fishR - proseLeft;

        const leftSlotW = Math.max(0, fishLocalL);
        const rightSlotX = Math.max(0, Math.min(fishLocalR, proseWidth));
        const rightSlotW = Math.max(0, proseWidth - rightSlotX);

        let lineConsumed = false;

        if (leftSlotW >= MIN_SLOT_WIDTH) {
          const line = layoutNextLine(prepared, cursor, leftSlotW);
          if (!line) break;
          this.addSpan(para, paraRect, line.text, 0, y - paraRect.top, lineHeight, style);
          cursor = line.end;
          lineConsumed = true;
        }

        if (rightSlotW >= MIN_SLOT_WIDTH) {
          const line = layoutNextLine(prepared, cursor, rightSlotW);
          if (line) {
            this.addSpan(para, paraRect, line.text, rightSlotX, y - paraRect.top, lineHeight, style);
            cursor = line.end;
            lineConsumed = true;
          }
        }

        if (!lineConsumed) {
          // Both slots too narrow — skip this line band
        }
      } else {
        // Full-width line
        const line = layoutNextLine(prepared, cursor, proseWidth);
        if (!line) break;
        this.addSpan(para, paraRect, line.text, 0, y - paraRect.top, lineHeight, style);
        cursor = line.end;
      }

      y += lineHeight;
    }
  }

  private addSpan(
    para: HTMLParagraphElement,
    _paraRect: DOMRect,
    text: string,
    localX: number,
    localY: number,
    lineHeight: number,
    style: CSSStyleDeclaration,
  ): void {
    const span = document.createElement("span");
    span.className = "pretext-line";
    span.textContent = text;
    span.style.left = `${localX}px`;
    span.style.top = `${localY}px`;
    span.style.fontSize = style.fontSize;
    span.style.lineHeight = `${lineHeight}px`;
    para.appendChild(span);
    this.lineSpans.push(span);
  }

  private renderOverlay(): void {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ctx = this.overlayCtx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    this.creature.drawOnContext(ctx, this.fishScreenPos);
  }

  private setupOverlay(): void {
    const dpr = window.devicePixelRatio || 1;
    this.overlay.width = window.innerWidth * dpr;
    this.overlay.height = window.innerHeight * dpr;
  }

  private finish(): void {
    cancelAnimationFrame(this.rafId);
    this.isActive = false;

    if (this.activePara) {
      this.activePara.style.color = "";
      this.activePara.style.position = "";
    }

    for (const s of this.lineSpans) s.remove();
    this.lineSpans = [];
    this.activePara = null;

    this.creature.setBreach(false);
    this.overlay.classList.remove("is-active");
    const dpr = window.devicePixelRatio || 1;
    const ctx = this.overlayCtx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  dispose(): void {
    cancelAnimationFrame(this.rafId);
    this.preparedMap.clear();
    for (const s of this.lineSpans) s.remove();
    this.lineSpans = [];
  }
}
