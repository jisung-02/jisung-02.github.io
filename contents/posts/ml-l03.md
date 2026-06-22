---
title: "벡터와 행렬"
date: 2025-12-20
publish: true
category: "학교공부/기계학습"
tags: ["기계학습", "중간"]
description: "선형 모델의 예측은 가중치 벡터와 피처 벡터의 내적 langle w, x rangle이며, 전체 데이터셋에 대한 예측은 설계 행렬과 가중치 벡터의 곱 h…"
---

## 한 줄 요약
선형 모델의 예측은 가중치 벡터와 피처 벡터의 내적 $\langle w, x \rangle$이며, 전체 데이터셋에 대한 예측은 설계 행렬과 가중치 벡터의 곱 $\hat{y} = Xw$로 한 번에 표현된다.

## 핵심 개념

- **피처 벡터(Feature Vector)** $x_i \in \mathbb{R}^p$: 한 샘플의 특징을 $p$개의 실수로 표현한 벡터. 학습 데이터는 $(x_i, y_i),\ i = 1, \dots, n$ ($n$ = 샘플 수).
- **선형 모델 = 가중합**: 예측은 피처의 가중합이고, 이는 곧 내적이다. $w$는 학습으로 찾는 가중치, 목표는 손실 $L(\hat{y}_i, y_i)$ 최소화.
- **내적 표기의 동치**: $\langle w, x_i \rangle = w^\top x_i = x_i^\top w$ (모두 같은 스칼라).
- **기하학적 해석**: $\langle w, x \rangle = 0$이 결정 경계. 부호로 클래스를 가르며, **가중치 벡터 $w$는 결정 경계에 수직**이다.
- **Bias(편향) $w_0$**: 상수항. 피처 벡터에 1을, 가중치 벡터에 $w_0$를 추가하면 다시 $\hat{y} = \langle w, x \rangle$ 형태로 통일된다. 역할은 결정 경계의 위치 조정(offset).
- **설계 행렬(Design/Feature Matrix)** $X \in \mathbb{R}^{n \times p}$: **행 = 샘플, 열 = 피처**. $x_{ij}$ = $i$번째 샘플의 $j$번째 피처.

### $\hat{y} = Xw$의 두 가지 해석
| 관점 | 표현 | 의미 |
| --- | --- | --- |
| 내적 관점 | $(Xw)_i = \langle x_i, w \rangle$ | $X$의 각 행과 $w$의 내적 |
| 선형결합 관점 | $Xw = \sum_j w_j \cdot (X의\ j번\ 열)$ | 피처 컬럼들의 가중합 |

핵심 통찰: 예측 $\hat{y}$는 **피처 컬럼들의 선형결합**이다.

### 내적 vs 외적
| | 식 | 결과 |
| --- | --- | --- |
| 내적(Inner) | $u^\top v$ | 스칼라 |
| 외적(Outer) | $uv^\top$ | 행렬 |

- $u^\top v = 0$ → **직교(orthogonal)**, $\|u\| = 1$ → **정규화(normalized)**, 둘 다면 **정규직교(orthonormal)**.
- **행렬곱 = 외적의 합**: $UV = u_1 v_1^\top + \dots + u_k v_k^\top$ (앞 행렬의 열들과 뒤 행렬의 행들의 외적 합).

## 핵심 수식 / 예시

- 선형 모델 / 내적:
$$\hat{y}_i = w_1 x_{i1} + \dots + w_p x_{ip} = \langle w, x_i \rangle = w^\top x_i$$
- 전체 예측 (차원 확인 필수):
$$\hat{y} = Xw, \quad (n \times 1) = (n \times p)(p \times 1)$$
  X의 열 개수 = $w$의 행 개수여야 곱이 정의된다.
- **다항식 피팅 (Vandermonde 행렬)**: 곡선 데이터도 선형 모델로 처리 가능. 선형 모델이지만 비선형 관계를 표현한다.
$$\hat{y}_i = w_0 + w_1 z_i + w_2 z_i^2 + w_3 z_i^3, \quad X = \begin{bmatrix} 1 & z_1 & z_1^2 & z_1^3 \\ \vdots & \vdots & \vdots & \vdots \\ 1 & z_n & z_n^2 & z_n^3 \end{bmatrix}$$
- **추천 시스템 (행렬 분해)**: 사용자-아이템 평점 행렬의 빈칸 채우기.
$$R \approx U V^\top$$
  $R$: 평점(users × items), $U$: 사용자 특성(users × features), $V$: 아이템 특성(items × features). 큰 행렬을 작은 두 행렬로 분해(차원 축소)하여 빈 평점을 예측.

## 시험 포인트
- 선형 모델을 내적으로 표현: $\hat{y} = \langle w, x \rangle = w^\top x = x^\top w$ (세 표기 동치).
- 설계 행렬에서 **행=샘플, 열=피처**, $x_{ij}$ 첨자 순서 ($i$=샘플, $j$=피처) 헷갈리지 말 것.
- $\hat{y} = Xw$의 **차원 맞춤**: $(n \times p)(p \times 1) = (n \times 1)$.
- $Xw$의 두 해석(내적 관점 vs 선형결합 관점)을 설명할 수 있어야 함.
- bias trick: 피처에 1, 가중치에 $w_0$ 추가 → $w_0$의 역할(offset).
- 내적은 스칼라 / 외적은 행렬. 직교($u^\top v=0$)·정규화($\|u\|=1$)·정규직교 정의 구분.
- **행렬곱을 외적의 합으로 표현**하는 식.
- 결정 경계 $\langle w, x\rangle=0$이고 $w$가 경계에 수직이라는 점.
- 다음 단계는 최적 가중치 $w$를 찾는 Least Squares / Optimization. 선행 개념은 [L02 머신러닝 소개](/posts/ml-l02/).
