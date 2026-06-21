# Obsidian Vault 블로그 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Obsidian vault(`./content`)로 쓰는 글 중 `publish: true`인 것만 골라, 코드·수식·태그·이미지가 잘 렌더되는 미니멀 정적 블로그를 GitHub Pages에 무료 배포한다.

**Architecture:** Astro 정적 사이트. `./contents/posts`를 glob content collection으로 읽고, 순수 헬퍼 함수로 발행 필터링/정렬/태그 집계(테스트 대상). 마크다운은 Astro 기본 Shiki(코드) + remark-math/rehype-katex(수식) + Astro 네이티브 이미지(상대경로). 디자인은 DESIGN.md를 단일 출처로 손수 작성한 CSS(프레임워크 없음). GitHub Actions로 push 시 자동 빌드·배포.

**Tech Stack:** Astro, @astrojs/rss, remark-math, rehype-katex, katex, vitest(헬퍼 단위 테스트). UI 프레임워크/CSS 프레임워크 없음.

## Global Constraints

- 사이트 주소: `https://jisung-02.github.io` (GitHub user site, base 경로 없음).
- 발행 조건: `contents/posts/` 내 파일 + frontmatter `publish: true`. 그 외(`publish:false`/누락)는 프로덕션 빌드 제외. 로컬 dev에서는 초안도 보이게 한다.
- 살릴 Obsidian 기능: 태그, 이미지 임베드, 수식. 위키링크/백링크/그래프는 구현하지 않는다.
- 의존성 최소(ponytail): 새 의존성은 stdlib/네이티브로 안 되는 경우에만. 폰트는 Google Fonts CDN 1곳.
- 접근성 바닥선: 모바일 반응형, 키보드 포커스 가시화, `prefers-reduced-motion` 존중.
- 디자인 결정의 단일 출처는 `DESIGN.md`. UI는 거기 정의된 토큰만 사용한다.
- 각 Task(=단계)는 정확히 한 번의 커밋으로 마무리한다.
- 커밋 메시지는 Conventional Commits 형식이되 콜론 뒤 설명은 한글로 작성한다 (예: `feat: 태그 페이지 추가`).
- Obsidian vault 루트는 `contents/` 폴더다 (`contents/.obsidian/` 존재 → 이 폴더를 Obsidian에서 연다).
- 모든 단위 테스트 대상 로직은 `astro:content`를 import하지 않는 순수 함수로 분리(vitest로 직접 실행 가능하게).

---

### Task 1: Astro 프로젝트 스캐폴드 (빌드 통과)

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/pages/index.astro`
- Modify: `.gitignore` (이미 존재)

**Interfaces:**
- Produces: `npm run build` / `npm run dev` / `npm test` 스크립트. 빈 홈페이지가 빌드되는 동작하는 Astro 앱.

- [ ] **Step 1: package.json 작성**

```json
{
  "name": "myblog",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run"
  }
}
```

- [ ] **Step 2: 의존성 설치**

Run:
```bash
npm install astro @astrojs/rss remark-math rehype-katex katex
npm install -D vitest
```
Expected: `node_modules/` 생성, `package.json`에 dependencies/devDependencies 추가, 에러 없음.

- [ ] **Step 3: astro.config.mjs 작성**

```js
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://jisung-02.github.io',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
```

- [ ] **Step 4: tsconfig.json 작성**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 5: 임시 홈페이지 작성**

`src/pages/index.astro`:
```astro
---
---
<html lang="ko">
  <head><meta charset="utf-8" /><title>myblog</title></head>
  <body><h1>myblog</h1></body>
</html>
```

- [ ] **Step 6: 빌드 검증**

Run: `npm run build`
Expected: 성공, `dist/index.html` 생성됨.

- [ ] **Step 7: 커밋**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/pages/index.astro
git commit -m "chore: Astro 프로젝트 스캐폴드"
```

---

### Task 2: DESIGN.md — 디자인 단일 출처

**Files:**
- Create: `DESIGN.md`

