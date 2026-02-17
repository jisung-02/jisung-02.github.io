# Notes Archive System (portfolio-blog)

Markdown 기반으로 개인 실행 기록을 쌓고,
Hugo로 정적 사이트를 빌드해 GitHub Pages에 배포하는 블로그 프로젝트입니다.

이 저장소의 핵심은 **포트폴리오 전시**보다,
다음 작업에 바로 재사용할 수 있는 **기록 아카이브**를 꾸준히 남기는 것입니다.

## 1) 현재 블로그 요약 (2026-02-17 기준)

- 배포 주소: https://chaejisung.github.io/blog/
- 메인 톤: Notes Archive (조용하고 오래 쓰는 기록)
- 주요 섹션:
  - `/about/`: 운영 원칙, 공개 기준, 프레임워크
  - `/profile/`: 현재 집중 분야, 작업 스타일, 링크
  - `/posts/`: 실행 로그, 학습 노트
  - `/projects/`: 프로젝트별 목표, 진행, 근거
  - `/tags/`: 태그 기반 탐색

### 현재 콘텐츠 목록

- Posts
  - AI 시대의 빌더 워크플로우
  - MentoAI RAG 아키텍처 메모
  - 불필요한 도구를 줄이는 기준
  - OpenStack 장애 대응 루프 메모
  - PARA + CODE 주간 리뷰 루프
  - WebSocket RFC 핵심만 빠르게 정리
- Projects
  - MentoAI Career Navigator
  - Notes Archive System

## 2) 기술 스택

- Static site generator: Hugo Extended
- Content format: Markdown (`content/`)
- UI interaction: React + TypeScript (`src/assets/app.tsx`)
- Styling: CSS (`src/assets/styles.css`)
- Build/bundle: esbuild + custom scripts
- Deployment target: GitHub Pages (`dist/`)

## 3) 프로젝트 구조

```text
.
├─ content/                  # 문서 원본 (about/profile/posts/projects)
├─ layouts/                  # Hugo 템플릿
├─ src/
│  ├─ site/                  # markdown 파싱 + 검색 인덱스 생성 로직
│  └─ assets/                # React/CSS 소스
├─ static/assets/            # 빌드 시 생성/복사되는 정적 자산
├─ scripts/                  # lint/typecheck/build/check-content 실행 스크립트
├─ tests/                    # node:test 기반 테스트
├─ dist/                     # 최종 정적 산출물
└─ hugo.toml                 # Hugo 설정
```

## 4) 로컬 실행

### 요구 사항

- Node.js 22+
- npm 10+
- Hugo extended

### 설치

```bash
npm install
```

### 개발/검증

```bash
npm run lint
npm run typecheck
npm run test
npm run check-content
npm run build
npm run audit
```

`npm run build`는 아래 단계를 순서대로 수행합니다.

1. Markdown 기반 검색 인덱스(`static/assets/search-index.json`) 생성
2. `src/assets/styles.css` 복사
3. `src/assets/app.tsx` 번들링
4. Hugo 빌드 실행 후 `dist/` 생성

## 5) 글 작성법

모든 본문 콘텐츠는 `content/` 아래 Markdown으로 관리합니다.

### 5-1. 섹션별 파일 위치

- 소개 페이지: `content/about/index.md`
- 프로필 페이지: `content/profile/index.md`
- 게시글 목록: `content/posts/_index.md`
- 프로젝트 목록: `content/projects/_index.md`
- 게시글 본문: `content/posts/*.md`
- 프로젝트 본문: `content/projects/*.md`

### 5-2. Frontmatter 기본 규칙

권장 공통 필드:

```yaml
---
title: 문서 제목
description: 요약 설명
date: 2026-02-17
tags: [tag1, tag2]
---
```

주의:

- `posts/`, `projects/` 문서는 `description` 필수
- URL은 반드시 `https://` 사용
- 민감 정보(IP, 계정, 비밀번호)는 제외 후 공개

### 5-3. 새 Post 작성 템플릿

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

### 5-4. 새 Project 작성 템플릿

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

## 6) 홈 상단 "지금은 ..." 문구 관리

홈 화면의 회전 문구는 템플릿 하드코딩이 아니라
`content/profile/index.md` frontmatter에서 관리합니다.

```yaml
home_now_prefix: 지금은
home_now_phrases:
  - 프로젝트 런북을 정리하는 중
  - 주간 리뷰 루프를 다듬는 중
  - 데모 시나리오를 정리하는 중
```

- `home_now_prefix`: "지금은" 같은 접두 문구
- `home_now_phrases`: 순환 표시할 문구 목록

## 7) 검색/탐색 동작

- React Finder가 `static/assets/search-index.json`을 읽어 검색합니다.
- 인덱스 데이터는 `content/` Markdown에서 자동 생성됩니다.
- 제목, 설명, 태그를 기준으로 간단 점수화해 결과를 정렬합니다.

## 8) 품질 게이트 (필수)

작업 완료 전 아래 6개 명령을 반드시 통과해야 합니다.

1. `npm run lint`
2. `npm run typecheck`
3. `npm run test`
4. `npm run check-content`
5. `npm run build`
6. `npm run audit`

## 9) 운영 원칙

- 문서는 "읽기용"보다 "실행 재사용용"으로 남긴다.
- 도구를 늘리기보다 복구 가능한 단순 구조를 유지한다.
- 한 번 크게 정리하기보다 짧은 루프를 반복한다.
- 시각 효과보다 가독성과 안정성을 우선한다.

## 10) 자주 쓰는 명령

### 새 글 추가 후 빌드 확인

```bash
npm run check-content
npm run build
```

### 전체 점검

```bash
npm run lint && npm run typecheck && npm run test && npm run check-content && npm run build && npm run audit
```

---

필요하면 다음 단계로,
게시글 템플릿 자동 생성 스크립트와 릴리즈 체크리스트를 추가할 수 있습니다.
