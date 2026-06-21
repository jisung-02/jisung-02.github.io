---
title: "SSH 라우팅 한계 분석"
date: 2026-03-30
publish: true
category: "시스템·네트워크"
tags: ["네트워크", "ssh"]
description: "하나의 소켓 주소에 여러 서비스를 올릴 수 없는 SSH의 한계와 우회법"
---


SSH는 하나의 IP + Port (Socket Address)에 대해 여러 서비스(프로세스)를 실행할 수 없다. 이 문서는 그 이유와 우회 방법을 정리한다.

---

## HTTP — 비교 대상

HTTP는 하나의 Socket Address에서 여러 서비스를 제공할 수 있다.

#### 가능한 이유

```
GET /index.html HTTP/1.1
Host: example.com
```

HTTP 요청 메시지 안에 `Host` 헤더가 포함되어 있어, 클라이언트가 어떤 도메인을 원하는지 명시적으로 전달한다. 서버(또는 Nginx/HAProxy 등의 L7 프록시)는 이 값을 보고 백엔드로 분기한다.

#### 연결 흐름

1. **DNS** — `example1.com`, `example2.com` 모두 동일한 IP(`1.2.3.4`)로 해석
2. **TCP 연결** — 클라이언트가 `1.2.3.4:80` 또는 `1.2.3.4:443`에 연결 (이 시점까지는 구분 불가)
3. **HTTP 요청 전송** — `Host: foo.com` 헤더 포함
4. **서버 내부 라우팅 (Name-based Virtual Hosting)**
   ```
   if Host == foo.com     → /var/www/foo
   if Host == example.com → /var/www/example
   ```

---

## Virtual Hosting

하나의 서버에서 여러 도메인을 서비스하는 방식. 클라이언트가 명시적으로 도메인 이름을 전달해야 하며, HTTP/1.1은 `Host` 헤더를 필수로 요구하므로 이를 만족한다.

Virtual Hosting이 가능하면 하나의 Socket Address로 여러 서비스를 제공할 수 있다.
- HTTP에서는 각각의 웹 서버(도메인)
- SSH에서는 개별 SSH 접속 대상(컨테이너, VM)

#### HTTPS의 문제점과 SNI

HTTPS에서는 TLS Handshake가 HTTP보다 먼저 일어난다.

```
TCP → TLS Handshake → HTTP
```

서버는 TLS 단계에서 HTTP를 볼 수 없으므로 `Host` 헤더를 알 수 없다. 이를 해결하기 위해 **SNI(Server Name Indication)** 을 사용한다.

```
ClientHello:
  SNI = example.com
```

TLS Handshake에 hostname을 포함시켜 서버가 올바른 인증서를 선택할 수 있게 한다.

---

## SSH에서 Virtual Hosting이 불가능한 이유

#### 1. 라우팅 정보가 없음

SSH 프로토콜 표준에 명시적인 라우팅 정보 필드가 없다.

#### 2. 라우팅 결정 시점이 너무 이르다

| | HTTP | SSH |
|---|---|---|
| 흐름 | TCP → Accept → **요청 읽기 → Host 확인** → 백엔드 결정 | TCP → **Accept → 라우팅 결정** → SSH 정보 도착 |

SSH는 TCP Accept 시점에 이미 어느 백엔드로 연결할지 결정해야 하지만, 아직 라우팅에 필요한 정보가 없다.

#### 3. 암호화로 인해 중간에서 읽을 수 없음

TLS Handshake의 SNI처럼 평문으로 노출되는 라우팅 정보가 SSH에는 없다. 암호화가 시작되면 프록시가 내용을 읽을 수 없다.

결과적으로 아래 구조는 불가능하다.

```
1.2.3.4:22
 ├── VM1
 ├── VM2
 └── VM3
```

---

## 우회 방법

### 1. Port 기반 분리

```
1.2.3.4:22   → VM1
1.2.3.4:2222 → VM2
1.2.3.4:2223 → VM3
```

VM마다 별도의 포트를 부여해 Socket Address 자체를 분리하는 방식.

| 장점 | 단점 |
|---|---|
| 구현이 간단 | 유저가 포트 번호를 알아야 함 |
| 인프라 변경 불필요 | 포트 관리 부담 |

---

### 2. Bastion / Jump Host 기반 SSH 프록싱

```
Client → Bastion → VM1
                   VM2
                   VM3
```

하나의 공인 Socket Address를 Bastion Host에 매핑하고, 클라이언트는 두 가지 방법으로 내부 VM에 접근한다.

1. Bastion에 SSH 접속 후, 내부에서 Private IP로 VM에 재접속
2. SSH 표준 `ProxyJump` 사용
   ```
   ssh -J ubuntu@1.2.3.4 ubuntu@10.0.0.5
   # 1.2.3.4  → Bastion
   # 10.0.0.5 → VM Private IP
   ```

