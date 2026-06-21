---
title: "01. Introduction to AI Networking"
date: 2026-06-20
publish: true
category: "학교공부/AI네트워킹"
tags: ["AI네트워킹"]
description: "정의: AI 기술을 네트워크 시스템에 적용해 성능, 효율성, 관리성을 향상시키는 것."
---

> AI 네트워킹 **중간** 범위 — 노션 강의 노트를 옵시디언용으로 정리한 노트.
> [← 전체 목차](/posts/ain-overview/)

## AI 네트워킹이란 (네트워크를 위한 AI)
- **정의**: AI 기술을 네트워크 시스템에 적용해 성능, 효율성, 관리성을 향상시키는 것.
- AI 알고리즘, 머신러닝, 데이터 분석을 통해 네트워크 운영을 **자동화·최적화·보안**적으로 안전하게 하는 분야.
- AI로 네트워크를 운영하는 것 → **AIOps** (AI Operation).

### 네트워크 운영의 주요 요소
- **성능 (Performance)**: 지연(latency) 감소, 처리량(throughput) 증가, 패킷 손실 감소.
- **효율 (Efficiency)**: 같은 자원으로 더 많은 처리, 불필요한 트래픽 제거.
- **운영 (Operation)**: 사람이 하던 운영을 자동화 (장애 감지, 자동 복구, 정책 적용).

### 자동화·최적화·보안 예시
- **자동화**: ACL 등의 Config를 사람이 아닌 AI가 생성.
- **최적화**: AI가 트래픽을 분석해 분산 또는 혼잡을 제어.
- **보안**: AI가 공격을 탐지하여 대응 (예: DDoS 탐지).

## AI 네트워킹 분야의 주요 토픽
1. **엣지 컴퓨팅 (Edge Computing)**: 데이터 처리를 중앙이 아닌 가까운 엣지 노드에서 처리.
2. **연합 학습 (Federated Learning)**: 데이터를 모으지 않고 개별 학습 후 모델만 공유.
3. **자원 관리 (Resource Management)**: 네트워크 자원의 할당과 스케줄링.
4. **D2D Communication Network**: 디바이스 사이의 통신 (UE↔UE 연결).
5. **UAV Networks**: 드론 기반 네트워크 — 드론이 공중에서 연결되어 통신 시스템을 구축.
6. **Security Issues**: 이상 탐지, 침입 탐지 (IDS, Intrusion Detection System) 등.
7. **AI for 5G, 6G**: AI에 네이티브하게 운영되는 6G.

## AI 네트워킹의 핵심 개념 (6가지)
1. **Automation (자동화)**: 네트워크 설정·모니터링·트러블슈팅 같은 반복 작업을 AI가 자동화. (예: 로그·트래픽을 수집·분석해 자동으로 설정·정책 변경)
2. **Optimization (최적화)**: 네트워크 데이터를 분석해 성능 최적화, 지연 감소, 대역폭 이용율 향상. (예: 혼잡 회피를 위한 동적 라우팅)
   - **혼잡 제어 (Congestion control)**: 네트워크 전체의 과부하를 제어.
   - **흐름 제어 (Flow control)**: 통신 상대의 처리 속도에 맞추는 것.
3. **Predictive Analytics (예측)**: 잠재 문제를 발생 전에 미리 예측. (예: 이력 데이터로 하드웨어 오류·병목 예측)
4. **Security (보안)**: 트래픽 패턴 기반 실시간 공격 탐지·대응. (예: DDoS 식별·완화)
5. **Self-Healing Network (자가 복구 네트워크)**: 인간 개입 없이 문제를 찾고 수정해 스스로 복구. (예: 연결 실패 시 트래픽 재라우팅)
6. **Intelligent Traffic Management (지능형 트래픽 관리)**: 트래픽 중요도에 따라 우선순위 지정·관리해 **QoS** 향상.

