import assert from "node:assert/strict";
import test from "node:test";

import { normalizeSiteRoot, resolveSiteUrl } from "../src/assets/site-url.js";

test("normalizeSiteRoot keeps a single leading and trailing slash", () => {
  assert.equal(normalizeSiteRoot(""), "/");
  assert.equal(normalizeSiteRoot("/"), "/");
  assert.equal(normalizeSiteRoot("blog"), "/blog/");
  assert.equal(normalizeSiteRoot("/blog"), "/blog/");
});

test("resolveSiteUrl prefixes site-root relative entries with the deploy base path", () => {
  assert.equal(resolveSiteUrl("/blog/", "/posts/hello-world/"), "/blog/posts/hello-world/");
  assert.equal(resolveSiteUrl("/blog/", "posts/hello-world/"), "/blog/posts/hello-world/");
  assert.equal(resolveSiteUrl("/blog", "./projects/sample-project/"), "/blog/projects/sample-project/");
});

test("resolveSiteUrl leaves already-resolved, hash, and absolute URLs unchanged", () => {
  assert.equal(resolveSiteUrl("/blog/", "/blog/posts/hello-world/"), "/blog/posts/hello-world/");
  assert.equal(resolveSiteUrl("/blog/", "#finder"), "#finder");
  assert.equal(resolveSiteUrl("/blog/", "https://example.com/post"), "https://example.com/post");
});