**Interfaces:**
- Produces: 이후 모든 스타일 작업(Task 4~7)이 참조하는 토큰 정의(색/타입/레이아웃/시그니처/모션/접근성).

- [ ] **Step 1: DESIGN.md 작성**

아래 내용을 그대로 `DESIGN.md`에 작성한다:

````markdown
# DESIGN.md — myblog 디자인 시스템

블로그 정체성: **학부생의 CS 학습 정리 노트**. 연구 노트/실험 노트의 여백 메모(marginalia) 감각을 미니멀하게.
이 문서가 모든 시각 결정의 단일 출처다. 컴포넌트는 여기 정의된 CSS 변수만 사용한다.

## 색 (light)
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--paper`  | `#FCFCFA` | 배경(차분한 종이색, 크림 아님) |
| `--ink`    | `#1A1A1F` | 본문 텍스트 |
| `--muted`  | `#6B6B76` | 여백 메타(날짜·태그), 보조 텍스트 |
| `--rule`   | `#E6E6E1` | 얇은 구분선(절제 사용) |
| `--accent` | `#2F54EB` | 링크·강조(볼펜 잉크 블루) |
| `--marker` | `rgba(120,224,164,0.45)` | 형광펜 마커(시그니처) |

## 색 (dark, `[data-theme="dark"]`)
| 토큰 | 값 |
|------|-----|
| `--paper`  | `#16161A` |
| `--ink`    | `#ECECEF` |
| `--muted`  | `#9A9AA6` |
| `--rule`   | `#2A2A31` |
| `--accent` | `#6B8AFF` |
| `--marker` | `rgba(108,231,150,0.22)` |

## 타이포그래피
- 출처: Google Fonts 1곳(`@import` 1줄).
- **Display**(사이트 제목·글 제목): `"Gowun Batang", serif` — 국문 세리프, 절제해서 제목에만.
- **Body**(본문·UI): `"IBM Plex Sans KR", system-ui, sans-serif`.
- **Mono**(코드): `"JetBrains Mono", monospace`.
- 스케일(rem): h1 2.0 / h2 1.5 / h3 1.2 / body 1.0 / small 0.85.
- 본문 측정폭(measure): 최대 `68ch`. 행간 1.7.

## 레이아웃 & 시그니처
- **시그니처 = 좌측 여백 레일(marginalia)**: 글 페이지에서 ≥1024px일 때 본문 왼쪽 여백에 날짜·태그를 메모처럼 배치. <1024px에서는 본문 위로 접힘. 그리드: `[rail 14rem] [content 68ch]`, gap 2.5rem, 중앙 정렬.
- **하이라이터 마커**: 활성 태그와 링크 호버에 `--marker`로 밑줄형 배경(`background: linear-gradient(...) no-repeat bottom / 100% 0.4em`). 시그니처는 이 한 곳에만 쓴다(Chanel rule: 그 외 장식 제거).
- border-radius: 2px 이하(거의 각짐). 그림자 없음. 구분선은 헤어라인만.

## 모션
- 글 본문: 로드 시 8px 상승 + 페이드(150ms). 그 외 페이지 전환 애니메이션 없음.
- 태그/링크 호버: 마커 배경 120ms 확장.
- `prefers-reduced-motion: reduce`에서 모든 모션 제거.

## 접근성 바닥선
- 본문 대비 ≥ 7:1(`--ink`/`--paper` 충족). 모바일 1열 반응형.
- `:focus-visible` 아웃라인 `2px solid var(--accent)`.
- 다크/라이트 토글은 시스템 설정 기본값 + 수동 전환(localStorage 저장).
````

- [ ] **Step 2: 커밋**

```bash
git add DESIGN.md
git commit -m "docs: DESIGN.md 디자인 시스템 추가"
```

---

### Task 3: 콘텐츠 컬렉션 + 발행 필터 헬퍼 (TDD)

