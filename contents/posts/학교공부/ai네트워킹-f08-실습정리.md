---
title: "실습 - 시험 핵심개념 정리"
date: 2026-06-20
publish: true
category: "AI네트워킹"
tags: ["AI네트워킹"]
description: "이상(Anomaly)의 정의: '다른 메커니즘에 의해 생성된 것으로 보이는 관측치(observation)'. 즉 나쁜(bad) 행위가 아니라 정상 범위(nor…"
---

> 실습 3개(이상탐지 · 연합학습 · SYN Flood 탐지)에서 **시험에 나올 법한 개념과 방법론**만 추려 한 곳에 정리했습니다.
> 환경설치·코드 실행 순서 등 실습 절차는 제외했습니다. (슬라이드 직역본은 별도 강의 노트 참고)
> [← 전체 목차](/posts/ai네트워킹-목차/)

## 한눈에 비교

| | 실습 1 이상탐지 | 실습 2 연합학습 | 실습 3 SYN Flood 탐지 |
|---|---|---|---|
| **목표** | 정상 벗어난 패턴 탐지 | 데이터 안 모으고 분산 학습 | 실시간 DoS 공격 탐지 |
| **방법론** | 오토인코더(비지도) | FedAvg 라운드 집계 | eBPF 캡처 + ML 분류 |
| **데이터셋** | KDD99 | KDD99 (클라이언트 분산) | CIC-DDoS2019 |
| **모델** | Autoencoder | (각 클라이언트 로컬모델) | Random Forest |
| **핵심 원리** | 재구성 오차 ↑ = 이상 | 가중치만 주고받음 | half-open 누적 = 자원고갈 |
| **평가** | Valid Detection Rate | (이상탐지 정확도) | Precision/Recall/F1 |

> 참고: 실습 1·2는 모두 **KDD99 이상탐지**를 다루며, 실습 2는 그 이상탐지를 **연합학습 방식**으로 분산 수행하는 버전이다.

---

## 실습 1 — 이상 탐지 (Anomaly Detection)

> 출처: 11-1-1 실습 - AnormalyDetection-Lab.pdf (오토인코더 기반 네트워크 이상탐지), 보조: _notion_notes/11-2.md

### 핵심 개념
- 이상(Anomaly)의 정의: "다른 메커니즘에 의해 생성된 것으로 보이는 관측치(observation)". 즉 **나쁜(bad) 행위가 아니라 정상 범위(norm)를 벗어난(out of norm) 행위**다. (= 공격뿐 아니라 평소와 다른 패턴 전반)
- 왜 중요한가: 네트워크 기술 발전으로 데이터의 크기·종류가 급증 → 위협이 점점 복잡하고 구분하기 어려워짐.
- 이상탐지 접근 분류:
  - **Supervised (레이블이 있을 때)**: 예) XGBoost
  - **Unsupervised (레이블이 없을 때)**: 예) Autoencoder, GAN(Generative Adversarial Networks)
  - → 본 실습의 주 초점은 **Autoencoder (비지도)**.
- 오토인코더(Autoencoder):
  - 비지도 학습의 한 형태. 이상탐지 외에도 응용됨.
  - **Encoder + Decoder** 두 부분으로 구성.
    - Encoder: 입력을 더 낮은 차원(latent space, 병목)으로 매핑하는 신경망
    - Decoder: 압축된(encoded) 데이터를 다시 원래 입력으로 복원하는 신경망
  - 핵심 직관: **이상치는 재구성 오차(reconstruction error)가 크다.** 오차가 클수록 입력이 기존 데이터의 추세(trend)를 따르지 않는다는 뜻 → 이상으로 판단.

### 방법론 / 파이프라인
- **데이터셋: KDD99 Intrusion Detection Dataset**
  - 목적: 네트워크 패킷 로그를 관찰해 이상을 탐지.
  - 규모: 743MB, 약 1800만 행, 23개 클래스(정상 포함).
  - 피처: 수치형(Numeric) 22개 + 범주형(Categorical) 9개. (Basic / Content / Traffic 특징군으로 구분)
