---
title: "AI 네트워킹 — 중간 종합 요약"
date: 2026-06-20
publish: true
category: "학교공부/AI네트워킹"
tags: ["AI네트워킹"]
description: "AI 네트워킹 = AI를 네트워크에 적용해 성능·효율·운영(관리성)을 높이는 것. AI로 네트워크를 운영하면 AIOps."
---

> 경희대 **AI 네트워킹**(허의남 교수님) 중간 범위 15개 강의를 시험용으로 압축한 통합 요약본.
> 강의별 상세 노트는 [← 전체 목차](/posts/ain-overview/) 의 *중간 범위* 섹션 참고.
> 흐름: **도입 → 계층 모델 → 물리 → 데이터링크 → 네트워크 → 전송 → 미래 인터넷 → 보안**

---

## 🌐 도입 — AI Networking

- **AI 네트워킹** = AI를 네트워크에 적용해 성능·효율·운영(관리성)을 높이는 것. AI로 네트워크를 운영하면 **AIOps**.
- 핵심 개념 6가지: **Automation**(자동화), **Optimization**(최적화), **Predictive Analytics**(예측 분석), **Security**(보안), **Self-Healing**(자가 복구), **Intelligent Traffic Management**(QoS 기반 지능형 트래픽 관리).
- 응용 분야 6개: Enterprise, Data Center, **Telecom(네트워크 슬라이싱)**, IoT, Cloud, **Networking for ML**.
- AI 배경: **AI ⊃ ML ⊃ DL** — 안쪽으로 갈수록 데이터 의존·자동화↑. ML은 데이터로 규칙을 학습, **DL은 feature 추출 + 분류를 End-to-End**로 수행.
- 딥러닝 핵심 = **Backpropagation + Gradient Descent + Neural Network**, 대표 문제 = **Overfitting**, 최신 흐름 = **Transformer · Federated Learning**.

---

## 📚 계층 모델 — OSI 7계층 & TCP/IP

### OSI 7계층
- **PDU = SDU + PCI** (PCI = Header + 경우에 따라 Trailer). 계층별 PDU: **Application=Message, Transport=Segment, Network=Packet, Data Link=Frame, Physical=Bit**.
- **수평 방향 = Protocol**(같은 계층끼리 규약), **수직 방향 = Interface**(계층 간). **Peer-to-Peer**(논리적 대응), 송신=**Encapsulation**, 수신=**Decapsulation**.
- 전달 단위 구분 (시험 빈출):
  - **Data Link = hop-to-hop** (MAC 주소, hop마다 바뀜)
  - **Network = end-to-end** (IP 주소, 불변)
  - **Transport = process-to-process** (Port / Socket)
- 빈출 비교: **Flow control**(수신자 보호) vs **Congestion control**(네트워크 전체), **CSMA/CD**(유선) vs **CSMA/CA**(무선), **TTL**(라우팅 루프 방지).

### TCP/IP Protocol Suite & Address
- TCP/IP는 본래 **4계층**(Host-to-Network · Internet · Transport · Application), OSI 대응 시 5계층. L1·L2는 표준화 안 하고 **L3(IP)부터 관리**.
- 네트워크 계층 보조 프로토콜 4종: **ARP**(IP→MAC), **RARP**(MAC→IP, DHCP가 대체), **ICMP**(오류·ping), **IGMP**(멀티캐스트 그룹).
- 전송 계층: **TCP**(연결·신뢰·순서·재전송) / **UDP**(비연결·빠름) / **SCTP**(메시지 지향·멀티홈).
- 주소 4종 ↔ 계층: **Specific**(App) · **Port**(Transport, 16bit) · **Logical IP**(Network) · **Physical MAC**(Data Link, 48bit). **MAC은 hop마다 변경, IP는 end-to-end 유지**.

---

## 📶 물리 계층 — Bandwidth Utilization

- 대역폭 활용 2목표: **효율 → Multiplexing**, **보안 → Spreading(확산)**.
- 멀티플렉싱 3종:
  - **FDM**(주파수 분할, 아날로그) — shift → combine → filter → shift back
  - **WDM**(파장 분할, 광)
  - **TDM**(시간 분할, 디지털)
- **TDM 비교**: **Synchronous**(고정 슬롯 · sync bit · 빈 슬롯 낭비) vs **Statistical**(동적 슬롯 · 주소 n=log₂N · 동기 비트 없음).
- **T-1 공식**: 64 kbps(DS-0) × 24채널 + 1 sync = **193 bit/frame** × 8000 fps = **1.544 Mbps**.
- **Spread Spectrum**(확산): **FHSS**(주파수 도약) / **DSSS**(1비트 → n chip 확산) — 도청·재밍 방지. (참고: 16-QAM = 4 bit/symbol)

---

## 🔗 데이터 링크 계층

