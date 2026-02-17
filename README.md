# portfolio-blog

Markdown으로 콘텐츠를 관리하고 Hugo로 정적 사이트를 생성해 GitHub Pages로 배포하는 개인 블로그입니다.

## 1. 저장소 / 배포 정보

- GitHub ID: `jisung-02`
- Repository: https://github.com/jisung-02/blog
- Pages URL: https://jisung-02.github.io/blog/

## 2. 기술 스택

- **SSG**: Hugo Extended
- **콘텐츠**: Markdown (`content/`)
- **UI 자산**: React 18 + TypeScript (`src/assets/app.tsx`)
- **스타일**: CSS (`src/assets/styles.css`)
- **빌드**: esbuild + Node scripts
- **배포**: GitHub Actions + GitHub Pages (`dist/`)

## 3. 프로젝트 구조

```text
.
├─ content/                  # profile/posts/projects markdown
├─ layouts/                  # Hugo 템플릿
├─ src/
│  ├─ site/                  # markdown 파싱, 검색 인덱스 생성
│  └─ assets/                # React/CSS 소스
├─ static/assets/            # 빌드 산출 자산(app.js, styles.css, search-index.json)
├─ scripts/                  # lint/typecheck/check-content/build 스크립트
├─ tests/                    # node:test 기반 테스트
├─ dist/                     # 최종 정적 사이트 산출물
└─ hugo.toml                 # Hugo 설정
```

## 4. 현재 페이지 구성

- `/` : Home
- `/profile/` : 작업 방식/현재 포커스
- `/posts/` : 게시글 목록 및 상세
- `/projects/` : 프로젝트 목록 및 상세
- `/tags/` : 태그 아카이브

콘텐츠 소스 매핑:

- `content/profile/index.md`
- `content/posts/_index.md`, `content/posts/*.md`
- `content/projects/_index.md`, `content/projects/*.md`

## 5. 작성 규칙

1. 모든 콘텐츠는 `content/` 아래 Markdown으로 작성
2. Frontmatter에 `title`, `date`는 기본 포함
3. `posts/`, `projects/` 문서는 `description` 필수
4. `tags`는 배열 형태 사용 (예: `[workflow, note]`)
5. 문서 내 URL은 반드시 `https://` 사용
6. 민감 정보(IP, 계정, 비밀번호 등) 제외 후 공개

기본 Frontmatter 예시:

```yaml
---
title: 문서 제목
description: 요약 설명
date: 2026-02-17
tags: [tag1, tag2]
---
```

## 6. 템플릿

### 6-1. Post 템플릿

```markdown
---
title: 제목
description: 한 줄 요약
date: 2026-02-17
tags: [workflow, note]
---

문제/배경

## 접근

- 핵심 아이디어 1
- 핵심 아이디어 2

## 실행

1. 실제로 한 일
2. 검증 방법

## 회고

- 다음에 재사용할 규칙
```

### 6-2. Project 템플릿

```markdown
---
title: 프로젝트명
description: 프로젝트 목적 한 줄 요약
date: 2026-02-17
tags: [project, architecture]
---

## Goal

- 무엇을 해결하는가

## Architecture

- 구성 요소
- 데이터/요청 흐름

## Current Progress

- 진행 현황
- 다음 액션

## Why this project

- 이 프로젝트를 하는 이유
```

## 7. 로컬 실행 / 검증

요구 사항:

- Node.js 22+
- npm 10+
- Hugo Extended

설치:

```bash
npm install
```

검증:

```bash
npm run verify
```

빌드:

```bash
npm run build
```

전체 게이트:

```bash
npm run verify && npm run build && npm run audit
```

로컬 서버:

```bash
hugo server --baseURL http://localhost:1313/blog/
```

## 8. 배포 흐름

1. `main` 브랜치에 push
2. GitHub Actions에서 `verify` 통과
3. `build` + `audit` 실행 후 Pages 배포
4. `https://jisung-02.github.io/blog/` 반영 확인
