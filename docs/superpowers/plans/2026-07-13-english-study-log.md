# English Study Log Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a private English study log for July 13, 2026, plus an Obsidian template for future dates.

**Architecture:** Add one Markdown entry below a new top-level `영어 공부` category directory, and keep its reusable source template under the build-excluded `contents/notes` directory. Astro's existing glob loader derives the post category and URL from the path, while Obsidian replaces the template's date variables when it is inserted.

**Tech Stack:** Markdown, Astro 6 content collections, npm

## Global Constraints

- Create `contents/posts/영어 공부/2026-07-13.md`.
- The generated URL is `/posts/영어-공부/2026-07-13/`.
- Set `publish: false` so the entry remains a draft.
- Do not add `category` to the frontmatter.
- Use the five approved empty study sections.
- Create `contents/notes/영어 공부 일지 템플릿.md` with Obsidian `{{date:YYYY-MM-DD}}` variables for future entries.
- Run `npm run build` after adding the new category path.

---

### Task 1: Create and validate today's English study log

**Files:**
- Create: `contents/posts/영어 공부/2026-07-13.md`

**Interfaces:**
- Consumes: Astro's existing `posts` collection schema and path-based `generateId` rule.
- Produces: A draft entry at `/posts/영어-공부/2026-07-13/` during draft-enabled preview builds.

- [x] **Step 1: Create the study log**

```markdown
---
title: "2026-07-13 영어 공부"
date: 2026-07-13
publish: false
tags: ["영어", "학습일지"]
description: "2026년 7월 13일 영어 학습 기록"
---

## 오늘의 목표

## 단어·표현

## 예문

## 듣기·말하기

## 복습·회고
```

- [x] **Step 2: Inspect the created file**

Run: `sed -n '1,120p' 'contents/posts/영어 공부/2026-07-13.md'`

Expected: The frontmatter and all five empty sections match Step 1 exactly.

- [x] **Step 3: Create the reusable Obsidian template**

Create `contents/notes/영어 공부 일지 템플릿.md` with this exact content:

```markdown
---
title: "{{date:YYYY-MM-DD}} 영어 공부"
date: {{date:YYYY-MM-DD}}
publish: false
tags: ["영어", "학습일지"]
description: "{{date:YYYY-MM-DD}} 영어 학습 기록"
---

## 오늘의 목표

## 단어·표현

## 예문

## 듣기·말하기

## 복습·회고
```

- [x] **Step 4: Inspect the reusable template**

Run: `sed -n '1,120p' 'contents/notes/영어 공부 일지 템플릿.md'`

Expected: The three date fields use `{{date:YYYY-MM-DD}}`, `publish` is `false`, and all five empty sections are present.

- [x] **Step 5: Build the production site**

Run: `npm run build`

Expected: Exit code 0 with no content schema or broken-link errors. Because `publish` is `false`, the draft is not emitted as a production post page.

- [x] **Step 6: Check the working-tree diff**

Run: `git diff --check && git status --short`

Expected: No whitespace errors, with the updated spec, plan, today's Markdown entry, and reusable template listed as the only uncommitted files.
