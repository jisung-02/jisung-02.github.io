---
title: "내가 무엇을 모르는지 알아보았다"
date: 2026-03-30
publish: true
category: "소프트웨어공학/SWEBOK 정리"
tags: ["소프트웨어공학", "정리"]
description: "SWEBOK을 기준으로 내가 모르던 소프트웨어 공학 개념들을 짚어본 정리"
---


# Part 1. SWEBOK 기반 소프트웨어 공학

## 1. Requirements (요구사항)

- **Requirement** — 시스템이 만족해야 하는 조건 또는 기능
- **Functional Requirement** — 시스템이 "무엇을 해야 하는지" 정의
- **Non-functional Requirement** — 성능, 보안, 확장성 등 "어떻게 해야 하는지"
- **Requirement Elicitation** — 이해관계자로부터 요구사항 수집 과정
- **Requirement Analysis** — 요구사항을 구조화하고 모순을 제거하는 과정
- **Requirement Specification (SRS)** — 요구사항을 문서화한 공식 명세
- **Requirement Validation** — 요구사항이 실제 요구를 충족하는지 검증
- **Requirement Traceability** — 요구사항과 구현/테스트 간 추적 가능성
- **Use Case** — 사용자 관점에서 시스템 동작 시나리오
- **User Story** — Agile에서 사용하는 간단한 요구사항 표현 방식

## 2. Design / Architecture (설계)

- **Architecture** — 시스템 구성 요소와 관계를 정의한 상위 구조
- **Component** — 독립적으로 배포/교체 가능한 시스템 단위
- **Interface** — 컴포넌트 간 상호작용 규약
- **Abstraction** — 복잡한 내부를 숨기고 핵심만 노출
- **Encapsulation** — 데이터와 로직을 하나로 묶는 개념
- **Modularity** — 시스템을 독립적인 모듈로 분리하는 설계 방식
- **Coupling** — 컴포넌트 간 의존성 정도 (낮을수록 좋음)
- **Cohesion** — 모듈 내부 요소의 관련성 (높을수록 좋음)
- **Design Pattern** — 반복되는 문제에 대한 검증된 설계 방식
- **Layered Architecture** — 계층별 역할을 나누는 구조
- **Microservices** — 서비스 단위로 분리된 분산 아키텍처
- **Monolith** — 하나의 단일 코드베이스로 구성된 구조

## 3. Construction / Implementation (구현)

- **Implementation** — 설계를 코드로 변환하는 단계
- **Refactoring** — 동작 변경 없이 코드 구조 개선
- **Code Smell** — 유지보수성이 낮은 코드의 징후
- **Technical Debt** — 미래 비용을 유발하는 설계/구현 선택
- **Version Control** — 코드 변경 이력을 관리하는 시스템
- **Branch** — 코드 변경을 위한 독립 작업 공간
- **Merge** — 변경 사항을 통합하는 과정
- **Build** — 소스 코드를 실행 가능한 형태로 변환
- **Dependency** — 외부 라이브러리 또는 모듈 의존성
- **Compilation** — 코드를 기계어 또는 바이트코드로 변환
- **Linting** — 코드 스타일 및 오류 자동 검사

## 4. Testing / Quality (테스트)

- **Testing** — 소프트웨어 품질을 검증하는 활동
- **Unit Test** — 개별 함수/모듈 단위 테스트
- **Integration Test** — 모듈 간 상호작용 테스트
- **System Test** — 전체 시스템 단위 테스트
- **Acceptance Test** — 사용자 요구 충족 여부 검증
- **Test Case** — 테스트 조건과 기대 결과 정의
- **Test Coverage** — 테스트가 코드의 얼마나를 검증하는지 비율
- **TDD (Test Driven Development)** — 테스트 먼저 작성 후 구현
- **Mocking** — 외부 의존성을 가짜 객체로 대체
- **Regression Test** — 변경 이후 기존 기능 유지 검증
- **Bug** — 기대와 다른 동작 (결함)

## 5. Maintenance / Evolution (유지보수)

- **Maintenance** — 배포 이후 시스템 수정 및 개선 활동
- **Corrective Maintenance** — 버그 수정
- **Adaptive Maintenance** — 환경 변화 대응 수정
- **Perfective Maintenance** — 성능/기능 개선
- **Preventive Maintenance** — 미래 문제 예방을 위한 개선
- **Hotfix** — 긴급한 운영 문제 해결 패치
- **Rollback** — 이전 안정 버전으로 되돌림
- **Deprecation** — 기능 사용 중단 예정 상태
- **Backward Compatibility** — 이전 버전과 호환 유지
- **Technical Evolution** — 시스템 구조의 장기적 개선

## 6. Cross-cutting (전 단계 공통 개념)

- **SDLC (Software Development Life Cycle)** — 소프트웨어 개발 전체 과정
- **Agile** — 반복적/점진적 개발 방법론
- **Waterfall** — 순차적 단계 기반 개발 방식
- **CI/CD** — 자동 빌드/테스트/배포 파이프라인
- **Code Review** — 코드 품질 검토 과정
- **Documentation** — 시스템/코드 설명 문서
- **Quality Assurance (QA)** — 품질 보증 활동
- **Debugging** — 오류 원인 분석 및 수정 과정
- **Release** — 사용자에게 배포 가능한 버전
- **Versioning** — 소프트웨어 버전 관리 체계

---

# Part 2. OS (기본 + 커널/리눅스 엔지니어 레벨)

## 1. Kernel & Internals

- **Kernel** — OS의 핵심으로 하드웨어와 프로세스를 관리하는 계층
- **System Call** — 유저 프로그램이 커널 기능을 요청하는 인터페이스
- **User Mode** — 제한된 권한 실행 영역
- **Kernel Mode** — 모든 자원 접근 가능한 특권 모드
- **Context Switch** — 실행 중인 작업 상태를 저장하고 다른 작업으로 전환
- **Interrupt** — 외부 이벤트로 CPU 흐름을 강제 변경
- **Trap** — 소프트웨어가 발생시키는 인터럽트 (syscall 등)
- **Scheduler Tick** — 스케줄러가 동작하는 주기
- **Kernel Preemption** — 커널 코드 실행 중에도 선점 가능한 기능
- **HardIRQ** — 즉시 실행되는 인터럽트 핸들러
- **SoftIRQ** — 지연 처리되는 인터럽트 핸들러
- **VFS (Virtual File System)** — 다양한 파일 시스템을 동일 인터페이스로 추상화하는 계층
- **Dentry** — 파일 경로 캐싱을 위한 디렉토리 엔트리 구조
- **Inode Cache** — inode 메타데이터 캐시
- **Page Cache** — 디스크 데이터를 메모리에 캐싱하는 계층
- **Slab Allocator** — 커널 객체 메모리 할당 최적화 구조
- **Buddy Allocator** — 물리 메모리 페이지 할당 알고리즘
- **RCU (Read-Copy-Update)** — lock-free read를 위한 동기화 기법

## 2. Process / Thread / Scheduling

- **Process** — 실행 중인 프로그램 인스턴스
- **Thread** — 프로세스 내부 실행 단위
- **PCB** — 프로세스 상태 정보를 저장하는 구조
- **Task Struct** — Linux에서 프로세스를 표현하는 핵심 구조체
- **Fork** — 프로세스 복제
- **Exec** — 프로세스 이미지 교체
- **Zombie** — 종료되었지만 회수되지 않은 프로세스
- **Orphan** — 부모가 사라진 프로세스
- **Thread Pool** — 스레드 재사용 구조
- **Kernel Thread (kthread)** — 커널 공간에서 실행되는 스레드
- **Workqueue** — 비동기 작업 처리 메커니즘
- **Scheduler** — CPU 할당을 결정하는 컴포넌트
- **CFS (Completely Fair Scheduler)** — Linux 기본 스케줄러
- **Run Queue** — 실행 대기 중인 task 목록
- **Preemption** — 강제 선점 실행 전환
- **Time Slice** — CPU 점유 시간 단위
- **Nice Value** — 프로세스 우선순위 힌트
- **Scheduler Class** — 스케줄링 정책 그룹
- **Load Balancer** — CPU 간 task 분산
- **CPU Affinity** — 특정 CPU에 프로세스 고정
- **Context Switching Cost** — 전환 시 발생하는 오버헤드
- **Load Average** — 시스템 부하 지표

## 3. Memory

- **Virtual Memory** — 물리 메모리 추상화된 주소 공간
- **Paging** — 페이지 단위 메모리 관리
- **Page Fault** — 메모리에 없는 페이지 접근 시 발생
- **Swap** — 메모리 ↔ 디스크 교환
- **Heap** — 동적 할당 영역
- **Stack** — 함수 호출 스택
- **TLB** — 주소 변환 캐시
- **TLB Miss** — 주소 변환 캐시 실패
- **Copy-on-Write** — 실제 수정 전까지 메모리 공유
- **OOM Killer** — 메모리 부족 시 프로세스 강제 종료
- **OOM Score** — 프로세스 종료 우선순위
- **mmap** — 파일/메모리를 가상 주소 공간에 매핑하는 syscall
- **brk** — 힙 영역을 확장하는 syscall
- **Anonymous Memory** — 파일과 연결되지 않은 메모리
- **Dirty Page** — 디스크와 동기화되지 않은 메모리 페이지
- **Writeback** — dirty page를 디스크로 flush하는 과정
- **Huge Page** — 큰 페이지로 TLB 효율 개선
- **Memory Overcommit** — 실제 메모리보다 많이 할당 허용
- **NUMA Node** — 메모리 지역성 단위

## 4. Concurrency / Locking

- **Concurrency** — 동시에 실행되는 것처럼 보이는 구조
- **Parallelism** — 실제 동시에 실행
- **Race Condition** — 실행 순서에 따라 결과 달라짐
- **Mutex** — 상호 배제 락
- **Futex** — user-space 기반 빠른 mutex 구현 syscall
- **Semaphore** — 자원 개수 기반 동기화
- **Spinlock** — sleep 없이 CPU를 점유하며 대기하는 락
- **RWLock** — read/write 분리 락
- **Seqlock** — writer 우선 lock-free 구조
- **Deadlock** — 서로 자원 대기 상태
- **Atomic** — 중단 없이 수행되는 연산
- **Memory Barrier** — CPU 재정렬 방지
- **Lock Contention** — 여러 스레드가 락을 기다리는 상태
- **False Sharing** — 캐시 라인 충돌로 인한 성능 저하
- **Cache Coherency** — CPU 간 캐시 일관성 유지 메커니즘
- **Memory Ordering** — CPU 명령 재정렬 규칙

