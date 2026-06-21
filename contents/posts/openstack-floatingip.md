---
title: "OpenStack FloatingIP와 기타등등"
date: 2026-04-01
publish: true
category: "클라우드·인프라/OpenStack"
tags: ["클라우드", "네트워크"]
description: "FloatingIP 부족 문제와 라우팅 구성 등을 정리한 작업 노트"
---

## 문제 정의
- 각 vm마다 floating IP를 할당해야 하는 문제다
- 현재 내부 공유기는 총 254개의 ip만 사용 가능한 상황이다

## 현재 상황
```
Controller 노드 (이름만 compute)
  - qrouter 있음
  - proxy 둘 예정

Network 노드
  - cloudflared 있음

User → Network node로 들어옴
```
## 고안한 구조
```
User
  ↓
Cloudflare
  ↓
Network Node (cloudflared)
  ↓
Controller Node (proxy + qrouter)
  ↓
VM (10.x.x.x)
```

## 현재 구조의 네트워크 흐름
### 1. 외부 -> 네트워크 노드
```
User → Cloudflare → cloudflared (network node)
```
### 2. 네트워크 노드 -> 컨트롤러 노드
```
cloudflared → proxy (controller)
```
-> 이건 그냥 일반 TCP/HTTP 연결로 해결한다
### 3. 컨트롤러 -> VM
```
proxy → qrouter → VM
```
-> 핵심 가정: qrouter가 controller에 있으므로 여기서 routing 가능할 것으로 추정한다

## 연결 방식 해결
### 1. 네트워크 노드 -> 컨트롤러 노드
```
User
  ↓
Cloudflare
  ↓
cloudflared (network node)
  ↓
controller:PORT
```
- cloudflared ingress 활용
```
ingress:
  - hostname: 도메인1
    service: tcp://<controller-ip>:포트

  - hostname: 도메인2
    service: http://<controller-ip>:포트

  - service: http_status:404
```

아래 작업을 수행해야 한다
```
1. tunnel 생성 (이미 있음 ✔)
2. DNS에 hostname 연결
3. cloudflared ingress 설정
4. cloudflared 재시작
```
또는
```
	1. ingress 설정
	2. Cloudflare Access 앱 타입
	3. 기존 HTTP 설정 제거
```

### 2. 컨트롤러 -> VM
1. `ip netns list`
	- qrouter namespace 확인
2. ip netns exec {qrouter-namespace} nc -vz 10.0.0.29 22
-> 현재 qrouter-namespace에서 네트워크 요청을 수행할 경우 문제 없다

###


ip netns -> 네트워크 네임스페이스 지정


## 또 다른 생각
- 현재 10.0.0.x 대역 접속 실패는 192대역의 host가 같은 대역이 아니므로 게이트웨이로 보내도 qrouter가 host에게 유효한 게이트웨이로 나가지 않아서 생기는 문제다
	- qrouter를 host가 인지하게 하면 된다 - 그러나 이는 Openstack 재시작마다 재설정해야 한다
	- 기존 openstack이 의도한 바가 아니므로 좋은 아이디어는 아니다
### ETC
- 접속 시 할 것
	1. source /etc/kolla/admin-openrc.sh
	2. source /etc/kolla/admin-openrc.sh

---
# 관련 개념
## Subnet
IP 주소를 일정 범위로 나눈 네트워크 단위다
```
10.0.0.0/24
→ 10.0.0.1 ~ 10.0.0.254
```
-> L3 라우팅의 판단 기준이다 (직접 전송할 것인지 라우터로 보낼 것인지 결정한다)

설명
- IP + netmask로 범위를 결정한다
- 같은 subnet이면 직접 통신한다(ARP)
- 다른 subnet이면 라우터가 필요하다

IP는 항상 [Network Prefix | Host IP]로 나뉜다
```
192.168.1.10 /24
→ Network: 192.168.1
→ Host: 10
```
- 이는 서브넷 마스크로 정의한다
```
255.255.255.0
= 11111111.11111111.11111111.00000000
```
- 1은 네트워크, 0은 호스트다
- `ip/24` 같은 표기법은 CIDR (Classless Inter-Domain Routing) 표기법이며, 이는 네트워크 자리를 나타낸다