- **전처리 (preprocess_data.py)**
  - 범주형(categorical) 피처는 DNN에 바로 못 넣음 → 인코딩 필요.
  - **LabelEncoder**: 범주형 데이터(레이블)를 정수로 매핑 (normal→0, back→1 ...).
  - **One-hot encoding**: 범주형 피처를 카테고리별 컬럼으로 분리해 0/1 이진값으로 표현. (예: service → service_X11, service_auth ... 각각 1개만 1)
  - **Train/Test split**: 무작위 분할, 테스트 비율 선택 가능(코드에서 25%).
  - 전처리된 데이터를 저장해 재사용.
- **정규화 (main.py)**
  - 오토인코더의 안정적 학습을 위해 모든 데이터를 **0~1로 스케일링**(Normalize).
  - 이유: 이상 데이터가 정상에서 너무 멀리 떨어져 있으면 데이터 표현(representation)을 방해하기 때문.
- **모델 구조 (Autoencoder, Keras)**
  - Encoder: 점점 작아지는 dense 층으로 병목(latent)까지 축소. 96 → 64 → 48 → 16 (활성화 tanh, 중간중간 Dropout(0.1)).
  - Bottleneck(latent): `Dense(latent_dim, activation='linear')` — 저차원 잠재 표현.
  - (보조 메모) 실습 규모: **약 114차원 입력 → latent 4차원 → 복원**.
- **학습**
  - 핵심: `fit(x_train, x_train, ...)` — **입력과 정답(target)이 동일**. 모델이 입력 자신을 재구성하도록 학습.
  - 정상 데이터로만 학습하는 이유: 오토인코더가 "정상의 표현"만 익히게 하면, 공격/이상 데이터가 들어왔을 때 잘 복원하지 못해 **reconstruction error가 커짐** → 이상 구분이 가능. (보조 메모 기준)
  - 학습 검증: training history(Loss) 그래프가 **수렴(converge)** 하면 학습이 진행된 것. **reconstruction loss가 점차 감소 = 모델이 데이터 표현을 재구성할 수 있게 됨.**
- **검증/평가 (main.py)**
  - **Confusion matrix**로 평가. 클래스는 **['Normal', 'Anomaly']** 2종.
  - True Label과 Predicted Label이 일치해야 좋은 성능(대각선=정답, 비대각선=오답).

### 평가 지표
- **Confusion matrix (혼동행렬)**: 행=True Label, 열=Predicted Label. 대각선이 맞춘 것(Correct), 나머지가 틀린 것(Wrong). TP/FP/TN/FN 구조.
- **Valid Detection Rate (유효 탐지율)** — 본 실습에서 사용한 지표:
  - 식: `(TP + TN) / 전체` = 맞게 분류된 개수 / 전체 개수 (= 정확도 개념)
  - 실습 결과 예: (243,073 + 2,221) / 245,627 = 245,294 / 245,627 = **0.9986 ≈ 99.86%**

### 시험 포인트
- 이상(anomaly)의 정의 = "다른 메커니즘에서 생성된, 정상 범위를 벗어난 관측치". **bad가 아니라 out-of-norm**임을 강조.
- 지도 vs 비지도 이상탐지 분류, 그리고 각 예시(XGBoost / Autoencoder / GAN). 본 실습은 비지도-오토인코더.
- 오토인코더 = Encoder(차원 축소) + Decoder(복원), **이상치는 reconstruction error가 크다**는 핵심 원리.
- **정상 데이터로만 학습하는 이유**(정상 표현만 학습 → 이상은 복원 실패 → 오차 증가)는 출제 가능성 높음.
- `fit(x_train, x_train)` — 입력=정답으로 자기 자신을 재구성하는 비지도 학습이라는 점.
- 전처리에서 범주형 처리: LabelEncoder(정수 매핑) vs One-hot encoding(이진 컬럼 분리)의 차이.
- 0~1 정규화의 이유(안정적 학습 + 멀리 떨어진 이상치가 표현을 방해하지 않도록).
- Loss 곡선이 수렴 = 학습 정상 진행, reconstruction loss 감소의 의미.
- Confusion matrix 해석과 Valid Detection Rate = (TP+TN)/전체 계산.
- (확장) 보조 메모: eBPF로 캡처한 패킷이 정상인지 판단하는 데까지 연결되며, ping/TCP SYN 공격 탐지로 확장하려면 데이터를 수정해야 함.

