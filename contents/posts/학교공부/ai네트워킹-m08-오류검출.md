---
title: "Error Detection and Correction L2, L4"
date: 2026-06-20
publish: true
category: "AI네트워킹"
tags: ["AI네트워킹"]
description: "데이터는 전송 중 손상될 수 있고, 일부 응용은 에러가 탐지·수정되기를 요구한다."
---

> AI 네트워킹 **중간**범위 — 노션 강의 노트를 옵시디언용으로 정리한 노트.
> [← 전체 목차](/posts/ai네트워킹-목차/)

## Introduction (소개)
- 데이터는 전송 중 손상될 수 있고, 일부 응용은 에러가 **탐지·수정**되기를 요구한다.
- 에러 탐지/수정은 인터넷 모델(TCP/IP)의 **데이터 링크 계층(L2)**과 **전송 계층(L4)**에서 구현된다.

### 에러의 종류
- **Single-bit error**: 데이터 단위에서 **1비트만**변경(isolated error).
- **Burst error**: **2비트 이상**변경. 버스트 길이 = 첫 손상 비트 ~ 마지막 손상 비트(중간 일부는 안 손상됐을 수 있음).

### Redundancy (중복성)
- 에러 탐지/수정의 핵심 개념. 전체 데이터를 반복하는 대신 **짧은 비트 그룹(redundant bits)**을 각 단위 끝에 추가한다.
- 원본 데이터 → redundant bits 추가 → **codeword(코드워드)**생성. 추가 비트는 정확성 확인 후 폐기.

### Detection vs Correction
- **Detection(탐지)**: 오류가 발생했는지 여부만 확인.
- **Correction(수정)**: 손상 비트의 개수 + **위치**까지 알아야 함 → 탐지보다 어렵다.

### FEC vs Retransmission
- **FEC(Forward Error Correction, 순방향 에러 수정)**: 수신자가 중복 비트로 메시지를 직접 복구(추정).
- **Retransmission(재전송)**: 수신자가 에러를 탐지하면 송신자에게 다시 보내달라고 요청.

### Coding & Modular Arithmetic
- **Coding**: 데이터 + redundancy를 **규칙적인 관계**로 결합하는 과정. 방식은 **블록 코딩**과 컨볼루션 코딩(이 강의는 블록 코딩 중심).
- **Modulo-2 arithmetic = XOR 연산**. 덧셈·뺄셈 결과가 동일하며 에러 검출에 사용.
 - 0⊕0=0, 0⊕1=1, 1⊕0=1, 1⊕1=0 (같으면 0, 다르면 1).

---

## Block Coding (블록 코딩)
- 메시지를 **k비트 블록(dataword)**으로 나누고, **r개 중복 비트**를 추가해 길이 **n = k + r**의 **codeword**를 만든다.
- Dataword space = 2^k 개 / Codeword space = 2^n 개 / **Valid codeword = 2^k 개**.

### Error Detection (에러 탐지)
- 두 조건이 만족되면 수신자가 에러를 탐지할 수 있다.
 1. 수신자가 **valid codeword 목록**을 알고 있다.
 2. 원래 코드워드가 **invalid codeword로 변경**되었다.
- → invalid로 변하지 않은 오류(valid → valid)는 **탐지 불가**.

**예시 (k=2, n=3, 보낸 codeword = 011)**

| 경우 | 수신값 | valid 여부 | 결과 |
| --- | --- | --- | --- |
| 1 | 011 | valid | 정상(dataword 01 추출) |
| 2 | 111 | invalid | 탐지 성공 |
| 3 | 000 | valid | 탐지 실패 (2비트 오류가 valid로 변조) |

### Error Correction (에러 수정)
- 핵심 = **가장 가까운 valid codeword 찾기**.
- 예시(dataword 01 → codeword 01011 전송, 수신 01001 = invalid):
```
00000 → distance 2 → 탈락
01011 → distance 1 → 후보
10101 → distance 3 → 탈락
11110 → distance 3 → 탈락
```
- 1비트만 다른 유일한 코드워드 **01011**선택 → dataword **01**복구. 이 거리가 **Hamming distance**.

