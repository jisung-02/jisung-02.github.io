---
title: "특이값분해 SVD (머신러닝 응용)"
date: 2025-12-20
publish: true
category: "학교공부/기계학습"
tags: ["기계학습", "중간"]
description: "L08 특이값분해 SVD의 분해를 실전에 적용 — rank가 작은 큰 행렬은 Economy SVD로 압축 저장하고, 차원 축소로 거리를 보존하며, 최소제곱 해…"
---

## 한 줄 요약
[L08 특이값분해 SVD](/posts/ml-l08/)의 분해를 실전에 적용 — rank가 작은 큰 행렬은 Economy SVD로 압축 저장하고, 차원 축소로 거리를 보존하며, 최소제곱 해는 pseudo-inverse로 역행렬 없이 안정적으로 푼다.

## 핵심 개념

| 주제 | 핵심 | 의미 |
|---|---|---|
| Rank ↔ 특이값 | $\text{rank}(X)$ = 0이 아닌 $\sigma_i$ 개수 | 모두 >0 = full rank, 일부 0 = reduced rank |
| Economy SVD | $X=\tilde U\tilde\Sigma\tilde V^T$, 앞 $r$개 열만 | rank $r\ll\min(n,p)$일 때 저장 절약 |
| 차원 축소 | $x_i\in\mathbb{R}^p \to z_i\in\mathbb{R}^k$ ($k<p$) | $x_i-x_j\approx z_i-z_j$ (거리 보존) |
| 최소제곱 + pseudo-inverse | $\hat w = V\Sigma^+U^Ty$ | 역행렬·직사각형·수치불안정 문제 해소 |

- Economy SVD 주의: $\tilde U^T\tilde U=I$ 이지만 $\tilde U\tilde U^T\neq I$ (부분공간만 span). $\tilde V$도 동일.
- 차원 축소: 각 $x_i$ = $\tilde V$ 열벡터들의 가중합이고, 그 **가중치가 곧 축소 벡터 $z_i$**.

## 핵심 수식 / 예시

Pseudo-inverse $\Sigma^+$ = 0 아닌 대각원소를 $1/\sigma_i$로 바꾸고 전치.

최소제곱 SVD 해 유도:
$$y\approx X\hat w = U\Sigma V^T\hat w \Rightarrow U^Ty\approx\Sigma V^T\hat w \Rightarrow \Sigma^+U^Ty\approx V^T\hat w \Rightarrow \hat w = V\Sigma^+U^Ty$$

Netflix 저장 절약 예시 ($n$=영화 5,000, $p$=고객 1억, rank 10):
- 전체: $5000\times10^8\times4\text{B} \approx 2\text{TB}$
- Economy: $\tilde U$ 200KB + $\tilde\Sigma$ 40B + $\tilde V$ 4GB $\approx$ **4GB**

차원 축소 예시 ($\text{rank}(X)=2$): $x_1=[1,-1,-1,1]^T \to z_1=2\sqrt{}\,[1,1]^T$ 처럼 4D → 2D.

## 시험 포인트
- $\hat w=V\Sigma^+U^Ty$ 유도(양변에 $U^T,\Sigma^+,V$ 차례로 곱) 암기. 정규방정식 $(X^TX)^{-1}X^Ty$ 대비 장점: 역행렬 불필요·수치 안정·직사각형 OK.
- $\text{rank}(X)$ = 0이 아닌 특이값 개수.
- Economy SVD에서 $\tilde U\tilde U^T\neq I$ 인 이유(전체 공간이 아닌 부분공간).
- 저장량 계산 감각: full $np$ vs compact $r(n+p+1)$.
- 응용 맥락: 추천 시스템, 이미지 압축, 노이즈 제거, feature 추출.

관련: [L07 부분공간 기저 투영](/posts/ml-l07/) · [L08 특이값분해 SVD](/posts/ml-l08/) · [중간 종합정리](/posts/ml-중간-종합정리/)