---

## 실습 2 — 연합 학습 (Federated Learning)

> 출처: "11-2-1 실습 - federated learning_실습" PDF (이상탐지용 FL 실습). 보조: 11-2 강의/녹취 노트.

### 핵심 개념
- **연합학습(Federated Learning)**: 각 디바이스(클라이언트)가 가진 데이터를 서버로 전송하지 않고, 데이터가 있는 현장에서 직접 모델을 학습시키는 분산 학습 기법.
  - 원본 데이터(raw data)의 외부 노출을 원천 차단한다.
  - 학습된 **로컬 가중치(local weights)만** 서버로 전송되어 집계(aggregation)된다.
  - 통신 비용이 줄고, 실시간 학습이 가능하다.
- **왜 쓰는가 (도입 이유)**:
  1. **Privacy** — 프라이버시/법적 제약으로 데이터를 한곳에 모을 수 없을 때.
  2. **Efficiency** — 데이터를 옮기지 않고 파라미터만 주고받으므로 통신 오버헤드/저장 비용 감소.
  3. **Scalability** — 엣지(edge) 디바이스 단위 학습 가능.
  4. **Collaboration** — 여러 주체의 협업 학습.
- **클라이언트 / 서버 역할 (중요)**:
  - 서버: 모델 구조(아키텍처)를 정의·배포하고, 수집한 로컬 가중치를 **집계(평균)** 만 한다. 서버는 직접 학습하지 않는다 (← 스플릿 러닝과의 핵심 차이).
  - 클라이언트(엣지 노드): 자기 로컬 데이터로 실제 학습을 수행하고 가중치를 업로드한다.
- **이 실습의 도메인 — 이상탐지(Anomaly Detection)**: 다수 데이터의 일반적 특성에서 크게 벗어나는 드문 케이스를 식별. 다차원 데이터의 통계 분포 분석을 통한 패턴 인식. 금융 사기, 시스템 장애, 보안 침입 탐지에 주로 사용. (실습 데이터셋: KDD99)

### 방법론 / 학습 라운드 흐름
1. **서버가 글로벌 모델 배포**: 서버가 모델 아키텍처를 정의하고 각 클라이언트에 글로벌 모델을 내려보낸다.
2. **로컬 학습(local update)**: 각 클라이언트가 자기 로컬 데이터로 모델을 학습한다 (1 라운드 = 보통 1 에폭 단위).
3. **파라미터 업로드**: 데이터가 아니라 학습된 **로컬 가중치(파라미터)만** 서버로 전송한다.
4. **서버 집계(global aggregation)**: 서버가 받은 가중치들을 (가중)평균하여 새 글로벌 모델을 만든다.
5. **반복(round)**: 갱신된 글로벌 모델을 다시 배포 → 2~4 반복. 매 라운드 데이터는 절대 전송하지 않는다.
- **FL 구조 두 가지**:
  - **Centralized FL**: 중앙 서버 1개가 여러 클라이언트의 파라미터를 취합·평균. (실습은 이 방식)
  - **Decentralized FL**: 서버 없이 P2P. 토폴로지에 따라 ring(한 노드 정체 시 전체 지연), cluster(유사 노드 묶음), fully-connected(통신량 과다) 등 이슈.
- **non-IID 데이터**: 각 클라이언트의 데이터 분포가 서로 다른 상태(Non-Identical Distribution). 현실의 FL은 대부분 non-IID이며, 이로 인해 집계 결과가 흔들릴 수 있어 가중치 부여 등 보정이 필요하다.
- **실습 세션 절차(파이프라인)**:
  - 서버 유저와 클라이언트 유저가 **같은 네트워크(예: 동일 WiFi)와 ip:port** 를 사용해야 함.
  - 데이터 전처리: `prepare_kdd99.py` 실행 (KDD99 데이터셋 전처리).
  - 서버 실행: `server.py` (servers 디렉토리).
  - 클라이언트 실행: `client.py` (clients 디렉토리). 클라이언트는 yaml 파일의 IP/port를 자기 환경에 맞게 수정.
  - 평가: 학습 종료 후 저장된 체크포인트로 추론 (`infer_saved_model.py --checkpoint_path ... --split test`).

