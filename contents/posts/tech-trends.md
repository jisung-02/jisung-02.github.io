---
title: "기술 트렌드 팔로업"
date: 2026-03-30
publish: true
category: "기술 트렌드·리서치"
tags: ["트렌드"]
description: "AI·인프라 등 최근 기술 트렌드 팔로업 메모"
---


> 정리 기준일: 2026-03-30

---

## AI / ML

### Claude Code 웹 Scheduled Tasks

Anthropic이 GitHub 연결 기반의 반복 작업을 클라우드에서 예약 실행할 수 있게 만든 기능이다.

- 클라우드 환경에서 실행되며 로컬 파일 시스템을 직접 보지 않는다.
- 반복 주기는 최소 1시간이며, PR 리뷰/CI 실패 요약/문서 업데이트 같은 반복 업무 자동화 용도다.
- 노트북을 켜 두지 않아도 돌아가는 점이 핵심이다.
- 무료 플랜 지원 여부는 실제 계정 화면에서 확인해야 한다. 로컬 파일/사내 자격증명 접근이 필요하면 데스크톱/로컬 러너가 더 적합하다.
- https://support.claude.com/en/articles/12618689-claude-code-on-the-web

### VibeVoice-ASR

긴 음성을 한 번에 처리하면서 화자 구분과 타임스탬프를 함께 뽑는 Microsoft 계열 음성 모델이다.

- 최대 60분 오디오를 single-pass로 처리하며 50개 이상 언어를 지원한다.
- 화자 정보와 타임스탬프를 동시 생성하므로 회의록/인터뷰/팟캐스트에서 청크 분할 파이프라인을 줄일 수 있다.
- 2026-03-06에 Transformers 통합 소식이 나왔다.
- "Whisper 완전 대체"로 보기엔 아직 이르다. 한국어 정확도, 잡음 환경, 도메인 용어 인식은 실제 샘플로 검증해야 한다.
- https://github.com/microsoft/VibeVoice
- https://huggingface.co/microsoft/VibeVoice-ASR

### Miasma — AI 스크레이퍼를 무한 독 데이터 함정에 가두는 도구

AI 기업의 무단 웹 스크래핑에 대항하는 data poisoning 방어 도구다. Rust 기반이고 GPL-3.0이다.

- 웹사이트에 `display: none` 숨김 링크를 삽입하면 봇만 따라가고, Miasma 서버가 자기참조 링크 5개와 오염된 가짜 콘텐츠를 무한 반환한다.
- `robots.txt`로 정상 크롤러(Googlebot 등)는 제외한다. 50 동시 연결 시 ~50MB로 경량이다.
- `cargo install miasma`로 설치한다. AI 생성 PR은 자동 거절 정책이다.
- https://github.com/austin-weeks/miasma

### Cybersecurity-BaronLLM

공격 보안 태스크를 겨냥한 커뮤니티 기반 Llama 3.1 계열 GGUF 모델이다.

- 로컬 추론 실험용이다. 게이트가 걸려 있어 사용 전 연락처 제공/이용 의도 확인이 필요하다.
- "실무에 바로 넣을 제품"보다 "보안 특화 모델 실험 재료"에 가깝다. 폐쇄된 연구 환경에서 검증하는 편이 맞다.
- https://huggingface.co/AlicanKiraz0/Cybersecurity-BaronLLM_Offensive_Security_LLM_Q6_K_GGUF

---

## Agent 인프라

### AGNTCY — Agent 간 협업 인프라 표준화

Cisco 주도, Linux Foundation 산하 프로젝트다. 고립된 Agent 사이의 통신 방식을 표준화하려는 프로젝트다.

- 4대 핵심 컴포넌트:
  - **Agent Discovery** — OASF 기반, 에이전트의 역할/기능 명세
  - **Agent Identity** — SPIFFE / JWT / PKI 기반 인증·권한 관리
  - **Agent Messaging** — SLIM Protocol (gRPC + HTTP/2 or HTTP/3 + MLS 기반)
  - **Observability** — 멀티 에이전트 작업 추적
