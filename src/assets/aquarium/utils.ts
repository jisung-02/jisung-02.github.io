import type { PixelFrame, ColorPalette } from "./types.js";

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  frame: PixelFrame,
  palette: ColorPalette,
  x: number,
  y: number,
  scale: number,
  flipX: boolean,
): void {
  const rows = frame.length;
  const cols = rows > 0 ? frame[0].length : 0;
  const pixX = Math.round(x);
  const pixY = Math.round(y);

  for (let r = 0; r < rows; r++) {
    const row = frame[r];
    for (let c = 0; c < cols; c++) {
      const idx = row[c];
      if (idx === 0) continue;
      const color = palette[idx];
      if (!color || color === "transparent") continue;
      ctx.fillStyle = color;
      const drawC = flipX ? (cols - 1 - c) : c;
      ctx.fillRect(pixX + drawC * scale, pixY + r * scale, scale, scale);
    }
  }
}