**Files:**
- Create: `src/content.config.ts`
- Create: `src/lib/posts.ts`
- Test: `src/lib/posts.test.ts`
- Create: `contents/posts/welcome.md`
- Create: `contents/posts/draft-example.md`
- Create: `contents/notes/.gitkeep`
- Create: `contents/attachments/.gitkeep`

**Interfaces:**
- Produces:
  - `posts` 컬렉션(스키마: `title:string, date:Date, publish:boolean(기본 false), tags:string[](기본 []), description?:string, updated?:Date`).
  - `isVisible(data: {publish: boolean}, isProd: boolean): boolean`
  - `sortByDate<T extends {data:{date:Date}}>(posts: T[]): T[]` — 날짜 내림차순
  - `collectTags<T extends {data:{tags:string[]}}>(posts: T[]): {tag:string,count:number}[]` — 태그명 오름차순
- Consumes(이후 페이지에서): `getCollection('posts')`, 위 헬퍼들.

- [ ] **Step 1: 실패하는 테스트 작성**

`src/lib/posts.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { isVisible, sortByDate, collectTags } from './posts';

describe('isVisible', () => {
  it('hides unpublished in prod', () => {
    expect(isVisible({ publish: false }, true)).toBe(false);
    expect(isVisible({ publish: true }, true)).toBe(true);
  });
  it('shows everything in dev', () => {
    expect(isVisible({ publish: false }, false)).toBe(true);
  });
});

describe('sortByDate', () => {
  it('orders newest first', () => {
    const a = { data: { date: new Date('2026-01-01') } };
    const b = { data: { date: new Date('2026-06-01') } };
    expect(sortByDate([a, b])).toEqual([b, a]);
  });
});

describe('collectTags', () => {
  it('counts unique tags, sorted by name', () => {
    const posts = [
      { data: { tags: ['cs', '자료구조'] } },
      { data: { tags: ['cs'] } },
    ];
    expect(collectTags(posts)).toEqual([
      { tag: 'cs', count: 2 },
      { tag: '자료구조', count: 1 },
    ]);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm test`
Expected: FAIL — `./posts` 모듈/함수 없음.

- [ ] **Step 3: 헬퍼 구현**

`src/lib/posts.ts`:
```ts
export function isVisible(data: { publish: boolean }, isProd: boolean): boolean {
  return isProd ? data.publish === true : true;
}

export function sortByDate<T extends { data: { date: Date } }>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function collectTags<T extends { data: { tags: string[] } }>(
  posts: T[],
): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag, 'ko'));
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test`
Expected: PASS (3 파일/모든 테스트 통과).

- [ ] **Step 5: 컬렉션 정의**

`src/content.config.ts`:
```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './contents/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    publish: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { posts };
```

- [ ] **Step 6: 샘플 글 + vault 폴더 작성**

`contents/posts/welcome.md`:
```markdown
---
title: 블로그를 시작하며
date: 2026-06-20
publish: true
tags: [잡담]
description: Obsidian으로 쓰고 그대로 발행하는 블로그
---

첫 글입니다. Obsidian에서 쓰고 `publish: true`만 켜면 발행됩니다.
```

`contents/posts/draft-example.md`:
```markdown
---
title: 아직 비공개 초안
date: 2026-06-19
publish: false
tags: [잡담]
---

이 글은 `publish: false`라서 배포본에는 안 나옵니다.
```

빈 폴더 유지용:
```bash
touch contents/notes/.gitkeep contents/attachments/.gitkeep
```

- [ ] **Step 7: 빌드로 컬렉션 인식 확인**

Run: `npm run build`
Expected: 성공(컬렉션 스키마 검증 통과, 에러 없음).

- [ ] **Step 8: 커밋**

```bash
git add src/content.config.ts src/lib/posts.ts src/lib/posts.test.ts contents/
git commit -m "feat: 발행 필터 헬퍼와 posts 컬렉션 추가"
```

---

