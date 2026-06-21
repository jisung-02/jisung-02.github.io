---
title: "OSI 7계층"
date: 2026-06-20
publish: true
category: "학교공부/AI네트워킹"
tags: ["AI네트워킹"]
description: "PDU (Protocol Data Unit): 각 계층에서 다루는 데이터 단위."
---

> AI 네트워킹 **중간**범위 — 노션 강의 노트를 옵시디언용으로 정리한 노트.
> [← 전체 목차](/posts/ain-overview/)

## 핵심 용어
- **PDU (Protocol Data Unit)**: 각 계층에서 다루는 데이터 단위.
- **SDU (Service Data Unit)**: 상위 계층에서 내려온 "순수 데이터".
 - **PDU = SDU + PCI**
- **PCI (Protocol Control Information)**: 해당 계층이 추가하는 제어 정보 (Header, 경우에 따라 Trailer).
- **Header**: 앞에 붙는 제어 정보 / **Trailer**: 뒤에 붙는 제어 정보(주로 에러 검출). 예: `Frame = [Header + Data + Trailer(CRC)]`
- **MTU (Maximum Transmission Unit)**: 한 번에 보낼 수 있는 최대 PDU 크기.
- **SAP (Service Access Point)**: 계층 간 인터페이스 접점 (port, MAC 등).

### 계층별 PDU
| 계층 | PDU |
|---|---|
| Application | Message |
| Transport | Segment (또는 Datagram) |
| Network | Packet |
| Data Link | Frame |
| Physical | Bit |

## Layered Tasks (계층화된 작업)
- 우편(편지) 비유: 송신자(Sender)·수신자(Receiver)·운반자(Carrier)로 역할을 나눔.
- **계층(layer)은 주체(역할)에 따라 기능을 나눈 것**— 사람/객체가 아니라 특정 기능을 수행하는 역할.
- OOP에서 class로 책임을 분리하는 것과 같은 설계 철학 (**Single Responsibility Principle**).
- 실제 구현: Linux의 `socket → TCP/IP stack → driver → NIC`처럼 모듈/함수 단위로 분리.
- **Hierarchy (계층 구조)**: 상위/중간/하위 계층으로 구성, **각 계층은 바로 아래 계층이 제공하는 서비스만 사용 가능**.

## The OSI Model
- **ISO**(국제표준화기구, 1947 설립)는 **조직**, **OSI**(Open Systems Interconnection)는 **모델**(1970년대 후반 도입).
- 7계층: Physical(1) · Data Link(2) · Network(3) · Transport(4) · Session(5) · Presentation(6) · Application(7).
- 서로 관련된 기능을 개별 그룹으로 묶어 계층을 만들고, **계층 간 인터페이스만 동일하면 호환되지 않는 시스템끼리도 완전한 상호운용성(interoperability)**제공이 목적.

### 계층 구성
- **네트워크 지원 계층**: 1, 2, 3 계층.
- **사용자 지원 계층**: 5, 6, 7 계층 (서로 다른 소프트웨어 간 상호운용성).
- **전송 계층 (4)**: 두 그룹을 연결.

### Peer-to-Peer Process
- 한 시스템의 Layer x는 다른 시스템의 Layer x와 통신 → **Peer-to-Peer 프로세스**.
- 직접 같은 계층끼리 물리적으로 통신하는 게 아니라, **논리적으로 대응**(한 쪽에서 처리·전송한 데이터는 받은 쪽의 동일 계층에서 처리).
- **수평(같은 Layer) → Protocol / 수직(다른 Layer) → Interface**

### Encapsulation / Decapsulation (캡슐화 / 역캡슐화)
- N-1 계층 패킷의 데이터 부분은 N 계층의 전체 패킷을 담고 있음.
- **Encapsulation (송신 단)**: Layer를 내려가며 각 계층 기능 정보를 Header로 추가해 데이터를 단계적으로 포장.
- **Decapsulation (수신 단)**: Layer를 올라가며 각 계층이 자신이 처리할 Header만 처리·제거하고 위 계층으로 전송.

---

## 계층별 상세

### 1. Physical Layer (물리 계층)
- 물리적 매체를 통해 **비트 스트림**을 전송, 한 홉(노드)에서 다음 홉으로 개별 비트를 이동. 비트를 실제로 보내는 **유일한 계층**(데이터를 전기/광 신호=아날로그로 변환).
- **다루는 항목**: 인터페이스·매체의 물리적 특성, 비트 표현, 데이터 전송률(data rate), 비트 동기화(synchronization), 선 구성(line configuration), 물리적 토폴로지(bus/star 등), 전송 모드.
- **비트 표현**: 0/1을 전압 수준으로 변환, 수신 측은 전압으로 0/1 판별. 한 클럭 구간에 0·1이 동시에 나타나면 동기화 오류.
- **동기화**: 송수신 클럭 속도가 다르면 비트 경계가 깨짐 → 데이터 앞에 동기화 비트(패턴) 삽입.
 - **Manchester Encoding**: 한 비트를 두 번의 전압 전이로 표현, 비트마다 반드시 전이 발생 → 동기화 오류 빠르게 감지, 전이 방향으로 0/1 구분.