### Hamming Distance (해밍 거리)
- 같은 크기 두 단어 사이 **서로 다른 비트 개수**= d(x, y).
- 두 단어를 **XOR 한 결과의 1의 개수**로 계산.
 - d(000, 011) = 2 (000 ⊕ 011 = 011 → 1이 2개)
 - d(10101, 11110) = 3 (10101 ⊕ 11110 = 01011 → 1이 3개)

### Minimum Hamming Distance (최소 해밍 거리, d_min)
- 코드워드 집합의 모든 쌍 중 **가장 작은 해밍 거리**. d_min이 클수록 안정적.
- 예: Case1(000,011,101,110) → d_min = 2 / Case2(00000,01011,10101,11110) → d_min = 3.

### 거리 기준 성능 공식
- **에러 탐지**: 최대 s개 에러를 확실히 탐지하려면 **d_min ≥ s + 1**.
 - d_min = 2 → s = 1 (1비트만 확실히 탐지). 예: 101→100(invalid, 탐지 성공) / 101→000(valid, 2비트, 탐지 실패).
 - d_min = 3 → 최대 2비트 탐지(일부 3비트는 탐지 불가).
- **에러 수정**: 최대 t개 에러를 수정하려면 **d_min ≥ 2t + 1**.

---

## Linear Block Codes (선형 블록 코드)
- 두 valid codeword를 **XOR(모듈로-2 덧셈)**하면 결과도 또 다른 valid codeword가 되는 코드 → XOR에 대해 **닫혀 있음**.
- 오늘날 거의 모든 블록 코드가 선형 블록 코드.

### 선형 블록 코드의 최소 거리
- **d_min = 0이 아닌(non-zero) 코드워드 중 1의 개수가 가장 작은 값**. (선형 블록 코드에서만 성립.)
- 예: 표1 → 1의 개수 2,2,2 → d_min = 2 / 표2 → 3,3,4 → d_min = 3.

### Simple Parity-Check Code (단순 패리티 검사 코드)
- k비트 데이터워드 → **n = k + 1**비트 코드워드. 추가되는 **패리티 비트**는 코드워드 안 1의 총 개수를 짝수(또는 홀수)로 맞춘다.
- **d_min = 2**, **단일 비트 에러 탐지**가능, 수정은 불가. → 공식 d_min = s+1에 따라 탐지 가능 비트 수 s = 1.
- 예: C(5, 4) → k=4, n=5.

**Sender (Encoding) / Receiver (Decoding)**
```
[Sender]   data: a3 a2 a1 a0
           parity r0 = a3 ⊕ a2 ⊕ a1 ⊕ a0
           codeword: a3 a2 a1 a0 r0
[Receiver] 수신: b3 b2 b1 b0 q0
           syndrome s0 = b3 ⊕ b2 ⊕ b1 ⊕ b0 ⊕ q0
[Decision] s0 == 0 → 정상(Accept, dataword 추출)
           s0 == 1 → 에러(Discard)
```

**예시 (dataword 1011 → codeword 10111)**

| 경우 | 수신 | syndrome | 결과 |
| --- | --- | --- | --- |
| 에러 없음 | 10111 | 0 | 정상 (1011) |
| 1비트(데이터) | 10011 | 1 | 에러 탐지 → 폐기 |
| 1비트(패리티) | 10110 | 1 | 에러 탐지 → 폐기 |
| 2비트 | 00110 | 0 | 정상처럼 보임 → **0011(틀림)**|
| 3비트 | 01011 | 1 | 에러 탐지 → 폐기 |

> ⇒ 패리티는 **홀수 개의 에러만**탐지할 수 있다(짝수 개는 syndrome이 0으로 돌아와 놓침).

### Two-Dimensional Parity Check Code (2차원 패리티 검사 코드)
- 데이터를 표(행·열)로 구성 → **행마다 parity, 열마다 parity**계산. 수신자는 각 행/열의 syndrome을 계산.
- 행·열 교차점으로 오류 **위치 추정 및 복구**가 가능한 경우가 있다(불가능한 경우도 존재).