- SLIM Protocol 내부 3계층: Data Plane → Session Layer (E2E 암호화) → Control Plane
- Agent 기반의 SOC(Security Operations Center)가 주요 트렌드로 부상 중이다.
- https://agntcy.org/

### Paperclip — AI 에이전트로 회사를 자율 운영하는 오케스트레이션 도구

여러 AI 에이전트를 조직도·예산·목표·거버넌스 체계로 통합 관리하는 오픈소스 도구다. MIT 라이선스다.

- Claude Code, Codex 등 다양한 에이전트를 "직원"으로 배치하고, 각 작업을 회사 미션에 정렬한다(goal alignment).
- Heartbeat 시스템으로 주기적 상태를 점검하고, 에이전트별 월별 예산 한도를 설정한다.
- 다중 회사(Multi-Company)를 지원한다. 하나의 인스턴스로 여러 회사를 독립 운영하며 데이터·감사 로그를 완전 분리한다.
- 모든 대화와 결정 과정을 불변 감사 로그로 기록한다. 승인/중단/해고 등 거버넌스를 제어한다.
- 핵심 기술: Atomic execution (중복·예산 초과 방지), Persistent agent state (재시작 시 문맥 보존), Runtime skill injection (재학습 없이 확장), Governance with rollback.
- Node.js 20+ / pnpm / PostgreSQL / Docker Compose로 원클릭 셋업한다.
- https://paperclip.ing

### OpenFGA — Fine-Grained Authorization 엔진

구글의 Zanzibar 논문을 기반으로 재구현한 OSS 엔진이다. CNCF Incubating 프로젝트다.

- 관계 그래프 기반으로 권한을 판단한다(ReBAC). 서버 또는 SDK 형태로 제공한다.
- Agent 환경에서 세분화된 권한 제어가 필요할 때 참고할 만하다.
- https://openfga.dev/

---

## 네트워킹 / 인프라

### Iroh — Rust 기반 P2P 네트워킹 라이브러리

QUIC + NAT Traversal + E2E 암호화를 결합한 P2P 네트워크 라이브러리다.

- Serverless Networking, Outbound-Only 모델 (NAT hole punching), Content-Addressed Transfer.
- TLS는 hop-by-hop이라 E2E 암호화는 별도 계층으로 필요하다. 릴레이 서버도 현실적으로 필요하다.
- 실질적으로 QUIC 기반 WebRTC와 큰 차이가 없어 보인다.
- https://www.iroh.computer/

### AyaFlow — eBPF 기반 네트워크 트래픽 분석기

K8s 환경에서 사이드카 없이 DaemonSet으로 노드 전체 트래픽을 커널 수준에서 모니터링하는 Rust 도구다.

- 커널: TC 훅으로 송수신 패킷을 캡처해 링 버퍼로 전송한다. libpcap이 필요 없다.
- 유저스페이스: Tokio 비동기 + DashMap 실시간 연결 추적 + SQLite 영구 저장.
- REST API + WebSocket 스트리밍 + Prometheus 메트릭을 제공한다. L7 검사(DNS, TLS SNI)를 지원한다.
- 메모리 ~33MB, eBPF 프로그램 576B(JIT)로 매우 경량이다.
- https://github.com/DavidHavoc/ayaFlow

### Datum — 네트워크를 Programmable Resource로 정의하는 플랫폼

네트워크 구성을 코드로 정의하는 AI 네이티브 접근 방식이다.

- Control Plane (K8s 기반 IaC) + AI Edge (Envoy 기반 서비스 메시) + QUIC Tunnel (Outbound-Only + Zero Trust).
- https://www.datum.net/

---

## 개발 도구 / 레퍼런스

### Pretext — DOM 없는 텍스트 측정·레이아웃 라이브러리

순수 JS/TS로 다중 라인 텍스트 측정과 레이아웃을 수행하는 라이브러리다. GitHub 스타 11.2k다.

