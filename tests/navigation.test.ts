import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { loadAllMarkdown } from "../src/site/content.js";
import { buildVaultTree } from "../src/site/navigation.js";
import type { VaultTreeEntry } from "../src/site/types.js";

function toTreeEntry(entry: Awaited<ReturnType<typeof loadAllMarkdown>>[number]): VaultTreeEntry {
  return {
    kind: "page",
    title: entry.title,
    urlPath: entry.urlPath,
    vaultPath: entry.vaultPath,
    summary: entry.summary,
    date: entry.date,
    tags: entry.tags,
    pathSegments: entry.pathSegments,
    isIndex: entry.isIndex,
  };
}

test("buildVaultTree nests folders and promotes _index.md to indexPage", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "portfolio-nav-"));

  try {
    const deepDirectory = path.join(tempRoot, "posts", "deep");
    await mkdir(deepDirectory, { recursive: true });

    await writeFile(
      path.join(tempRoot, "posts", "_index.md"),
      `---
title: Posts
---

posts index`,
      "utf8",
    );

    await writeFile(
      path.join(deepDirectory, "first.md"),
      `---
title: First Deep Note
date: 2026-01-02
---

note`,
      "utf8",
    );

    const entries = await loadAllMarkdown(tempRoot);
    const tree = buildVaultTree(entries.map(toTreeEntry));

    assert.equal(tree.path, "");
    assert.equal(tree.depth, 0);
    assert.deepEqual(tree.children.map((child) => child.path), ["posts"]);

    const postsFolder = tree.children[0];
    assert.equal(postsFolder?.path, "posts");
    assert.equal(postsFolder?.depth, 1);
    assert.equal(postsFolder?.indexPage?.title, "Posts");
    assert.deepEqual(postsFolder?.children.map((child) => child.path), ["posts/deep"]);

    const deepFolder = postsFolder?.children[0];
    assert.equal(deepFolder?.path, "posts/deep");
    assert.equal(deepFolder?.pages.length, 1);
    assert.equal(deepFolder?.pages[0].title, "First Deep Note");
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("buildVaultTree sorts folders alphabetically and pages by date then title", () => {
  const tree = buildVaultTree([
    {
      kind: "page",
      title: "Zeta Folder Page",
      urlPath: "/zeta/page/",
      vaultPath: "zeta/page.md",
      summary: "zeta",
      date: "2026-01-01",
      tags: [],
      pathSegments: ["zeta"],
      isIndex: false,
    },
    {
      kind: "page",
      title: "Alpha Latest",
      urlPath: "/alpha/latest/",
      vaultPath: "alpha/latest.md",
      summary: "alpha",
      date: "2026-02-02",
      tags: [],
      pathSegments: ["alpha"],
      isIndex: false,
    },
    {
      kind: "page",
      title: "Alpha Earlier",
      urlPath: "/alpha/earlier/",
      vaultPath: "alpha/earlier.md",
      summary: "alpha",
      date: "2026-01-05",
      tags: [],
      pathSegments: ["alpha"],
      isIndex: false,
    },
    {
      kind: "page",
      title: "Alpha Same Date",
      urlPath: "/alpha/same-date/",
      vaultPath: "alpha/same-date.md",
      summary: "alpha",
      date: "2026-02-02",
      tags: [],
      pathSegments: ["alpha"],
      isIndex: false,
    },
  ]);

  assert.deepEqual(tree.children.map((child) => child.path), ["alpha", "zeta"]);
  assert.deepEqual(tree.children[0]?.pages.map((page) => page.title), [
    "Alpha Latest",
    "Alpha Same Date",
    "Alpha Earlier",
  ]);
  assert.deepEqual(tree.children[1]?.pages.map((page) => page.title), ["Zeta Folder Page"]);
});

test("buildVaultTree excludes asset entries and counts them on the folder", () => {
  const tree = buildVaultTree([
    {
      kind: "asset",
      vaultPath: "posts/deep/image.png",
      pathSegments: ["posts", "deep"],
    },
    {
      kind: "page",
      title: "Note",
      urlPath: "/posts/deep/note/",
      vaultPath: "posts/deep/note.md",
      summary: "note",
      date: "2026-01-03",
      tags: [],
      pathSegments: ["posts", "deep"],
      isIndex: false,
    },
    {
      kind: "page",
      title: "Broken Image",
      urlPath: "/posts/deep/image.png/",
      vaultPath: "posts/deep/image.png",
      summary: "image",
      date: "2026-01-04",
      tags: [],
      pathSegments: ["posts", "deep"],
      isIndex: false,
    },
  ]);

  const postsFolder = tree.children[0];
  const deepFolder = postsFolder?.children[0];

  assert.equal(postsFolder?.path, "posts");
  assert.equal(deepFolder?.path, "posts/deep");
  assert.equal(deepFolder?.assetCount, 2);
  assert.equal(deepFolder?.pages.length, 1);
  assert.equal(deepFolder?.pages[0].title, "Note");
});
