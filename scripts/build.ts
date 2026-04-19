import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { copyFile, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
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

  await assertRenderedEditorialShell(path.join(rootDirectory, "dist"));

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

function normalizeOpeningBodyTag(bodyTag: string): string {
  const attributeSource = bodyTag.replace(/^<body\b/, "").replace(/>$/, "");
  const attributes = Array.from(
    attributeSource.matchAll(/\s([^\s=/>]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g),
  ).map((match) => {
    const [, name, doubleQuotedValue, singleQuotedValue, unquotedValue] = match;
    const value = doubleQuotedValue ?? singleQuotedValue ?? unquotedValue ?? "";
    return `${name}="${value}"`;
  });

  return `<body ${attributes.join(" ")}>`;
}

function findMarkerIndex(source: string, pattern: RegExp): number {
  return source.search(pattern);
}

async function assertRenderedEditorialShell(distDirectory: string): Promise<void> {
  const homeHtml = await readFile(path.join(distDirectory, "index.html"), "utf8");
  const homeBodyTag = homeHtml.match(/<body\b[^>]*>/)?.[0];
  const siteFrameIndex = findMarkerIndex(homeHtml, /<div class="?site-frame"?>/);
  const siteProgressIndex = findMarkerIndex(homeHtml, /<div class="?site-progress"? aria-hidden="?true"?><\/div>/);
  const siteHeaderIndex = findMarkerIndex(homeHtml, /<header class="?site-header"?>/);

  assert.ok(homeBodyTag, "expected the home page to render a body tag");
  assert.doesNotMatch(
    homeHtml,
    /aquarium-layout/,
    "expected the home page to drop the aquarium layout wrapper",
  );
  assert.doesNotMatch(
    homeHtml,
    /aquarium-canvas/,
    "expected the home page to drop the aquarium canvas",
  );
  assert.doesNotMatch(
    homeHtml,
    /pretext-overlay/,
    "expected the home page to drop the pretext overlay canvas",
  );
  assert.equal(
    normalizeOpeningBodyTag(homeBodyTag),
    '<body class="site-body" data-section="" data-kind="home">',
    "expected the home page body to use the exact editorial shell markup",
  );
  assert.notStrictEqual(siteFrameIndex, -1, "expected the home page shell to include the site frame");
  assert.notStrictEqual(siteProgressIndex, -1, "expected the home page shell to include the site progress bar");
  assert.notStrictEqual(siteHeaderIndex, -1, "expected the home page shell to include the site header");
  assert.ok(
    siteFrameIndex < siteProgressIndex && siteProgressIndex < siteHeaderIndex,
    "expected the site frame to wrap the progress bar before the header in the home page shell",
  );
  assert.match(homeHtml, /<a class=vault-nav__link href=\/blog\/about\/>About<\/a>/, "expected the home rail to include an About link");
  assert.match(
    homeHtml,
    /<a class=vault-nav__link href=\/blog\/scratchpad\/>Scratchpad<\/a>/,
    "expected the home rail to include a Scratchpad link",
  );
  assert.match(
    homeHtml,
    /<section class="[^"]*home-feature[^"]*">/,
    "expected the home page to render the new featured-entry section",
  );
  assert.match(
    homeHtml,
    /<aside class="?home-rail"?[\s\S]*?Scratchpad/,
    "expected the home page to render a secondary scratchpad rail",
  );

  const postsHtml = await readFile(path.join(distDirectory, "posts", "index.html"), "utf8");
  assert.match(postsHtml, /<a class="site-header__nav-link is-active" href=\/blog\/posts\/>Posts<\/a>/, "expected the header to keep Posts active on posts pages");
  assert.match(
    postsHtml,
    /<section class="?archive-stream"? aria-label="?문서 목록"?>/,
    "expected archive list pages to render the editorial archive stream",
  );

  const tagsIndexHtml = await readFile(path.join(distDirectory, "tags", "index.html"), "utf8");
  assert.match(
    tagsIndexHtml,
    /<section class="?archive-grid archive-grid--tags"? aria-label="?태그 목록"?>/,
    "expected the tag index to render the archive tag grid",
  );

  const editorialArticleHtml = await readFile(path.join(distDirectory, "posts", "hello-world", "index.html"), "utf8");
  assert.match(
    editorialArticleHtml,
    /<article class="article article--editorial">/,
    "expected editorial article pages to render the new single-column article wrapper",
  );
  assert.match(
    editorialArticleHtml,
    /<p class="?article-deck"?>/,
    "expected editorial article pages to render a standfirst deck",
  );
  assert.doesNotMatch(
    editorialArticleHtml,
    /section-atmosphere/,
    "expected editorial article pages to remove the old atmosphere image block",
  );
  assert.doesNotMatch(
    editorialArticleHtml,
    /article-nav/,
    "expected editorial article pages to remove the old article navigation block",
  );

  const editorialProjectHtml = await readFile(path.join(distDirectory, "projects", "sample-project", "index.html"), "utf8");
  assert.match(
    editorialProjectHtml,
    /<article class="article article--editorial">/,
    "expected editorial project pages to reuse the editorial article wrapper",
  );
  assert.match(
    editorialProjectHtml,
    /<p class="?article-deck"?>/,
    "expected editorial project pages to render a standfirst deck",
  );
  assert.doesNotMatch(
    editorialProjectHtml,
    /section-atmosphere/,
    "expected editorial project pages to remove the old atmosphere image block",
  );
  assert.doesNotMatch(
    editorialProjectHtml,
    /article-nav/,
    "expected editorial project pages to remove the old article navigation block",
  );
}

function isDirectExecution(): boolean {
  return process.argv[1] !== undefined && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
}

if (isDirectExecution()) {
  void main();
}