## 5. I/O / File / Descriptor

- **File Descriptor** — 열린 파일/소켓을 가리키는 핸들
- **Inode** — 파일 메타데이터 구조
- **Buffer Cache** — 디스크 I/O 캐싱
- **Blocking I/O** — 작업 완료까지 대기
- **Non-blocking I/O** — 즉시 반환
- **Async I/O** — 완료 이벤트 기반 처리
- **epoll** — 대량 fd를 효율적으로 처리하는 이벤트 기반 I/O
- **select/poll** — legacy I/O multiplexing 방식
- **io_uring** — syscall 최소화한 고성능 async I/O 인터페이스
- **AIO** — 기존 Linux async I/O
- **Direct I/O (O_DIRECT)** — page cache bypass I/O
- **Buffered I/O** — page cache 사용 I/O
- **IO Scheduler** — 디스크 요청 순서 최적화
- **Zero-copy** — 메모리 복사 없이 데이터 전달

## 6. IPC

- **IPC** — 프로세스 간 통신 메커니즘
- **Pipe** — 단방향 데이터 전달
- **Socket** — 네트워크 기반 통신
- **Shared Memory** — 메모리 공유
- **Message Queue** — 큐 기반 메시지 전달
- **Signal** — 프로세스 이벤트 전달

## 7. Container Primitive

- **Namespace** — 리소스를 격리하는 커널 기능
- **PID Namespace** — 프로세스 ID 격리
- **Mount Namespace** — 파일 시스템 격리
- **Network Namespace** — 네트워크 스택 격리
- **User Namespace** — UID/GID 격리
- **IPC Namespace** — IPC 자원 격리
- **cgroup** — 프로세스 그룹의 CPU, 메모리, I/O 사용량을 제한/관리하는 기능
- **cgroup v1** — 리소스별 개별 hierarchy 구조
- **cgroup v2** — unified hierarchy (현대 Linux 표준)
- **CPU quota** — CPU 사용량 제한
- **CPU Throttling** — CPU quota 초과 시 발생하는 제한
- **Memory limit** — 메모리 사용 제한
- **Memory Reclaim** — 메모리 회수 메커니즘
- **OOM Control** — 메모리 부족 시 제어
- **blkio** — 디스크 I/O 제한
- **Namespace vs cgroup** — namespace는 "격리", cgroup은 "자원 제한" 역할
- **Container** — namespace + cgroup 기반 실행 환경
- **Container Runtime** — container lifecycle 관리 (runc 등)

## 8. Init / Process Management

- **init** — 최초 실행되는 PID 1 프로세스
- **systemd** — 현대 Linux의 서비스 및 cgroup 기반 관리 시스템
- **Unit** — systemd 관리 단위 (service, socket 등)
- **Daemon** — 백그라운드 실행 프로세스
- **Service Manager** — 서비스 생명주기 관리

## 9. Syscall / ABI Layer

- **Syscall Table** — syscall 번호와 핸들러 매핑
- **ABI (Application Binary Interface)** — 사용자 프로그램과 커널 간 규약
- **ELF** — 실행 파일 포맷
- **Loader** — 실행 파일을 메모리에 로드하는 과정
- **vdso** — syscall 없이 커널 기능 접근하는 최적화 영역
- **Syscall Overhead** — user↔kernel 전환 비용

## 10. Networking (OS 관점)

- **Socket Buffer (skb)** — 네트워크 패킷 내부 표현 구조
- **Netfilter** — 커널 패킷 필터링 프레임워크
- **iptables/nftables** — 패킷 필터링 도구
- **TCP Stack** — 커널 TCP 구현
- **Backlog Queue** — accept 대기 큐
- **Zero-copy networking** — kernel bypass 통신

## 11. Performance / Observability

- **perf** — 커널 성능 분석 도구
- **eBPF** — 커널 내부 동작을 동적으로 추적/확장하는 기술
- **uprobes/kprobes** — 유저/커널 함수 추적
- **Flame Graph** — CPU 사용 시각화
- **Latency** — 요청 처리 시간
- **Throughput** — 처리량
- **Context Switch Overhead** — 전환 비용

## 12. Hardware Interaction & Kernel Bypass

- **CPU Cache** — 빠른 데이터 접근 계층
- **NUMA** — CPU별 메모리 접근 차이 구조
- **DMA** — CPU 없이 장치 ↔ 메모리 전송
- **Bus** — 장치 간 데이터 통로
- **Clock** — CPU 동작 기준 시간
- **DPDK** — 커널을 거치지 않는 고성능 네트워크 처리
- **SPDK** — user-space storage stack
- **Kernel Bypass** — 커널을 우회하는 I/O 방식
- **Userspace Networking** — 유저 영역 네트워크 처리

---

# Part 3. Networking / Protocol

## 1. Network Fundamentals

- **IP** — 네트워크 상에서 호스트를 식별하는 주소 체계
- **IPv4** — 32비트 주소 체계 (가장 널리 사용)
- **IPv6** — 128비트 주소 체계 (주소 부족 해결)
- **Subnet** — 네트워크를 논리적으로 분할한 단위
- **CIDR** — IP 주소와 네트워크 범위를 표현하는 방식
- **Gateway** — 다른 네트워크로 나가기 위한 출입 지점
- **Routing** — 목적지까지 패킷을 전달하는 경로 결정 과정
- **Routing Table** — 패킷 전달 경로 정보 목록
- **MTU** — 한 번에 전송 가능한 최대 패킷 크기
- **Packet** — 네트워크 전송 단위 데이터

## 2. Transport Layer

- **TCP** — 신뢰성 있는 연결 기반 프로토콜
- **UDP** — 비연결, 빠르지만 신뢰성 없음
- **3-way Handshake** — TCP 연결을 설정하는 과정
- **4-way Handshake** — TCP 연결 종료 과정
- **Flow Control** — 송신/수신 속도 조절
- **Congestion Control** — 네트워크 혼잡 제어
- **Retransmission** — 패킷 손실 시 재전송
- **RTT** — 왕복 지연 시간
- **Socket** — 네트워크 통신 엔드포인트

## 3. Application Protocols

- **HTTP** — 웹 기반 요청/응답 프로토콜
- **HTTP/1.1** — keep-alive 기반 연결 재사용
- **HTTP/2** — multiplexing 지원
- **HTTP/3** — QUIC 기반 (UDP 위에서 동작)
- **gRPC** — HTTP/2 기반 RPC 프레임워크
- **REST** — 리소스 기반 API 설계 방식
- **WebSocket** — 양방향 실시간 통신 프로토콜
- **DNS** — 도메인 → IP 변환 시스템
- **SMTP** — 이메일 전송 프로토콜

## 4. TLS / Security

- **TLS** — 통신 암호화 프로토콜
- **SSL** — TLS 이전 버전 (현재는 deprecated)
- **Handshake** — 암호화 연결을 설정하는 과정
- **Certificate** — 서버 신원을 증명하는 공개키 인증서
- **CA** — 인증서를 발급하는 기관
- **SNI** — TLS에서 도메인 기반 인증 처리
- **ALPN** — 프로토콜 협상 (HTTP/2 등)

## 5. Connection / State

- **Connection** — 두 엔드포인트 간 통신 상태
- **Stateless** — 요청 간 상태를 유지하지 않는 구조
- **Stateful** — 상태를 유지하는 구조
- **Keep-alive** — 연결을 재사용하는 방식
- **Connection Pool** — 미리 연결을 만들어 재사용
- **Timeout** — 일정 시간 응답 없을 경우 종료
- **Retry** — 실패 시 재요청
- **Idempotency** — 여러 번 호출해도 동일 결과 보장

## 6. Load Balancing / Traffic

- **Load Balancer** — 트래픽을 여러 서버로 분산
- **L4 Load Balancing** — TCP/UDP 레벨 분산
- **L7 Load Balancing** — HTTP 레벨 분산
- **Round Robin** — 순차적으로 분배
- **Least Connection** — 연결 수 기반 분배
- **Health Check** — 서버 상태 확인
- **Reverse Proxy** — 클라이언트 대신 요청 전달
- **Forward Proxy** — 클라이언트 대신 외부 요청

## 7. NAT / Firewall / Network Control

- **NAT** — 내부 IP를 외부 IP로 변환
- **SNAT** — 출발지 IP 변경
- **DNAT** — 목적지 IP 변경
- **Firewall** — 네트워크 접근 제어 시스템
- **Port** — 프로세스를 식별하는 네트워크 엔드포인트
- **Ephemeral Port** — 임시 할당 포트
- **ACL** — 접근 제어 규칙

## 8. Performance / Failure

- **Latency** — 요청/응답 지연 시간
- **Throughput** — 단위 시간당 처리량
- **Packet Loss** — 패킷 손실
- **Jitter** — 지연 시간의 변동성
- **Head-of-line Blocking** — 앞 요청 때문에 뒤 요청 지연
- **Backpressure** — 처리 속도 차이로 인한 압력
- **Circuit Breaker** — 장애 전파 방지 패턴
- **Retry Storm** — 재시도로 인해 시스템 과부하 발생
- **Timeout Cascade** — 타임아웃이 연쇄적으로 발생하는 현상

## 9. Modern Networking (클라우드/컨테이너)

- **VPC** — 클라우드 내 논리적 네트워크
- **Overlay Network** — 가상 네트워크 (VXLAN 등)
- **Service Mesh** — 서비스 간 통신 제어 레이어 (Istio 등)
- **Sidecar** — 서비스 옆에서 네트워크 처리 담당
- **Ingress** — 외부 → 내부 트래픽 진입 지점
- **Egress** — 내부 → 외부 트래픽 출구

---

# Part 4. Data & Storage

## 1. Data Model / Schema

- **Schema** — 데이터 구조 정의
- **Entity** — 데이터 객체 단위
- **Relation** — 엔티티 간 관계
- **Normalization** — 데이터 중복 제거 설계
- **Denormalization** — 성능을 위해 일부 중복 허용
- **Primary Key** — 레코드를 고유하게 식별하는 키
- **Foreign Key** — 다른 테이블을 참조하는 키
- **Index** — 검색 성능 향상을 위한 자료구조
- **Composite Key** — 여러 컬럼으로 구성된 키

