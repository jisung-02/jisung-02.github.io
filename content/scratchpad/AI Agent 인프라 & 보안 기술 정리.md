# AI Agent 인프라 & 보안 기술 정리

> 대표님이 소개해주신 기술들

---

## 1. OpenFGA

**Zanzibar 기반 Fine-Grained Authorization 엔진**

- 구글의 Zanzibar 논문/기술 문서를 기반으로 재구현한 OSS 엔진
- 관계 그래프 기반 권한 판단 엔진 (ReBAC)
- 서버 형태 또는 SDK 형태로 제공
- CNCF Incubating 프로젝트
- https://openfga.dev/

---

## 2. AGNTCY

**Agent 간 협업 인프라 표준화 프로젝트**

- Cisco 주도, Linux Foundation 산하
- 등장 배경: 고립된 Agent 사이의 통신 방식이 표준화되지 않은 문제
- "Agent 간 인터넷"을 만들기 위한 인프라 컴포넌트 집합

### 4대 핵심 컴포넌트

| 컴포넌트 | 구현체 | 역할 |
|---|---|---|
| Agent Discovery | Directory / Registry / Schema | OASF 기반, 에이전트의 역할/기능 명세 |
| Agent Identity | SPIFFE / JWT / PKI | OAuth/JWT 기반 인증·권한 관리 |
| Agent Messaging | SLIM Protocol | 멀티모달, 보안, 저지연 메시징 |
| Observability | tracing / telemetry stack | 멀티 에이전트 작업 추적 |

### SLIM Protocol (Secure Low-Latency Interactive Messaging)

- gRPC + HTTP/2 or HTTP/3 + MLS 기반 메시징 스택
- OSI 7계층 기준 위치:
  ```
  IP → TCP/QUIC → HTTP/2 or HTTP/3 → gRPC → SLIM → A2A/MCP → Agent/LLM
  ```
- 내부 3계층 구조:
  1. **Data Plane** - 메시지 전달 및 라우팅
  2. **Session Layer** - E2E 암호화(MLS), group communication, reliability
  3. **Control Plane** - 노드 관리, 라우팅, 오케스트레이션

- https://agntcy.org/

---

## 3. Iroh

**Rust 기반 P2P 네트워킹 라이브러리**

- QUIC + NAT Traversal + E2E 암호화를 결합한 P2P 네트워크 라이브러리
  - QUIC: TLS, multiplexing 담당
  - NAT Traversal: 양측 모두 private network여도 연결 가능
  - E2E Encryption: peer 간 암호화 (중간 노드도 내용 불가)

- 기존 서버 방식의 문제점: 서버 필요 / 지연 증가 / 비용 발생 / 중앙 의존

- 주요 특징:
  1. Serverless Networking
  2. Outbound-Only 모델 (NAT hole punching 기반)
  3. Content-Addressed Transfer
  4. Multiplexing

- 개인 의문점:
  - QUIC이 TLS를 포함하는데 E2E가 필요한 이유 → TLS는 hop-by-hop, E2E는 별도 계층
  - 릴레이 서버 필요 여부 → 현실적으로 필요함 (P2P 한계)
  - 결론: 실질적으로 QUIC 기반 WebRTC와 큰 차이 없어 보임

- https://www.iroh.computer/

---

## 4. Datum

**네트워크를 Programmable Resource로 정의하는 플랫폼**

- 네트워크 구성을 코드로 정의 → AI 네이티브한 접근 방식
- 3계층 구조:
  1. **Control Plane** - K8s 기반, kubectl 방식으로 네트워크 정의 (IaC)
  2. **AI Edge** - Envoy 기반, 서비스 메시 지원
  3. **QUIC Tunnel** - QUIC 기반 Outbound-Only + Zero Trust 구조

- https://www.datum.net/

---

## 5. 트렌드 메모

- Agent 기반의 SOC(Security Operations Center)가 주요 트렌드로 부상
