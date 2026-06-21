# Obsidian Vault 기반 개인 블로그 — 설계 문서

작성일: 2026-06-20
작성자: jisung-02 (jschae02@khu.ac.kr)

## 목표

Obsidian으로 글을 편하게 쓰면서, 같은 내용을 무료 정적 블로그로도 공개한다.
정리용 중심의 미니멀 블로그. 학부생 수준의 CS/기술 정리(코드 + 가벼운 수식).

## 핵심 결정 사항

| 항목 | 결정 |
|------|------|
| 정적 사이트 생성기 | **Astro** |
| 호스팅 | **GitHub Pages + GitHub Actions** (무료, push 시 자동 배포) |
| 사이트 주소 | `https://jisung-02.github.io` (user site, 루트 도메인) |
| 작성 환경 | `./content` 폴더를 Obsidian vault로 사용 |
| 발행 방식 | 선택 공개 — `content/posts/` 안 + frontmatter `publish: true` 인 글만 |
| 살릴 Obsidian 기능 | 태그, 이미지 임베드(`![[...]]`), 수식(LaTeX) — 표시 수준만 |
| 제외 | 위키링크/백링크/그래프, 댓글, 검색, 조회수 (YAGNI) |

## 1. 저장소 & 디렉터리 구조

```
myblog/                     ← git repo = Astro 프로젝트 루트
├─ content/                 ← Obsidian vault (Obsidian에서 이 폴더를 연다)
│  ├─ posts/                ← 발행 대상 글 (.md)
│  ├─ notes/                ← 비공개 메모/초안 (발행 안 됨)
│  └─ attachments/          ← 이미지 등 첨부파일
├─ src/                     ← Astro 코드
│  ├─ layouts/
│  ├─ components/
│  ├─ pages/
│  ├─ styles/
│  └─ content.config.ts     ← content collection 정의 (glob loader → ./content/posts)
├─ public/                  ← 정적 에셋 (favicon 등)
├─ astro.config.mjs
├─ .github/workflows/deploy.yml
├─ package.json
└─ docs/superpowers/specs/  ← 본 설계 문서
```

- 글 쓰는 사람 관점: `content/` 폴더만 Obsidian vault로 열면 끝. `src/` 등은 신경 쓸 필요 없음.
- 이미지는 Obsidian 기본 첨부 폴더를 `content/attachments/`로 설정해 `![[image.png]]`로 삽입.

## 2. 발행 규칙 (선택 공개)

- 발행 조건: `content/posts/` 안에 있으면서 frontmatter `publish: true`.
- `publish: false`거나 플래그가 없으면 빌드에서 제외(초안 보호).
- `notes/`, `attachments/`는 발행 로직이 건드리지 않음.

### Frontmatter 스키마

```yaml
---
title: string          # 필수
date: YYYY-MM-DD        # 필수 (발행/정렬 기준)
publish: boolean        # 필수 — true일 때만 발행
tags: [string, ...]     # 선택
description: string     # 선택 (목록/메타 설명)
updated: YYYY-MM-DD     # 선택 (수정일)
---
```

Astro content collection 스키마(Zod)로 검증하고, `publish !== true` 항목은 빌드 시 필터링한다.

## 3. 렌더링 기능

- **태그**: 글 하단 태그 표시 + `/tags/[tag]` 태그별 모음 페이지.
- **이미지 임베드**: Obsidian `![[image.png]]` → 표준 이미지로 변환하는 remark 플러그인. `content/attachments/`에서 해석.
- **수식**: `remark-math` + `rehype-katex`로 `$인라인$`, `$$블록$$` 렌더. KaTeX CSS 포함.
- **코드 강조**: Astro 내장 Shiki (별도 설정 불필요).

## 4. 페이지 구성

| 경로 | 내용 |
|------|------|
| `/` | 글 목록 (최신순: 제목·날짜·태그) |
| `/posts/[slug]` | 글 본문 + 라이트/다크 토글 |
| `/tags/[tag]` | 해당 태그 글 모음 |
| `/about` | 간단 자기소개 (선택) |
| `/rss.xml` | RSS 피드 (자동 생성) |

디자인: 군더더기 없는 흑백 미니멀, 라이트/다크 토글, 한글 가독성 좋은 폰트.

## 5. 빌드 & 배포

- GitHub Actions: `main` 브랜치 push 시 트리거.
- 단계: 의존성 설치 → `astro build` → `dist/`를 GitHub Pages에 배포.
- 저장소 Settings → Pages → Source를 "GitHub Actions"로 설정 (1회).

## 6. 작성 → 발행 워크플로

1. Obsidian에서 `content/` vault 열기.
2. `posts/`에 글 작성, frontmatter에 `publish: true`.
3. 이미지는 `![[...]]`로 삽입(첨부 폴더 = `attachments/`).
4. git commit & push → Actions가 자동 빌드·배포 → `jisung-02.github.io`에 반영.

## 7. 의도적으로 제외 (YAGNI)

댓글(giscus), 전문 검색(Pagefind), 그래프/백링크, 조회수 분석.
→ 필요해지면 나중에 추가 가능한 구조로 둔다.

## 열린 항목 / 가정

- 주소는 user site(`jisung-02.github.io`) 가정. 커스텀 도메인은 추후 옵션.
- `/about` 페이지 포함 여부는 구현 시 빈 페이지로라도 둘 수 있음.
