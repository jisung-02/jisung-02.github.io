- RSAC2026에서 소개된 기술은 아님
	- 대표님이 소개해주신 기술

1. OpenFGA
	- Zanzibar기반 fine-grained authorization 엔진
		- 구글의 zanzibar의 설계(논문, 기술 문서)를 기반으로 새로 구현한 OSS엔진
	- 관계 그래프 기반 권한 판단 엔진(ReBAC)
	- 서버 형태 또는 SDK형태로 제공됨
	- CNCF Incubating 프로젝트
	- https://openfga.dev/
2. AGNTCY
	- Cisco 주도, Linux Foundation 산하 agent 간 협업 인프라 표준화 프로젝트.
	- 등장 배경: 각각 고립된 Agent 사이 통신 방식이 표준화, 규격화되지 않은 상태
	- Agent 간 인터넷을 만들기 위한 인프라 컴포넌트의 집합
	- 네 가지 컴포넌트를 중심으로 여러 인프라 요소들이 모여 하나의 인프라로 기능
		- 아래 명칭은 개념적 명칭
		1. Agent Discovery 
			- 구현체: Directory / Registry / Schema
			- OASF(Open Agent Schema Framework)를 기반으로 한 해당 에이전트가 어떤 역할을 수행할 수 있는지를 알려주는 컴포넌트
		2. Agent Identity
			- 구현체: SPIFFE / JWT / PKI
			- OAuth/ JWT를 기반으로 각 에이전트의 인증, 권한 관리 컴포넌트
		3. Agent Messaging 
			- 구현체: SLIM protocol
			- SLIM protocol을 기반으로 멀티모달, 보안, 저지연성의 특징을 가지는 메시징 컴포넌트
		4. Observability
			- 구현체: tracing / telemetry stack
			- 멀티 에이전트의 작업을 추적하는 컴포넌트
		- SLIM Protocol
			- Secure Low-Latency Interactive Messaging
			- gRPC + HTTP/2 or HTTP/3 + MLS 기반 메시징 스택
			- Agent 통신을 위한 gRPC-like messaging protocol
			- OSI스택으로 비교했을 때 7계층의 중간에 위치
				IP -> TCP or QUIC -> HTTP/2 or HTTP/3 -> gRPC -> SLIM -> A2A or MCP -> Agent, LLM
			- 내부적으로 3개의 계층으로 구성
				1. Data Plane - 메시지 전달만 담당(단순 전달, 라우팅)
				2. Session Layer - 암호화, 신뢰성, 세션 관리
					- E2E 암호화(MLS), group communication, reliability
				3. Control Plane 
					- 네트워크 운영, 설정
					- 노드 관리, 라우팅, 오케스트레이션
	- https://agntcy.org/
3. Iroh
	- Rust 기반 P2P 네트워킹 라이브러리
	- QUIC + NAT traversal + E2E 암호화를 결합한 P2P 네트워크 라이브러리
		- QUIC -> TLS, multiplexing 담당
		- Nat Traversal -> 양쪽 다 private network여도 연결
		- E2E Encryption -> peer간 암호화, 중간 노드도 알 수 없음
	- 기존 서버 방식 네트워킹의 문제점
		- 서버 필요 / 지연시간 증가 / 비용 발생 / 중앙 의존
	- 특징
		1. serverless networking
		2. outbound-only 모델
		3. content-addressed transfer
		4. multiplexing
	- 나의 궁금증
		- QUIC이 TLS포함하는데 E2E필요한 이유 - TLS는 hop-by-hop, E2E는 별로
		- 릴레이 서버 필요한가 - 현실적으로 필요함(P2P 한계)
		- outbound only 구현방식 - nat hole punching
		-> 실질적으로 quic기반 webrtc와 별 차이가 없는 듯
	-  https://www.iroh.computer/
4. Datum
	- Network를 Programmable Resource로 만들어 코드로 정의
		- Network 구성을 Programming으로 하는 것이 ai네이티브한 듯
	- 세 가지 계층으로 정의
		1. Controle Plane
			- K8S기반, kubectl 같은 방식으로 네트워크 정의
			- 일종의 IaC
		2. AI Edge
			1. Envoy기반, 서비스 메시 지원
		3. QUIC Tunnel
			1. QUIC기반의 Outbound-Only 연결의 zero trust구조
	- https://www.datum.net/
5. ETC
	- Agent기반의 SOC가 트렌드

