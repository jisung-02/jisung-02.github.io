---
title: "TCP/IP Protocol Suite & Address"
date: 2026-06-20
publish: true
tags: ["AI네트워킹"]
description: "TCP/IP는 현대 네트워크를 구성하는 실제 구현이다 (OSI 7계층은 이론적 참조 모델)."
---

> AI 네트워킹 **중간**범위 — 노션 강의 노트를 옵시디언용으로 정리한 노트.
> [← 전체 목차](/posts/학교공부/ai네트워킹/목차/)

## TCP/IP Protocol Suite (프로토콜 집합)
- TCP/IP는 현대 네트워크를 구성하는 **실제 구현**이다 (OSI 7계층은 이론적 참조 모델).
- TCP/IP 계층은 OSI 계층과 정확히 일치하지 않는다.
- **원래 정의는 4계층**: Host-to-network → Internet → Transport → Application
- OSI와 비교해 **5계층으로 재해석**: Physical → Data Link → Network → Transport → Application
- → 맥락에 따라 4계층 또는 5계층으로 본다.

| TCP/IP 4계층 | OSI 대응 5계층 |
| --- | --- |
| Application | Application (+ Session, Presentation) |
| Transport | Transport |
| Internet | Network |
| Host-to-network | Data Link + Physical |

## Physical & Data Link Layer
- TCP/IP는 물리/데이터링크 계층에서 **특정 프로토콜을 정의하지 않는다**.
- 모든 표준 프로토콜 및 독자(proprietary) 프로토콜을 지원한다.
- 이 계층의 네트워크는 LAN일 수도 WAN일 수도 있다.
- 핵심: TCP/IP는 하위 계층(L1·L2)을 표준화하지 않고 **그 위에 올라타는 구조**. L1·L2는 기저 네트워크가 정의하고, TCP/IP는 **L3(네트워크 계층)부터 관리**한다.

## Network Layer (네트워크 계층)
- TCP/IP는 **IP(Internetworking Protocol)**를 지원 → 서로 다른 네트워크를 연결해 통신 가능하게 함.
- IP는 4가지 보조 프로토콜을 사용: **ARP, RARP, ICMP, IGMP**.
- 흐름: `Application → TCP → IP → (ARP) → Data Link → 전송`, 오류 발생 시 ICMP, 멀티캐스트 시 IGMP.

| 프로토콜 | 풀이 | 역할 |
| --- | --- | --- |
| IP | Internetworking Protocol | 목적지 IP 기반 라우팅·패킷 전달. **connectionless, unreliable**(보장 없음) |
| ARP | Address Resolution Protocol | **IP → MAC**변환 |
| RARP | Reverse ARP | **MAC → IP**변환. 현재 거의 안 씀 → **DHCP로 대체**|
| ICMP | Internet Control Message Protocol | 네트워크 상태/오류 전달 (제어 메시지). 예: ping = ICMP echo request/reply |
| IGMP | Internet Group Message Protocol | **멀티캐스트 그룹 관리**(가입/전송 대상 관리) |

- **ARP 동작 방식**: "192.168.0.10 누구냐?" 질의 → 브로드캐스트 → 해당 IP를 가진 노드가 응답 → MAC 주소 획득. ⇒ 실제 전송은 MAC 기반, IP만으로는 전송 불가.
- ICMP·IGMP는 **데이터 전송이 아닌 제어 메시지**이다. (실제 멀티캐스트 데이터 전송은 다른 프로토콜이 담당.)
- 캐스트 구분: 1:1 → 유니캐스트, 1:N → 멀티캐스트.

## Transport Layer (전송 계층)
- IP는 host-to-host(호스트 간) 프로토콜이지만, 전송 계층은 **process-to-process(프로세스 간)**메시지 전달을 담당.
- **Port**로 프로세스를 구분한다.
- 세 가지 프로토콜: **TCP, UDP, SCTP**.

### TCP (Transmission Control Protocol)
- 동작: ① 연결 설정 (3-way handshake) → ② 데이터 전송 (ACK 기반) → ③ 연결 종료.
- 특징: **연결 기반(connection-oriented), 신뢰성 있음(reliable), 순서 보장, 재전송 있음**.
- 수신 확인(ACK), 흐름 제어(상대방 기준), 혼잡 제어(네트워크/하위 계층 기준) 존재.