## 2. Storage Engine Internals

- **Row Store** — 행 단위 저장 방식
- **Column Store** — 컬럼 단위 저장 방식
- **Page** — 디스크 I/O 최소 단위
- **Segment** — 여러 페이지 묶음
- **Heap File** — 순차 저장 구조
- **B-Tree** — 가장 일반적인 인덱스 구조
- **LSM Tree** — write-heavy 시스템용 구조
- **SSTable** — 정렬된 불변 데이터 파일
- **MemTable** — 메모리 상 쓰기 버퍼
- **Compaction** — LSM 데이터 병합/정리 과정

## 3. Query Processing

- **Query Planner** — 실행 계획 생성
- **Query Optimizer** — 최적 실행 전략 선택
- **Execution Plan** — 쿼리 실행 방식 정의
- **Full Scan** — 전체 데이터 탐색
- **Index Scan** — 인덱스를 통한 탐색
- **Join** — 여러 테이블 결합
- **Nested Loop Join** — 반복 기반 조인
- **Hash Join** — 해시 기반 조인
- **Sort Merge Join** — 정렬 기반 조인
- **Cost Model** — 실행 비용 계산 기준

## 4. Transactions / Consistency

- **Transaction** — 논리적 작업 단위
- **ACID** — 원자성, 일관성, 격리성, 지속성
- **Atomicity** — 모두 성공하거나 모두 실패
- **Consistency** — 데이터 무결성 유지
- **Isolation** — 트랜잭션 간 간섭 방지
- **Durability** — 커밋된 데이터 유지
- **Isolation Level** — 격리 수준 정의
- **Read Uncommitted** — 커밋 전 데이터 읽기 가능
- **Read Committed** — 커밋된 데이터만 읽기
- **Repeatable Read** — 같은 데이터 반복 읽기 보장
- **Serializable** — 완전한 격리
- **Dirty Read** — 커밋되지 않은 데이터 읽기
- **Non-repeatable Read** — 같은 쿼리 결과 변경
- **Phantom Read** — 행 추가/삭제로 결과 변화

## 5. Concurrency Control

- **Lock** — 데이터 접근 제어 메커니즘
- **Row Lock** — 행 단위 락
- **Table Lock** — 테이블 단위 락
- **Deadlock** — 트랜잭션 간 교착 상태
- **MVCC** — 버전 기반 동시성 제어
- **Snapshot** — 특정 시점 데이터 뷰
- **Write Conflict** — 동시에 쓰기 충돌
- **Optimistic Lock** — 충돌 가정 후 검증
- **Pessimistic Lock** — 사전 락 확보

## 6. Logging / Recovery

- **WAL (Write-Ahead Log)** — 변경 전 로그 기록 후 데이터 반영
- **Redo Log** — 변경 내용을 재적용하기 위한 로그
- **Undo Log** — 변경 이전 상태 복구용 로그
- **Checkpoint** — 디스크 상태와 로그 동기화 지점
- **Crash Recovery** — 장애 후 데이터 복구 과정
- **Log Sequence Number (LSN)** — 로그 순서 식별자

## 7. Distributed Data

- **Replication** — 데이터 복제
- **Leader-Follower** — 단일 쓰기 노드 구조
- **Multi-leader** — 다중 쓰기 구조
- **Sharding** — 데이터 분할 저장
- **Partition Key** — 데이터 분배 기준
- **Consistent Hashing** — 분산 환경에서 키 분배 방식
- **Quorum** — 읽기/쓰기 합의 기준
- **Eventual Consistency** — 최종 일관성 모델
- **Strong Consistency** — 즉시 일관성 보장
- **CAP Theorem** — consistency / availability / partition tradeoff

## 8. NoSQL / Alternative Models

- **Key-Value Store** — 단순 key-value 구조
- **Document Store** — JSON 기반 저장
- **Wide Column Store** — 컬럼 패밀리 구조
- **Graph DB** — 노드/엣지 기반 저장
- **Time-series DB** — 시계열 데이터 최적화

## 9. Performance / Optimization

- **Query Latency** — 쿼리 실행 시간
- **Throughput** — 처리량
- **Index Selectivity** — 인덱스 효율성
- **Hotspot** — 특정 데이터에 집중된 접근
- **Cache Hit Ratio** — 캐시 적중률
- **Connection Pool** — DB 연결 재사용
- **N+1 Query** — 비효율 반복 쿼리 패턴
- **Batching** — 요청 묶음 처리
- **Pagination** — 데이터 분할 조회

## 10. Storage / Disk Level

- **SSD** — 반도체 기반 저장 장치
- **HDD** — 디스크 기반 저장 장치
- **IOPS** — 초당 입출력 수
- **Sequential I/O** — 순차 읽기/쓰기
- **Random I/O** — 랜덤 접근
- **fsync** — 디스크 강제 동기화
- **Write Amplification** — 실제 쓰기보다 많은 물리 쓰기 발생

---

# Part 5. DevOps / Infrastructure

## 1. Build / Artifact

- **Build** — 소스 코드를 실행 가능한 형태로 변환하는 과정
- **Artifact** — 빌드 결과물 (binary, image 등)
- **Dependency Resolution** — 의존성 버전 결정 과정
- **Reproducible Build** — 동일 입력 → 동일 결과 보장
- **Build Cache** — 빌드 속도 개선을 위한 캐시
- **Immutable Artifact** — 변경 불가능한 배포 단위

## 2. CI/CD Pipeline

- **CI (Continuous Integration)** — 코드 변경 시 자동 빌드/테스트
- **CD (Continuous Delivery)** — 배포 가능한 상태 유지
- **Continuous Deployment** — 자동으로 실제 서비스 배포
- **Pipeline** — 빌드/테스트/배포 단계 흐름
- **Stage** — 파이프라인의 단계 단위
- **Runner/Executor** — 작업을 수행하는 실행 환경
- **Rollback** — 이전 버전으로 되돌림
- **Blue-Green Deployment** — 두 환경 전환 방식 배포
- **Canary Deployment** — 일부 트래픽만 새 버전에 적용
- **Feature Flag** — 런타임에서 기능 제어

## 3. Container

- **Container** — 격리된 실행 환경 (namespace + cgroup 기반)
- **Image** — 컨테이너 실행 템플릿
- **Layer** — 이미지 구성 단위
- **Union FS** — 레이어를 합쳐 하나의 파일 시스템 구성
- **Entrypoint** — 컨테이너 시작 명령
- **Registry** — 이미지 저장소

## 4. Container Runtime / OCI

- **OCI** — 컨테이너 표준 (runtime/image spec)
- **runc** — 대표적인 low-level runtime
- **containerd** — container lifecycle 관리
- **CRI** — Kubernetes와 runtime 연결 인터페이스
- **Shim** — runtime과 프로세스 사이 중간 계층

## 5. Orchestration (Kubernetes)

- **Cluster** — 여러 노드로 구성된 시스템
- **Node** — 컨테이너가 실행되는 머신
- **Pod** — Kubernetes 최소 배포 단위
- **ReplicaSet** — 동일 Pod 복제 관리
- **Deployment** — 상태 선언 기반 배포 관리
- **Service** — Pod 접근을 위한 네트워크 추상화
- **Ingress** — 외부 트래픽 진입 지점
- **ConfigMap** — 설정 데이터 관리
- **Secret** — 민감 정보 저장
- **Namespace** — 리소스 논리적 분리
- **Scheduler** — Pod를 노드에 배치
- **Controller** — desired state 유지

## 6. Networking (Infra 관점)

- **CNI** — 컨테이너 네트워크 인터페이스 표준
- **Overlay Network** — 가상 네트워크 (VXLAN 등)
- **Service Discovery** — 서비스 위치 자동 탐색
- **DNS (Cluster DNS)** — 서비스 이름 해석
- **Load Balancer** — 트래픽 분산
- **Ingress Controller** — HTTP 라우팅 관리
- **Egress** — 외부로 나가는 트래픽

## 7. Storage (Infra)

- **Volume** — 컨테이너 외부 저장 공간
- **Persistent Volume (PV)** — 클러스터 저장 리소스
- **Persistent Volume Claim (PVC)** — 사용자 요청 단위
- **Storage Class** — 동적 볼륨 프로비저닝 정책
- **CSI** — 스토리지 인터페이스 표준
- **Ephemeral Storage** — 임시 저장 공간

## 8. Observability

- **Logging** — 시스템 이벤트 기록
- **Metrics** — 수치 기반 상태 데이터
- **Tracing** — 요청 흐름 추적
- **APM** — 애플리케이션 성능 모니터링
- **Prometheus** — metrics 수집 시스템
- **Grafana** — 시각화 도구
- **OpenTelemetry** — observability 표준
- **Log Aggregation** — 로그 중앙 수집
- **Sampling** — 일부 데이터만 추적

## 9. Reliability / SRE

- **SLO** — 목표 서비스 수준
- **SLA** — 계약 기반 서비스 수준
- **SLI** — 측정 지표
- **Error Budget** — 허용 가능한 실패량
- **Incident** — 서비스 장애
- **Postmortem** — 장애 분석 문서
- **Runbook** — 운영 절차 문서
- **Chaos Engineering** — 장애 실험
- **Circuit Breaker** — 장애 전파 차단
- **Backpressure** — 시스템 과부하 제어

## 10. Infrastructure as Code

- **IaC** — 인프라를 코드로 관리
- **Terraform** — 대표 IaC 도구
- **State File** — 인프라 상태 저장
- **Drift** — 실제 인프라와 코드 불일치
- **Provisioning** — 자원 생성 과정
- **Immutable Infrastructure** — 변경 대신 교체 전략

## 11. Security (DevOps 관점)

- **IAM** — 접근 권한 관리
- **RBAC** — 역할 기반 권한 제어
- **Secret Management** — 민감 정보 관리
- **TLS Termination** — 암호화 종료 지점
- **Zero Trust** — 신뢰하지 않고 검증하는 모델
- **Network Policy** — 네트워크 접근 제어

## 12. Resource Management

