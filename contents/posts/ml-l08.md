---
title: "특이값분해 SVD (기초)"
date: 2025-12-20
publish: true
category: "학교공부/기계학습"
tags: ["기계학습", "중간"]
description: "X=USigma V^T. U는 데이터를 가장 잘 설명하는 직교 방향(주성분), Sigma는 각 방향의 중요도, V^T는 새 좌표 — L07 부분공간 기저…"
---

## 한 줄 요약
$X=U\Sigma V^T$. $U$는 데이터를 가장 잘 설명하는 직교 방향(주성분), $\Sigma$는 각 방향의 중요도, $V^T$는 새 좌표 — [L07 부분공간 기저 투영](/posts/ml-l07/)에서 필요했던 직교정규기저 $U$를 SVD가 만들어 준다.

## 핵심 개념

| 요소 | 크기 | 의미 |
|---|---|---|
| $U$ Left singular vectors | $n\times n$ | 직교정규. $X$ column space의 기저. $u_1$=최대 분산 방향(1st PC) |
| $\Sigma$ Singular values | $n\times p$ 대각 | $\sigma_1\ge\sigma_2\ge\dots\ge0$. 각 방향 데이터 퍼짐(중요도) |
| $V$ Right singular vectors | $p\times p$ | 직교정규. 회전·스케일된 좌표계에서의 좌표 |

- 기하학: $U$=회전(rotation), $\Sigma$=축별 확대/축소(scaling), $V^T$=새 좌표(coordinates).
- $u_1$은 거리 최소화 = 분산 최대화 방향. 이후 $u_2,u_3,\dots$는 잔차에 대해 순차적으로 구하며 모두 직교 → best $k$-dim 근사.
- **SVD = PCA**: left singular vectors = principal components. 공분산 $C=\tfrac1n XX^T$의 고유벡터 = $XX^T$의 고유벡터 = $U$.

## 핵심 수식 / 예시

거리 최소화 → 분산 최대화 유도 (1D 부분공간 $a$):
$$d_i^2 = \Big\|x_i - \tfrac{aa^T}{a^Ta}x_i\Big\|^2 = x_i^Tx_i - \frac{x_i^T a\,a^T x_i}{a^Ta}$$
$x_i^Tx_i$는 상수이므로 제거 → 최대화 문제로:
$$\hat a = \text{argmax}_a\ \frac{a^T XX^T a}{a^Ta}\quad(\text{= 1st left singular vector } u_1)$$

분해 / rank-1 합:
$$X = U\Sigma V^T = \sigma_1 u_1 v_1^T + \sigma_2 u_2 v_2^T + \dots + \sigma_r u_r v_r^T$$

투영행렬이 깔끔해짐:
$$P_X = X(X^TX)^{-1}X^T = UU^T\quad(\text{역행렬 소거})$$

최소제곱 응용: $\text{span}(\text{cols}(U))=\text{span}(\text{cols}(X))$ 이므로 $\hat w=U^Ty,\ \hat y=UU^Ty$.

## 시험 포인트
- $\hat a=\text{argmax}\,\dfrac{a^TXX^Ta}{a^Ta}$ 유도(Rayleigh quotient 형태)는 출제 단골. 거리 최소 → 상수항 제거 → 분산 최대 흐름 암기.
- 성질 4종: 직교성($U^TU=I,V^TV=I$), 순서($\sigma_1\ge\dots\ge0$), 최적성($[u_1..u_k]$=best $k$-dim), 유일성($\sigma_i$ 서로 다르면 $u_i,v_i$ 유일).
- 직교여공간: $P_{a^\perp}=I-P_a$, $d_i=\|P_{a^\perp}(x_i)\|$.
- SVD=PCA 등식과 그 이유(공분산 고유벡터).
- 응용 5: 최소제곱 $U$, 차원축소, low-rank 근사, 데이터 압축($k(n+p+1)\ll np$), 노이즈 제거.

관련: [L07 부분공간 기저 투영](/posts/ml-l07/) · [L09 특이값분해 SVD 2](/posts/ml-l09/) · [중간 종합정리](/posts/ml-중간-종합정리/)
