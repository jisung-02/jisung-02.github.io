---
title: MentoAI RAG 아키텍처 메모
description: 채용 데이터 파이프라인을 Bronze-Silver-Gold로 나누고 RAG로 연결한 설계 요약
date: 2026-02-17
tags: [ai, rag, data-engineering]
---

MentoAI Career Navigator는
"채용 공고를 많이 모으는 것"보다
"사용자에게 다음 행동을 제안하는 것"에 초점을 둡니다.

## 데이터 파이프라인

- **Bronze**: 원본 수집 데이터 저장
- **Silver**: 정제·중복 제거 후 구조화
- **Gold**: 임베딩 생성 및 벡터 검색 최적화

## 서비스 흐름

1. 사용자 입력
2. 벡터 검색으로 관련 공고 Top-N 추출
3. LLM이 결과를 요약하고 액션 플랜 생성

## 현재 보강 중인 항목

- 데모 시나리오를 한 페이지로 고정
- 모델 선택 근거(성능/비용/한국어 적합성) 명시
- 예상 질문 대응 문구 정리

구조가 단순할수록 발표와 운영 모두 쉬워집니다.

참고:
- https://www.databricks.com/glossary/medallion-architecture
- https://www.trychroma.com/guides/retrieval-augmented-generation
