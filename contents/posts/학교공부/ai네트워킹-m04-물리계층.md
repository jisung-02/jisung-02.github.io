---
title: "Physical Layer: Bandwidth Utilization"
date: 2026-06-20
publish: true
category: "AI네트워킹"
tags: ["AI네트워킹"]
description: "특정 목표를 달성하기 위해 사용 가능한 대역폭을 현명하게 사용하는 것."
---

> AI 네트워킹 **중간**범위 — 노션 강의 노트를 옵시디언용으로 정리한 노트.
> [← 전체 목차](/posts/ai네트워킹-목차/)

## Bandwidth Utilization (대역폭 활용)
- 특정 목표를 달성하기 위해 사용 가능한 대역폭을 **현명하게 사용**하는 것.
- 두 가지 목표와 기법:
 1. **효율(efficiency)**→ **Multiplexing**(같은 대역폭을 여러 개로 나눠 사용).
 2. **보안/안정성(privacy·anti-jamming)**→ **Spreading**(신호를 더 넓은 대역에 퍼뜨림).

## Multiplexing (멀티플렉싱)
- 하나의 물리 링크를 여러 채널로 나눠서 동시에 여러 신호를 전송하는 기술의 집합.
- **link**= 물리적 경로(선), **channel**= 두 라인 사이 전송을 수행하는 링크의 일부(논리적 단위).
- 구성: 입력(n개) → **MUX(멀티플렉서, 다수→하나)**→ 하나의 링크 → **DEMUX(디멀티플렉서, 하나→다수)**→ 출력(n개).
- 물리선은 하나인데 여러 데이터를 동시에 보내고 싶을 때 사용.

| 종류 | 기준 | 신호 | 사용처 |
| --- | --- | --- | --- |
| **FDM**(Frequency Division) | 주파수 대역 | 아날로그 | 라디오/케이블 등 |
| **WDM**(Wavelength Division) | 파장(λ) | 아날로그(광) | 광섬유 (FDM의 광 버전) |
| **TDM**(Time Division) | 시간 슬롯 | 디지털 | 디지털 데이터 |

- 주파수/파장은 연속값 → 아날로그, 시간 슬롯은 끊어 처리 → 이산적(디지털).

## FDM (Frequency Division Multiplexing)
- 아날로그 신호들을 결합하는 **아날로그 멀티플렉싱**기술.
- 각 채널은 서로 다른 **carrier frequency(반송 주파수)**대역을 사용.
- **Multiplexing 과정**: 비슷한 주파수 대역의 신호들을 각각 다른 carrier로 **변조(이동)**→ 서로 겹치지 않게 분리 배치 → 합침(composite signal). `shift → combine`
- **Demultiplexing 과정**: 합쳐진 신호를 주파수별 **필터로 분리**→ carrier 제거해 baseband로 복원. `filter → shift back`
 - **Demodulation**= carrier 제거해 원래 baseband 신호로 복원하는 과정.
- 전체 흐름: **shift → combine → filter → shift back**.

### Carrier (반송파) 용어
- 정보를 직접 담지 않는 기본 파형으로, 신호를 실어 전달하는 역할 (보통 고주파 사인파). 정보(signal) + carrier → 전송 가능한 신호.
- (참고) CSMA에서 Carrier는 "현재 채널에 신호가 흐르는 상태"를 뜻함.

### FDM 예제 6.1
- 음성 채널 1개 = 4 kHz, 채널 3개를 20~32 kHz(총 12 kHz) 링크로 결합, 가드밴드 없음.
- 배치: ch1 → 20~24, ch2 → 24~28, ch3 → 28~32 kHz. ⇒ 각 채널을 **겹치지 않게 연속 배치**.

### FDM + QAM 예제
- 각 채널: 1 Mbps 디지털 → **16-QAM**→ 250 kHz 아날로그. 총 4채널 → 250 kHz × 4 = **1 MHz**.
- FDM은 아날로그 기반이라 디지털 신호는 변조가 필요 → QAM으로 아날로그화 후 FDM 결합.
- **QAM (Quadrature Amplitude Modulation, 직교 진폭 변조)**: 진폭 + 위상을 동시에 사용 → 한 심볼에 여러 비트.
 - **16-QAM**= 16개 신호 상태 = log₂(16) = **4 bit/symbol**→ 1 Mbps ÷ 4 = 250 ksymbol/s → 대역폭 ≈ 250 kHz.
 - ⇒ 신호의 "상태 개수"를 늘려 전송 효율(대역폭 효율) 증가.

### FDM 응용: 케이블 TV
- 동축 케이블 ≈ 500 MHz, TV 채널당 ≈ 6 MHz → 500 / 6 ≈ **83개 채널**(이론적).