## AI 네트워킹의 응용 분야
1. **Enterprise Network (기업용 네트워크)**: Wi-Fi 성능 최적화, 사용자 접속 관리, 안전한 연결 보장. (사람이 많아지면 Wi-Fi 불안정·접근 제어 어려움을 AI로 해결)
2. **Data Center**: 자원 할당 개선, 에너지 소비 감소, 확장성 향상. (예: AI-powered 냉각 시스템)
3. **Telecommunication (원거리 통신)**: 5G 고도화, 주파수 할당 관리, 고객 경험 개선.
   - **네트워크 슬라이싱 (Network Slicing)**: 하나의 5G 인프라를 서비스 특성에 따라 여러 가상 네트워크 슬라이스로 쪼개 사용하는 기술.
4. **IoT 네트워크**: 대규모 IoT 환경 관리·보안 강화. (예: 스마트 시티 센서의 AI 기반 이상 탐지)
5. **Cloud Networking**: 클라우드 자원 할당 최적화, 끊김 없는 연결성 보장. (예: AI 기반 부하 분산)
6. **Networking for ML (머신러닝을 위한 네트워킹)**: 대규모 AI 모델은 오버헤드가 큰 네트워크로 연결된 수많은 노드에서 실행. (예: 매 라운드 방대한 통신을 사용하는 연합 학습)

## AI 네트워킹의 이점
1. **효율성 향상**: 수작업 개입을 줄이고 운용을 효율화.
2. **성능 향상**: 자원을 최적화해 더 빠르고 신뢰성 있는 성능 제공.
3. **선제적 문제 해결**: 사용자에게 영향을 주기 전에 미리 예측·해결.
4. **비용 절감**: 자동화·최적화로 운영 비용 절감.
5. **확장성**: 증가하는 네트워크 요구에 쉽게 대응.

---

## AI 배경 지식 (Short Background)

### 1. 전통 소프트웨어 vs 머신러닝
| 구분 | 전통 프로그래밍 | 머신러닝 |
|---|---|---|
| 입력 | 데이터 + 프로그램 | 데이터 + 정답(Label) |
| 처리 | 명시적 규칙 기반 | 모델 학습 |
| 출력 | 결과 | 학습된 모델 |

- **핵심 차이**: 전통은 사람이 규칙을 정의, ML은 데이터로부터 규칙을 학습.

### 2. AI / ML / DL 관계
```
Artificial Intelligence
 └── Machine Learning
      └── Deep Learning
```
- 구성 요소: Expert System(Rule-based), Decision Tree, Perceptron, RNN, Deep RL 등.
- 흐름: **AI → ML → DL로 갈수록 데이터 의존성 증가 + 자동화 수준 증가.**

### 3. 머신 지능의 정의
- 다양한 데이터를 추출(process)·통합(integrate)하고 결론에 도달하면 머신 지능이 형성됨.
- 구성 요소: 데이터 추출 → 프로세스 통합 → 의사결정.

### 4. 뉴럴 네트워크 기초
| 생물학적 | 인공 |
|---|---|
| Dendrite (수상돌기) | Input |
| Synapse (시냅스) | Weight |
| Axon (축삭) | Output |
| Cell body (세포체) | Activation |

- 핵심 구조: `Input → Weight → Activation Function → Output`

### 5. 머신러닝 vs 딥러닝
- **머신러닝**: Feature extraction을 사람이 수행, 이후 모델이 분류.
- **딥러닝**: Feature extraction + classification을 모두 학습 → **End-to-End 학습 구조**.

### 6. 학습 방식 분류
- **Supervised (지도)**: 입력 + 정답(label). 예: 분류, 회귀.
- **Unsupervised (비지도)**: 정답 없음. 예: clustering.
- **Semi-supervised (준지도)**: 일부 라벨만 존재.
- **Self-supervised (자기지도)**: 데이터 자체에서 라벨 생성.

### 7. AI의 전환점: Backpropagation (역전파)
1. Forward Propagation
2. Loss 계산
3. Backpropagation (오차를 뒤로 전달)
4. Gradient Descent로 weight 업데이트
- **핵심**: 오차를 뒤로 전달하여 weight를 업데이트 → 딥러닝을 가능하게 만든 핵심 기술.

