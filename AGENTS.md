# AGENTS.md — portfolio-blog

## Scope
This file applies to the entire repository.

## Project goals
- Keep the site minimal, readable, and reliable.
- Manage content with Markdown under `content/`.
- Generate static HTML into `dist/` for GitHub Pages.

## Architecture
- `src/site/`: markdown parsing/search-index generation logic
- `src/assets/`: React/CSS source assets
- `layouts/`: Hugo templates
- `hugo.toml`: Hugo site configuration
- `static/assets/`: build-time copied/bundled assets
- `scripts/`: executable build/check commands
- `content/`: markdown source (profile/about/posts/projects)
- `tests/`: Node test runner suites

## Quality gates (run before finishing)
1. `npm run lint`
2. `npm run typecheck`
3. `npm run test`
4. `npm run check-content`
5. `npm run build`
6. `npm run audit`

## Coding style
- Prefer explicit, small functions over abstractions.
- Avoid unnecessary dependencies.
- Keep UI colors limited (2–3 core colors).
- Use only HTTPS links in markdown frontmatter and body.

## Obsidian vault setup
`content/` 폴더를 Obsidian vault로 사용합니다.

**필수 설정 (Settings → Files & Links):**
- `Use [[Wikilinks]]` → **끄기** (Hugo가 `[[]]` 문법을 파싱하지 못함)
- `New link format` → **Relative path to file**

**폴더 구조:**
```
content/
├── posts/           ← 포스트 글 (.md)
├── projects/        ← 프로젝트 런북 (.md)
├── about/
│   └── _index.md    ← About 페이지
└── profile/
    └── _index.md    ← Profile 페이지
```

**front matter 형식 (모든 .md 파일 상단):**
```yaml
---
title: "제목"
description: "설명"
date: YYYY-MM-DD
tags: ["태그1", "태그2"]
---
```
- `posts/`, `projects/` 하위 파일은 `date` 필드 필수
- `about.md`, `profile.md`는 `date` 생략 가능

## Commit style
- Write commit subjects in Conventional Commit form: `feat: ...`, `fix: ...`, `refactor: ...`, `docs: ...`, `test: ...`, or `chore: ...`.
- Keep the first line focused on intent, but still include the Conventional Commit prefix.
- If a commit body includes Lore-style rationale or trailers, keep the Conventional Commit subject as the first line.
