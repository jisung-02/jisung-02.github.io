---
title: "기계학습 — 중간 핵심 요약"
date: 2026-06-20
publish: true
category: "학교공부/기계학습"
tags: ["기계학습", "중간"]
description: "경희대 기계학습(이원희 교수님) 중간 범위(Lecture 2~9) 압축본."
---

경희대 **기계학습**(이원희 교수님) 중간 범위(Lecture 2~9) 압축본.
관통하는 축: **선형모델 = 내적 → 최소제곱 = 직교투영 → SVD로 일반화**.
[← 전체 목차](/posts/ml-overview/)

---

## L02 머신러닝 소개
- **용어**: Feature(입력 특징), Label(정답), Decision Boundary(결정 경계), 선형모델 + 활성함수.
- **지도학습 7단계**: 데이터 수집 → 전처리 → 특징 추출 → 학습 샘플 구성 → 손실함수 정의 → 학습 → 일반화 평가.
- **학습 = 손실 최소화** 파라미터 찾기. 핵심: **테스트 에러 ≈ 일반화 에러**, 학습/테스트 데이터 분리 필수.
- **AI 한계 3종**: 블랙박스(→XAI), 적대적 공격(판다 → gibbon 99.3%), 편향된 데이터.

## L03 벡터와 행렬
- 선형모델 = 내적: $\hat{y} = \langle w, x\rangle = w^\top x$.
- **설계행렬** $X\in\mathbb{R}^{n\times p}$ (행=샘플, 열=피처), 전체 예측 $\hat{y}=Xw$.
- $Xw$ 두 해석: ① 행별 내적 ② 피처 컬럼의 선형결합(가중합).
- 내적(스칼라) vs 외적(행렬), 직교·정규직교, **행렬곱 = 외적의 합**.
- 응용: Vandermonde(다항 피팅), 추천 시스템 $R\approx UV^\top$.

## L04 최소제곱법과 기하
- $\min\|y-Xw\|_2^2$ = $y$를 $X$ 열공간(span)에 **직교 투영**.
- 직교 조건 $X^\top(y-X\hat w)=0$ → **정규방정식** $\hat{w}=(X^\top X)^{-1}X^\top y$.
- 직교가 최소인 이유 = **피타고라스**. $X^{-1}y$ 못 쓰는 이유 = $X$가 비정사각.
- $(X^\top X)^{-1}$ 존재 조건 = $X$ **full column rank**($n\ge p$, 열 선형독립).

## L05 최소제곱법과 최적화
- **기하(직교투영) = 최적화(gradient=0)** → 같은 정규방정식.
- 목적함수 전개 $y^\top y - 2w^\top X^\top y + w^\top X^\top X w$ → $\nabla=0$.
- Gradient 공식: $\nabla(c^\top w)=c$, $\nabla(w^\top w)=2w$, $\nabla(w^\top Qw)=2Qw$.
- 연쇄: $X$ 열 독립 → $X^\top X\succ 0$(PD) → **convex** → 유일 최적해.

## L06 경사하강법
- 대규모 $X$에서 **역행렬 회피** 위해 반복 최적화 사용.
- 업데이트 $w^{(k+1)}=w^{(k)}-\tau\nabla f$, LS gradient $=2X^\top(Xw-y)$.
- **Step size** $\tau$: 과대 → overshooting/발산, 과소 → 느린 수렴.
- 종료조건 $\|w^{(k+1)}-w^{(k)}\|<\varepsilon$.

## L07 부분공간·기저·투영
- $(X^\top X)^{-1}$ 부담을 **직교정규기저** $U$($U^\top U=I$)로 회피.
- $\hat{w}=U^\top y$, $\hat{y}=UU^\top y$ (정규방정식과 같은 $\hat y$).
- 핵심: $U^\top U=I$ 이지만 $UU^\top\neq I$. 기저가 달라도 $\hat y$는 동일. $\dim(S)=\text{rank}(X)$.

## L08 특이값분해 (SVD)
- $X=U\Sigma V^\top$ = **회전·스케일·회전**. $u_1$ = 최대분산 방향(1st PC).
- Rayleigh quotient: $\hat a=\arg\max \frac{a^\top XX^\top a}{a^\top a}$ (거리 최소 = 분산 최대).
- **SVD = PCA**(공분산 고유벡터). 투영행렬 $P_X=UU^\top$.
- $\Sigma$ 성질: 직교성·내림차순·최적 저랭크 근사·유일.

## L09 SVD 응용
- **Economy SVD**: rank $r$만 보존 → 압축(예: Netflix 2TB→4GB).
- **차원축소**: 좌표 $z_i$, 거리 보존.
- **Pseudo-inverse 최소제곱**: $\hat{w}=V\Sigma^+U^\top y$ (정규방정식보다 수치 안정).
- $\text{rank}(X)$ = 0이 아닌 특이값 개수.

---

### 한 줄 정리
> **내적(L03) → 직교투영 = 정규방정식(L04) → 최적화로도 같은 해(L05) → 큰 문제는 경사하강(L06) → 기저 바꿔 단순화(L07) → SVD가 그 최적 기저(L08~L09).**