### Switching(교환)
- 스위치 = 장치 간 **임시 연결(on-demand)**을 만드는 장치.
- 분류: **Circuit / Packet(Datagram · Virtual Circuit) / Message(미사용)**.
  - **Circuit**: 전용 경로 독점(지연↓·효율↓), 확장성 N(N−1)/2, Crossbar N².
  - **Datagram**: 자원 예약 없음, 패킷 독립 처리 → **인터넷 IP가 사용**.
  - **Virtual Circuit**: 둘의 혼합, **VCI**(로컬값·매 홉 변경), L2 구현.

### Data Link Control(흐름·오류 제어)
- L2 = **흐름 제어 + 오류 제어** (혼잡 제어는 L2 아님). 핵심 = **ARQ**.
- **Stop-and-Wait ARQ**: 1개씩 전송, modulo-2 번호(0/1), 타이머·복사본·ACK 재전송, 파이프라이닝 없음.
- **BDP = Bandwidth × Delay**, **Utilization = frame size / BDP**.
- **Go-Back-N**: 송신 윈도우 W·수신 윈도우 1, 오류 시 그 지점부터 전부 재전송, `W ≤ 2^m − 1`.
- **Selective Repeat**: 송·수신 윈도우 모두 사용, `2^(m−1)`, 손상분만 재전송 + NAK.
- (Stop-and-Wait = Go-Back-N의 특수경우 W=1)

### Multiple Access(다중 접근)
- 데이터 링크 = 상위(Data Link Control) + 하위(**MAC**). 3분류: **Random / Controlled / Channelization**.
- **Pure ALOHA**: 취약시간 2Tfr, S=G·e^(−2G), **Smax=0.184**.
- **Slotted ALOHA**: 취약시간 Tfr, S=G·e^(−G), **Smax=0.368**.
- **CSMA**: 취약시간=Tp(전파 지연), Persistence 3종(1-/non-/p-persistent). **CSMA/CD 최소 프레임 조건 Tfr ≥ 2Tp**, **CSMA/CA**(무선)는 IFS + Contention Window + ACK.
- **Channelization**: **FDMA**(주파수+Guard Band) / **TDMA**(시간 슬롯) / **CDMA**(직교 코드: A·A=N, A·B=0, Walsh table).

### Error Detection & Correction
- **탐지 조건 d_min ≥ s+1**, **수정 조건 d_min ≥ 2t+1**. Hamming distance = 두 코드워드 XOR 후 1의 개수.
- 패리티: 단순 패리티(n=k+1, d_min=2, 홀수 개 에러만 탐지) → 2차원 패리티 → **Hamming code**(d_min=3, n=2^m−1, **syndrome 2진값 = 오류 위치**).
- **CRC**: 이진(다항식) 나눗셈, 나머지 0이면 정상, 성능은 생성다항식 g(x)에 의존.
- **Checksum**: 합 + 1의 보수, 수신 측 합이 전부 1이면 정상(16비트). L2에서는 미사용.

---

## 🌍 네트워크 계층 — 주소 & 라우팅

### Addressing(주소)
- 인터넷 = LAN/WAN을 잇는 인터네트워크. **노드-to-노드는 데이터링크, end-to-end·라우팅은 네트워크 계층**.
- **IPv4 = Best-effort / Unreliable / Connectionless**(데이터그램), 신뢰성은 상위 TCP에 위임. 헤더 20~60B.
- **Classful**(A~E, 첫 비트 0 / 10 / 110 / 1110 / 1111)은 주소 낭비 → **CIDR**로 전환. **Mask AND IP = 네트워크 주소**.
- 서브넷 수 = 2^(빌린 비트), 호스트 수 = **2^(호스트 비트) − 2** (예: /27 → 32개 중 **30개**).
- **Supernetting**(/24 × 4 → /22), **NAT**(사설 ↔ 공인 IP 변환).

### Routing(라우팅)
- **Direct delivery**(같은 망, 라우터 X) vs **Indirect delivery**(다른 망, 라우터 경유). **Forwarding** = 테이블 조회 → next-hop·interface 결정.
- CIDR 라우팅 테이블 4컬럼(**Mask / Network / Next-hop / Interface**), **Longest mask matching**(긴 prefix 우선).
- **Address aggregation**: 연속·동일 prefix 블록을 묶어 prefix 축소(/26 × 4 → /24).
- **Intra-domain**: **RIP**(Distance Vector, hop ≤ 15) / **OSPF**(Link State, Dijkstra). **Inter-domain**: **BGP**(Path Vector, AS 경로 전체).
- **AS(자율 시스템)** = 단일 관리 주체의 네트워크 집합.

---

## 🚚 전송 계층 — TCP

