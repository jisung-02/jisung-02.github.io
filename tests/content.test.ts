import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { loadMarkdownFile } from "../src/site/content.js";

test("loadMarkdownFile resolves section, slug, url, summary", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "portfolio-content-"));

  try {
    const nestedDirectory = path.join(tempRoot, "posts", "deep");
    await mkdir(nestedDirectory, { recursive: true });

    const markdownPath = path.join(nestedDirectory, "index.md");
    await writeFile(
      markdownPath,
      `---
title: Deep Dive
date: 2026-02-16
---

# Heading

본문에 [링크](https://example.com)이 있고 \`inline\` 코드가 있습니다.`,
      "utf8",
    );

    const parsed = await loadMarkdownFile(markdownPath, tempRoot);

    assert.equal(parsed.section, "posts");
    assert.equal(parsed.slug, "deep");
    assert.equal(parsed.urlPath, "/posts/deep/");
    assert.equal(parsed.frontMatter.title, "Deep Dive");
    assert.match(parsed.summary, /본문에 링크/);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("loadMarkdownFile resolves section landing page from _index.md", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "portfolio-content-section-"));

  try {
    const sectionDirectory = path.join(tempRoot, "posts");
    await mkdir(sectionDirectory, { recursive: true });

    const markdownPath = path.join(sectionDirectory, "_index.md");
    await writeFile(
      markdownPath,
      `---
title: Posts
date: 2026-02-17
---

섹션 소개`,
      "utf8",
    );

    const parsed = await loadMarkdownFile(markdownPath, tempRoot);

    assert.equal(parsed.section, "posts");
    assert.equal(parsed.slug, "posts");
    assert.equal(parsed.urlPath, "/posts/");
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});
