---
title: "기계학습 강의 정리"
date: 2026-06-20
publish: true
category: "학교공부/기계학습"
tags: ["기계학습"]
description: "경희대학교 기계학습(이원희 교수님) 수업의 Notion 강의 노트를 정리한 Obsidian Vault입니다."
---

경희대학교 **기계학습**(이원희 교수님) 수업의 Notion 강의 노트를 정리한 Obsidian Vault입니다.
**중간 범위(Lecture 2~9) + 기말 범위(Lecture 15~25)**를 하나의 Vault에 모았습니다.

> - **중간 범위**: `강의/중간/` — 선형대수 기반(최소제곱·투영·SVD)
> - **기말 범위**: `강의/기말/` — 회귀·분류·SVM·앙상블·평가·PCA
> - 종합 요약: `_summary/` (중간·기말 각 1개). 원본 Notion 덤프: `_notion_notes/`. 생성 PDF: `PDF/`.

## 종합 요약 (시험용)
- [기계학습 중간 요약](/posts/ml-기계학습-중간-요약/) — 중간 8개 강의 통합 압축본 (선형대수 축)
- [기계학습 기말 요약](/posts/ml-기계학습-기말-요약/) — 기말 10개 강의 통합 압축본 (모델·학습·평가 축)

## 중간 범위 강의 목록 (강의/중간/)

| # | 노트 | 주제 |
|---|---|---|
| L02 | [L02 머신러닝 소개](/posts/ml-l02/) | ML 개론 · 7단계 · 일반화 · AI 한계 |
| L03 | [L03 벡터와 행렬](/posts/ml-l03/) | 내적으로서의 선형모델 · 설계행렬 $Xw$ |
| L04 | [L04 최소제곱법과 기하](/posts/ml-l04/) | 직교투영 · 정규방정식 |
| L05 | [L05 최소제곱법과 최적화](/posts/ml-l05/) | gradient=0 · convex · PD |
| L06 | [L06 경사하강법](/posts/ml-l06/) | 반복 최적화 · step size |
| L07 | [L07 부분공간 기저 투영](/posts/ml-l07/) | 직교정규기저 · $\hat y = UU^\top y$ |
| L08 | [L08 특이값분해 SVD](/posts/ml-l08/) | $X=U\Sigma V^\top$ · 분산 최대 방향 |
| L09 | [L09 특이값분해 SVD 2](/posts/ml-l09/) | Economy SVD · 차원축소 · pseudo-inverse |
| — | [중간 종합정리](/posts/ml-중간-종합정리/) | 중간 전체 흐름 한눈에 |

## 기말 범위 강의 목록 (강의/기말/)

| # | 노트 | 주제 |
|---|---|---|
| L15 | [L15 최적화와 선형회귀](/posts/ml-l15/) | 목적함수·옵티마이저 · OLS · NLLS |
| L16 | [L16 Ridge Lasso 회귀](/posts/ml-l16/) | 일반화 · L2/L1 정규화 · sparsity |
| L17 | [L17 분류 알고리즘](/posts/ml-l17/) | 로지스틱 · 크로스엔트로피 · softmax |
| L18-19 | [L18-19 구현](/posts/ml-l18-19/) | 회귀·분류 구현 파트 *(원본 미완)* |
| L20 | [L20 SVM](/posts/ml-l20/) | 마진 최대화 · dual · KKT |
| L21 | [L21 SVM 2](/posts/ml-l21/) | soft margin · 커널 트릭 |
| L22 | [L22 트리 포레스트 앙상블](/posts/ml-l22/) | 불순도 · bagging · Random Forest |
| L23 | [L23 과적합과 과소적합](/posts/ml-l23/) | bias-variance 분해 |
| L24 | [L24 모델 평가지표](/posts/ml-l24/) | 혼동행렬 · PR/ROC · AUC |
| L25 | [L25 PCA](/posts/ml-l25/) | 공분산→고유분해→주성분 *(원본 미완)* |

## 원본 미완 노트
다음 두 노트는 Notion 원본 페이지가 비어 있어, 강의 표준 내용과 인접 강의(SVD·과적합)로 보충했습니다. 원본이 채워지면 갱신이 필요합니다.
- [L18-19 구현](/posts/ml-l18-19/) — Notion 본문 빈 상태
- [L25 PCA](/posts/ml-l25/) — Notion 본문 "비지도 학습" 한 줄뿐

## 사용 안내
- 이 폴더(`기계학습_정리`)를 Obsidian에서 **Open folder as vault**로 열면 됩니다.
- 수식은 LaTeX(`$...$`)로 작성되어 있어 Obsidian 수식 렌더링이 켜져 있어야 보입니다.