### 핵심 수식 / 집계 방식
- **FedAvg (가중 평균 집계)**: 서버는 각 클라이언트 가중치를 그 클라이언트가 보유한 데이터 양에 비례해 가중평균한다.
  - w_global = Σ_k (n_k / n) · w_k
    - w_k: 클라이언트 k의 로컬 가중치, n_k: 클라이언트 k의 샘플 수, n = Σ n_k (전체 샘플 수)
  - 데이터 양이 같으면 단순 평균 (예: 두 노드면 (w_0 + w_1)/2).
- **집계 보강 방법(개념)**:
  - Weighted Aggregation: 클라이언트 신뢰도/데이터 양에 가중치.
  - 암호화 기반: 파라미터 자체를 암호화해 전송.
  - 클러스터링: 유사 파라미터/분포끼리 묶어 집계.
  - Differential Privacy(차등 프라이버시): 전송 전 로컬 파라미터에 노이즈(주로 가우시안 분포)를 추가.
  - Sparse Aggregation: 중요한(변동 큰) 파라미터만 전송해 통신량 절감.

### 시험 포인트
- 연합학습의 핵심: **데이터는 안 보내고 파라미터(가중치)만 주고받는다.** → 프라이버시 보장 + 통신/저장 비용 절감.
- FL을 쓰는 이유 4가지: Privacy, Efficiency, Scalability, Collaboration.
- 라운드 흐름 순서(배포→로컬학습→가중치 업로드→서버 집계→반복)를 정확히 쓸 것.
- 서버는 **학습하지 않고 집계만** 한다 (스플릿 러닝은 서버도 학습 — 둘의 핵심 차이).
- FedAvg = 데이터 양에 비례한 가중평균 (n_k / n).
- non-IID = 클라이언트별 데이터 분포 불일치, FL의 대표적 과제.
- 주요 과제(Challenge): non-IID, aggregation, Communication Overhead/Bandwidth, Device Heterogeneity.

---

## 실습 3 — 실시간 SYN Flood 탐지 (Real-Time SYN Flood Detection)

> 출처: "12-2 실습 4 - RealTimeSYNFloodDetection_Lab" PDF

### 핵심 개념 (TCP 핸드셰이크 / 공격 원리)
- **TCP 3-way handshake**: 정상 연결은 SYN → SYN-ACK → ACK 3단계로 성립. 클라이언트가 SYN을 보내면 서버는 SYN-ACK으로 응답하고 ACK를 기다리며 해당 연결을 위한 자원(포트/큐 슬롯)을 예약한다.
- **SYN Flood 공격 원리**: 공격자가 다량의 SYN만 보내고 마지막 ACK를 보내지 않음 → 서버는 SYN-ACK을 보낸 뒤 ACK를 계속 기다리는 **half-open(반열림) 연결** 상태로 자원을 점유한 채 대기.
- **자원 고갈(왜 위험한가)**: 응답 없는 half-open 연결이 누적되면 서버의 연결 대기 큐(backlog)와 메모리가 가득 차 정상 사용자의 연결 요청을 받을 수 없게 됨 → 서비스 거부(DoS). PDF 다이어그램의 "Open port / Waiting for ACK / Connection exhausted"가 이 메커니즘.
- **5-Tuple / Flow**: 네트워크 흐름(flow)은 [Source IP, Destination IP, Source Port, Destination Port, Protocol] 5튜플을 공유하는 패킷들의 묶음. 탐지/분류의 기본 단위 (1 flow = 1 데이터 행).
- **eBPF**: 커널 소스 수정 없이 Linux 커널 내부에서 샌드박스화된 커스텀 프로그램을 실행하는 기술. 시스템 콜·네트워크 패킷 도착 같은 커널 이벤트에 hook으로 걸려 event-driven으로 동작 → 고속·저오버헤드 실시간 패킷 캡처에 활용.

