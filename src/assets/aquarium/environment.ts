import type { Bubble, EnvironmentElement } from "./types.js";
import { MAX_BUBBLES, BUBBLE_SPAWN_INTERVAL_MIN, BUBBLE_SPAWN_INTERVAL_MAX, SAND_HEIGHT } from "./types.js";
import { PLANT_SPRITE, SHELL_SPRITE, SNAIL_SPRITE } from "./sprites.js";
import { drawSprite } from "./utils.js";

export class Environment {
  private plants: EnvironmentElement[] = [];
  private shells: EnvironmentElement[] = [];
  private snails: EnvironmentElement[] = [];
  private bubbles: Bubble[] = [];
  private nextBubbleTime = 0;
  private time = 0;

  // Sand texture dots (generated once)
  private sandDots: Array<{ x: number; y: number; r: number; alpha: number }> = [];
  private canvasW = 0;
  private canvasH = 0;

  init(w: number, h: number): void {
    this.canvasW = w;
    this.canvasH = h;
    this.generateSandDots(w, h);
    this.placeElements(w, h);
    this.nextBubbleTime = BUBBLE_SPAWN_INTERVAL_MIN + Math.random() * (BUBBLE_SPAWN_INTERVAL_MAX - BUBBLE_SPAWN_INTERVAL_MIN);
  }

  private generateSandDots(w: number, h: number): void {
    this.sandDots = [];
    const sandY = h - SAND_HEIGHT;
    for (let i = 0; i < 80; i++) {
      this.sandDots.push({
        x: Math.random() * w,
        y: sandY + Math.random() * SAND_HEIGHT,
        r: 1 + Math.random() * 2,
        alpha: 0.15 + Math.random() * 0.2,
      });
    }
  }

  private placeElements(w: number, h: number): void {
    const sandY = h - SAND_HEIGHT;
    const plantCount = 6 + Math.floor(Math.random() * 3);
    const plantSpacing = w / (plantCount + 1);

    this.plants = [];
    for (let i = 0; i < plantCount; i++) {
      const baseX = plantSpacing * (i + 1) + (Math.random() - 0.5) * plantSpacing * 0.6;
      this.plants.push({
        type: "plant",
        x: baseX,
        y: sandY - PLANT_SPRITE.height * PLANT_SPRITE.scale + PLANT_SPRITE.scale * 4,
        frameIndex: Math.random() > 0.5 ? 0 : 1,
        frameTimer: 0,
      });
    }

    this.shells = [];
    const shellCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < shellCount; i++) {
      this.shells.push({
        type: "shell",
        x: (w * 0.1) + Math.random() * (w * 0.8),
        y: sandY - SHELL_SPRITE.height * SHELL_SPRITE.scale + 4,
        frameIndex: 0,
        frameTimer: 0,
      });
    }

    this.snails = [];
    const snailCount = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < snailCount; i++) {
      this.snails.push({
        type: "snail",
        x: (w * 0.1) + Math.random() * (w * 0.8),
        y: sandY - SNAIL_SPRITE.height * SNAIL_SPRITE.scale + 4,
        frameIndex: 0,
        frameTimer: 0,
      });
    }
  }

  resize(w: number, h: number): void {
    const scaleX = w / (this.canvasW || w);
    for (const el of [...this.plants, ...this.shells, ...this.snails]) {
      el.x *= scaleX;
    }
    this.canvasW = w;
    this.canvasH = h;
    this.generateSandDots(w, h);
  }

  update(delta: number): void {
    this.time += delta;

    // Plant animation
    for (const plant of this.plants) {
      plant.frameTimer += delta;
      if (plant.frameTimer >= 0.8) {
        plant.frameTimer = 0;
        plant.frameIndex = (plant.frameIndex + 1) % PLANT_SPRITE.frames.idle.length;
      }
    }

    // Snail animation
    for (const snail of this.snails) {
      snail.frameTimer += delta;
      if (snail.frameTimer >= 0.6) {
        snail.frameTimer = 0;
        snail.frameIndex = (snail.frameIndex + 1) % SNAIL_SPRITE.frames.idle.length;
      }
    }

    // Bubble updates
    for (const b of this.bubbles) {
      b.y -= b.speed * delta;
      b.x += Math.sin(this.time * 1.5 + b.wobblePhase) * b.wobbleAmp * delta;
    }
    // Remove off-screen bubbles
    const keepBubbles = this.bubbles.filter(b => b.y > -20);
    this.bubbles.length = 0;
    this.bubbles.push(...keepBubbles);

    // Spawn new bubbles
    this.nextBubbleTime -= delta;
    if (this.nextBubbleTime <= 0 && this.bubbles.length < MAX_BUBBLES) {
      this.spawnBubble();
      this.nextBubbleTime = BUBBLE_SPAWN_INTERVAL_MIN + Math.random() * (BUBBLE_SPAWN_INTERVAL_MAX - BUBBLE_SPAWN_INTERVAL_MIN);
    }
  }

  private spawnBubble(): void {
    const sandY = this.canvasH - SAND_HEIGHT;
    this.bubbles.push({
      x: Math.random() * this.canvasW,
      y: sandY - 4,
      radius: 2 + Math.random() * 4,
      speed: 25 + Math.random() * 30,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleAmp: 8 + Math.random() * 8,
      opacity: 0.3 + Math.random() * 0.3,
    });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const sandY = h - SAND_HEIGHT;

    // Sand floor gradient
    const sandGrad = ctx.createLinearGradient(0, sandY, 0, h);
    sandGrad.addColorStop(0, "#c4a86a");
    sandGrad.addColorStop(0.3, "#b09050");
    sandGrad.addColorStop(1, "#8a7040");
    ctx.fillStyle = sandGrad;
    ctx.fillRect(0, sandY, w, SAND_HEIGHT);

    // Sand texture dots
    for (const dot of this.sandDots) {
      ctx.save();
      ctx.globalAlpha = dot.alpha;
      ctx.fillStyle = "#6a5030";
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Plants
    for (const plant of this.plants) {
      const frame = PLANT_SPRITE.frames.idle[plant.frameIndex];
      const px = plant.x - PLANT_SPRITE.width * PLANT_SPRITE.scale / 2;
      drawSprite(ctx, frame, PLANT_SPRITE.palette, px, plant.y, PLANT_SPRITE.scale, false);
    }

    // Shells
    for (const shell of this.shells) {
      const sx = shell.x - SHELL_SPRITE.width * SHELL_SPRITE.scale / 2;
      drawSprite(ctx, SHELL_SPRITE.frames.idle[0], SHELL_SPRITE.palette, sx, shell.y, SHELL_SPRITE.scale, false);
    }

    // Snails
    for (const snail of this.snails) {
      const frame = SNAIL_SPRITE.frames.idle[snail.frameIndex];
      const snx = snail.x - SNAIL_SPRITE.width * SNAIL_SPRITE.scale / 2;
      drawSprite(ctx, frame, SNAIL_SPRITE.palette, snx, snail.y, SNAIL_SPRITE.scale, false);
    }

    // Bubbles
    for (const b of this.bubbles) {
      ctx.save();
      ctx.globalAlpha = b.opacity;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.strokeStyle = "#a8e0f0";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Highlight
      ctx.beginPath();
      ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = "#e8f8ff";
      ctx.fill();
      ctx.restore();
    }
  }
}