#### Classful vs CIDR

원래 IP 주소는 **클래스** 단위로 네트워크 크기가 고정되어 있었다 (Classful)

| **클래스** | **범위**                    | **기본 prefix** | **용도**      |
| ---------- | --------------------------- | --------------- | ------------- |
| A          | 1.0.0.0 ~ 126.255.255.255   | /8              | 대형 기관     |
| B          | 128.0.0.0 ~ 191.255.255.255 | /16             | 중형 기관     |
| C          | 192.0.0.0 ~ 223.255.255.255 | /24             | 소형 기관     |
| D          | 224.0.0.0 ~ 239.255.255.255 | -               | 멀티캐스트    |
| E          | 240.0.0.0 ~ 255.255.255.255 | -               | 예약 (실험용) |

- 문제: Class B를 할당받으면 65534개 호스트 자리가 생기는데 실제로 다 못 쓴다 → IP 낭비
- 해결: **CIDR** — /8~/32 아무 단위로나 자유롭게 나눈다 (Classless = 클래스 없음)
- 공유기가 `192.168.0.N` 대역인 이유: Class C 사설 대역 (`192.168.0.0/24`) 기본값이 굳어진 것이다

| **CIDR** | **Subnet Mask** | **2진수 표기**                      | **Host 수** |
| -------- | --------------- | ----------------------------------- | ----------- |
| /24      | 255.255.255.0   | 11111111.11111111.11111111.00000000 | 254         |
| /25      | 255.255.255.128 | 11111111.11111111.11111111.10000000 | 126         |
| /26      | 255.255.255.192 | 11111111.11111111.11111111.11000000 | 62          |
| /30      | 255.255.255.252 | 11111111.11111111.11111111.11111100 | 2           |

#### 네트워크 주소 계산 (비트 AND 연산)

`Network Address = IP & Subnet Mask` — 각 자리 비트 AND 연산

```
IP   : 192.168.1.10  →  11000000.10101000.00000001.00001010
Mask : 255.255.255.0 →  11111111.11111111.11111111.00000000
결과 : 192.168.1.0   →  11000000.10101000.00000001.00000000
```

- 결과가 해당 서브넷의 **네트워크 주소**다 (호스트에 할당 불가)
- host 비트를 모두 1로 만든 주소는 **브로드캐스트 주소**다 (마찬가지로 할당 불가)

#### 라우터(L3) vs ARP(L2) 역할 분리

> 라우터는 "어느 네트워크로 보낼지"만 결정하고, "어떤 호스트인지"는 ARP(L2)가 해결한다.

| **단계**        | **담당**      | **하는 일**                        |
| --------------- | ------------- | ---------------------------------- |
| L3 (라우터)     | 라우팅 테이블 | 목적지 IP → 어느 서브넷으로 보낼지 |
| L2 (ARP/스위치) | ARP           | 해당 호스트의 MAC 주소 찾기        |

**라우터 내부 동작**
```
192.168.1.123 수신
→ /24 적용 → 네트워크 주소 192.168.1.0
→ routing table lookup → 인터페이스 선택
→ ARP 요청: "Who has 192.168.1.123?"
→ 응답: "MAC: aa:bb:cc"
→ Ethernet frame으로 전송
```

**실제 패킷 흐름**
```
[Client]  → destination IP = 192.168.1.123 → default gateway로 전송
[Router]  → routing table lookup → ARP로 MAC 획득 → Ethernet frame 생성 → 전송
[Host]    → 자기 IP 확인 → 수신
```

#### Edge Case

| **상황**                | **동작**                           |
| ----------------------- | ---------------------------------- |
| 같은 subnet             | 라우터 거치지 않고 ARP로 직접 통신 |
| 다른 subnet             | 반드시 라우터(gateway) 경유        |
| ARP 실패 (host down 등) | packet drop                        |

## ARP
실제 Ethernet 전송에 필요한 **MAC 주소를 IPv4 주소로부터 알아내는** 프로토콜이다 (L2)