| 장점 | 단점 |
|---|---|
| SSH 표준 기능만 사용 | 홉 증가 → 레이턴시 증가 |
| 인프라 단순 | Bastion이 네트워크 병목(SPOF) |

---

### 3. SSH Port Forwarding (SSH Tunnel)

```
ssh -L 10001:vm1:22 user@bastion
ssh -L 10002:vm2:22 user@bastion
ssh -L 10003:vm3:22 user@bastion

localhost:10001 → VM1 SSH
localhost:10002 → VM2 SSH
localhost:10003 → VM3 SSH
```

SSH 연결 하나를 암호화된 터널로 사용해 다른 TCP 연결을 전달한다.
- `-L` : 로컬 포트 포워딩 (로컬 포트 → 원격 서비스)
- `-R` : 원격 포트 포워딩
- `-D` : 동적 포워딩(SOCKS 프록시)

| 장점 | 단점 |
|---|---|
| 내부망 VM 접근 가능 | 터널을 미리 열어야 함 |
| SSH 표준 기능만 사용 | 자동 라우팅 불가 |
| | VM 100개 = 포트 100개 (스케일 어려움) |

> **프록싱 vs 포트 포워딩**: 프록싱은 동적으로 목적지를 결정하지만, SSH 맥락에서는 실질적인 차이가 거의 없다. 포트 포워딩은 고정된 목적지로 트래픽을 보내는 파이프에 가깝다.

---

### 4. NAT / L4 Proxy

```
1.2.3.4:2222 → 10.0.0.1:22
1.2.3.4:2223 → 10.0.0.2:22
```

L4 레벨의 포트 번호를 식별자로 삼아 VM으로 트래픽을 포워딩한다. NAT, iptables, HAProxy 등으로 구현한다.

| 장점 | 단점 |
|---|---|
| 네트워크 레벨 분기 → 레이턴시 낮음 | 유저가 포트 번호를 알아야 함 |

> **Port 기반 분리(방법 1)와의 차이**: 방법 1은 애플리케이션 레벨에서 처리하므로 VM 포트도 식별용 포트와 동일해야 하는 반면, NAT/L4 Proxy는 VM 포트를 22번으로 고정할 수 있고 일반적으로 레이턴시가 더 낮다.

---

### 5. Identity 기반 라우팅

사용자 인증 정보(공개키)를 라우팅 키로 사용한다. 즉, `(pubkey, IP, port)` 조합이 라우팅 키가 된다.

```
          ┌────────────┐
Client →  │ SSH Proxy  │ → VM1
          │            │ → VM2
          │            │ → VM3
          └────────────┘
                 ↑
         (Identity 기반 라우팅)
```

#### 동작 흐름

1. TCP 연결
2. SSH 초기 Handshake
3. 인증 단계 진입 — `SSH_MSG_USERAUTH_REQUEST`에 username과 공개키 포함
4. Proxy가 라우팅 결정
5. 백엔드 VM에 연결

기존에 TCP Accept 시점에 해야 했던 라우팅 결정을 **SSH 인증 이후**로 미루는 방식이다.

#### 구현 방식

- Client → Proxy (SSH 종료) → Proxy → VM (새 SSH 연결)
- 중간에서 SSH 정보를 읽는 방식도 있지만, SSH는 암호화되므로 구현 난이도가 높다.
- SSH hook(`UserAuth` 단계)을 활용해 인증 정보를 읽고 분기할 수도 있다.

#### 문제: 공개키가 식별자 = VM당 공개키 1개 필요

**해결 방법**

1. `username`을 VM과 1:1 매핑
2. 인증서를 직접 발급하고 인증서 안에 라우팅 정보 기입
3. SSH Proxy가 접속 가능한 VM 목록을 먼저 제공하고 유저가 선택
   - 장점: UX 개선
   - 단점: GitHub Actions, Ansible 등 자동화 도구에서 동작하지 않음 (별도 처리 필요)
4. Control Plane 서버를 구성해 비표준 SSH 컨텍스트로 라우팅 정보 전달

---

## 방법 비교 요약

| 방법 | 라우팅 기준 | UX | 인프라 복잡도 | 레이턴시 |
|---|---|---|---|---|
| Port 기반 분리 | 포트 번호 | 나쁨 | 낮음 | 낮음 |
| Bastion / Jump Host | 도메인/IP | 보통 | 낮음 | 높음 |
| SSH Port Forwarding | 포트 번호 | 나쁨 | 낮음 | 보통 |
| NAT / L4 Proxy | 포트 번호 | 나쁨 | 중간 | 낮음 |
| Identity 기반 라우팅 | 공개키 / username | 좋음 | 높음 | 보통 |