### UDP (User Datagram Protocol)
- 데이터를 그냥 보냄 (no connection).
- 특징: **비연결, 신뢰성 없음, 순서 보장 없음, 빠름**.

### SCTP (Stream Control Transmission Protocol)
- 특징: **메시지 기반**(TCP는 stream 기반), 멀티 스트림, 멀티 홈 지원.

## Application Layer (응용 계층)
- TCP/IP의 응용 계층 = OSI의 **세션 + 표현 + 응용 계층이 결합**된 것.
- 많은 프로토콜이 이 계층에서 정의된다.

---

## ADDRESSING (주소 체계)
- TCP/IP 인터넷에서는 **4가지 수준의 주소**가 사용된다: **Physical, Logical, Port, Specific**.
- 각 주소는 계층별 목적에 따라 존재한다.

| 주소 | 계층 | 비트/형식 | 비고 |
| --- | --- | --- | --- |
| Specific | Application | 사용자 친화적 (이메일, URL) | 사람이 쓰는 주소 |
| Port | Transport | 16-bit | 프로세스 식별 |
| Logical (IP) | Network | (IP 주소) | end-to-end 유지 |
| Physical (MAC) | Data Link | 48-bit (6-byte) | hop-by-hop 변경 |

### Physical Address (물리 주소 / 링크 주소)
- LAN/WAN에서 정의되는 노드의 주소, **데이터 링크 계층 프레임에 포함**되어 실제 전달에 사용.
- 해당 네트워크(LAN/WAN)에 대해 권한(authority)을 가지며, 크기·형식은 네트워크마다 다르다.
- 대부분의 LAN은 **48-bit(6-byte)**물리 주소 사용 → **12개 16진수 숫자**, 각 바이트를 콜론으로 구분. 예: `07:01:02:01:2C:4B`.
- = NIC(네트워크 인터페이스)에 붙은 로컬 식별자.
- 특징:
 1. **hop-by-hop**: MAC은 매 홉마다 바뀜 (라우터 지나면 프레임 새로 생성).
 2. **로컬 범위**: 같은 LAN에서만 의미, 인터넷 전체에서는 의미 없음.
 3. **변경 가능**: 이론상 고정이나 소프트웨어로 변경 가능 (MAC spoofing).
- (참고, 안 배움) MAC = [OUI 제조사 코드] + [Device ID] → 원칙적으로 모두 유니크.

### Logical Address (논리 주소 = IP 주소)
- 기저 물리 네트워크와 **독립적인 보편적 통신**을 위해 필요.
- 서로 다른 네트워크는 주소 형식이 다를 수 있어 물리 주소만으로는 인터네트워크 통신에 부족.
- IP 주소는 물리 네트워크와 관계없이 호스트를 **유일하게 식별**하고 **end-to-end 기준을 유지**한다.
- 물리 주소는 홉마다 변경되지만, 논리 주소(IP)는 일반적으로 **동일하게 유지**된다.

**라우터를 거치는 전달 과정 (논리 vs 물리):**
- IP는 출발지 → 최종 수신지(A→P)를 **끝까지 유지**.
- MAC은 홉마다 변경:
 1. Sender → LAN1: IP(Sender→Receiver), MAC(Sender→Router1)
 2. Router1: 기존 MAC 제거 → IP 확인(라우팅 결정) → 새 MAC 생성
 3. Router1 → LAN2: IP(Sender→Receiver), MAC(Router1→Router2)
 4. Router2: 동일하게 MAC 교체
 5. Router2 → LAN3: IP(Sender→Receiver), MAC(Router2→Receiver)
 6. Receiver: MAC 확인(일치 시 수신) → IP 확인(최종 목적지 처리)

### Port Address (포트 주소)
- IP·물리 주소는 데이터를 출발지에서 목적지 **호스트**까지 옮긴다.
- 인터넷 통신의 최종 대상은 **프로세스 간 통신**이다.
- 여러 프로세스가 동시에 수신하므로 각 프로세스를 식별하는 **포트 주소**가 필요. TCP/IP에서 **16비트**.
- **IP는 컴퓨터(호스트)까지, Port는 그 안의 프로세스까지**전달.
- IP·포트 주소는 일반적으로 유지(물리 주소는 홉마다 변경).

### Specific Address (특정 주소)
- 일부 애플리케이션이 가지는 **사용자 친화적 주소**.
- 예: E-mail address `johnhuh@khu.ac.kr`, URL `http://icns.khu.ac.kr`.