IP 패킷은 L3 정보지만, 실제 Ethernet 전송은 MAC 주소가 있어야 한다.
```
Ethernet Frame = dst MAC + src MAC + payload(IP packet)
```
IP만 알아서는 frame을 만들 수 없다 → ARP로 MAC 조회가 필요하다

#### 동작 순서

| **단계**             | **레이어**    | **동작**                                                        |
| -------------------- | ------------- | --------------------------------------------------------------- |
| 1. 목적지 판단       | ⚠️ **L3**    | 목적지 IP가 같은 subnet인지 계산 (subnet mask AND 연산)         |
| 2. ARP 대상 결정     | ⚠️ **L3**    | 같은 subnet → 목적지 IP / 다른 subnet → 게이트웨이 IP          |
| 3. ARP cache 확인    | L2            | 이미 아는 MAC이면 바로 사용 (`ip neigh` 로 확인)               |
| 4. ARP Request 브로드캐스트 | L2     | 모르면 링크 전체에 `Who has X.X.X.X?` 전송                     |
| 5. ARP Reply 수신    | L2            | 해당 IP를 가진 호스트만 유니캐스트로 MAC 응답                  |
| 6. 캐시 저장 후 전송 | L2            | MAC 캐시 저장 → Ethernet frame 생성 → 전송                     |

> ⚠️ **1~2단계는 L3 로직** — "누구에게 ARP할지"를 결정하는 건 라우팅(L3)이고, ARP 자체는 L2

#### ARP 케이스별 대상

| **상황**                            | **ARP 대상**               | **이유**                    |
| ----------------------------------- | -------------------------- | --------------------------- |
| 같은 subnet (`10.0.0.5 → 10.0.0.8`) | 목적지 IP(`10.0.0.8`)의 MAC | 직접 전달 가능              |
| 다른 subnet (`10.0.0.5 → 8.8.8.8`) | 게이트웨이(`10.0.0.1`)의 MAC | 라우터를 거쳐야 하므로      |

#### ARP 패킷 구조

| **필드**   | **Request**              | **Reply**         |
| ---------- | ------------------------ | ----------------- |
| Operation  | request                  | reply             |
| Sender MAC | aa:aa:aa:aa:aa:aa        | bb:bb:bb:bb:bb:bb |
| Sender IP  | 10.0.0.5                 | 10.0.0.8          |
| Target MAC | 00:00:00:00:00:00 (모름) | aa:aa:aa:aa:aa:aa |
| Target IP  | 10.0.0.8                 | 10.0.0.5          |

#### ARP cache (neighbor table)

매번 브로드캐스트하지 않고 한번 배운 매핑을 캐시에 저장해 재사용한다
```
ip neigh
→ 10.0.0.8 dev eth0 lladdr bb:bb:bb:bb:bb:bb REACHABLE
→ 10.0.0.1 dev eth0 lladdr cc:cc:cc:cc:cc:cc STALE
```

#### 스위치와 역할 분리

| **장비**      | **역할**                                             |
| ------------- | ---------------------------------------------------- |
| 호스트/라우터 | ARP request 생성, reply 처리, cache 유지             |
| 스위치        | frame의 dst MAC 보고 포트 전달 (ARP 내용 해석 안 함) |

- ARP는 같은 L2 세그먼트(링크) 안에서만 동작한다 — 라우터 너머 원격 호스트 MAC은 못 찾는다
- IPv6에서는 ARP 대신 **Neighbor Discovery (ND)** 를 사용한다

#### Edge Case

| **상황**       | **설명**                                                    |
| -------------- | ----------------------------------------------------------- |
| ARP 실패       | 상대 꺼짐/링크 끊김 → reply 없음 → packet drop             |
| Stale entry    | 캐시된 MAC이 구버전 → Linux가 재검증 (STALE → 재ARP)       |
| Gratuitous ARP | IP 충돌 탐지, failover 후 캐시 갱신 용도로 자기 MAC 알림   |
| ARP spoofing   | 인증 없음 → 공격자가 거짓 reply로 MAC 매핑 오염 가능       |

#### OpenStack (qrouter) 관점

