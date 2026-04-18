import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { loadAllMarkdown } from "../src/site/content.js";
import { buildVaultTree } from "../src/site/navigation.js";

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

    await writeFile(path.join(deepDirectory, "image.png"), "fake image", "utf8");

    const entries = await loadAllMarkdown(tempRoot);
    const tree = buildVaultTree(entries);

    assert.equal(tree.folders.length, 1);
    const postsFolder = tree.folders[0];
    assert.equal(postsFolder.name, "posts");
    assert.equal(postsFolder.indexPage?.title, "Posts");
    assert.equal(postsFolder.folders.length, 1);
    assert.equal(postsFolder.folders[0].name, "deep");
    assert.equal(postsFolder.folders[0].pages.length, 1);
    assert.equal(postsFolder.folders[0].pages[0].title, "First Deep Note");
    assert.equal(postsFolder.folders[0].pages[0].vaultPath, "posts/deep/first.md");
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("buildVaultTree excludes non-markdown and image-like entries", () => {
  const tree = buildVaultTree([
    {
      title: "Image",
      vaultPath: "posts/deep/image.png",
      pathSegments: ["posts", "deep", "image.png"],
      isIndex: false,
      section: "unknown",
      summary: "image",
      slug: "image",
      urlPath: "/posts/deep/image.png/",
      sourcePath: "/tmp/posts/deep/image.png",
    } as never,
    {
      title: "Text",
      vaultPath: "posts/deep/notes.txt",
      pathSegments: ["posts", "deep", "notes.txt"],
      isIndex: false,
      section: "unknown",
      summary: "text",
      slug: "notes",
      urlPath: "/posts/deep/notes.txt/",
      sourcePath: "/tmp/posts/deep/notes.txt",
    } as never,
    {
      title: "Note",
      vaultPath: "posts/deep/note.md",
      pathSegments: ["posts", "deep", "note.md"],
      isIndex: false,
      section: "posts",
      summary: "note",
      slug: "note",
      urlPath: "/posts/deep/note/",
      sourcePath: "/tmp/posts/deep/note.md",
    } as never,
  ]);

  const postsFolder = tree.folders[0];
  const deepFolder = postsFolder?.folders[0];

  assert.equal(postsFolder?.name, "posts");
  assert.equal(deepFolder?.name, "deep");
  assert.equal(deepFolder?.pages.length, 1);
  assert.equal(deepFolder?.pages[0].title, "Note");
});