### 탐지 방법론 / 파이프라인
- **전체 흐름 (Lab Overview 4단계)**: ① eBPF로 패킷 캡처 → ② Flow 구성(5튜플 기반 집계) → ③ ML 분류 → ④ 조치(rate limiting).
- **데이터셋(학습)**: CIC-DDoS2019 — flow 단위 로그에서 추출한 80여 개 통계 피처, 12종 DDoS 공격 벡터(SYN, UDP, LDAP, NetBIOS 등) 포함. Wireshark로 raw 트래픽 캡처 후 CICFlowMeter로 flow 피처 추출.
- **분류 모델**: **Random Forest** (결정 트리 앙상블, 다수결로 최종 예측). 재현성을 위해 random seed 고정.
- **전처리**: 문자열 라벨 → 이진(Syn=1, Benign=0) 변환, 피처/라벨 분리, inf/NaN → 0 치환, **min-max scaling으로 [0,1] 정규화**.
- **모델 저장**: model.pkl과 scaler.pkl 저장. scaler는 학습 데이터의 min/max를 보관 → 실시간 분류 시 동일 값으로 정규화해야 일관성 유지(중요 포인트).
- **실시간 탐지 구조(detect/main)**: 커널의 eBPF 프로그램이 패킷마다 호출되어(IPv4·TCP가 아니면 drop, TCP 플래그를 1바이트로 패킹) **perf buffer(BPF_PERF_OUTPUT)** 로 유저 공간에 전달 → 유저 공간에서 양방향 flow 키로 flow_table 갱신(race 방지용 lock) → flow 단위 피처 계산 후 정규화 → 모델로 예측·확률 산출.
- **타이밍/스트리밍 처리**: perf buffer를 100ms마다 poll, 만료(expire) 루프를 백그라운드 스레드로 돌려 분류 완료된 flow를 flow_table에서 제거. SYN timeout 만료 후 flow를 ATTACK으로 분류.

### 탐지 지표 & 대응
- **분류에 쓰는 flow 피처(시험 주의)**:
  - ACK Flag Count: flow 내 TCP ACK 플래그가 설정된 패킷 수 (SYN Flood는 ACK가 거의 없어 핵심 신호).
  - Init Fwd Win Bytes: 정방향 첫 패킷이 광고한 TCP 수신 윈도우 크기.
  - Fwd Seg Size Min: 정방향 패킷 중 최소 세그먼트(페이로드) 크기.
  - Fwd IAT Total: 정방향 패킷 간 도착 간격(inter-arrival time) 총합.
  - Flow Duration: 첫 패킷~마지막 패킷까지 flow 전체 지속 시간(μs).
- **평가 지표**: Precision(공격으로 예측한 것 중 실제 공격 비율), Recall(실제 공격 중 탐지한 비율), F1-score(두 값의 조화평균), Support(클래스별 실제 샘플 수).
- **대응책(Take Action)**: 공격으로 판정된 flow에 **rate limiting** 적용. 실습 환경에선 iptables로 lo 인터페이스의 RST 패킷 DROP 후 탐지 실행.
- **검증 방식**: normal_flow.py(정상 트래픽) vs attack_flow.py(SYN Flood 트래픽)를 발생시켜 정상은 BENIGN, 공격은 SYN timeout 만료 후 ATTACK으로 분류되는지 확인.

### 시험 포인트
- SYN Flood = SYN만 보내고 ACK 미응답 → half-open 연결 누적 → backlog/메모리 고갈 → DoS. "ACK가 오지 않는다"가 정상 핸드셰이크와의 결정적 차이.
- 탐지 단위는 5튜플 기반 flow이며, 가장 변별력 있는 피처는 ACK Flag Count(공격 시 매우 적음).
- 분류기 = Random Forest(앙상블 다수결), 정규화는 min-max, 학습 때의 scaler를 추론에 그대로 재사용해야 함.
- eBPF: 커널 수정 없이 커널 내부에서 샌드박스 실행, 이벤트 기반 패킷 캡처 → 고속 실시간성 확보. 패킷은 perf buffer로 커널→유저 공간 전달.
- 평가 지표 정의(Precision/Recall/F1) 구분, 특히 Recall(놓치지 않는 능력)과 Precision(오탐 적음)의 의미.
- 대응은 탐지된 flow에 대한 rate limiting.