### Task 4: 베이스 레이아웃 + 전역 스타일 + 홈(글 목록)

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `getCollection('posts')`, `isVisible`, `sortByDate`. DESIGN.md 토큰.
- Produces: `BaseLayout`(props: `title: string`, `description?: string`) — 폰트/KaTeX CSS/테마 토글/헤더/푸터 포함, 본문은 `<slot/>`. 홈 `/`에 발행 글 목록.

- [ ] **Step 1: 전역 스타일 작성 (DESIGN.md 토큰 그대로)**

`src/styles/global.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=IBM+Plex+Sans+KR:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');

:root {
  --paper: #FCFCFA; --ink: #1A1A1F; --muted: #6B6B76;
  --rule: #E6E6E1; --accent: #2F54EB; --marker: rgba(120,224,164,0.45);
  --display: "Gowun Batang", serif;
  --body: "IBM Plex Sans KR", system-ui, sans-serif;
  --mono: "JetBrains Mono", monospace;
}
[data-theme="dark"] {
  --paper: #16161A; --ink: #ECECEF; --muted: #9A9AA6;
  --rule: #2A2A31; --accent: #6B8AFF; --marker: rgba(108,231,150,0.22);
}

* { box-sizing: border-box; }
html { color-scheme: light dark; }
body {
  margin: 0; background: var(--paper); color: var(--ink);
  font-family: var(--body); line-height: 1.7;
  font-size: 1rem; -webkit-font-smoothing: antialiased;
}
.wrap { max-width: 68ch; margin: 0 auto; padding: 0 1.25rem; }

h1, h2, h3 { font-family: var(--display); line-height: 1.25; font-weight: 700; }
h1 { font-size: 2rem; } h2 { font-size: 1.5rem; } h3 { font-size: 1.2rem; }

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

code, pre { font-family: var(--mono); font-size: 0.9em; }
pre { padding: 1rem; border-radius: 2px; overflow-x: auto; border: 1px solid var(--rule); }
:not(pre) > code { background: var(--rule); padding: 0.1em 0.3em; border-radius: 2px; }
img { max-width: 100%; height: auto; }

/* site chrome */
.site-header { display: flex; justify-content: space-between; align-items: baseline;
  padding: 2rem 0 1.5rem; border-bottom: 1px solid var(--rule); margin-bottom: 2rem; }
.site-header .brand { font-family: var(--display); font-size: 1.3rem; font-weight: 700; color: var(--ink); }
.site-nav a { color: var(--muted); margin-left: 1rem; font-size: 0.9rem; }
.site-footer { margin: 4rem 0 2rem; padding-top: 1.5rem; border-top: 1px solid var(--rule);
  color: var(--muted); font-size: 0.85rem; }
#theme-toggle { background: none; border: 1px solid var(--rule); color: var(--muted);
  font: inherit; font-size: 0.8rem; padding: 0.2rem 0.5rem; border-radius: 2px; cursor: pointer; }

/* post list */
.post-list { list-style: none; padding: 0; margin: 0; }
.post-list li { padding: 1rem 0; border-bottom: 1px solid var(--rule); }
.post-list .meta { color: var(--muted); font-size: 0.85rem; }
.post-list .title { font-family: var(--display); font-size: 1.25rem; }

/* highlighter marker (signature) */
.marker {
  background: linear-gradient(var(--marker), var(--marker)) no-repeat bottom / 0 0.4em;
  transition: background-size 120ms ease;
}
a.marker:hover, .marker.active { background-size: 100% 0.4em; text-decoration: none; }

/* tags */
.tags { display: flex; flex-wrap: wrap; gap: 0.5rem; list-style: none; padding: 0; }
.tags a { color: var(--muted); font-size: 0.85rem; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition: none !important; animation: none !important; }
}
```

- [ ] **Step 2: BaseLayout 작성**