- **TCP = 버퍼 기반 + 연결 지향 + 신뢰성** 전송. 바이트 스트림을 세그먼트로 분할/재조립.
- 4대 기능: **Numbering**(byte별 번호, seq = 세그먼트 첫 byte), **Flow / Error / Congestion Control**.
- 연결: **3-way handshake**(SYN → SYN+ACK → ACK), 종료(FIN → FIN+ACK → ACK), Half-Close, 상태 전이.
- Error Control 3요소: **Checksum, ACK, Time-out 재전송**.
- 윈도우: Flow=**rwnd**, Congestion=**cwnd**, **실제 윈도우 = min(rwnd, cwnd)**.
- 혼잡 제어: **Slow Start(지수) → Additive Increase(선형) → Multiplicative Decrease(AIMD)**, **RED**(L3, 큐가 차기 전 확률적 드롭).

---

## 🔮 미래 인터넷 — Future Internet

- 변화 요구 증가 → 기존 TCP/IP의 근본 가정을 재고하는 **클린 슬레이트** 탐색 시점.
- 두 접근: **진화적(Incremental — SDN / Overlay)** vs **혁신적(Clean-slate — ICN)**. 최신 화두 = **Intent-Based Networking**.
- **SDN**: 제어/전달 분리 + 컨트롤러 중앙화. **ICN**: Host 중심 → **이름 붙은 정보(Information) 중심**(대표 CCN). **Overlay + LISP**: 위치자/식별자 분리.
- 인터넷 성장 4단계(연구 → 초기 공공 → 국제 공공 → 도전기), 4단계 핵심 이슈 = **망 중립성**.
- 현재 인터넷: 장점(견고성·개방성) / 단점(**확장성·이동성·보안·QoS 부족**) → 미래 인터넷은 설계 단계부터 이를 고려 + **AI 적용**이 화두.

---

## 🔒 네트워크 보안 (AI for Security)

### 보안 소개
- 5대 용어: **Attack**(실행) vs **Threat**(가능성), **Mechanism**(수단) vs **Service**(기능).
- 4대 위협-속성 매핑: **Interruption → 가용성, Interception → 기밀성, Modification → 무결성, Fabrication → 인증성**.
- **Passive**(수동: 기밀성만 침해·탐지 곤란) vs **Active**(능동: 상태 변경·DoS 등).
- Security Service 6종, Mechanism은 Specific vs Pervasive, 보안 모델 핵심 = **Gatekeeper**.

### Message Authentication & Key Management
- 메시지 인증 3방식: **대칭키 암호화 / 평문+태그 / MAC**. 핵심 = "**secret key + function**".
- **Secure Hash 3조건**: Preimage · 2nd preimage · **Collision** 저항성. **SHA-1=160bit/80step, MD5=128bit/64step**.
- **HMAC** = 키로 두 번 해싱(ipad/opad) → **length extension attack 방지**.
- 비대칭키: **RSA**(소인수분해, 암호화·서명) vs **Diffie-Hellman**(이산로그, 키 교환, **MITM 취약**).

### Intruders & Firewalls
- 침입자 3유형: **Masquerader / Misfeasor / Clandestine**. UNIX 비밀번호 = **salt + shadow file**.
- 침입 탐지: **Statistical anomaly** vs **Rule-based**.
- 방화벽 4제어: **Service / Direction / User / Behavior**. 유형 3종: **Packet Filter / Application Gateway / Circuit-Level**.
- 가장 안전한 구성 = **Screened Subnet**(라우터 2개 + DMZ). **Trusted System** = No read up / No write down.

---

## ✅ 시험 핵심 공식·구분 정리

| 항목 | 핵심 |
|---|---|
| PDU 공식 | PDU = SDU + PCI |
| 주소 전달 | MAC = hop-to-hop(변경) / IP = end-to-end(불변) / Port = process |
| T-1 | 193 bit × 8000 = 1.544 Mbps |
| ALOHA 효율 | Pure 0.184(2Tfr) / Slotted 0.368(Tfr) |
| CSMA/CD | 최소 프레임 Tfr ≥ 2Tp |
| 오류 탐지/수정 | 탐지 d_min ≥ s+1 / 수정 d_min ≥ 2t+1 |
| 해밍 코드 | d_min=3, syndrome 2진값 = 오류 위치 |
| 서브넷 호스트 수 | 2^(호스트 비트) − 2 |
| 라우팅 매칭 | Longest mask matching |
| 라우팅 프로토콜 | RIP(DV) / OSPF(LS) / BGP(PV) |
| TCP 윈도우 | min(rwnd, cwnd) |
| TCP 혼잡 | Slow Start → AIMD |
| 위협-속성 | 가용성/기밀성/무결성/인증성 |
| 키 방식 | RSA(소인수분해) / DH(이산로그·MITM) |
| 방화벽 | Packet Filter / App Gateway / Circuit-Level |
