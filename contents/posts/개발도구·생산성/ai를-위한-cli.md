---
title: "AI를 위한 CLI"
date: 2026-04-05
publish: true
tags: ["AI", "도구"]
description: "AI 에이전트 친화적인 CLI를 만들기 위한 개선 순서 메모"
---

> 참고자료
> - https://justin.poehnelt.com/posts/rewrite-your-cli-for-ai-agents/
> - https://daleseo.com/cli-for-ai-agents/#google_vignette

## 기존 CLI를 어디서부터 바꿔야 할까

이미 운영 중인 CLI가 있다면 처음부터 다시 만들 필요는 없다. 아래 순서로 하나씩 개선해 나가면 된다.

1. `--output json` 추가 — 머신 리더블 출력은 모든 것의 시작점
2. 입력 검증 강화 — 경로 탐색, 제어 문자, 쿼리 매개변수 인젝션 차단
3. `schema` 또는 `--describe` 명령 추가 — 런타임 스키마 조회
4. 필드 마스크 지원 — 응답 크기를 에이전트가 제어할 수 있게
5. `--dry-run` 추가 — 위험한 작업의 사전 검증
6. 컨텍스트 파일 배포 — AGENTS.md나 스킬로 에이전트 가이드 제공
7. MCP 인터페이스 노출 — API를 래핑하는 CLI라면 특히 유용

1번과 2번만 해도 에이전트 친화성이 확 올라간다. 나머지는 필요할 때 추가하면 된다.