`src/layouts/BaseLayout.astro`:
```astro
---
import 'katex/dist/katex.min.css';
import '../styles/global.css';
interface Props { title: string; description?: string }
const { title, description } = Astro.props;
---
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    <link rel="alternate" type="application/rss+xml" title="myblog" href="/rss.xml" />
    <script is:inline>
      const t = localStorage.getItem('theme') ??
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.dataset.theme = t;
    </script>
  </head>
  <body>
    <div class="wrap">
      <header class="site-header">
        <a class="brand" href="/">jisung-02</a>
        <nav class="site-nav">
          <a href="/tags">태그</a>
          <a href="/about">소개</a>
          <button id="theme-toggle" aria-label="테마 전환">테마</button>
        </nav>
      </header>
      <main><slot /></main>
      <footer class="site-footer">© 2026 jisung-02 · <a href="/rss.xml">RSS</a></footer>
    </div>
    <script is:inline>
      document.getElementById('theme-toggle').addEventListener('click', () => {
        const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        localStorage.setItem('theme', next);
      });
    </script>
  </body>
</html>
```

- [ ] **Step 3: 홈페이지 작성**

`src/pages/index.astro`:
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import { isVisible, sortByDate } from '../lib/posts';

const all = await getCollection('posts');
const posts = sortByDate(all.filter((p) => isVisible(p.data, import.meta.env.PROD)));
const fmt = (d: Date) => d.toISOString().slice(0, 10);
---
<BaseLayout title="jisung-02">
  <ul class="post-list">
    {posts.map((p) => (
      <li>
        <div class="meta">{fmt(p.data.date)}</div>
        <a class="title marker" href={`/posts/${p.id}`}>{p.data.title}</a>
        {p.data.description && <p>{p.data.description}</p>}
      </li>
    ))}
  </ul>
</BaseLayout>
```

- [ ] **Step 4: 빌드 및 출력 검증**

Run: `npm run build && grep -l "블로그를 시작하며" dist/index.html`
Expected: `dist/index.html` 출력(발행 글 제목 포함). 초안 제목은 미포함:
Run: `! grep -q "아직 비공개 초안" dist/index.html && echo OK`
Expected: `OK`

- [ ] **Step 5: 커밋**

```bash
git add src/styles/global.css src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "feat: 베이스 레이아웃·전역 스타일·홈 목록 추가"
```

---

### Task 5: 글 페이지 (마크다운·코드·수식·이미지 + 여백 레일)

**Files:**
- Create: `src/pages/posts/[...id].astro`
- Modify: `contents/posts/welcome.md` (코드·수식·이미지 데모 추가)
- Modify: `src/styles/global.css` (여백 레일 그리드 추가)

**Interfaces:**
- Consumes: `getCollection('posts')`, `render` (astro:content), `isVisible`, `sortByDate`, BaseLayout, DESIGN.md 레일 규격.
- Produces: `/posts/[id]` 라우트. 좌측 여백 레일(날짜·태그) + 본문.

- [ ] **Step 1: 글 페이지 작성**

`src/pages/posts/[...id].astro`:
```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { isVisible } from '../../lib/posts';

export async function getStaticPaths() {
  const all = await getCollection('posts');
  return all
    .filter((p) => isVisible(p.data, import.meta.env.PROD))
    .map((p) => ({ params: { id: p.id }, props: { post: p } }));
}

