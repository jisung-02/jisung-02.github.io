import { execSync } from "node:child_process";
import { copyFile, mkdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { build } from "esbuild";

import { loadAllMarkdown } from "../src/site/content.js";
import { buildNavigationData } from "../src/site/navigation-data.js";
import { buildSearchIndex } from "../src/site/search-index.js";
import type { NavigationData } from "../src/site/navigation-data.js";
import type { SearchIndexEntry } from "../src/site/types.js";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const staticDirectory = path.join(rootDirectory, "static");
const staticAssetsDirectory = path.join(rootDirectory, "static", "assets");
const generatedDataDirectory = path.join(rootDirectory, "data", "generated");

export interface GeneratedArtifactsOptions {
  generatedDataDirectory: string;
  staticAssetsDirectory: string;
  searchIndex: SearchIndexEntry[];
  navigationData: NavigationData;
}

async function main(): Promise<void> {
  const temporaryAssetsDirectory = path.join(staticDirectory, `.assets-tmp-${Date.now()}`);
  await rm(temporaryAssetsDirectory, { recursive: true, force: true });
  await mkdir(temporaryAssetsDirectory, { recursive: true });

  const entries = await loadAllMarkdown(path.join(rootDirectory, "content"));
  const searchIndex = buildSearchIndex(entries);
  const navigationData = buildNavigationData(entries);

  await writeGeneratedArtifacts({
    generatedDataDirectory,
    staticAssetsDirectory: temporaryAssetsDirectory,
    searchIndex,
    navigationData,
  });

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

export async function writeGeneratedArtifacts(options: GeneratedArtifactsOptions): Promise<void> {
  await mkdir(options.generatedDataDirectory, { recursive: true });
  await mkdir(options.staticAssetsDirectory, { recursive: true });

  await writeGeneratedJson(path.join(options.generatedDataDirectory, "search-index.json"), options.searchIndex);
  await writeGeneratedJson(path.join(options.generatedDataDirectory, "vault-navigation.json"), options.navigationData);
  await writeGeneratedJson(path.join(options.staticAssetsDirectory, "search-index.json"), options.searchIndex);
}

async function writeGeneratedJson(filePath: string, payload: unknown): Promise<void> {
  await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function isDirectExecution(): boolean {
  return process.argv[1] !== undefined && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
}

if (isDirectExecution()) {
  void main();
}