- **Resource Request** — 최소 필요 자원
- **Resource Limit** — 최대 사용 가능 자원
- **CPU Throttling** — CPU 제한 초과 시 성능 제한
- **OOM Kill** — 메모리 초과 시 프로세스 종료
- **Autoscaling** — 부하에 따른 자동 확장
- **HPA** — CPU/metrics 기반 scaling
- **Vertical Scaling** — 자원 크기 증가
- **Horizontal Scaling** — 인스턴스 수 증가

---

# Part 6. Security

## 1. Security Fundamentals

- **Confidentiality** — 정보가 인가된 사용자에게만 노출되는 것
- **Integrity** — 데이터가 변조되지 않는 것
- **Availability** — 시스템이 항상 접근 가능한 상태
- **CIA Triad** — 보안의 3대 원칙 (C/I/A)
- **Threat** — 시스템에 피해를 줄 수 있는 잠재적 요소
- **Vulnerability** — 시스템의 취약점
- **Exploit** — 취약점을 이용한 공격 코드/기법
- **Attack Surface** — 공격 가능한 모든 진입점
- **Security Control** — 위험을 줄이기 위한 방어 메커니즘

## 2. Authentication / Authorization

- **Authentication (AuthN)** — 사용자가 누구인지 검증
- **Authorization (AuthZ)** — 무엇을 할 수 있는지 결정
- **Session** — 인증 상태 유지 메커니즘
- **JWT** — 토큰 기반 인증 방식
- **OAuth** — 권한 위임 프로토콜
- **RBAC** — 역할 기반 접근 제어
- **ABAC** — 속성 기반 접근 제어
- **Least Privilege** — 최소 권한 원칙
- **Credential Stuffing** — 탈취된 계정 재사용 공격
- **Brute Force** — 무차별 대입 공격

## 3. Input / Injection

- **Input Validation** — 입력값 검증 (필수 보안 요소)
- **Sanitization** — 위험한 데이터 제거
- **Encoding** — 출력 시 안전한 형태로 변환
- **SQL Injection** — SQL 쿼리 조작 공격
- **Command Injection** — OS 명령 실행 공격
- **XSS** — 브라우저에서 스크립트 실행 공격
- **CSRF** — 사용자 권한을 악용한 요청 위조
- **SSRF** — 서버가 내부 요청을 수행하게 만드는 공격
- **Deserialization Attack** — 객체 역직렬화 취약점

## 4. Cryptography

- **Encryption** — 데이터를 암호화
- **Decryption** — 암호 해독
- **Symmetric Key** — 동일 키 사용
- **Asymmetric Key** — 공개키/개인키 구조
- **Hash** — 단방향 함수
- **Salt** — 해시 보안 강화 요소
- **TLS** — 네트워크 통신 암호화
- **Certificate** — 서버 신뢰 검증
- **Key Rotation** — 키 주기적 변경
- **Perfect Forward Secrecy** — 과거 세션 보호

## 5. Secure Coding / AppSec

- **Secure Coding** — 보안 고려한 코드 작성
- **OWASP Top 10** — 주요 웹 취약점 리스트
- **Security Misconfiguration** — 잘못된 설정으로 인한 취약점
- **Dependency Vulnerability** — 라이브러리 취약점
- **Hardcoded Secret** — 코드에 비밀값 포함
- **Error Leakage** — 에러 메시지로 정보 노출
- **Canonicalization** — 입력 정규화

## 6. Application Security Testing

- **SAST** — 정적 코드 분석
- **DAST** — 실행 중 취약점 테스트
- **IAST** — 런타임 분석
- **Fuzzing** — 입력 변형 기반 취약점 탐지
- **Penetration Testing** — 공격 시뮬레이션 테스트
- **Vulnerability Scan** — 자동 취약점 탐지
- **Security Audit** — 보안 검증 과정

## 7. Runtime / System Security

- **Sandbox** — 격리된 실행 환경
- **SELinux** — 강제 접근 제어 시스템
- **AppArmor** — 프로세스 권한 제한
- **Seccomp** — syscall 필터링
- **Capability** — root 권한 분리
- **Chroot** — 파일 시스템 격리

## 8. Network Security

- **Firewall** — 네트워크 접근 제어
- **IDS** — 침입 탐지 시스템
- **IPS** — 침입 방지 시스템
- **WAF** — 웹 애플리케이션 방화벽
- **DDoS** — 대량 트래픽 공격
- **MITM** — 중간자 공격
- **Packet Sniffing** — 패킷 도청
- **Zero Trust** — 신뢰하지 않고 검증하는 모델

## 9. Secrets / Identity

- **Secret** — API 키, 패스워드 등 민감 정보
- **Secret Management** — 비밀값 관리 시스템
- **Vault** — 대표적인 secret 관리 도구
- **Key Store** — 키 저장소
- **Token Leakage** — 토큰 유출
- **Rotation Policy** — 키 교체 정책

## 10. DevSecOps

- **Shift Left Security** — 개발 초기에 보안 적용
- **Security Pipeline** — CI/CD에 보안 포함
- **SBOM** — 소프트웨어 구성 요소 목록
- **Supply Chain Attack** — 공급망 공격
- **Dependency Scanning** — 라이브러리 취약점 분석
- **Container Scanning** — 이미지 취약점 검사

## 11. Advanced / Real Attack Concepts

- **Privilege Escalation** — 권한 상승 공격
- **Lateral Movement** — 내부 시스템 확산
- **Persistence** — 공격 지속성 확보
- **Exfiltration** — 데이터 탈취
- **Backdoor** — 숨겨진 접근 경로
- **Zero-day** — 공개되지 않은 취약점
- **Exploit Chain** — 여러 취약점 조합 공격

---

# Part 7. Cloud / Platform

## 1. Cloud Fundamentals

- **Cloud Computing** — 인터넷 기반 컴퓨팅 자원 제공 모델
- **IaaS** — 인프라 (VM, 네트워크) 제공
- **PaaS** — 플랫폼 (runtime, DB) 제공
- **SaaS** — 완성된 애플리케이션 제공
- **Region** — 물리적 데이터 센터 그룹
- **Availability Zone** — 독립 장애 도메인
- **Multi-region** — 여러 지역에 서비스 분산
- **High Availability** — 장애에도 서비스 지속
- **Fault Tolerance** — 장애 발생 시 자동 복구

## 2. Compute Layer

- **Virtual Machine** — 하드웨어를 가상화한 실행 환경
- **Hypervisor** — VM을 생성/관리하는 소프트웨어
- **Bare Metal** — 가상화 없이 직접 실행
- **Instance** — 클라우드에서 실행되는 VM
- **Auto Scaling** — 부하에 따라 인스턴스 자동 조정
- **Serverless** — 서버 관리 없이 코드 실행
- **FaaS** — 함수 단위 실행 모델
- **Cold Start** — 서버리스 초기 실행 지연

## 3. Storage Layer

- **Object Storage** — 파일 기반 저장 (S3 등)
- **Block Storage** — 디스크 단위 저장
- **File Storage** — 파일 시스템 기반 공유 저장
- **Durability** — 데이터 보존 보장
- **Replication** — 데이터 복제
- **Lifecycle Policy** — 데이터 자동 관리 정책
- **Cold Storage** — 저비용 장기 저장

## 4. Networking (Cloud)

- **VPC** — 클라우드 내 격리된 네트워크
- **Subnet** — 네트워크 분할 단위
- **Public Subnet** — 인터넷 접근 가능
- **Private Subnet** — 내부 전용 네트워크
- **Internet Gateway** — 외부 인터넷 연결
- **NAT Gateway** — 내부 → 외부 통신 중계
- **Route Table** — 트래픽 경로 정의
- **Security Group** — 인스턴스 단위 방화벽
- **Network ACL** — 서브넷 단위 방화벽
- **Elastic IP** — 고정 공인 IP

## 5. Load Balancing / Traffic

- **Load Balancer** — 트래픽 분산 장치
- **L4 LB** — TCP 기반 분산
- **L7 LB** — HTTP 기반 분산
- **Sticky Session** — 동일 서버 유지
- **Health Check** — 서버 상태 검사
- **DNS Load Balancing** — DNS 기반 분산
- **Anycast** — 가장 가까운 노드로 라우팅

## 6. Identity / Access

- **IAM** — 사용자/권한 관리 시스템
- **Policy** — 접근 제어 규칙
- **Role** — 특정 권한 묶음
- **Assume Role** — 임시 권한 획득
- **Access Key** — API 인증 키
- **Federation** — 외부 인증 연동
- **Principle of Least Privilege** — 최소 권한 원칙

## 7. Managed Services

- **Managed DB** — 클라우드가 관리하는 데이터베이스
- **Managed Cache** — Redis 등 캐시 서비스
- **Queue Service** — 메시지 큐 제공
- **Event Bus** — 이벤트 기반 통신
- **CDN** — 콘텐츠 캐싱 네트워크
- **API Gateway** — API 진입점 관리

## 8. Observability (Cloud)

- **Cloud Monitoring** — 리소스 상태 모니터링
- **Log Service** — 로그 수집/분석
- **Metric** — 수치 기반 상태 데이터
- **Tracing** — 요청 흐름 추적
- **Alert** — 이상 감지 시 알림
- **Dashboard** — 시각화 도구

## 9. Cost / FinOps

- **Pay-as-you-go** — 사용량 기반 과금
- **Reserved Instance** — 장기 계약 할인
- **Spot Instance** — 저가/불안정 인스턴스
- **Cost Optimization** — 비용 최적화 전략
- **Overprovisioning** — 과도한 자원 할당
- **Idle Resource** — 사용하지 않는 리소스
- **Egress Cost** — 외부 트래픽 비용

## 10. Reliability / Resilience

- **Multi-AZ** — 여러 AZ에 분산 배치
- **Failover** — 장애 시 자동 전환
- **Backup** — 데이터 백업
- **Disaster Recovery** — 재해 복구 전략
- **RTO** — 복구 목표 시간
- **RPO** — 데이터 손실 허용 범위
- **Chaos Testing** — 장애 시뮬레이션

## 11. Platform / Advanced

- **Service Mesh** — 서비스 간 통신 제어 계층
- **Sidecar** — 네트워크/보안 기능 분리
- **Control Plane** — 시스템 제어 계층
- **Data Plane** — 실제 데이터 처리 계층
- **API Gateway** — API 트래픽 관리
- **Edge Computing** — 사용자 근처에서 처리