### 아날로그 계층 구조 (FDM 반복 적용)
- 낮은 대역폭 신호들을 더 높은 대역폭 라인으로 계층적으로 묶어 인프라 효율 극대화.

| 단계 | 묶음 | 채널 수 | 대역폭 |
| --- | --- | --- | --- |
| Group | 12 채널 (4kHz×12) | 12 | 48 kHz |
| Supergroup | 5 Groups | 60 | 240 kHz |
| Master group | 10 Supergroups | 600 | 2.52 MHz |
| Jumbo group | 6 Master groups | 3600 | 16.984 MHz |

- ⇒ FDM을 **계층적으로 반복 적용**해 작은 단위를 큰 대역으로 확장.

## WDM (Wavelength Division Multiplexing)
- 개념적으로 FDM과 동일하나, **광섬유로 전달되는 빛 신호**를 사용 (FDM의 광 버전).
- 주파수 대신 **파장(λ)**으로 구분 → 서로 다른 파장의 빛을 동시에 전송. (주파수와 파장은 반비례, 동일 개념.)
- 좁은 대역의 빛(채널) 여러 개를 합쳐 하나의 넓은 빛으로 → 하나의 광섬유로 전송 → 수신 측에서 분리. 파장이 다르면 서로 간섭하지 않음.
- **물리 구현**: 프리즘(또는 광학 필터)이 입사각·주파수에 따라 빛을 다르게 굴절 → 결합/분리. 응용 예: **SONET**.

## TDM (Time Division Multiplexing, 시간 분할)
- **디지털**멀티플렉싱: 매체의 전송 용량이 개별 장치 요구 전송률보다 클 때 적용.
- 여러 **저속 채널을 하나의 고속 채널**로 결합 (링크 속도 > 개별 채널 속도).
- 시간을 쪼개 여러 신호를 번갈아 전송 → 빠르게 보내면 동시에 보내는 것처럼 보임.
- 두 가지 방식: **① Synchronous TDM ② Statistical TDM**.

### Synchronous TDM (동기식)
- 링크 데이터 속도는 n배 빠르고, 각 단위 시간은 n배 짧다.
- n개 채널 → n개 **고정 시간 슬롯**으로 나눔. 송신은 슬롯 순서대로, 수신은 같은 순서로 → **시간 동기화 필요**.
- **프레임**= 모든 채널의 슬롯 묶음.
- **Interleaving(인터리빙)**: 빠르게 회전하는 스위치처럼 각 채널 데이터를 번갈아 끼워 넣는 과정 (A→B→C→A→B→C…). MUX/DEMUX 스위치는 동기화되어 같은 속도, 반대 방향으로 회전.
- **Empty Slots(빈 슬롯)**: 보낼 데이터가 없는 소스의 슬롯은 비게 됨 → **슬롯 낭비**(동기식의 문제). ⇒ 해결: Statistical TDM.

**Synchronous TDM 보조 기법:**
- **Multilevel TDM(다단계)**: 입력 속도가 다른 라인의 배수일 때, 작은 것끼리 먼저 묶어 큰 것과 속도를 맞춤. 예: 20+20→40, … 40×4→160 kbps.
- **Multiple-slot allocation**: 빠른 채널에 슬롯 여러 개 할당. 예: 50 kbps → 슬롯 2개(직렬-병렬 변환기로 분할), 25 kbps → 슬롯 1개. ⇒ 속도 비율만큼 슬롯 배정.
- **Pulse stuffing(= bit padding/stuffing)**: 소스 속도가 정수 배가 아닐 때, 가장 빠른 속도에 맞춰 느린 라인에 **dummy bit**추가. 예: 50·50·46 → 46을 50으로 → 총 150 kbps.
- **Framing synchronization(프레임 동기화)**: MUX·DEMUX가 동기화 안 되면 비트가 다른 채널로 잘못 수신됨. 각 프레임 시작에 **sync bit**(프레임당 1비트, 0·1 교대 `101010…`)를 추가해 슬롯 경계를 정확히 분리.
 - 오버헤드 예: 250 frame/s × 1 bit = **250 bps**(채널당 2000 bps × 4채널 + 동기화 250 bps).

### DS (Digital Signal) Service & T-1
- 디지털 신호의 계층 구조. 장점: 아날로그보다 **노이즈에 덜 민감, 저비용**.
- DS-0 = 전화 1개. **T-line = 실제 물리 회선 이름, DS = 논리 신호 구조.**

| 등급 | 속도 |
| --- | --- |
| DS-0 | 64 kbps |
| DS-1 | 1.544 Mbps |
| DS-2 | 6.312 Mbps |
| DS-3 | 44.376 Mbps |
| DS-4 | 274.176 Mbps |