| 오류 수 | 결과 |
| --- | --- |
| 1개 | 위치까지 찾기 가능 |
| 2개 | 탐지 가능 |
| 3개 | 탐지 가능 |
| 4개 | 탐지 실패 가능 |

### Hamming Codes (해밍 코드)
- **d_min = 3**으로 설계 → **2비트 detection**또는 **1비트 correction**가능.
- 정수 m ≥ 3 선택 → **n = 2^m − 1**, **k = n − m**, 체크 비트 수 **r = m**.
- 동작: data → parity 생성 → 전송 → syndrome 계산 → 위치 찾기 → 해당 비트 뒤집기 → data 복구. ("syndrome으로 오류 위치를 찾아 그 비트를 뒤집는 구조".)

**패리티 / 신드롬 계산식 (modulo-2)**
```
[Sender]   r0 = a2 + a1 + a0
           r1 = a3 + a2 + a1
           r2 = a1 + a0 + a3
[Receiver] s0 = b2 + b1 + b0 + q0
           s1 = b3 + b2 + b1 + q1
           s2 = b1 + b0 + b3 + q2
```
- *패리티* = 송신자가 데이터 일관성을 맞추려 추가하는 비트(오류 판단 기준). *신드롬* = 수신자가 계산한 오류 상태 값(0이면 정상, 0이 아니면 어디에 오류인지 가리킴).

**예시 (dataword a3a2a1a0 = 1011)**
- r0 = a2⊕a1⊕a0 = 0⊕1⊕1 = **0**
- r1 = a3⊕a2⊕a1 = 1⊕0⊕1 = **0**
- r2 = a1⊕a0⊕a3 = 1⊕1⊕1 = **1**
- 코드워드 [a3 a2 a1 a0 r2 r1 r0] = **1 0 1 1 1 0 0**
- 수신 = 1 0 0 1 1 0 0 (세 번째 비트 오류) →
 - s0 = b2⊕b1⊕b0⊕q0 = 0⊕1⊕0⊕0 = **1**
 - s1 = b3⊕b2⊕b1⊕q1 = 1⊕0⊕1⊕0 = **0**
 - s2 = b1⊕b0⊕b3⊕q2 = 1⊕0⊕1⊕1 = **1**
 - syndrome s2 s1 s0 = **101**(2진) = **5**(10진) → **5번 비트 오류**→ 그 비트를 뒤집어 복구.

---

## Cyclic Codes (순환 코드)
- **codeword를 순환 이동(회전, shift)해도 valid codeword가 유지되는**특별한 선형 블록 코드.
 - 일반 선형 블록 코드는 XOR만 보장, 순환 코드는 **XOR + shift**모두 보장.
 - 예: 1011 → 1101 → 1110 → 0111 (모두 valid).

### Cyclic Redundancy Check (CRC)
- 순환 코드를 다항식 나눗셈에 적용한 것. LAN/WAN 등 네트워크에서 널리 사용.
- **이진 나눗셈(XOR division)**기반:
 - 송신자: 데이터 뒤에 **0들(divisor 길이 − 1 만큼)**을 붙여 나눗셈 → 나머지(remainder)를 CRC로 사용.
 - 수신자: (data + CRC) ÷ divisor → **나머지 0이면 정상(수용), 0이 아니면 거부**.
- 조건: ① CRC는 divisor보다 정확히 **1비트 짧다**. ② (data + CRC)는 divisor로 정확히 나누어 떨어져야 한다.

**예시 (data = 1001, divisor = 1011)**
```
1. 0 붙이기:   1001 → 1001000   (divisor 길이-1 = 3개)
2. XOR 나눗셈: 1001000 ÷ 1011 → remainder = 110
3. 전송:       codeword = 1001 110
4~5. 수신/검사:
   정상:   1001110 ÷ 1011 → remainder = 000  (정상)
   비정상: 1000110 ÷ 1011 → remainder = 011  (에러 → 버림)
```