## 12. Hybrid / Multi-cloud

- **Hybrid Cloud** — 온프레미스 + 클라우드 혼합
- **Multi-cloud** — 여러 클라우드 사용
- **Cloud Bursting** — 필요 시 외부 확장
- **Vendor Lock-in** — 특정 클라우드 종속
- **Portability** — 환경 간 이동 가능성

---

# Part 8. Software Lifecycle / Process

## 1. Lifecycle Fundamentals

- **SDLC** — 소프트웨어 개발 전체 생명주기
- **Requirement Phase** — 요구사항 정의 단계
- **Design Phase** — 시스템 설계 단계
- **Implementation Phase** — 개발 단계
- **Testing Phase** — 검증 단계
- **Deployment Phase** — 배포 단계
- **Maintenance Phase** — 운영/개선 단계
- **Iteration** — 반복 개발 단위
- **Feedback Loop** — 결과를 다시 반영하는 구조

## 2. Development Methodologies

- **Waterfall** — 순차적 단계 진행 모델
- **Agile** — 반복/점진적 개발 방식
- **Scrum** — Agile 프레임워크
- **Sprint** — 일정 기간 개발 사이클
- **Backlog** — 작업 목록
- **Kanban** — 흐름 기반 작업 관리
- **Lean** — 낭비 최소화 중심 개발
- **XP (Extreme Programming)** — 품질 중심 개발 방식

## 3. Planning / Work Management

- **Epic** — 큰 단위 기능
- **Feature** — 사용자 기능 단위
- **Task** — 실행 가능한 작업
- **User Story** — 사용자 관점 요구사항
- **Story Point** — 작업 난이도 추정 단위
- **Velocity** — 팀 작업 처리 속도
- **Milestone** — 주요 목표 지점
- **Roadmap** — 장기 계획

## 4. Collaboration / Workflow

- **Code Review** — 코드 품질 검토
- **Pull Request (PR)** — 변경 요청 단위
- **Merge Strategy** — 코드 통합 방식
- **Git Flow** — 브랜치 전략
- **Trunk-based Development** — 단일 브랜치 중심 개발
- **Branch Protection** — 코드 보호 정책
- **Pair Programming** — 두 명이 함께 개발

## 5. Release Management

- **Release** — 배포 가능한 버전
- **Versioning** — 버전 관리 체계
- **Semantic Versioning** — 버전 규칙 (MAJOR.MINOR.PATCH)
- **Tag** — 특정 버전 표시
- **Hotfix** — 긴급 수정
- **Release Candidate** — 배포 후보 버전
- **Rollback** — 이전 버전으로 복귀

## 6. Quality Process

- **QA** — 품질 보증 활동
- **Test Strategy** — 테스트 접근 방식
- **Test Plan** — 테스트 계획
- **Acceptance Criteria** — 요구 충족 조건
- **Regression Testing** — 변경 영향 검증
- **Bug Tracking** — 버그 관리 시스템
- **Defect** — 결함

## 7. Incident / Operations

- **Incident** — 서비스 장애 이벤트
- **Severity** — 장애 심각도
- **On-call** — 장애 대응 담당자
- **Alerting** — 이상 감지 알림
- **Runbook** — 대응 절차 문서
- **Postmortem** — 장애 분석 문서
- **Blameless Culture** — 책임 추궁 없는 분석 문화
- **MTTR** — 평균 복구 시간
- **MTBF** — 평균 고장 간격

## 8. Reliability / SRE Process

- **SLO** — 목표 서비스 수준
- **SLA** — 고객 계약 기준
- **SLI** — 측정 지표
- **Error Budget** — 허용 가능한 실패 범위
- **Availability** — 서비스 가용성
- **Latency Objective** — 응답 시간 목표
- **Capacity Planning** — 자원 계획

## 9. Change Management

- **Change Request** — 변경 요청
- **Approval Process** — 승인 절차
- **Change Freeze** — 변경 제한 기간
- **Deployment Window** — 배포 가능 시간
- **Risk Assessment** — 변경 위험 평가

## 10. Documentation / Knowledge

- **Documentation** — 시스템 설명 문서
- **ADR (Architecture Decision Record)** — 설계 결정 기록
- **RFC** — 변경 제안 문서
- **Design Doc** — 설계 문서
- **Runbook** — 운영 절차 문서
- **Playbook** — 대응 전략 문서
- **Knowledge Base** — 지식 저장소

## 11. Metrics / Productivity

- **Lead Time** — 개발부터 배포까지 시간
- **Cycle Time** — 작업 완료까지 시간
- **Deployment Frequency** — 배포 빈도
- **Change Failure Rate** — 변경 실패 비율
- **DORA Metrics** — DevOps 성과 지표
- **Throughput** — 작업 처리량
- **WIP (Work In Progress)** — 진행 중 작업 수

## 12. Governance / Compliance

- **Compliance** — 규정 준수
- **Audit** — 시스템 검증
- **Policy** — 규칙 정의
- **Access Control** — 접근 관리
- **Data Governance** — 데이터 관리 정책
- **Change Log** — 변경 기록

---

# Part 9. Quality / Testing / Reliability

## 1. Testing Fundamentals

- **Testing** — 소프트웨어가 기대대로 동작하는지 검증하는 과정
- **Verification** — 명세대로 구현되었는지 확인
- **Validation** — 사용자 요구를 만족하는지 확인
- **Test Case** — 입력/기대 결과 정의
- **Test Suite** — 테스트 집합
- **Test Coverage** — 코드 커버리지 비율
- **Assertion** — 기대 결과 검증 조건
- **Test Fixture** — 테스트 환경 구성

## 2. Test Types

- **Unit Test** — 함수/모듈 단위 테스트
- **Integration Test** — 모듈 간 상호작용 테스트
- **System Test** — 전체 시스템 테스트
- **Acceptance Test** — 사용자 요구 기반 테스트
- **Regression Test** — 기존 기능 유지 검증
- **Smoke Test** — 핵심 기능 빠른 검증
- **End-to-End Test** — 사용자 흐름 전체 테스트

## 3. Advanced Testing

- **Property-based Testing** — 다양한 입력 자동 생성 테스트
- **Fuzz Testing** — 비정상 입력으로 오류 탐지
- **Mutation Testing** — 코드 변형 후 테스트 강도 평가
- **Contract Testing** — 서비스 간 인터페이스 검증
- **Snapshot Testing** — 결과 상태 비교 테스트
- **Load Testing** — 시스템 부하 테스트
- **Stress Testing** — 한계 상황 테스트
- **Soak Testing** — 장시간 안정성 테스트

## 4. Test Strategy / Design

- **Test Pyramid** — unit > integration > e2e 구조
- **Test Double** — 실제 객체 대체 (mock/stub)
- **Mock** — 호출/행위 검증 객체
- **Stub** — 고정된 응답 제공 객체
- **Fake** — 간단한 구현 객체
- **Boundary Testing** — 경계값 테스트
- **Equivalence Partitioning** — 입력 그룹화 테스트

## 5. Reliability Engineering

- **Reliability** — 시스템이 지속적으로 정상 동작하는 능력
- **Availability** — 서비스 사용 가능 시간 비율
- **Durability** — 데이터 유지 능력
- **Fault Tolerance** — 장애 발생 시 계속 동작
- **Resilience** — 장애 후 회복 능력
- **Redundancy** — 중복 시스템 구성
- **Graceful Degradation** — 일부 기능만 제한하며 유지

## 6. Failure / Fault Concepts

- **Fault** — 결함의 원인
- **Error** — 잘못된 상태
- **Failure** — 사용자에게 드러난 문제
- **Single Point of Failure** — 한 지점 장애로 전체 중단
- **Partial Failure** — 일부 시스템만 실패
- **Cascading Failure** — 장애가 연쇄적으로 확산
- **Retry Storm** — 재시도로 인한 과부하

## 7. Observability & Debugging

- **Observability** — 내부 상태를 외부에서 이해 가능하게 하는 능력
- **Logging** — 이벤트 기록
- **Metrics** — 수치 기반 상태 데이터
- **Tracing** — 요청 흐름 추적
- **Distributed Tracing** — 서비스 간 요청 추적
- **Debugging** — 오류 원인 분석
- **Profiling** — 성능 분석
- **Sampling** — 일부 데이터만 수집

## 8. Performance Engineering

- **Latency** — 요청 처리 시간
- **Throughput** — 처리량
- **Concurrency** — 동시 처리 수
- **Scalability** — 확장 가능성
- **Bottleneck** — 성능 제한 요소
- **Queueing** — 요청 대기 구조
- **Backpressure** — 처리 속도 차이로 인한 압력

## 9. Chaos / Failure Testing

- **Chaos Engineering** — 의도적으로 장애를 발생시켜 테스트
- **Fault Injection** — 장애 주입
- **Network Partition** — 네트워크 분리 상황 테스트
- **Latency Injection** — 지연 추가
- **Kill Switch** — 시스템 강제 종료 테스트
- **Game Day** — 실제 장애 시뮬레이션

## 10. SRE / Reliability Metrics

- **SLI** — 서비스 상태 측정 지표
- **SLO** — 목표 수준
- **SLA** — 계약 기준
- **Error Budget** — 허용 가능한 실패량
- **MTTR** — 평균 복구 시간
- **MTBF** — 평균 고장 간격
- **Uptime** — 서비스 가용 시간

## 11. Data Integrity / Consistency

- **Data Integrity** — 데이터 정확성 유지
- **Consistency** — 데이터 일관성
- **Replication Lag** — 복제 지연
- **Split Brain** — 분산 시스템 상태 불일치
- **Idempotency** — 반복 요청 안전성
- **Exactly-once** — 정확히 한 번 처리
- **At-least-once** — 최소 한 번 처리
- **At-most-once** — 최대 한 번 처리

## 12. Test Automation / CI Integration

- **Test Automation** — 테스트 자동화
- **CI Integration** — CI에 테스트 포함
- **Test Pipeline** — 테스트 실행 흐름
- **Flaky Test** — 불안정 테스트
- **Parallel Testing** — 병렬 테스트 실행
- **Test Isolation** — 테스트 간 독립성 유지

---

# Part 10. Domain Knowledge

## 1. Domain Fundamentals

