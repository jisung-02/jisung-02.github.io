# 블로그 학습 로드맵 (Next.js + TypeScript)

작성일: 2026-05-11
대상: `Desktop/Project/blog` 저장소 (브랜치 `new-rayout`)

## 목표

- React와 TypeScript를 **배우면서** 개인 블로그를 직접 만들어 GitHub Pages에 배포한다.
- v1 범위: **홈 + posts 목록 + posts 상세** 만 동작.
- 컨텐츠는 기존 `content/posts/` 안의 마크다운을 그대로 사용한다.

## 원칙

- **학습 우선.** 막히면 그 단계에서 더 머문다. 다음 단계로 넘어가지 않는다.
- **단계마다 git commit + 자기 칭찬 1줄.** 동기부여 장치.
- **AI에게 답을 받기 전에 5분은 직접 생각해본다.** 그래야 남는다.
- **YAGNI.** v2 후보(태그, 검색, projects 섹션 등)는 v1 끝나기 전엔 손대지 않는다.

## 스택 결정

- **Next.js (App Router) + TypeScript** — React 학습에 가장 정공법.
- **마크다운 파서**: `gray-matter`(frontmatter) + `remark` + `remark-html` 또는 `marked`. Phase 4에서 비교 후 선택.
- **스타일링**: Phase 5에서 CSS Modules vs Tailwind 중 결정. (Tailwind를 추천하지만 학습 부담 때문에 미정.)
- **배포**: GitHub Pages + GitHub Actions. `next export`로 정적 빌드.

## 안 다루는 것 (v1 out of scope)

- `projects`, `scratchpad`, `about`, `profile` 섹션
- 태그, 카테고리, 검색, RSS
- 댓글, 좋아요
- 다크모드
- 신택스 하이라이팅(기본 `<pre><code>`만)
- Obsidian wikilink/embed (`[[...]]`, 이미지 임베드) 변환
- 이미지 최적화

위 항목은 v1 배포 후 별도 단계로.

---

## Phase 0 — 환경 + JS 핵심 (1~2일)

### 학습 목표

- 로컬에 Node.js LTS, pnpm(또는 npm), Git이 동작한다.
- JS의 다음 개념을 "쓸 줄" 안다 (외울 필요 X, 검색하며 쓸 정도면 OK):
  - `let`/`const`, 화살표 함수, 템플릿 리터럴
  - 객체/배열 리터럴, 구조 분해 할당, 스프레드 `...`
  - 자주 쓰는 배열 메서드: `map`, `filter`, `find`, `some`, `every`, `reduce`
  - ES 모듈: `import` / `export`
  - `async`/`await`와 `Promise` 한 줄 요약
  - `try`/`catch`

### 자료 (택1)

- [ko.javascript.info](https://ko.javascript.info/) — 1~2부 일부.
- MDN "JavaScript Guide" (영문이지만 번역 좋음).

### 체크리스트

- [ ] `node -v`, `pnpm -v` 출력 확인
- [ ] 빈 폴더에 `package.json` 만들고 `node script.js` 실행해보기
- [ ] 다음 함수를 직접 작성해서 동작 확인:
  - `getPostTitles(posts)` — `{title}` 객체 배열을 받아 제목 문자열 배열 반환 (`.map`)
  - `findRecent(posts)` — `date` 필드 기준 가장 최근 1개 반환

### 완성 신호

- `console.log` 없이 위 두 함수 동작 그림이 머릿속에 그려진다.

---

## Phase 1 — TypeScript 기초 (1일)

### 학습 목표

- "왜 TS를 쓰는가"를 자기 언어로 설명할 수 있다.
- 다음을 작성/읽을 수 있다: 기본 타입, `interface`, `type`, 함수 시그니처, 옵셔널 `?`, 유니온 `|`.
- 제네릭은 **읽을 줄만** 알면 됨. 직접 만들 필요 X.

### 자료

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) "Everyday Types"까지.
- TS Playground에서 직접 쳐보기.

### 체크리스트

- [ ] `Post`라는 인터페이스 작성: `slug: string`, `title: string`, `date: string`, `body: string`
- [ ] `getPostTitles(posts: Post[]): string[]` 시그니처로 Phase 0의 함수 다시 작성
- [ ] 일부러 타입 에러 한 번 내보고 메시지 읽어보기

### 완성 신호

- 타입 에러 메시지가 더 이상 무섭지 않다.

---

## Phase 2 — React 기초 (2~3일)

### 학습 목표

- JSX, 컴포넌트, props, `useState`, 리스트 렌더링(`key`)이 손에 익는다.
- "상태는 위로, props는 아래로" 라는 흐름이 감각으로 잡힌다.
- **블로그는 아직 손대지 않는다.** 별도의 작은 연습 프로젝트로 학습.

### 자료