qrouter namespace도 Linux 네트워크 스택이므로 ARP를 그대로 사용한다
- VM으로 패킷을 내보내기 전 VM의 MAC 주소 조회가 필요하다
- qrouter namespace 안에도 neighbor table이 생성된다

## VLAN
물리 네트워크를 논리적으로 분리하는 기술이다

| **항목**  | **설명**                                         |
| --------- | ------------------------------------------------ |
| 정의      | 스위치 포트에 VLAN ID를 태깅해 네트워크 분리     |
| 통신 범위 | 같은 VLAN ID끼리만 직접 통신 가능               |
| 다른 VLAN | 라우터(L3) 없이는 통신 불가                     |
| OpenStack | Neutron에서 provider/tenant 네트워크 구성에 사용 |
| 태그 방식 | 802.1Q 표준, 프레임에 4바이트 VLAN 태그 추가    |

### Neutron
OpenStack의 네트워킹 컴포넌트다

| **구성요소**   | **역할**                                    |
| -------------- | ------------------------------------------- |
| neutron-server | REST API 요청 처리 및 DB 연동               |
| ML2 Plugin     | 다양한 네트워크 드라이버 추상화 레이어      |
| L2 Agent       | VLAN/VXLAN 등 L2 네트워크 구성 (각 노드)   |
| L3 Agent       | 라우팅, Floating IP, NAT 처리               |
| DHCP Agent     | VM에 IP 자동 할당                           |
| Metadata Agent | VM이 클라우드 메타데이터 접근 가능하게 중계 |


### Floating IP

| **항목**  | **Fixed IP**          | **Floating IP**           |
| --------- | --------------------- | ------------------------- |
| 할당 위치 | 내부 tenant network   | 외부 public network       |
| 접근      | 내부에서만 접근 가능  | 외부 인터넷에서 접근 가능 |
| 변경      | VM 생성 시 고정       | 동적으로 연결/해제 가능   |
| 목적      | VM 간 내부 통신       | 외부에 서비스 노출        |
| 구현      | DHCP로 VM에 직접 부여 | DNAT으로 Fixed IP에 매핑  |


### SNAT, DNAT

| **항목**    | **SNAT**                          | **DNAT**                      |
| ----------- | --------------------------------- | ----------------------------- |
| 변환 대상   | Source IP 변환                    | Destination IP 변환           |
| 트래픽 방향 | VM → 외부                         | 외부 → VM                     |
| 사용 예     | VM이 인터넷 접속할 때             | Floating IP로 VM에 접근할 때  |
| OpenStack   | L3 Agent의 qrouter namespace 처리 | Floating IP 매핑 시 자동 설정 |
| iptables    | MASQUERADE / SNAT 규칙            | DNAT 규칙                     |


### Tenant Network

| **항목**  | **설명**                                                |
| --------- | ------------------------------------------------------- |
| 정의      | 테넌트(프로젝트)가 자유롭게 생성하는 가상 내부 네트워크 |
| 대역 예시 | 10.0.0.0/24, 192.168.100.0/24 등 임의 설정 가능        |
| 격리 방식 | VLAN ID 또는 VXLAN VNI로 다른 테넌트와 완전 격리       |
| 외부 접속 | Floating IP(DNAT) 또는 SNAT를 통해 외부 통신           |
| 라우팅    | qrouter를 거쳐 외부 네트워크와 연결                    |



### Neutron router(qrouter)

| **항목**        | **설명**                                           |
| --------------- | -------------------------------------------------- |
| 정의            | Neutron L3 Agent가 생성하는 가상 라우터            |
| 구현 방식       | Linux network namespace (`qrouter-<uuid>`)         |
| 내부 인터페이스 | tenant network 게이트웨이 (qr- 포트)              |
| 외부 인터페이스 | external network 연결 (qg- 포트)                  |
| Floating IP     | DNAT 규칙으로 Floating IP → Fixed IP 매핑          |
| SNAT            | VM → 외부 트래픽의 source IP를 external IP로 변환 |
| 확인 명령       | `ip netns exec qrouter-<uuid> ip addr`             |
