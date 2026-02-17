import assert from "node:assert/strict";
import test from "node:test";

import { parseMarkdownDocument } from "../src/site/frontmatter.js";

test("parseMarkdownDocument parses scalar and list values", () => {
  const markdown = `---
title: Hello
published: true
tags:
  - alpha
  - beta
inline: [one, two]
---

Body text`;

  const parsed = parseMarkdownDocument(markdown);

  assert.equal(parsed.frontMatter.title, "Hello");
  assert.equal(parsed.frontMatter.published, true);
  assert.deepEqual(parsed.frontMatter.tags, ["alpha", "beta"]);
  assert.deepEqual(parsed.frontMatter.inline, ["one", "two"]);
  assert.equal(parsed.body, "Body text");
});

test("parseMarkdownDocument returns empty frontmatter when boundary is missing", () => {
  const parsed = parseMarkdownDocument("# Title\n\nPlain body");

  assert.deepEqual(parsed.frontMatter, {});
  assert.equal(parsed.body, "# Title\n\nPlain body");
});