**T-1 프레임 구조 (PCM + TDM + framing):**
1. 음성 → PCM → 8000 sample/s × 8 bit = **64 kbps (DS-0)**.
2. **24개 채널**→ TDM → DS-1.
3. 1 프레임 = 24 × 8 bit + **1 sync bit**= **193 bits**.
4. 8000 frame/s × 193 = **1.544 Mbps**(T-1).

### Statistical TDM (통계적)
- 슬롯을 **동적으로 할당**해 대역폭 효율 향상. **데이터가 있는 라인만**전송 → 빈 슬롯 없음.
- 대신 식별 이슈 발생 → **주소(식별자)**필요.
- **Addressing**: 슬롯 = **데이터 + 주소**. n 비트로 N개 출력 라인 정의 → **n = log₂ N**.
- **동기화 비트 없음**: 프레임을 동기화할 필요가 없어 sync bit 불필요.
- '통계적'인 이유: 동시 활성 채널 수가 확률적으로 변하므로 평균/분포(통계)에 의존해 용량을 잡음.

### 교수님 보조 설명
- **PCM**: 음성을 디지털로 변환하는 기술.
- **E-1**: 여러 PCM 채널을 묶은 디지털 전송 라인 (유럽 방식).
- **DSU(Data Service Unit)**: 여러 데이터를 하나의 회선으로 보내는 장치 (내부적으로 멀티플렉싱 사용).
- **Delta modulation**: 신호의 절대값이 아니라 **변화량만 전송**→ 데이터 압축 효과(전송량 절감).

---

## Spread Spectrum (스펙트럼 확산)
- 서로 다른 소스의 신호를 **더 큰 대역폭**에 맞도록 결합. 목표: **도청·재밍 방지(보안 + 간섭 저항)**.
- 이를 위해 **중복성(redundancy)**추가 → 같은 정보를 여러 방식으로 반복 → 노이즈에도 복구 가능.
- ⇒ **효율성을 포기하고 보안성을 얻는 것**(넓게 퍼뜨리면 특정 주파수 공격에도 영향 적음).
- 두 가지 원칙:
 1. 각 스테이션은 필요한 것보다 **더 넓은 대역폭**사용.
 2. 확산 과정은 신호가 **생성된 이후**에 수행.
- 모든 사용자가 같은 대역을 공유하면서 **spreading code**로 구분.

### FHSS (Frequency Hopping Spread Spectrum)
- 여러 개의 서로 다른 반송 주파수를 사용 → 한 순간엔 한 주파수, 다음 순간엔 다른 주파수로 **계속 점프(hopping)**.
- **k-bit**: 주파수 테이블에서 사용할 주파수를 선택하는 코드 (비트 값 → 특정 주파수). hopping sequence = 그 선택 값들의 **시간 순서**.
- 수신자가 동일한 hopping sequence와 타이밍을 모르면 신호 자체를 받을 수 없음 → 보안.
- **Bandwidth Sharing**: 호핑 주파수가 M개면, 같은 Bss 대역폭으로 M개 채널을 멀티플렉싱 가능 (FHSS를 이용한 멀티플렉싱). FDM은 동시에 다른 대역 사용, FHSS는 시점마다 주파수를 바꿔가며 사용.

### DSSS (Direct Sequence Spread Spectrum)
- 각 **데이터 비트를 n개의 비트(chip)**로 대체 → 칩 속도 = 데이터 속도의 n배.
- 데이터 비트에 **spreading code를 직접 곱함**(비트 × 코드 = 확산 신호).
- 과정: 원래 비트(예: 1,0,1) → spreading code 적용(예: 10110111000 곱함) → 각 비트가 여러 chip으로 변환.
- 이름 풀이: Direct(직접) + Sequence(비트열·코드) + Spread Spectrum(스펙트럼 확산).

## 핵심 정리 (시험 포인트)
- 대역폭 활용 2목표: **효율 → Multiplexing**, **보안/안정성 → Spreading**.
- 멀티플렉싱 3종: **FDM(주파수·아날로그), WDM(파장·광, FDM의 광 버전), TDM(시간·디지털)**.
- FDM 흐름 = **shift → combine → filter → shift back**, Demodulation = carrier 제거. 16-QAM = log₂16 = **4 bit/symbol**.
- **Synchronous TDM = 고정 슬롯·sync bit·빈 슬롯 낭비**vs **Statistical TDM = 동적 슬롯·주소(n=log₂N) 사용·동기화 비트 없음**.
- **T-1 = PCM(64kbps DS-0)×24 + 1 sync = 193 bit/frame × 8000 = 1.544 Mbps.**T-line은 물리 회선, DS는 논리 신호.
- Spread Spectrum은 효율을 포기하고 보안(도청·재밍 방지)을 얻음. **FHSS = 주파수 점프(hopping sequence), DSSS = 1비트를 n개 chip으로 확산.**