- **Domain** — 시스템이 해결하려는 문제 영역
- **Business Logic** — 도메인 규칙을 코드로 구현한 것
- **Domain Model** — 도메인 개념을 구조화한 모델
- **Entity** — 고유 식별자를 가진 객체
- **Value Object** — 값 자체로 의미를 가지는 객체
- **Aggregate** — 일관성 단위 객체 집합
- **Invariant** — 항상 유지되어야 하는 조건

## 2. Domain Modeling (DDD)

- **DDD (Domain-Driven Design)** — 도메인 중심 설계 방법론
- **Bounded Context** — 도메인 경계 정의
- **Ubiquitous Language** — 팀 전체가 공유하는 용어
- **Context Map** — 도메인 간 관계 정의
- **Aggregate Root** — aggregate 접근 진입점
- **Repository** — 도메인 객체 저장/조회 추상화
- **Domain Service** — 엔티티에 속하지 않는 로직

## 3. Data Semantics

- **Business State** — 도메인 상태
- **State Transition** — 상태 변화 흐름
- **Lifecycle** — 객체 생애주기
- **Event** — 상태 변화 기록
- **Event Sourcing** — 이벤트 기반 상태 저장
- **Snapshot** — 상태 저장 시점
- **Derived Data** — 계산된 데이터
- **Consistency Rule** — 데이터 일관성 규칙

## 4. Financial Domain

- **Transaction** — 금전 이동 단위
- **Settlement** — 정산 과정
- **Ledger** — 거래 기록 장부
- **Reconciliation** — 데이터 일치 검증
- **Double-entry** — 차변/대변 기록 방식
- **Authorization** — 결제 승인
- **Capture** — 실제 금액 청구
- **Refund** — 환불
- **Chargeback** — 결제 취소/분쟁

## 5. Distributed Domain Logic

- **Saga** — 분산 트랜잭션 관리 패턴
- **Orchestration** — 중앙 제어 방식
- **Choreography** — 이벤트 기반 협력 방식
- **Compensation** — 실패 시 롤백 로직
- **Eventually Consistent** — 최종 일관성 모델
- **Idempotency Key** — 중복 요청 방지 키
- **Outbox Pattern** — 이벤트 전송 보장 패턴

## 6. Domain Constraints / Rules

- **Validation Rule** — 입력 검증 규칙
- **Business Rule** — 도메인 규칙
- **Policy** — 정책 기반 제어
- **Rate Limit** — 요청 제한
- **Quota** — 사용량 제한
- **SLA Rule** — 서비스 계약 조건

## 7. Domain Events / Messaging

- **Domain Event** — 도메인 상태 변화 이벤트
- **Event Stream** — 이벤트 흐름
- **Event Log** — 이벤트 저장소
- **Message Broker** — 메시지 중계 시스템
- **Event Ordering** — 이벤트 순서 보장
- **Exactly-once Semantics** — 정확히 한 번 처리
- **At-least-once** — 최소 한 번 전달
- **Event Replay** — 이벤트 재처리

## 8. Domain-specific Performance

- **Hot Path** — 핵심 처리 경로
- **Critical Path** — 전체 지연에 영향 주는 경로
- **Latency Budget** — 허용 가능한 지연
- **Throughput Requirement** — 처리량 요구사항
- **Peak Load** — 최대 부하
- **Burst Traffic** — 순간 트래픽 증가

## 9. Domain Risk / Failure

- **Data Loss** — 데이터 유실
- **Inconsistency** — 데이터 불일치
- **Duplicate Processing** — 중복 처리
- **Partial Failure** — 일부 실패
- **Fraud** — 부정 행위
- **Abuse** — 시스템 악용
- **Race Condition (Business)** — 상태 경쟁 문제

## 10. Domain Compliance / Regulation

- **Compliance** — 규정 준수
- **Audit** — 감사
- **Data Retention** — 데이터 보관 정책
- **PII** — 개인 식별 정보
- **GDPR** — 개인정보 보호 규정
- **KYC** — 고객 신원 확인
- **AML** — 자금 세탁 방지

## 11. Domain Integration

- **Third-party Integration** — 외부 서비스 연동
- **API Contract** — 인터페이스 정의
- **Webhook** — 이벤트 기반 호출
- **Retry Policy** — 재시도 정책
- **Timeout Policy** — 시간 제한
- **Circuit Breaker** — 장애 차단

## 12. Domain Abstraction

- **Anti-corruption Layer** — 외부 시스템 영향 차단
- **Adapter** — 인터페이스 변환
- **Facade** — 단순화된 인터페이스
- **Translation Layer** — 도메인 간 변환
- **Canonical Model** — 표준 데이터 모델

---

# Part 11. Meta Layer (Trade-off / System Thinking / Decision)

## 1. Trade-off

- **Trade-off** — 하나를 얻으면 다른 것을 포기해야 하는 관계
- **Latency vs Throughput** — 빠른 응답 vs 많은 처리량
- **Consistency vs Availability** — 일관성 vs 가용성
- **Memory vs CPU** — 메모리 사용 vs 연산 비용
- **Read vs Write Optimization** — 읽기 최적화 vs 쓰기 최적화
- **Cost vs Performance** — 비용 vs 성능
- **Simplicity vs Flexibility** — 단순성 vs 확장성

## 2. System Thinking

- **System Thinking** — 시스템 전체를 연결된 구조로 보는 사고 방식
- **Feedback Loop** — 출력이 다시 입력에 영향을 주는 구조
- **Emergent Behavior** — 개별 요소로는 설명 안 되는 시스템 행동
- **Bottleneck** — 전체 성능을 제한하는 요소
- **Critical Path** — 전체 지연을 결정하는 경로
- **Local Optimization** — 부분 최적화
- **Global Optimization** — 전체 최적화

## 3. Complexity Management

- **Complexity** — 시스템 복잡도
- **Essential Complexity** — 문제 자체의 복잡성
- **Accidental Complexity** — 불필요하게 증가한 복잡성
- **Abstraction** — 복잡성을 숨기는 방법
- **Modularity** — 시스템 분리 구조
- **Coupling** — 모듈 간 의존성
- **Cohesion** — 모듈 내부 응집도

## 4. Scalability Thinking

- **Scalability** — 시스템 확장 능력
- **Vertical Scaling** — 자원 확장
- **Horizontal Scaling** — 노드 추가
- **Load Distribution** — 부하 분산
- **Elasticity** — 자동 확장
- **Capacity Planning** — 자원 계획
- **Hotspot** — 특정 지점 과부하

## 5. Failure-Oriented Thinking

- **Failure Mode** — 시스템이 실패하는 방식
- **Single Point of Failure** — 단일 장애 지점
- **Partial Failure** — 일부만 실패하는 상황
- **Failure Domain** — 장애 영향 범위
- **Blast Radius** — 장애 영향 크기
- **Fail-fast** — 빠르게 실패 감지
- **Graceful Degradation** — 부분 기능 유지
- **Fallback** — 대체 경로

## 6. Decision Making

- **Decision Criteria** — 선택 기준
- **Constraint** — 제약 조건
- **Assumption** — 가정
- **Risk** — 잠재적 문제
- **Cost Analysis** — 비용 분석
- **Opportunity Cost** — 기회 비용
- **Short-term vs Long-term** — 단기 vs 장기

## 7. Architecture Thinking

- **Architecture Style** — 시스템 구조 방식
- **Monolith vs MSA** — 단일 vs 분산 구조
- **Layered vs Event-driven** — 계층 vs 이벤트 기반
- **Stateless vs Stateful** — 상태 없음 vs 상태 유지
- **Sync vs Async** — 동기 vs 비동기

## 8. Performance Thinking

- **Latency Budget** — 허용 가능한 지연
- **Throughput Limit** — 처리량 한계
- **Tail Latency** — 최악 지연 시간
- **Queueing Theory** — 대기열 이론
- **Little's Law** — 처리량/지연 관계

## 9. Operational Thinking

- **Operability** — 운영 가능성
- **Observability** — 상태 파악 가능성
- **Maintainability** — 유지보수 용이성
- **Deployability** — 배포 용이성
- **Debuggability** — 디버깅 가능성

## 10. Evolution / Change

- **Evolution** — 시스템 변화
- **Backward Compatibility** — 이전 버전 호환
- **Migration** — 시스템 이전
- **Refactoring** — 구조 개선
- **Rewrite** — 재작성
- **Technical Debt** — 기술 부채

## 11. Abstraction & Boundaries

- **Boundary** — 시스템 경계
- **Interface** — 상호작용 계약
- **Encapsulation** — 내부 숨김
- **Leakage** — 추상화 깨짐
- **Anti-pattern** — 잘못된 설계 방식
- **Over-engineering** — 과도한 설계
- **Under-engineering** — 부족한 설계

---

# Part 12. Tooling / Ecosystem / Developer Productivity

## 1. Version Control Deep

- **Git** — 분산 버전 관리 시스템
- **Commit** — 변경 기록 단위
- **Rebase** — 히스토리 재정렬
- **Cherry-pick** — 특정 커밋 선택 적용
- **Merge Conflict** — 변경 충돌
- **Detached HEAD** — 브랜치와 분리된 상태
- **Bisect** — 버그 발생 지점 탐색
- **Submodule** — 외부 저장소 포함
- **Monorepo** — 단일 저장소 구조

## 2. Build / Package Management

- **Package Manager** — 라이브러리 관리 도구
- **Dependency Graph** — 의존성 구조
- **Lockfile** — 의존성 버전 고정
- **Semantic Versioning** — 버전 규칙
- **Binary Distribution** — 빌드된 파일 배포
- **Source Build** — 소스 기반 빌드
- **Cross Compilation** — 다른 환경용 빌드

## 3. CLI / Shell / Environment

- **Shell** — 명령 실행 인터페이스
- **Environment Variable** — 실행 환경 변수
- **PATH** — 실행 파일 경로
- **stdin/stdout/stderr** — 입출력 스트림
- **Pipe** — 명령어 연결
- **TTY** — 터미널 인터페이스
- **tmux** — 터미널 멀티플렉서
- **Shell Script** — 자동화 스크립트

## 4. Editor / IDE / LSP

