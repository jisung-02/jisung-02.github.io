---
title: "리눅스 네트워크 네임스페이스"
date: 2026-04-01
publish: true
category: "시스템·네트워크"
tags: ["리눅스", "네트워크"]
description: "커널 수준에서 네트워크 스택을 격리하는 리눅스 네트워크 네임스페이스 정리"
---


리눅스 **네트워크 네임스페이스 (network namespace)**는 커널 수준에서 **네트워크 스택을 분리(격리)**하는 기능이다. 단순한 "가상 네트워크"가 아니라, 커널 리소스 단위에서 완전히 독립된 네트워크 환경을 여러 개 만드는 메커니즘이다.

---

## 1. 기본 개념

### 1.1 핵심 정의

하나의 리눅스 시스템 안에서 여러 개의 독립된 네트워크 스택을 만드는 기능이다.

각 네임스페이스는 아래를 자기만의 것으로 가진다.
- 네트워크 인터페이스 (eth0 등)
- IP 주소
- 라우팅 테이블
- ARP 테이블
- 포트/소켓
- iptables/nftables (방화벽 규칙)

즉, 같은 OS 안에 있지만 **서로 다른 "네트워크 세계"**가 존재한다.

### 1.2 동작 원리

**기본 상태**: 리눅스는 기본적으로 하나의 네트워크 스택을 공유한다.

```
[Process A] ─┐
[Process B] ─┼── same network stack
[Process C] ─┘
```

**네임스페이스 생성 후**:

```
[Process A] → netns: A (독립)
[Process B] → netns: B (독립)
[Process C] → default netns
```

각 프로세스는 자신이 속한 netns만 볼 수 있다.
- A는 B의 인터페이스/포트/라우팅을 전혀 모른다
- 동일 IP/포트 재사용이 가능하다

**커널 관점**:
- 네트워크 리소스는 namespace 단위로 분리된다
- 프로세스는 특정 netns에 바인딩된다
- `setns`, `clone`, `unshare` syscall로 조작한다

### 1.3 왜 가능한가

리눅스 네임스페이스는 다음과 같다.

> "global resource를 namespace 단위로 분할해서 프로세스가 다른 view를 보게 만드는 abstraction"

- 실제 리소스는 커널에 존재한다
- 접근 관점(view)만 분리된다

→ virtualization이 아니라 **logical isolation**이다.

---

## 2. 주요 특징

### 2.1 인터페이스는 namespace에 속함
- 하나의 NIC는 하나의 netns에만 존재한다
- 이동 가능: `ip link set ... netns`

### 2.2 기본 상태는 loopback만 있음

새 netns 생성 시 `lo (127.0.0.1)`만 존재한다.
→ 외부와 통신하려면 추가 설정이 필요하다.

### 2.3 namespace 간 연결 방법

**(1) veth pair**— 가장 핵심
```
[netns A] veth0 <----> veth1 [netns B]
```
virtual cable

**(2) bridge**
L2 스위치처럼 연결한다.

**(3) NAT**
외부 인터넷에 연결한다.

---

## 3. OSI 계층과의 관계

### 3.1 왜 OSI 계층으로 딱 떨어지지 않나

```
OSI = 데이터 처리 관점
netns = 리소스 격리 관점
```

→ 서로 **orthogonal**한 개념이다.

- OSI 모델: 통신 프로토콜의 기능 분리 모델, 데이터 흐름 기준 abstraction
- 네임스페이스: "네트워크를 어떻게 처리하냐"가 아니라 "누가 어떤 네트워크를 보느냐"의 문제

### 3.2 굳이 매핑하면

| 요소 | OSI 계층 |
|------|---------|
| NIC / 인터페이스 | L1 (Physical) |
| MAC / 브리지 / ARP | L2 (Data Link) |
| IP / Routing | L3 (Network) |
| TCP/UDP / 포트 | L4 (Transport) |

→ **"L2~L4 전체를 통째로 분리하는 개념"**이라고 보는 게 가장 정확하다.

### 3.3 커널 레벨에서 보면

네임스페이스는 아래를 분리한다.
- network device list
- routing table
- socket table
- conntrack
- firewall rules

```
netns = "mini TCP/IP stack instance"
```

### 3.4 직관적 이해

```
OSI 관점:
App → TCP → IP → Ethernet → Wire

netns 관점:
[namespace A] → 위 스택 전체
[namespace B] → 위 스택 전체
```

→ 스택 자체를 복제하는 느낌이다.

### 3.5 주의할 포인트

**오해**: "IP만 분리됨"
**실제**: 인터페이스 + 포트 + routing + firewall 전부 분리된다

**L7 (Application)은 포함되지 않는다**
HTTP, gRPC 같은 L7은 영향을 받지 않는다.

### 3.6 아키텍처적 정의

```
[Application Layer]
[Transport]
[Network]
[Data Link]
[Physical]
-----------------
[Namespace (kernel isolation)]
```

OSI 위에 존재하는 "Layer -1 (커널 격리 레이어)"이다.

---

## 4. 실제 사용 사례

### 4.1 Docker / Kubernetes
```
컨테이너 = netns 하나

Container A → netns A
Container B → netns B
```
→ 서로 IP 충돌이 없다.