### 8. 딥러닝 동작 과정
- **모델 구성**: MLP, CNN, RNN, GAN 등 / Hyperparameter 설정(Layer 수, Unit 수, Cost function, Optimizer).
- **학습 (Training)**: Input=Data, Output=Label, 목표=Loss 최소화.
- **추론 (Inference)**: 실제 데이터 입력 → 학습된 weight 기반 결과 출력.

### 9. Overfitting (과적합) 문제
- **발생 조건**: 데이터 부족 / 모델 복잡도 과다.
- **결과**: Training 성능 ↑, Generalization(일반화) 성능 ↓.
- **해결**: 데이터 증가, Regularization, Dropout, Autoencoder / VAE.

### 10. CNN (이미지 처리)
- **문제**: 이미지를 1D vector로 변환 → feature 손실.
- **해결**: Convolution + Pooling.
- 구조: `Image → Convolution → Feature Map → Pooling → Classification`

### 11. Generative Model (GAN)
- **Generator**: 데이터 생성 / **Discriminator**: 진짜·가짜 판별.
- 두 모델이 경쟁하며 성능 향상 → 실제와 유사한 데이터 생성.

### 12. Reinforcement Learning (강화 학습)
- 환경과 상호작용하며 학습. 구성 요소: **State, Action, Reward**.
- 목표 기반 학습, 장기 보상 최적화.

### 13. Transformer
- **Self-Attention** 기반, 순차 데이터 관계 학습.
- 긴 거리 의존성 처리 가능, NLP 핵심 모델.

### 14·15. Federated Learning (연합 학습)
- **개념**: 분산 학습 방식, 데이터 공유 없이 학습.
- **특징**: Decentralization, Privacy 보호, 통신 비용 감소(파라미터만 공유).
- 구조: `Local Model → Parameter Upload → Aggregation → Global Model`
- **동작**: ① 클라이언트 로컬 학습 → ② 파라미터 서버 전송 → ③ 서버 aggregation → ④ 글로벌 모델 배포 → ⑤ 반복.

### 16. Deep Learning Taxonomy
- **Supervised**: CNN, RNN, LSTM, Transformer (이미지·NLP).
- **Unsupervised**: Autoencoder, Clustering.
- **Reinforcement**: DQN, PPO (게임, 자율주행).
- **기타**: Transfer Learning, Online Learning, Semi-supervised.

### 전체 구조 정리
```
AI
 ├── Rule-based
 └── Machine Learning
      ├── Supervised
      ├── Unsupervised
      ├── Reinforcement
      └── Deep Learning
           ├── CNN
           ├── RNN
           ├── Transformer
           └── GAN
```

## ✅ 핵심 정리 (시험 포인트)
- **AI 네트워킹 = AI를 네트워크에 적용해 성능·효율·운영(관리성)을 향상**시키는 것 → AI로 운영하면 **AIOps**.
- 핵심 개념 6가지: Automation, Optimization, Predictive Analytics, Security, Self-Healing, Intelligent Traffic Management.
- **혼잡 제어(네트워크 전체) vs 흐름 제어(상대 처리 속도)** 구분.
- 응용 분야: Enterprise, Data Center, Telecom(네트워크 슬라이싱), IoT, Cloud, Networking for ML.
- 전통 프로그래밍은 사람이 규칙 정의, **ML은 데이터로부터 규칙 학습** / **AI⊃ML⊃DL** (갈수록 데이터 의존·자동화 증가).
- 딥러닝 핵심 기술 = **Backpropagation + Gradient Descent + Neural Network**, 주요 문제 = **Overfitting**.
- 학습 방식: Supervised / Unsupervised / Semi-supervised / Self-supervised + Reinforcement.
- **Federated Learning**: 데이터를 모으지 않고 파라미터만 공유(프라이버시·통신비용 절감) — AI 네트워킹의 핵심 주제.