- [react.dev](https://react.dev/) "Learn" 섹션의 Quick Start.
- 공식 튜토리얼 "Tic-Tac-Toe" 1회 따라하기.

### 연습 프로젝트: "독서 기록 미니 앱"

별도 폴더 (`~/practice/react-reading/`) 에 Vite로 만든다. 블로그 저장소 건드리지 않음.

- `Book[]` 배열 (책 제목, 읽은 날짜) 표시
- 입력 폼으로 책 추가
- "읽음/안읽음" 토글
- 필터(전체/읽음/안읽음)

### 체크리스트

- [ ] Vite + React + TS 프로젝트 생성
- [ ] 위 4가지 기능 동작
- [ ] props만 받는 컴포넌트와 상태를 가진 컴포넌트의 차이를 설명 가능

### 완성 신호

- 새 컴포넌트를 만들 때 "이걸 props로 받을지 state로 둘지" 망설임이 줄어든다.

---

## Phase 3 — Next.js 스켈레톤 (1일)

### 학습 목표

- `create-next-app`으로 빈 프로젝트 시작.
- App Router의 파일 기반 라우팅 이해 (`app/page.tsx`, `app/posts/page.tsx`, `app/posts/[slug]/page.tsx`).
- 서버 컴포넌트 vs 클라이언트 컴포넌트 차이 **개념만**.

### 자료

- [nextjs.org/learn](https://nextjs.org/learn) — Foundations + App Router 시작 부분.

### 체크리스트

- [ ] 블로그 저장소 안에 Next.js 앱 생성 (위치는 작업 시 결정 — 루트에 둘지 `app/` 서브폴더에 둘지 구현 계획 단계에서)
- [ ] `/` 홈, `/posts` 목록, `/posts/hello` 상세, 셋 다 더미 텍스트로 동작
- [ ] `npm run dev`로 로컬에서 세 경로 모두 띄움

### 완성 신호

- URL을 보고 어떤 파일이 그려주는지 머릿속에서 매칭된다.

---

## Phase 4 — 마크다운 렌더링 (2~3일) ★ 가장 중요

### 학습 목표

- `content/posts/`의 `.md` 파일을 빌드 시점에 읽어 목록/상세 페이지로 렌더링.
- frontmatter(`---` 안의 메타)를 파싱해서 제목/날짜 추출.

### 구현 단위

1. `lib/posts.ts` — 마크다운 파일 읽기/파싱 함수 (`getAllPosts()`, `getPostBySlug(slug)`)
   - `gray-matter`로 frontmatter 분리
   - 본문 markdown → HTML 변환 (`remark` + `remark-html` 또는 `marked`)
2. `app/posts/page.tsx` — `getAllPosts()` 호출, 제목 + 날짜 + 링크 목록
3. `app/posts/[slug]/page.tsx` — `getPostBySlug(slug)` 호출, 본문 HTML 렌더
   - Next.js 정적 export 위해 `generateStaticParams()` 구현

### 체크리스트

- [ ] `lib/posts.ts` 함수가 단독으로 동작 (테스트는 Phase 5 이후로 미뤄도 됨)
- [ ] `/posts`에 실제 글 제목 나옴
- [ ] `/posts/<slug>` 에 실제 본문 나옴 (스타일은 엉망이어도 OK)
- [ ] 이미지 경로(`/content/...` 또는 `/static/...`)가 끊기지 않게 정리 — 작업하면서 결정

### 함정 주의

- App Router에서 `fs` 모듈을 쓰려면 **서버 컴포넌트**여야 함. `"use client"` 붙이지 말 것.
- Obsidian의 `[[wikilink]]`, `![[image.png]]` 임베드 문법은 표준 마크다운이 아님. v1에서는 깨져 보여도 통과하고, 깨진 글은 잠시 미공개 처리.

### 완성 신호

- 새 글을 `content/posts/foo.md`로 추가하면 빌드 후 사이트에 나타난다.

---

## Phase 5 — 최소 스타일링 (1~2일)

### 학습 목표

- "읽을 만한" 수준의 타이포 + 여백.
- 화려한 디자인 금지. 색 2~3개, 폰트 1~2개.

### 결정 사항 (이 단계 시작 시 정함)

- **CSS Modules** (Next.js 기본 내장, 학습 부담 0) vs **Tailwind** (생산성 좋음, 학습 1~2시간).
- 추천: 우선 CSS Modules로 시작 → 답답해지면 Tailwind 도입.

### 체크리스트

- [ ] 본문 폰트, 줄 간격, 문단 간격, 최대 너비 설정
- [ ] 헤더(사이트 제목 + 홈 링크)
- [ ] 푸터 (간단히)
- [ ] `<pre><code>` 가독성 (배경색 + 모노스페이스)

### 완성 신호

- 친구한테 보여줄 때 부끄럽지 않은 정도.

---

## Phase 6 — GitHub Pages 배포 (반나절)

### 학습 목표

- Next.js를 정적으로 export 해서 GitHub Pages에 자동 배포.

### 체크리스트

- [ ] `next.config.js`에 `output: 'export'` 설정
- [ ] 로컬에서 `next build` 후 `out/`에 정적 파일 생성 확인
- [ ] GitHub Actions 워크플로 작성 (`.github/workflows/pages.yml`)
  - main 브랜치 push 시 build → `out/`를 Pages로 배포
- [ ] 저장소 Settings → Pages에서 Actions 소스 선택
- [ ] 라이브 URL에서 글 1개가 보이는 것 확인

### 함정 주의

- 저장소 이름이 `<username>.github.io`가 아니라면 base path 설정 필요 (`basePath`, `assetPrefix`).
- `next/image` 사용 시 정적 export는 추가 설정 또는 미사용.

### 완성 신호

- URL을 누가 물어봐도 부끄럽지 않게 답해줄 수 있다.

---

## 단계 외: 막혔을 때 행동 강령

1. **에러 메시지 한 줄을 그대로 검색** — 가장 빠른 정답.
2. 그래도 안 풀리면 **공식 문서**의 해당 키워드.
3. 그래도 안 되면 **AI한테 묻기 — 단, 답을 받기 전에 자기가 추측한 원인을 한 줄 적어두기.**
4. 한 문제에 1시간 이상 안 쓰기. 다음 날 다시.

## v2 후보 (참고용, v1 끝나기 전엔 손대지 말 것)

- projects / scratchpad / about / profile 섹션
- 태그/카테고리
- 풀텍스트 검색 (Pagefind)
- RSS feed
- 신택스 하이라이팅 (`shiki`)
- 다크모드
- Obsidian wikilink/embed 변환
- 이미지 최적화 (`next/image`)
- 댓글 (giscus)
