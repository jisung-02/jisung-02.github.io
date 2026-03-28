import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { loadAllMarkdown } from "../src/site/content.js";
import { buildSearchIndex } from "../src/site/search-index.js";

test("buildSearchIndex excludes draft entries and keeps url path", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "portfolio-blog-"));

  try {
    const postsDirectory = path.join(tempRoot, "posts");
    await mkdir(postsDirectory, { recursive: true });

    await writeFile(
      path.join(postsDirectory, "first.md"),
      `---
title: First Post
description: First description
date: 2026-01-01
tags: [one]
---

본문`,
      "utf8",
    );

    await writeFile(
      path.join(postsDirectory, "draft.md"),
      `---
title: Draft
description: Draft description
draft: true
---

draft`,
      "utf8",
    );

    const allEntries = await loadAllMarkdown(tempRoot);
    const index = buildSearchIndex(allEntries);

    assert.equal(index.length, 1);
    assert.equal(index[0].title, "First Post");
    assert.equal(index[0].url, "/posts/first/");
    assert.deepEqual(index[0].tags, ["one"]);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});