### 4.2 OpenStack
- qrouter namespace: routing / NAT 담당
- qdhcp namespace: DHCP 담당
- floating IP 처리

```
qrouter-xxx netns
└─ routing / NAT 담당
```

### 4.3 보안 격리 / sandbox
- 특정 프로세스의 외부 네트워크를 차단한다
- 테스트 환경을 분리한다

---

## 5. 기본 명령어

```bash
# 네임스페이스 생성
ip netns add ns1

# 확인
ip netns list

# 해당 네임스페이스에서 실행
ip netns exec ns1 ip addr
```

---

## 6. Trade-off

| | 내용 |
|--|------|
| **장점**| 커널 레벨 isolation (빠름), 가볍다 (VM 대비), 컨테이너 기반 구조 핵심 |
| **단점**| 네트워크 연결 직접 구성 필요, 디버깅 어려움 (namespace context 필요), observability 어려움 (특히 TLS/QUIC 환경) |

**Edge case / 실패 조건**:
- 네임스페이스 안에서 DNS 없음 → 외부 통신 실패
- default route 없음 → outbound 실패
- veth 연결 안 하면 → 완전 고립 상태
- iptables 잘못 설정 → 디버깅 매우 어려움

---

## 7. OpenStack qrouter namespace 심화

### 7.1 개념 정의

```
qrouter namespace = OpenStack virtual router의 Linux 구현체
```

- 이름: `qrouter-<router_uuid>`
- 역할: tenant network ↔ external network 연결, routing + NAT + firewall 수행
- 생성 주체: `neutron-l3-agent`

### 7.2 전체 구조

```
        [ External Network ]
                │
          (br-ex bridge)
                │
          qg-xxxx interface
                │
        ┌──────────────────┐
        │  qrouter netns   │
        │                  │
        │  Routing Table   │
        │  iptables (NAT)  │
        │                  │
        │ qr-xxxx interfaces
        └──────────────────┘
                │
         (br-int bridge)
                │
         [ Tenant Network ]
                │
              VM
```

### 7.3 내부 구성 요소

**인터페이스 3종**:

| 인터페이스 | 역할 |
|-----------|------|
| `qr-xxxx` | tenant network 연결, VM subnet gateway |
| `qg-xxxx` | external network 연결, floating IP / SNAT 수행 |
| `lo` | loopback |

```bash
# 확인
ip netns exec qrouter-xxx ip a
```

**라우팅 테이블**:
```bash
ip netns exec qrouter-xxx ip route

10.0.0.0/24 dev qr-xxxx
default via 172.x.x.x dev qg-xxxx
```

**iptables (핵심)**:

qrouter의 본질 = `iptables 기반 L3 + NAT 엔진`

| 기능 | 방향 | 예시 |
|------|------|------|
| SNAT | 내부 → 외부 | `10.0.0.5 → 172.24.4.3` |
| DNAT (Floating IP) | 외부 → VM | `172.24.4.10 → 10.0.0.5` |
| Metadata proxy DNAT | VM → metadata service | `169.254.169.254 → metadata service` |

**Metadata proxy**:
```
VM → 169.254.169.254 → qrouter → metadata agent
```

### 7.4 패킷 흐름

**Outbound (VM → Internet)**:
```
VM (10.0.0.5)
   ↓
br-int
   ↓
qr-xxxx (qrouter)
   ↓
iptables SNAT
   ↓
qg-xxxx
   ↓
br-ex
   ↓
physical network
```

**Inbound (Floating IP)**:
```
Internet
   ↓
br-ex
   ↓
qg-xxxx
   ↓
iptables DNAT
   ↓
qr-xxxx
   ↓
VM
```

핵심 포인트: routing + NAT 모두 namespace 내부에서 수행하고, host는 단순 forwarding 역할만 한다.

### 7.5 OVS / bridge 연결

qrouter는 독립된 네임스페이스지만 완전히 고립된 것은 아니다.
- `qr-*` → br-int
- `qg-*` → br-ex

→ veth + OVS port 형태로 연결된다.

### 7.6 고급 구조 (DVR)

**기본 구조 (centralized)**: 모든 트래픽이 network node qrouter를 통과한다 → bottleneck 문제

**DVR (Distributed Virtual Router)**:
- compute node에도 qrouter가 존재한다
- east-west 트래픽을 local에서 처리한다

**SNAT namespace (별도)**:
```
qrouter → snat namespace → external
```
→ centralized SNAT를 처리한다.

### 7.7 디버깅

```bash
#  host에서는 안 보임
ip addr

#  namespace 안으로 들어가야 함
ip netns exec qrouter-xxx ip addr
ip netns exec qrouter-xxx ip route
ip netns exec qrouter-xxx iptables -t nat -L
```

---

## 한줄 요약

| 개념 | 요약 |
|------|------|
| 네트워크 네임스페이스 | 하나의 리눅스에서 여러 개의 독립된 네트워크 스택을 만드는 커널 기능 |
| OSI와의 관계 | 특정 계층이 아니라 L2~L4를 포함한 네트워크 스택 전체를 분리 |
| qrouter namespace | OpenStack에서 VM 트래픽을 라우팅하고 NAT하는 리눅스 기반 가상 라우터 인스턴스 |
