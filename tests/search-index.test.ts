import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { writeGeneratedArtifacts, type GeneratedArtifactsOptions } from "../scripts/build.js";
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

test("buildSearchIndex includes folder labels for arbitrary vault sections", () => {
  const index = buildSearchIndex([
    {
      title: "SSH Routing",
      vaultPath: "scratchpad/network/ssh-routing.md",
      pathSegments: ["scratchpad", "network"],
      isIndex: false,
      tags: ["network"],
      frontMatter: { title: "SSH Routing", tags: ["network"], date: "2026-04-18" },
      body: "",
      summary: "jump host notes",
      slug: "ssh-routing",
      section: "unknown",
      sourcePath: "/tmp/ssh-routing.md",
      urlPath: "/scratchpad/network/ssh-routing/",
      date: "2026-04-18",
    },
  ] as Awaited<ReturnType<typeof loadAllMarkdown>>);

  assert.equal(index[0]?.sectionLabel, "scratchpad/network");
});

test("writeGeneratedArtifacts writes the generated JSON payloads to disk", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "portfolio-artifacts-"));

  try {
    const generatedDataDirectory = path.join(tempRoot, "data", "generated");
    const staticAssetsDirectory = path.join(tempRoot, "static", "assets");
    const artifacts: GeneratedArtifactsOptions = {
      generatedDataDirectory,
      staticAssetsDirectory,
      searchIndex: [
        {
          title: "First Post",
          description: "First description",
          section: "posts",
          sectionLabel: "posts",
          tags: ["one"],
          date: "2026-01-01",
          url: "/posts/first/",
        },
      ],
      navigationData: {
        topLevelFolders: [],
        recentNotes: [],
      },
    };

    await writeGeneratedArtifacts(artifacts);

    const generatedSearchIndex = JSON.parse(
      await readFile(path.join(generatedDataDirectory, "search-index.json"), "utf8"),
    ) as unknown;
    const generatedNavigation = JSON.parse(
      await readFile(path.join(generatedDataDirectory, "vault-navigation.json"), "utf8"),
    ) as unknown;
    const staticSearchIndex = JSON.parse(
      await readFile(path.join(staticAssetsDirectory, "search-index.json"), "utf8"),
    ) as unknown;

    assert.deepEqual(generatedSearchIndex, artifacts.searchIndex);
    assert.deepEqual(generatedNavigation, artifacts.navigationData);
    assert.deepEqual(staticSearchIndex, artifacts.searchIndex);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});
