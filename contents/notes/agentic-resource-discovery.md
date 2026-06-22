---
title: "Agentic Resource Discovery (ARD)"
date: 2026-06-22
tags: ["AI에이전트", "리서치"]
---

> 출처: https://developers.googleblog.com/announcing-the-agentic-resource-discovery-specification/

AI 에이전트가 조직 경계를 넘어 도구·스킬·다른 에이전트를 **찾고(discover)·검증하고·안전하게 연결**하기 위한 오픈 스펙. Apache 2.0, Linux Foundation의 AI Catalog Working Group 기반.

## 푸는 문제
에이전트가 던지는 세 질문에 표준 답이 없음 → 생태계 파편화:
- 필요한 기능이 **어디** 있나?
- **어떤** 기능을 써야 하나?
- 연결해도 **안전**한가?

## 핵심 구성 (2개 프리미티브)
- **Catalog**: 조직이 도메인의 잘 알려진 경로에 `ai-catalog.json` 게시. 제공 기능(MCP 서버, OpenAPI 도구, 에이전트)을 기술. **도메인 소유권이 곧 암호학적 신원**.
- **Registry**: 게시된 카탈로그를 색인하는 검색엔진. 자연어 질의 또는 도메인 직접 fetch로 발견.

## 동작 4단계
게시(catalog) → 발견(registry 검색/직접 fetch) → 게시자 신원 암호학적 검증 → 네이티브 프로토콜로 런타임 직접 연결.

## 메모
- Google Cloud의 Agent Registry(Gemini Enterprise)가 호스팅·거버넌스 제공, ARD 네이티브 통합 예정.
- MCP가 "에이전트↔도구 연결 방법"이라면, ARD는 그 앞단의 "무엇이 어디 있는지 찾기" 계층.
