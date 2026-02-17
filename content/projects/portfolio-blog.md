---
title: Notes Archive System
description: Markdown 기반 개인 기록 아카이브를 Hugo로 운영하는 프로젝트
date: 2026-02-17
tags: [hugo, markdown, archive]
---

이 프로젝트는 개인 기록을 오래 운영하기 위한 최소 블로그 시스템입니다.
포트폴리오 전시보다, 실행 기록과 런북을 남기는 데 초점을 둡니다.

## Architecture

- `content/`: profile/posts/projects 문서 원본
- `layouts/`: Hugo 템플릿
- `src/assets/`: 인터랙션/스타일
- `scripts/`: lint, typecheck, content check, build 자동화

## Quality Gate

1. `npm run lint`
2. `npm run typecheck`
3. `npm run test`
4. `npm run check-content`
5. `npm run build`
6. `npm run audit`

## Recent Update

- 헤더를 텍스트 중심으로 단순화
- 홈 카피를 기록 아카이브 톤으로 정리
- 읽기 흐름을 방해하는 장식을 줄이고 가독성을 유지
