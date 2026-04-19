import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const rootDirectory = "/Users/chaejisung/Desktop/Project/blog";
const stylesFilePath = path.join(rootDirectory, "src", "assets", "styles.css");

test("styles use a restrained developer-blog visual system", async () => {
  const styles = await readFile(stylesFilePath, "utf8");

  assert.doesNotMatch(styles, /Iowan Old Style|Palatino Linotype|Book Antiqua/, "should remove the editorial serif stack");
  assert.match(styles, /font-family:\s*"Pretendard Variable",\s*"Pretendard"/, "should use a sans-serif reading stack");
  assert.match(styles, /body\s*\{[\s\S]*background:\s*#fff;/, "should use a clean white canvas");
  assert.match(styles, /\.site-frame\s*\{[\s\S]*box-shadow:\s*none;/, "should remove the heavy paper card shadow");
  assert.match(styles, /\.finder\s*\{[\s\S]*background:\s*#fff;/, "should restyle the archive finder as a flat white panel");
});