- **노이즈**: 외부 전자기 간섭·진동·열로 신호 왜곡 → 비트 오류.
- **UTP (Unshielded Twisted Pair)**: 두 선을 꼬아 차동 신호로 노이즈 상쇄, 많이 꼬일수록 저항성 ↑.
 - **STP**(Shielded): 금속 실드로 차단 / **UTP**: 실드 없이 꼬임으로 대응 / **TP**: 꼬인 선 구조 자체.
- **전송 모드**: simplex(한 방향, 라디오) / half-duplex(양방향 교대, 무전기) / full-duplex(양방향 동시, 전화).
- **PDU**: Bit (구조·header·trailer 없음) / **장비**: Hub, Repeater, NIC 물리부 (신호 증폭·재생성, 내용 해석 X) / **프로토콜**: 전통적 프로토콜 없음 — 물리 규격(Ethernet PHY 10BASE-T/100BASE-TX, RS-232, DSL, Fiber)이 전압·주파수·인코딩·타이밍 정의 / **주소**: 없음.

### 2. Data Link Layer (데이터 링크 계층)
- 비트를 **frame**으로 묶고 MAC 기반으로 **인접 노드 간(hop-to-hop)**안정적 전달.
- **Framing**: 비트를 의미 있는 frame으로 묶음. `frame = Header(H2) + Data + Trailer(T2)`.
- **Physical addressing**: MAC 주소로 같은 네트워크 내 노드 식별, **hop마다 MAC 주소 변경**.
- **Flow control**: 인접 노드 간 처리 속도 차이를 고려해 전송량 조절. (cf. Transport는 네트워크 전체 기준)
- **Error control**: Physical에서 발생한 오류를 frame 단위로 검출(CRC, checksum), 오류 시 재전송 요청.
- **Access control (매체 접근 제어)**: 매체 공유 시 충돌 회피.
 - **CSMA/CD**(유선): 충돌 감지 후 재전송 / **CSMA/CA**(무선): 충돌 사전 회피.
 - 최근 AI 기반 접근 제어도 연구됨(6G 등).
- **PDU**: Frame `[Header(MAC) + Data(packet) + Trailer(CRC)]` / **장비**: Switch, Bridge (MAC Address Table로 포트 결정) / **프로토콜**: Ethernet(IEEE 802.3), Wi-Fi(IEEE 802.11), PPP, HDLC / **주소**: MAC(Physical) address, 보통 48bit, 같은 LAN 내에서만 의미, hop마다 변경.

### 3. Network Layer (네트워크 계층)
- 출발 호스트에서 목적지 호스트까지 **패킷**을 전달 → **전체 경로 책임 (end-to-end delivery)**.
- **네트워크 정의**: 통신 가능한 두 개 이상 노드 + 그 사이의 연결(link) 집합 (연결+전달 가능성 포함).
- **Routing (라우팅)**: source→destination 최적 경로 선택. 라우터가 수행, 기준은 거리·비용·지연·혼잡도 등 metric.
- **Routing loop 문제**: 잘못된 경로/미연결 시 패킷이 계속 순환 → **TTL (Time To Live)**로 해결.
 - TTL은 IP 헤더 필드, 라우터를 거칠 때마다 1씩 감소, **0이 되면 패킷 폐기**→ 무한 루프·자원 낭비 방지.
- **PDU**: Packet `[IP header + Data(segment)]` / **장비**: Router (IP 기반 next hop 결정, 라우팅 테이블) / **프로토콜**: IP(핵심), 보조 ICMP(에러·TTL 초과)·ARP(IP→MAC)·IGMP(멀티캐스트), 비연결형(connectionless)·best-effort / **주소**: IP(Logical) address, 전 세계 유일, **hop을 거쳐도 변하지 않음(end-to-end 유지)**.