- **IDE** — 통합 개발 환경
- **Editor** — 코드 편집기
- **LSP** — 언어 서버 프로토콜
- **Syntax Highlighting** — 코드 시각화
- **Code Completion** — 자동 완성
- **Refactoring Tool** — 코드 구조 변경 도구
- **Debugger** — 실행 중 상태 분석 도구
- **Breakpoint** — 실행 중단 지점

## 5. Debugging / Profiling

- **Debugger** — 코드 실행 추적 도구
- **Stack Trace** — 함수 호출 흐름
- **Heap Dump** — 메모리 상태 스냅샷
- **Core Dump** — 프로세스 상태 저장
- **Profiling** — 성능 분석
- **CPU Profile** — CPU 사용 분석
- **Memory Profile** — 메모리 사용 분석
- **Flame Graph** — 성능 시각화

## 6. Observability Tooling

- **Log Aggregator** — 로그 수집 시스템
- **Metrics Collector** — 지표 수집
- **Tracing System** — 요청 흐름 추적
- **APM** — 애플리케이션 성능 관리
- **Alerting System** — 알림 시스템
- **Dashboard** — 시각화

## 7. Automation / Workflow

- **Task Runner** — 작업 자동화 도구
- **Makefile** — 빌드/작업 정의 파일
- **Workflow Engine** — 작업 흐름 관리
- **Cron** — 주기적 작업 실행
- **Scheduler** — 작업 스케줄링
- **Job Queue** — 비동기 작업 큐

## 8. API / Contract Tooling

- **OpenAPI** — API 명세 표준
- **Swagger** — API 문서/테스트 도구
- **gRPC Proto** — RPC 인터페이스 정의
- **Schema Validation** — 데이터 검증
- **Code Generation** — 코드 자동 생성
- **Mock Server** — 테스트용 서버

## 9. Testing Tooling

- **Test Runner** — 테스트 실행 도구
- **Assertion Library** — 검증 도구
- **Coverage Tool** — 커버리지 측정
- **Mock Framework** — 가짜 객체 생성
- **Benchmark Tool** — 성능 측정
- **Load Testing Tool** — 부하 테스트 도구

## 10. Container / Infra Tooling

- **Docker CLI** — 컨테이너 관리 도구
- **kubectl** — Kubernetes CLI
- **Helm** — Kubernetes 패키지 매니저
- **Terraform CLI** — 인프라 관리 도구
- **Ansible** — 자동화 도구
- **Cloud CLI** — 클라우드 관리 도구

## 11. Collaboration / Dev Workflow

- **Issue Tracker** — 작업 관리 시스템
- **Wiki** — 문서 시스템
- **Code Review Tool** — 코드 리뷰 도구
- **PR Template** — 변경 요청 템플릿
- **Commit Convention** — 커밋 규칙
- **Changelog** — 변경 기록

## 12. Advanced Tooling

- **Static Analysis** — 정적 코드 분석
- **Lint** — 코드 규칙 검사
- **Formatter** — 코드 스타일 자동화
- **Type Checker** — 타입 검사
- **Fuzz Tool** — 입력 변형 테스트
- **Security Scanner** — 취약점 분석
- **Dependency Scanner** — 라이브러리 검사

---

# Part 13. Distributed Systems

## 1. Distributed Fundamentals

- **Distributed System** — 여러 노드가 협력하여 하나의 시스템처럼 동작
- **Node** — 시스템 구성 단위
- **Cluster** — 여러 노드의 집합
- **Partition** — 네트워크 단절 상태
- **Partial Failure** — 일부 노드만 실패하는 상황
- **Unreliable Network** — 네트워크는 항상 실패 가능

## 2. Consistency / CAP

- **Consistency** — 모든 노드가 동일한 데이터를 보는 것
- **Availability** — 항상 응답을 반환하는 것
- **Partition Tolerance** — 네트워크 분리에도 동작
- **CAP Theorem** — C/A/P 중 2개만 선택 가능
- **Strong Consistency** — 즉시 일관성
- **Eventual Consistency** — 시간이 지나면 일관성
- **Causal Consistency** — 인과 관계 기반 일관성
- **Read-your-writes** — 자신의 쓰기 반영 보장
- **Monotonic Read** — 읽기 순서 보장

## 3. Replication / Data Distribution

- **Replication** — 데이터 복제
- **Leader-Follower** — 단일 쓰기 구조
- **Leader Election** — 리더 선정 과정
- **Multi-leader** — 다중 쓰기 구조
- **Sharding** — 데이터 분할 저장
- **Partition Key** — 데이터 분산 기준
- **Consistent Hashing** — 분산 키 매핑 방식
- **Rebalancing** — 노드 변화 시 데이터 재배치
- **Replication Lag** — 복제 지연

## 4. Consensus / Coordination

- **Consensus** — 여러 노드가 동일한 상태에 합의
- **Raft** — 대표적인 합의 알고리즘
- **Paxos** — 고전 합의 알고리즘
- **Leader Election** — 리더 선정
- **Quorum** — 합의에 필요한 최소 노드 수
- **Split Brain** — 네트워크 분리로 인한 이중 리더
- **ZooKeeper** — 분산 coordination 시스템
- **etcd** — key-value 기반 coordination 시스템

## 5. Distributed Transactions

- **Distributed Transaction** — 여러 노드에 걸친 트랜잭션
- **2PC (Two-phase Commit)** — 분산 트랜잭션 프로토콜
- **Prepare Phase** — 준비 단계
- **Commit Phase** — 확정 단계
- **Blocking Problem** — coordinator 실패 시 멈춤
- **Saga Pattern** — 분산 트랜잭션 대안
- **Compensation** — 실패 시 롤백 로직

## 6. Messaging / Event Systems

- **Message Queue** — 메시지 전달 시스템
- **Pub/Sub** — 발행/구독 모델
- **Broker** — 메시지 중계 서버
- **Partition** — 메시지 분할 단위
- **Offset** — 메시지 위치
- **Consumer Group** — 메시지 소비 그룹
- **At-least-once** — 최소 1번 전달
- **At-most-once** — 최대 1번 전달
- **Exactly-once** — 정확히 1번 처리 (이론적)

## 7. Time / Ordering

- **Logical Clock** — 이벤트 순서 추적
- **Lamport Clock** — 논리적 시간
- **Vector Clock** — 인과 관계 추적
- **Wall Clock** — 실제 시간
- **Clock Skew** — 시간 차이
- **Event Ordering** — 이벤트 순서 보장

## 8. Fault Tolerance / Recovery

- **Failover** — 장애 시 자동 전환
- **Retry** — 재시도
- **Backoff** — 점진적 지연 재시도
- **Circuit Breaker** — 장애 전파 차단
- **Bulkhead** — 리소스 격리
- **Checkpoint** — 상태 저장
- **Recovery** — 장애 복구

## 9. Distributed Caching

- **Cache** — 데이터 임시 저장
- **Cache Aside** — 필요 시 캐시 로딩
- **Write-through** — 쓰기 시 캐시+DB 동시 반영
- **Write-back** — 캐시 먼저 반영
- **Cache Invalidation** — 캐시 무효화
- **Cache Stampede** — 캐시 만료 시 트래픽 폭증
- **Hot Key** — 특정 키 집중 요청

## 10. Observability (Distributed)

- **Distributed Tracing** — 서비스 간 요청 추적
- **Trace ID** — 요청 식별자
- **Span** — 요청 단위 작업
- **Correlation ID** — 로그 연계 식별자
- **Service Graph** — 서비스 관계 시각화

## 11. Scaling Patterns

- **Horizontal Scaling** — 노드 추가 확장
- **Load Distribution** — 트래픽 분산
- **Auto Scaling** — 자동 확장
- **Geo-distribution** — 지역 분산
- **Edge Computing** — 사용자 근처 처리

## 12. Anti-patterns / Failure

- **Thundering Herd** — 동시에 요청 몰림
- **Retry Storm** — 재시도 폭증
- **Split Brain** — 상태 불일치
- **Hot Partition** — 특정 파티션 과부하
- **Data Skew** — 데이터 불균형
- **Cascade Failure** — 장애 확산

---

# Part 14. Runtime / Language Internals

## 1. Memory Management

- **GC Algorithm** — mark-sweep, generational, concurrent GC
- **Escape Analysis** — stack vs heap 결정
- **Memory Model** — happens-before, visibility 규칙
- **Stack Growth** — dynamic stack 확장
- **Heap Fragmentation** — 메모리 단편화
- **GC Pause** — GC 실행 중 멈춤
- **Write Barrier** — GC 정확성 보장 메커니즘

## 2. Scheduler / Execution

- **Scheduler** — goroutine M:N scheduling
- **M:N Threading** — 유저 스레드 vs OS 스레드
- **Goroutine** — Go 경량 실행 단위
- **Work Stealing** — idle 스레드가 작업 훔침
- **Preemption** — 실행 중 강제 전환
- **Park/Unpark** — goroutine 대기/재개

## 3. Compiler / Optimization

- **Inlining** — 함수 호출 최적화
- **Devirtualization** — 동적 호출 제거
- **Dead Code Elimination** — 사용 안 하는 코드 제거
- **Loop Unrolling** — 반복 최적화
- **SSA** — 정적 단일 대입 (컴파일러 중간 표현)
- **IR** — 중간 표현 (Intermediate Representation)

## 4. Language Runtime

- **Runtime** — 프로그램 실행 환경
- **Bootstrap** — 런타임 초기화
- **Goroutine Stack** — 초기 2KB, 동적 확장
- **Finalizer** — GC 전 정리 함수
- **reflect** — 런타임 타입 정보
- **unsafe** — 포인터 직접 접근
- **CGO** — Go에서 C 코드 호출

## 5. ABI / Binary Interface

- **ABI (Application Binary Interface)** — 바이너리 인터페이스 규약
- **Calling Convention** — 함수 호출 규칙
- **Register Allocation** — CPU 레지스터 사용 전략
- **FFI** — 언어 간 호출 인터페이스
- **Symbol Table** — 함수/변수 이름 테이블
- **Relocation** — 메모리 주소 조정

---

# Part 15. Hardware / Computer Architecture

## 1. CPU Execution

- **CPU Pipeline** — 명령 실행 흐름 (fetch → decode → execute)
- **Pipeline Stall** — 파이프라인 지연
- **Branch Prediction** — 분기 예측
- **Branch Misprediction** — 분기 실패 비용
- **Out-of-order Execution** — 명령 재정렬 실행
- **Speculative Execution** — 투기적 실행
- **Superscalar** — 여러 명령 동시 실행

