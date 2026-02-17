---
title: MentoAI Career Navigator
description: 데이터 엔지니어링 + RAG로 맞춤형 커리어 액션 플랜을 만드는 프로젝트
date: 2026-01-28
tags: [ai, rag, data-engineering]
---

채용 데이터를 수집·정제·벡터화해, 사용자 입력에 맞는 커리어 액션 플랜을 제안하는 프로젝트입니다.

## Architecture

- Ingestion: Kafka
- Processing: Spark (Streaming + Batch)
- Storage: S3(Bronze), Postgres(Silver), Qdrant(Gold)
- Serving: FastAPI + LangChain + Gemini

## Current Progress

- 발표용 핵심 메시지(문제/해결/성과) 1페이지 정리 중
- 데모 시나리오(입력 → 처리 → 결과) 단계별 정리 중
- 기술 선택 근거와 예상 질문 답변 보강 중

## Why this project

단순 공고 검색이 아니라, 사용자 역량과 공고의 의미적 유사도를 기준으로
"다음 행동"을 제안하는 흐름을 만드는 것이 목표입니다.
