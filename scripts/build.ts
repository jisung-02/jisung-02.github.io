import { execSync } from "node:child_process";
import { copyFile, mkdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { build } from "esbuild";

import { loadAllMarkdown } from "../src/site/content.js";
import { buildNavigationData } from "../src/site/navigation-data.js";
import { buildSearchIndex } from "../src/site/search-index.js";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const staticDirectory = path.join(rootDirectory, "static");
const staticAssetsDirectory = path.join(rootDirectory, "static", "assets");
const generatedDataDirectory = path.join(rootDirectory, "data", "generated");

async function main(): Promise<void> {
  const temporaryAssetsDirectory = path.join(staticDirectory, `.assets-tmp-${Date.now()}`);
  await rm(temporaryAssetsDirectory, { recursive: true, force: true });
  await mkdir(temporaryAssetsDirectory, { recursive: true });

  const entries = await loadAllMarkdown(path.join(rootDirectory, "content"));
  const searchIndex = buildSearchIndex(entries);
  const navigationData = buildNavigationData(entries);

  await mkdir(generatedDataDirectory, { recursive: true });
  await writeGeneratedJson(path.join(generatedDataDirectory, "search-index.json"), searchIndex);
  await writeGeneratedJson(path.join(generatedDataDirectory, "vault-navigation.json"), navigationData);

  await writeGeneratedJson(path.join(temporaryAssetsDirectory, "search-index.json"), searchIndex);

  await copyFile(path.join(rootDirectory, "src", "assets", "styles.css"), path.join(temporaryAssetsDirectory, "styles.css"));

  await build({
    entryPoints: [path.join(rootDirectory, "src", "assets", "app.tsx")],
    outfile: path.join(temporaryAssetsDirectory, "app.js"),
    bundle: true,
    format: "esm",
    target: ["es2020"],
    minify: true,
    sourcemap: false,
  });

  await rm(staticAssetsDirectory, { recursive: true, force: true });
  await rename(temporaryAssetsDirectory, staticAssetsDirectory);

  try {
    execSync("hugo --cleanDestinationDir --minify", {
      cwd: rootDirectory,
      stdio: "inherit",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Hugo build failed. Ensure \`hugo\` is installed and available in PATH. ${message}`);
  }

  console.log("build ok: dist generated");
}

async function writeGeneratedJson(filePath: string, payload: unknown): Promise<void> {
  await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

void main();