## 2. Cache Hierarchy

- **L1/L2/L3 Cache** — 캐시 계층 구조
- **Cache Line** — 캐시 단위 (64 bytes)
- **Cache Hit / Miss** — 캐시 적중/실패
- **Cache Eviction** — 캐시 교체
- **False Sharing** — 같은 캐시 라인 동시 접근 충돌
- **Cache Thrashing** — 반복적 캐시 교체
- **Prefetching** — 미리 데이터 로드

## 3. Memory Subsystem

- **MESI Protocol** — 캐시 일관성 프로토콜
- **Cache Coherency** — CPU 간 캐시 동기화
- **Memory Bandwidth** — 메모리 전송 속도
- **NUMA** — CPU별 메모리 접근 비용 차이
- **NUMA Locality** — 로컬 메모리 접근 최적화
- **TLB Miss** — 주소 변환 캐시 실패 비용
- **Memory Latency** — 메모리 접근 지연

## 4. Concurrency Hardware

- **Atomic Instruction** — CPU 수준 원자 연산
- **Memory Barrier** — CPU 명령 재정렬 방지
- **Load/Store Ordering** — 메모리 접근 순서 규칙
- **CAS (Compare-and-Swap)** — lock-free 연산
- **Spinlock Cost** — busy-wait CPU 소모
- **Context Switch Cost** — 레지스터 저장/복원 비용

## 5. I/O Hardware

- **DMA** — CPU 없이 장치 ↔ 메모리 전송
- **Interrupt Coalescing** — 인터럽트 묶음 처리
- **PCIe** — 고속 장치 연결
- **IOMMU** — 장치 메모리 접근 제어
- **NVMe** — 고속 SSD 인터페이스

---

# Part 16. API / Interface Design

## 1. API Fundamentals

- **API Design** — 인터페이스 설계
- **Contract** — API 사용 규약
- **Endpoint** — 요청 수신 지점
- **Resource** — API가 다루는 대상
- **Representation** — 리소스 표현 방식
- **Versioning Strategy** — URI vs header vs content-type

## 2. Correctness

- **Idempotency** — 여러 번 호출해도 동일 결과
- **Idempotency Key** — 중복 요청 방지 키
- **Safety** — 상태 변경 없는 작업 (GET)
- **At-least-once** — 최소 1번 처리 보장
- **Retry Strategy** — 재시도 정책

## 3. Pagination / Query

- **Offset Pagination** — 페이지 번호 기반
- **Cursor Pagination** — 커서 기반 (대용량 적합)
- **Keyset Pagination** — 정렬 키 기반
- **Filtering** — 조건 기반 조회
- **Sorting** — 정렬
- **Projection** — 필요한 필드만 조회

## 4. Compatibility

- **Backward Compatibility** — 이전 클라이언트 호환
- **Breaking Change** — 호환성 깨는 변경
- **Additive Change** — 안전한 필드 추가
- **Schema Evolution** — 필드 추가/삭제 전략
- **Deprecation** — 사용 중단 예정 표시
- **Sunset Policy** — API 종료 정책

## 5. Performance / Reliability

- **Rate Limiting** — 요청 제한
- **Throttling** — 처리 속도 제한
- **Timeout** — 응답 시간 제한
- **Retry-After** — 재시도 대기 시간 안내
- **Circuit Breaker** — 장애 전파 차단
- **Bulkhead** — 요청 격리

## 6. Contract Stability

- **OpenAPI** — API 명세 표준
- **Contract Testing** — 인터페이스 검증
- **Consumer-Driven Contract** — 소비자 주도 계약
- **Schema Validation** — 요청/응답 검증
- **API Gateway** — API 진입점 관리
- **Mock Server** — 테스트용 서버

---

# Part 17. Data Engineering / Streaming

## 1. Stream Processing

- **Stream Processing** — 실시간 데이터 처리
- **Batch Processing** — 묶음 단위 처리
- **Micro-batch** — 작은 배치 단위 처리
- **Event Time** — 이벤트 발생 시간
- **Processing Time** — 처리 시점 시간
- **Ingestion Time** — 수집 시점 시간

## 2. Windowing

- **Windowing** — 시간 기반 데이터 집계
- **Tumbling Window** — 겹치지 않는 고정 크기 윈도우
- **Sliding Window** — 겹치는 윈도우
- **Session Window** — 활동 기반 윈도우
- **Watermark** — 이벤트 시간 기준 처리 마감선
- **Late Data** — 늦게 도착한 데이터
- **Out-of-order Handling** — 순서 뒤틀림 처리

## 3. Pipeline Architecture

- **Source** — 데이터 입력 지점
- **Sink** — 데이터 출력 지점
- **Transform** — 데이터 변환
- **Filter** — 조건 기반 선택
- **Join** — 스트림 결합
- **Aggregation** — 집계
- **DAG** — 처리 흐름 그래프

## 4. Delivery Semantics

- **Exactly-once Processing** — 정확히 한 번 처리 (이론적)
- **At-least-once** — 최소 한 번 보장
- **At-most-once** — 최대 한 번
- **Checkpointing** — 처리 진행 상태 저장
- **Offset Management** — 메시지 위치 관리
- **Idempotent Consumer** — 중복 처리 안전한 소비자

## 5. CDC / Integration

- **CDC (Change Data Capture)** — DB 변경 스트림화
- **Debezium** — CDC 대표 도구
- **Outbox Pattern** — 이벤트 전송 보장
- **Event Log** — 이벤트 저장소
- **Schema Registry** — 메시지 스키마 관리
- **Data Lineage** — 데이터 출처 추적

---

# Part 18. Time / Clock

## 1. Clock Types

- **Wall Clock** — 실제 현재 시간
- **Monotonic Clock** — 증가만 하는 시간 (역행 없음)
- **Clock Drift** — 시간 차이 발생
- **Clock Skew** — 노드 간 시간 차이
- **NTP** — 네트워크 시간 동기화 프로토콜
- **PTP** — 정밀 시간 프로토콜

## 2. Distributed Time

- **Logical Clock** — 이벤트 순서 추적용 시간
- **Lamport Clock** — 논리적 시간 (단순 순서)
- **Vector Clock** — 인과 관계 추적
- **Hybrid Logical Clock** — wall + logical 결합
- **Happens-before** — 이벤트 인과 관계
- **Causal Ordering** — 인과 순서 보장

## 3. Time in Systems

- **Timestamp** — 시간 기록
- **TTL (Time-to-Live)** — 유효 시간
- **Expiry** — 만료
- **Lease** — 시간 제한 소유권
- **Timeout** — 시간 초과
- **Deadline** — 처리 마감 시간
- **Epoch** — 기준 시간

## 4. Time-related Bugs

- **Time Zone Bug** — 시간대 처리 오류
- **Daylight Saving Bug** — 서머타임 오류
- **Leap Second** — 윤초 처리 문제
- **Clock Rollback** — 시간 역행 문제
- **Thundering Herd (TTL)** — 동시 캐시 만료

---

# Part 19. Queueing / Performance Theory

## 1. Queueing Fundamentals

- **Queue** — 대기열
- **Arrival Rate (λ)** — 요청 도착 속도
- **Service Rate (μ)** — 처리 속도
- **Utilization (ρ)** — 시스템 사용률 = λ/μ
- **Little's Law** — L = λW (대기 수 = 도착률 × 대기 시간)
- **Queue Length** — 대기 중인 요청 수
- **Wait Time** — 대기 시간
- **Service Time** — 처리 시간

## 2. Latency Analysis

- **Latency** — 요청 처리 시간
- **p50 / p95 / p99** — 백분위 지연
- **Tail Latency** — 최악 지연 (p99, p999)
- **Head-of-line Blocking** — 앞 요청 지연이 뒤에 영향
- **Jitter** — 지연 시간 변동성
- **SLO Latency** — 목표 지연 시간

## 3. Capacity / Saturation

- **Throughput** — 처리량
- **Saturation** — 시스템 포화 상태
- **Bottleneck** — 처리 제한 요소
- **Overload** — 처리 한계 초과
- **Backpressure** — 처리 속도 차이 압력
- **Shedding** — 초과 요청 거절

## 4. Performance Models

- **Amdahl's Law** — 병렬화 한계 법칙
- **USL (Universal Scalability Law)** — 확장성 한계 모델
- **Knee Point** — 성능 급격히 저하 시점
- **Working Set** — 자주 접근하는 데이터 집합
- **Working Set Size** — 메모리 요구량
- **Cache Efficiency** — 캐시 활용도

---

# Part 20. Deep Dives

## 1. Observability Internals

- **Sampling Strategy** — tracing 샘플링 방식
- **Head-based Sampling** — 요청 시작 시 결정
- **Tail-based Sampling** — 완료 후 결정
- **Cardinality** — metric 차원 수 (폭발 문제)
- **Log Structure** — structured logging
- **Trace Propagation** — context 전달 방식
- **Exemplar** — metric과 trace 연결

## 2. Build / Linking / Binary

- **Linker** — object 파일 결합 도구
- **Static Linking** — 모든 라이브러리 포함
- **Dynamic Linking** — 런타임 링크
- **Shared Library** — 공유 라이브러리
- **Symbol Table** — 함수/변수 이름 정보
- **Relocation** — 메모리 주소 조정
- **Strip** — 디버그 정보 제거

## 3. Kernel Advanced

- **eBPF** — 커널 내부 동적 추적/확장
- **io_uring** — syscall 최소화 async I/O
- **Scheduler Class** — CFS / RT / Deadline
- **Page Reclaim** — 메모리 회수 메커니즘
- **NUMA Balancing** — 메모리 접근 최적화
- **kprobes/uprobes** — 커널/유저 함수 추적
- **perf_events** — 성능 이벤트 시스템

## 4. Network Deep

- **TCP Congestion Control** — CUBIC, BBR, Reno
- **Nagle's Algorithm** — 작은 패킷 병합
- **Delayed ACK** — ACK 지연 전송
- **SYN Backlog** — 연결 대기 큐
- **TIME_WAIT** — 연결 종료 대기 상태
- **TLS Handshake Cost** — 초기 지연 비용
- **TCP Fast Open** — 핸드셰이크 최적화
