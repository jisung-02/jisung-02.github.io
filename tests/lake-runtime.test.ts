import assert from "node:assert/strict";
import test from "node:test";

import {
  computeCardHighlights,
  normalizePointerPosition,
  pushLimitedRipple,
  resolveRenderScale,
  resolveSceneTime,
  shouldSyncHighlights,
} from "../src/assets/lake/logic.js";

test("normalizePointerPosition clamps coordinates into the viewport", () => {
  const point = normalizePointerPosition(-12, 980, { width: 360, height: 640 });

  assert.deepEqual(point, { x: 0, y: 640 });
});

test("computeCardHighlights marks the nearest highlighted card", () => {
  const highlights = computeCardHighlights(
    [
      { id: "a", center: { x: 40, y: 40 } },
      { id: "b", center: { x: 80, y: 80 } },
      { id: "c", center: { x: 280, y: 280 } },
    ],
    { x: 72, y: 74 },
    120,
  );

  assert.equal(highlights.length, 2);
  assert.equal(highlights.find((highlight) => highlight.id === "b")?.isNearest, true);
  assert.equal(highlights.find((highlight) => highlight.id === "a")?.isNearest, false);
});

test("pushLimitedRipple keeps only the newest items within the ripple cap", () => {
  const result = [1, 2, 3, 4].reduce((items, item) => pushLimitedRipple(items, item, 3), [] as number[]);

  assert.deepEqual(result, [2, 3, 4]);
});

test("resolveRenderScale uses a coarser scale on mobile widths", () => {
  assert.equal(resolveRenderScale(430), 3);
  assert.equal(resolveRenderScale(1280), 2);
});

test("resolveSceneTime freezes the scene clock when reduced motion is enabled", () => {
  assert.equal(resolveSceneTime(1_234, true), 0);
  assert.equal(resolveSceneTime(1_234, false), 1_234);
});

test("shouldSyncHighlights forces updates for dirty state and otherwise throttles cadence", () => {
  assert.equal(shouldSyncHighlights(50, 0, false), false);
  assert.equal(shouldSyncHighlights(100, 0, false), true);
  assert.equal(shouldSyncHighlights(10, 0, true), true);
  assert.equal(shouldSyncHighlights(10, 0, false, true), true);
});