- DOM의 `getBoundingClientRect` 같은 레이아웃 리플로우 없이 텍스트 높이·줄바꿈을 계산한다.
- Canvas, SVG, DOM 어디서든 렌더링할 수 있다. 이모지, 양방향 텍스트(bidi), 다국어를 모두 지원한다.
- `prepare()` (일회성 분석, 500개 배치 ~19ms) + `layout()` (순수 산술, ~0.09ms) 두 단계 API다.
- 가변 너비 레이아웃, 라인별 상세 정보 추출 등 고급 API도 제공한다.
- chenglou (React Motion, Reason 등의 저자)가 제작했다. Sebastian Markbage의 `text-layout`에서 영감을 받았다.
- https://github.com/chenglou/pretext

### Pascal Editor — 웹 기반 3D 건축 편집기

React Three Fiber + WebGPU로 만든 오픈소스 3D building editor다.

- Turborepo 모노레포: `apps/editor` (Next.js), `packages/core` (스키마/상태), `packages/viewer` (3D 렌더링).
- 웹 기반 3D 에디터 구조 참고용이다. 구현 참고 목적이면 `core`와 `viewer`부터 읽는 게 효율적이다.
- https://github.com/pascalorg/editor

### Alternatives to JPA 발표 자료

JPA 바깥에서 비동기/논블로킹 데이터 접근을 고민할 때 볼 만한 발표 자료다.

- R2DBC, Hibernate Reactive, Vert.x SQL Client, Kotlin Exposed, Virtual Threads 비교.
- 고동시성, 반응형 I/O, ORM 추상화 비용이 문제인 시스템에서 비교 출발점으로 유용하다.
- https://speakerdeck.com/debop/alternatives-to-jpa-2026?slide=2

### QuickBEAM — JS를 Erlang/OTP supervised process로 실행

QuickJS 엔진을 BEAM 위의 GenServer로 감싸서, JS 코드가 OTP 감독 트리 안에서 돌아가게 만든 프로젝트다.

- JS에서 `Beam.call()`, `Beam.send()`, `Beam.spawn()` 등으로 Elixir 핸들러를 호출하고 프로세스 메시징을 할 수 있다.
- Context Pool로 수천 개 동시 연결을 지원한다. 메모리/스택/연산 예산 제한으로 안전성을 확보한다.
- Node.js 호환 모듈(`process`, `path`, `fs`, `os`)을 제공한다. TypeScript 툴체인을 내장한다.
- Elixir + Zig(Zigler)로 구현했다.
- https://github.com/elixir-volt/quickbeam

### CPython 3.15 JIT — 다시 궤도에 올라옴

3.13~3.14의 JIT는 인터프리터보다 느린 경우가 많았고 주요 스폰서를 잃으면서 불확실했는데, 이 상황이 해소됐다.

- macOS AArch64에서 11-12%, x86_64 Linux에서 5-6% 성능이 향상된다. 벤치마크에 따라 최대 100%+다.
- 듀얼 디스패치: 트레이싱 프론트엔드 재설계로 코드 커버리지가 50% 증가했다.
- 참조 카운트 제거: 각 명령어당 1개 이상 분기를 없애 상당한 성능 개선을 얻었다.
- 커뮤니티 주도 개발로 전환했고, 일 11명이 참여하는 협업 체제다.
- https://blog.python.org/2026/03/jit-on-track

### io_uring DBMS 논문

`io_uring`을 DBMS에 넣는다고 무조건 빨라지는 것은 아니고, 어디에 어떻게 써야 이득이 나는지 정리한 논문이다.

- 단순 치환으로는 성능 이득이 보장되지 않는다. 저장소 바운드/네트워크 바운드 워크로드를 각각 평가한다.
- PostgreSQL 적용 사례에서 최대 14% 성능 향상을 보고했다.
- https://arxiv.org/abs/2512.04859

---
https://wikidocs.net/blog/@jaehong/10625/