**다항식(polynomial) 표현**
- 비트를 다항식으로: `1011` → x^3·1 + x^2·0 + x^1·1 + x^0·1 = **x^3 + x + 1**.
- 흐름: Dataword → polynomial 변환 → **x^r 곱하기(0 추가)**→ generator polynomial g(x)로 나눔 → remainder 계산 → codeword = data + remainder.
- 왼쪽 시프트 = **x를 곱함**(차수 1↑). 예: 1011 → 10110.
- Cyclic shift = **x·c(x) mod (x^n − 1)**→ 결과도 codeword. c(x) ∈ codeword ⇒ x·c(x) mod (x^n−1) ∈ codeword.

**CRC 동작 분석**
- divisor = 생성 다항식 **g(x)**(generator).
- 수신 코드워드 = C(x) + e(x). syndrome s(x) ≠ 0 이면 비트 손상.
 - s(x) = 0 이면 ① 손상 없음 **또는**② 손상됐지만 탐지 못한 것.
 - **g(x)로 나누어 떨어지는 오류 다항식 e(x)는 탐지되지 않는다**→ CRC 성능은 **g(x) 선택**에 달려 있다.

**CRC의 장점**
1. 단일/이중/홀수 개/버스트 오류 탐지에 매우 우수. 2. 하드웨어·소프트웨어 구현 쉬움(특히 하드웨어에서 매우 빠름). 3. 속도 빠름. 4. 실전에서 많이 사용.

---

## Checksum (체크섬)
- 인터넷의 여러 프로토콜이 사용하지만 **데이터 링크 계층에서는 사용하지 않는다**(점점 CRC로 대체되는 추세).
- redundancy 기반, **데이터를 더해서 만든 검증값**. 단순 계산이지만 CRC보다 약하다.
- 송신: data → 전부 더함 → **보수(complement)**→ checksum 생성 → data + checksum 전송.
- 수신: data + checksum 을 다시 더해 **결과가 모두 1이면 정상**.

**예시 (1의 보수 산술)**
- 보낸 데이터: 10101001 00111001 / 받은 데이터: 10101001 00111000 (1비트 변경)
```
1. 데이터 더함:  10101001 + 00111001 = 11100010
2. 보수(뒤집기): 11100010 → 00011101   ← 이것이 checksum
3. data + checksum 전송
4. 수신 측 합산:
   10101001
   00111001
   00011101
   ---------
   11111111   → 모두 1이면 성공
```
> ⇒ Checksum = 데이터를 더해 "합이 일정하게 유지되도록 만든 값"을 보내고, 수신자가 그 합 유지를 확인하는 방식.
- 전통적으로 인터넷은 **16비트 체크섬**을 1의 보수 산술로 사용(n비트로 0 ~ 2^n − 1 표현).

## 핵심 정리 (시험 포인트)
- 에러 종류: single-bit(1비트) vs burst(2비트+). 탐지/수정은 L2·L4에서, 핵심 개념은 **redundancy**, 코딩 연산은 **modulo-2 = XOR**.
- 블록 코딩: n = k + r, valid codeword 2^k개. 탐지 조건 **d_min ≥ s + 1**, 수정 조건 **d_min ≥ 2t + 1**.
- Hamming distance = XOR 후 1의 개수. 선형 블록 코드의 d_min = **0이 아닌 최소 1의 개수**(코드워드 XOR가 닫혀 있음).
- 단순 패리티: n=k+1, **d_min=2, 홀수 개 에러만 탐지**. 2차원 패리티: 행·열 parity로 최대 3개 탐지·1개 위치 복구.
- Hamming code: **d_min=3**→ 1비트 수정/2비트 탐지, n=2^m−1·k=n−m, syndrome 값(2진→10진)이 오류 비트 위치를 가리킨다.
- Cyclic/CRC: shift해도 valid. **나머지=0이면 정상**, 비트→다항식, 성능은 **generator g(x)**에 달림. Checksum: 합+보수, 수신 시 합이 전부 1이면 정상(L2 미사용, CRC보다 약함).