### 4. Transport Layer (전송 계층)
- 하나의 프로세스에서 다른 프로세스로 메시지 전달 → **end-to-end (process-to-process) 통신**.
- **Service port addressing**: 포트 번호로 어느 프로세스로 전달할지 결정. **IP=호스트 식별, Port=프로세스 식별**.
- **Segmentation & Reassembly**: 큰 데이터를 segment로 분할 전송, 수신 측에서 순서대로 재조립.
- **Connection control**: 통신 전 상대 프로세스 생존 확인 (예: TCP **3-way handshake**). 연결형(TCP) vs 비연결(UDP), broadcast는 연결 과정 없이 전송.
- **Flow control**: 송수신 처리 능력 차이를 고려한 속도 조절 (end-to-end 전체 경로 기준).
- **Congestion control**: 네트워크 전체 혼잡 상태 기반 속도 조절 (패킷 손실·지연으로 판단, TCP 주요 기능).
 - **Flow control = 수신자 기준 / Congestion control = 네트워크 전체 기준**(중요 구분).
- **Error control**: end-to-end 수준 오류 검출·복구. Data Link는 hop 단위, Transport는 전체 경로 보장 (재전송·순서 보장·중복 제거, TCP).
- **PDU**: Segment(TCP)/Datagram(UDP) `[Transport header(H4) + Data]` / **장비**: 전용 장비 없음, Host(End system)의 OS TCP/IP stack에서 수행 (라우터·스위치는 처리 X) / **프로토콜**: TCP(연결형·신뢰성·흐름·혼잡 제어), UDP(비연결·빠름·신뢰성 없음), SCTP / **주소**: Port number(16bit), **IP + Port = Socket(통신 엔드포인트)**.

### 5. Session Layer (세션 계층)
- **대화 제어(dialog control)**와 **동기화(synchronization)**담당. 데이터 전달 자체는 하지 않고 통신의 흐름·상태를 관리.
- **Dialog control**: 통신 방식(simplex/half/full-duplex) 제어, 누가 언제 보낼지 조정.
- **Synchronization**: 데이터 중간에 checkpoint(syn) 삽입 → 오류 시 전체가 아닌 특정 지점부터 복구.
- **Session management**: 세션 생성·유지·종료 관리 (stateful communication).
- 현대에는 대부분 상위 계층으로 흡수된 개념적 계층.
- **PDU**: 고정 이름 없음(보통 message) / **장비**: 없음(Host) / **프로토콜**: NetBIOS Session Service, RPC, PPTP / **주소**: 없음(하위 IP+Port 기반).

### 6. Presentation Layer (표현 계층)
- **변환(translation), 압축(compression), 암호화(encryption)**담당 → 서로 다른 시스템 간 올바르게 이해·안전 전달.
- **PDU**: Message(별도 이름 없음) / **장비**: 없음(Host) / **프로토콜**: TLS/SSL, MIME, ASN.1 / **주소**: 없음.

### 7. Application Layer (응용 계층)
- 사용자에게 서비스를 제공하는 **최상위 계층**.
- **주요 기능**: 네트워크 가상 터미널, 파일 전송·접근·관리, 메일 서비스, 디렉토리 서비스.
- **PDU**: Message / **장비**: 없음(Host) / **프로토콜**: HTTP, FTP, SMTP, DNS / **주소**: 없음(하위 IP+Port 사용).

## 계층 요약
- **Application**: 네트워크 자원 접근 제공.
- **Presentation**: 변환·암호화·압축.
- **Session**: 세션 설정·관리·종료.
- **Transport**: 신뢰성 있는 프로세스 간 메시지 전달 및 오류 복구.
- **Network**: 패킷을 출발지→목적지로 이동, 네트워크 간 연결.
- **Data Link**: 비트를 프레임으로 구성, 홉 간 전달.
- **Physical**: 매체를 통해 비트 전송, 기계적/전기적 규격 제공.

## 핵심 정리 (시험 포인트)
- **PDU = SDU + PCI**/ 계층별 PDU: Application=Message, Transport=Segment, Network=Packet, Data Link=Frame, Physical=Bit.
- **수평(같은 계층)=Protocol, 수직(다른 계층)=Interface**/ 같은 계층은 Peer-to-Peer로 논리적 대응.
- **Encapsulation(송신, Header 추가)**↔ **Decapsulation(수신, Header 제거)**, 각 계층은 바로 아래 계층 서비스만 사용.
- **MAC vs IP**: MAC은 로컬(hop마다 변경), IP는 전역(end-to-end 유지) / **IP=호스트, Port=프로세스, IP+Port=Socket**.
- **전달 단위 차이**: Data Link=hop-to-hop, Network=호스트 end-to-end, Transport=프로세스 end-to-end.
- **Flow control(수신자 기준) vs Congestion control(네트워크 전체 기준)**— Transport에서 둘 다 다룸.
- **TTL**: Network 계층에서 routing loop 방지 (라우터마다 1 감소, 0이면 폐기).
- 계층별 장비: Physical=Hub/Repeater, Data Link=Switch/Bridge, Network=Router / 접근 제어: 유선 CSMA/CD, 무선 CSMA/CA.