const { post } = Astro.props;
const { Content } = await render(post);
const fmt = (d: Date) => d.toISOString().slice(0, 10);
---
<BaseLayout title={post.data.title} description={post.data.description}>
  <article class="post">
    <aside class="rail">
      <div class="meta">{fmt(post.data.date)}</div>
      {post.data.updated && <div class="meta">수정 {fmt(post.data.updated)}</div>}
      {post.data.tags.length > 0 && (
        <ul class="tags">
          {post.data.tags.map((t) => <li><a class="marker" href={`/tags/${t}`}>#{t}</a></li>)}
        </ul>
      )}
    </aside>
    <div class="post-body">
      <h1>{post.data.title}</h1>
      <Content />
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 2: 여백 레일 스타일 추가**

`src/styles/global.css` 끝에 추가:
```css
/* post: marginalia rail (signature layout) */
.post { display: block; }
.post-body { animation: rise 150ms ease both; }
@keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.post-body :is(h2, h3) { margin-top: 2rem; }
.rail { color: var(--muted); margin-bottom: 1.5rem; }
.rail .tags { margin-top: 0.5rem; }

@media (min-width: 1024px) {
  .post { display: grid; grid-template-columns: 12rem 1fr; gap: 2.5rem; align-items: start; }
  .rail { position: sticky; top: 2rem; text-align: right; margin-bottom: 0; }
  .rail .tags { justify-content: flex-end; }
}
```
주: `.wrap`이 68ch로 제한하므로, 1024px+에서 레일을 본문 왼쪽 여백처럼 보이게 하려면 글 페이지에서 더 넓은 폭이 필요하다. 다음 스텝에서 글 페이지 폭을 넓힌다.

- [ ] **Step 3: 글 페이지에서 넓은 폭 적용**

`src/styles/global.css`의 `@media (min-width: 1024px)` 블록에 추가:
```css
@media (min-width: 1024px) {
  body:has(.post) .wrap { max-width: 56rem; }
}
```

- [ ] **Step 4: welcome.md에 코드·수식·이미지 데모 추가**

`contents/posts/welcome.md` 본문 끝에 추가:
```markdown

## 코드

​```python
def hello():
    print("안녕")
​```

## 수식

인라인 $E = mc^2$, 블록:

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$
```
주: 위 코드펜스의 `​`(제로폭) 문자는 제거하고 실제 백틱 3개로 작성한다. 이미지 데모는 Task 9에서 Obsidian 설정 후 추가한다(지금은 첨부 파일이 없으므로 생략).

- [ ] **Step 5: 빌드 및 검증**

Run: `npm run build`
Expected: 성공, `dist/posts/welcome/index.html` 생성.
Run: `grep -q 'katex' dist/posts/welcome/index.html && echo MATH_OK`
Expected: `MATH_OK` (수식이 KaTeX로 렌더됨).
Run: `grep -q 'class="rail"' dist/posts/welcome/index.html && echo RAIL_OK`
Expected: `RAIL_OK`.

- [ ] **Step 6: 커밋**

```bash
git add src/pages/posts/ src/styles/global.css contents/posts/welcome.md
git commit -m "feat: 여백 레일 글 페이지와 코드·수식 추가"
```

---

### Task 6: 태그 페이지 (목록 + 태그별)

**Files:**
- Create: `src/pages/tags/index.astro`
- Create: `src/pages/tags/[tag].astro`

**Interfaces:**
- Consumes: `getCollection`, `isVisible`, `sortByDate`, `collectTags`, BaseLayout.
- Produces: `/tags`(전체 태그+개수), `/tags/[tag]`(해당 태그 글 목록).

- [ ] **Step 1: 태그 목록 페이지 작성**

`src/pages/tags/index.astro`:
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { isVisible, collectTags } from '../../lib/posts';

const all = await getCollection('posts');
const posts = all.filter((p) => isVisible(p.data, import.meta.env.PROD));
const tags = collectTags(posts);
---
<BaseLayout title="태그 · jisung-02">
  <h1>태그</h1>
  <ul class="tags">
    {tags.map((t) => <li><a class="marker" href={`/tags/${t.tag}`}>#{t.tag} ({t.count})</a></li>)}
  </ul>
</BaseLayout>
```

- [ ] **Step 2: 태그별 페이지 작성**

`src/pages/tags/[tag].astro`:
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { isVisible, sortByDate, collectTags } from '../../lib/posts';

export async function getStaticPaths() {
  const all = await getCollection('posts');
  const posts = all.filter((p) => isVisible(p.data, import.meta.env.PROD));
  return collectTags(posts).map((t) => ({
    params: { tag: t.tag },
    props: { tag: t.tag, posts: sortByDate(posts.filter((p) => p.data.tags.includes(t.tag))) },
  }));
}

const { tag, posts } = Astro.props;
const fmt = (d: Date) => d.toISOString().slice(0, 10);
---
<BaseLayout title={`#${tag} · jisung-02`}>
  <h1>#{tag}</h1>
  <ul class="post-list">
    {posts.map((p) => (
      <li>
        <div class="meta">{fmt(p.data.date)}</div>
        <a class="title marker" href={`/posts/${p.id}`}>{p.data.title}</a>
      </li>
    ))}
  </ul>
</BaseLayout>
```

- [ ] **Step 3: 빌드 및 검증**

Run: `npm run build`
Expected: 성공. `dist/tags/index.html` 및 `dist/tags/잡담/index.html`(또는 URL 인코딩된 경로) 생성.
Run: `grep -rq '잡담' dist/tags/index.html && echo TAGS_OK`
Expected: `TAGS_OK`.

- [ ] **Step 4: 커밋**

```bash
git add src/pages/tags/
git commit -m "feat: 태그 목록·태그별 페이지 추가"
```

---

### Task 7: RSS 피드 + 소개 페이지

**Files:**
- Create: `src/pages/rss.xml.js`
- Create: `src/pages/about.astro`

**Interfaces:**
- Consumes: `@astrojs/rss`, `getCollection`, `isVisible`, `sortByDate`, `Astro.site`.
- Produces: `/rss.xml`(발행 글 피드), `/about`.

- [ ] **Step 1: RSS 피드 작성**

`src/pages/rss.xml.js`:
```js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { isVisible, sortByDate } from '../lib/posts';

export async function GET(context) {
  const all = await getCollection('posts');
  const posts = sortByDate(all.filter((p) => isVisible(p.data, import.meta.env.PROD)));
  return rss({
    title: 'jisung-02',
    description: '학습 정리 노트',
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description ?? '',
      pubDate: p.data.date,
      link: `/posts/${p.id}/`,
    })),
  });
}
```

- [ ] **Step 2: 소개 페이지 작성**

`src/pages/about.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="소개 · jisung-02">
  <h1>소개</h1>
  <p>학부생의 CS 학습 정리 노트입니다. Obsidian으로 쓰고 그대로 발행합니다.</p>
</BaseLayout>
```

- [ ] **Step 3: 빌드 및 검증**

Run: `npm run build`
Expected: 성공, `dist/rss.xml`, `dist/about/index.html` 생성.
Run: `grep -q '<rss' dist/rss.xml && grep -q '블로그를 시작하며' dist/rss.xml && echo RSS_OK`
Expected: `RSS_OK`.

- [ ] **Step 4: 커밋**

```bash
git add src/pages/rss.xml.js src/pages/about.astro
git commit -m "feat: RSS 피드와 소개 페이지 추가"
```

---

### Task 8: GitHub Pages 자동 배포

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: 빌드 산출물 `dist/`.
- Produces: `main` push 시 GitHub Pages 자동 배포 워크플로.

- [ ] **Step 1: 배포 워크플로 작성**

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: YAML 유효성 확인**

Run: `node -e "require('fs').readFileSync('.github/workflows/deploy.yml','utf8')" && echo FILE_OK`
Expected: `FILE_OK` (파일 존재). 들여쓰기/구조는 위 내용 그대로 사용.

- [ ] **Step 3: 커밋**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: push 시 GitHub Pages 배포 추가"
```

주(수동 1회 설정): GitHub 저장소 → Settings → Pages → Build and deployment → Source = **GitHub Actions**. 저장소를 `jisung-02.github.io` 이름으로 만들고 `main`에 push하면 배포된다.

---

### Task 9: Obsidian vault 설정 + README (작성 워크플로)

**Files:**
- Create: `contents/.obsidian/app.json`
- Create: `README.md`

**Interfaces:**
- Produces: `contents/`를 열면 이미지가 표준 마크다운 링크(`![](../attachments/x.png)`)로 저장되도록 설정된 vault. 작성→발행 절차 문서.

- [ ] **Step 1: Obsidian 설정 파일 작성 (이미지가 Astro 호환 마크다운으로 저장되게)**

`contents/.obsidian/app.json`:
```json
{
  "useMarkdownLinks": true,
  "newLinkFormat": "relative",
  "attachmentFolderPath": "attachments"
}
```
주: 이 설정으로 Obsidian은 이미지를 `![[...]]`(위키 임베드)가 아니라 `![](상대경로)` 표준 마크다운으로 기록한다 → Astro가 별도 플러그인 없이 네이티브로 이미지 최적화. (설계서의 "remark 플러그인" 대신 택한, 더 견고하고 의존성 0인 방식.)

- [ ] **Step 2: 이미지 렌더 실제 검증**

`contents/attachments/`에 임의 PNG 하나(`sample.png`)를 넣고, `contents/posts/welcome.md` 끝에 추가:
```markdown

## 이미지

![샘플](../attachments/sample.png)
```
Run: `npm run build && ls dist/_astro/*.png >/dev/null 2>&1 && echo IMG_OK`
Expected: `IMG_OK` (이미지가 빌드 파이프라인에 포함/최적화됨).
검증 후 데모용 이미지/문단은 유지하거나 제거(선택). `.gitkeep`은 유지.

- [ ] **Step 3: README 작성**

`README.md`:
```markdown
# myblog

Obsidian vault(`contents/`)로 쓰고 GitHub Pages로 발행하는 개인 블로그.

## 글 쓰기
1. Obsidian에서 `contents/` 폴더를 vault로 연다.
2. `contents/posts/`에 `.md` 파일을 만들고 frontmatter를 채운다:
   ```yaml
   ---
   title: 제목
   date: 2026-06-20
   publish: true        # true일 때만 발행
   tags: [태그1, 태그2]
   description: 한 줄 설명   # 선택
   ---
   ```
3. 이미지는 그냥 붙여넣으면 `contents/attachments/`에 저장되고 표준 마크다운 링크로 삽입된다.
4. 초안은 `publish: false`로 두면 로컬에서만 보이고 배포되지 않는다.

## 발행
`git add -A && git commit && git push` → GitHub Actions가 자동 빌드·배포 → https://jisung-02.github.io

## 로컬 미리보기
`npm install` 후 `npm run dev` (초안 포함 미리보기). `npm test`로 헬퍼 테스트.

## 폴더
- `contents/posts/` 발행 대상 · `contents/notes/` 비공개 메모 · `contents/attachments/` 이미지
- `src/` Astro 코드 · `DESIGN.md` 디자인 단일 출처
```

- [ ] **Step 4: 커밋**

```bash
git add contents/.obsidian/app.json README.md contents/posts/welcome.md contents/attachments/
git commit -m "docs: Obsidian vault 설정과 README 추가"
```

---

## Self-Review (작성자 점검 결과)

- **스펙 커버리지**: 선택 발행(Task 3,4) · 태그(6) · 이미지(9) · 수식(5) · 코드(5) · RSS(7) · 미니멀 디자인+DESIGN.md(2,4,5) · 무료 배포(8) · Obsidian 작성 워크플로(9) — 모두 태스크 매핑됨.
- **설계서와의 차이(의도적)**: 이미지 임베드를 "remark 플러그인으로 `![[]]` 변환"에서 "Obsidian이 표준 마크다운 링크로 저장(`useMarkdownLinks`)"으로 변경 → Astro 네이티브 이미지 처리, 의존성 0, 더 견고(ponytail). 기능 결과(이미지 임베드)는 동일.
- **placeholder 스캔**: 없음. 모든 코드 블록은 실제 동작 코드. (welcome.md 코드펜스의 제로폭 문자 주의 사항만 명시.)
- **타입 일관성**: `isVisible/sortByDate/collectTags` 시그니처가 Task 3 정의와 4·5·6·7 사용처에서 일치. `p.id`(glob 기본 id) 라우트 파라미터 일관.
