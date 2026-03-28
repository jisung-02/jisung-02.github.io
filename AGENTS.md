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

## Commit style
- Write commit subjects in Conventional Commit form: `feat: ...`, `fix: ...`, `refactor: ...`, `docs: ...`, `test: ...`, or `chore: ...`.
- Keep the first line focused on intent, but still include the Conventional Commit prefix.
- If a commit body includes Lore-style rationale or trailers, keep the Conventional Commit subject as the first line.
