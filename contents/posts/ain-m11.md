---
title: "TCP"
date: 2026-06-20
publish: true
category: "학교공부/AI네트워킹"
tags: ["AI네트워킹"]
description: "TCP는 응용 프로그램의 바이트 스트림을 받아 세그먼트(segment) 단위로 만들어 전송하고, 수신 측에서 다시 스트림으로 복원한다."
---

> AI 네트워킹 **중간**범위 — 노션 강의 노트를 옵시디언용으로 정리한 노트.
> [← 전체 목차](/posts/ain-overview/)

## TCP: Stream Delivery (스트림 전달)
TCP는 응용 프로그램의 바이트 스트림을 받아 세그먼트(segment) 단위로 만들어 전송하고, 수신 측에서 다시 스트림으로 복원한다.

**송신 측 TCP**
1. 송신 응용 프로그램으로부터 문자 스트림을 받아들인다.
2. 스트림으로부터 적절한 크기로 추출된, **세그먼트**라고 불리는 패킷을 생성한다.
3. 세그먼트를 네트워크를 통해 전송한다.

**수신 측 TCP**
1. 세그먼트를 수신하고, 세그먼트로부터 데이터를 추출한다.
2. 순서가 어긋나 도착한 경우 세그먼트를 재정렬한다.
3. 수신 응용 프로그램에 문자 스트림 형태로 전달한다.

### 버퍼 기반 구조 (Buffering)
- 스트림 전달을 위해 송신 측과 수신 측 TCP는 모두 **버퍼(buffer)**를 사용한다.
- 송신 TCP는 송신 애플리케이션이 쓴 데이터를 **송신 버퍼**에 저장한다.
- 수신 TCP는 세그먼트를 수신하여 **수신 버퍼**에 저장하고, 수신 애플리케이션은 `read` 연산으로 버퍼에서 데이터를 읽는다.
- 읽기 속도가 수신 속도보다 느릴 수 있으므로, 데이터는 애플리케이션이 완전히 읽을 때까지 버퍼에 유지된다.

핵심 흐름:
1. TCP는 **버퍼 기반 구조**이다.
2. 송신: application → buffer → network
3. 수신: network → buffer → application
4. 속도 불일치는 buffer가 흡수한다. (송신 쪽은 송신 버퍼에 쓰고, 수신 쪽은 읽을 때까지 수신 버퍼에 담아둠)

### 세그먼트화 (Segmentation)
- IP 계층은 TCP를 위한 서비스 제공자로서, 데이터를 바이트 스트림이 아니라 **패킷 형태**로 전송해야 한다.
- 전송 계층에서 TCP는 여러 바이트를 모아 **세그먼트**라는 패킷을 만든다.
- TCP는 각 세그먼트에 헤더를 추가하고, 전송을 위해 IP 계층으로 전달한다.

## TCP의 4대 기능
1. **Numbering System (번호 시스템)**— 모든 byte에 고유 번호를 부여하고, 세그먼트는 첫 byte 번호를 대표값으로 사용한다.
2. **Flow Control (흐름 제어)**
3. **Error Control (에러 제어)**
4. **Congestion Control (혼잡 제어)**

### Numbering System 상세
- **바이트 레벨**: 모든 byte에 번호 부여 (시작 번호는 랜덤).
- **세그먼트 레벨**: 각 세그먼트는 "첫 번째 byte 번호"를 대표값(= **sequence number**)으로 사용한다.
- 번호는 flow control / error control의 기반이 된다. → 어디까지 받았는지, 어디가 빠졌는지 확인하기 위함.

## 연결 지향 (Connection-Oriented)
- TCP는 **연결 지향적**이며, 출발지와 목적지 사이에 **가상 경로(virtual path)**를 설정한다.
- TCP 연결은 물리적인 것이 아니라 **가상적**인 것이다.
- TCP는 개별 세그먼트 전달에 IP 서비스를 사용하지만, **연결 자체는 TCP가 제어**한다.
- 세그먼트가 손실되거나 손상되면 **재전송**된다.

| 프로토콜 | 역할 |
| --- | --- |
| **TCP**| 연결 관리 + 신뢰성 제공 |
| **IP**| 데이터 전달 (best effort) |

## 연결 설정 (3-way handshake)
- Client (active open) → **SYN**
- Server (passive open) → **SYN + ACK**
- Client → **ACK**
- → 연결 성립

## 데이터 전송
- 양방향 통신 가능 (**full-duplex**, 전이중).
- Client ↔ Server 로 Data + ACK를 계속 교환한다.

## 연결 종료
- Client → **FIN**
- Server → **FIN + ACK**
- Client → **ACK**
- → 연결 종료

## Half-Close (반 닫기)
- 한쪽은 데이터 전송을 종료하고, 다른 쪽은 계속 전송할 수 있다.
- → 남은 데이터를 다 보낸 뒤 다시 FIN을 보내고 ACK를 받는 형태로 마무리한다.

## State Transition Diagram (상태 전이도)
- TCP는 **상태(state)를 가지는 시스템**이다.
- 연결 전 → SYN 처리
- 연결 중 → 데이터 처리
- 종료 중 → FIN 처리

## Error Control (에러 제어)
- TCP는 신뢰성 있는 전송 계층 프로토콜이다.
- 데이터 스트림 전체를 **순서대로, 오류 없이, 손실이나 중복 없이**전달한다.
- 에러 제어는 세 가지 도구로 이루어진다:
	1. **Checksum**→ 데이터가 깨졌는지 확인
	2. **Acknowledgement (ACK)**→ 수신 확인
	3. **Time-out**→ 손실 복구; 타임아웃 안에 ACK가 안 오면 재전송

## Flow Control (흐름 제어)
- 수신자가 감당 가능한 속도로만 보내기 위한 메커니즘.
- 송신 속도가 수신자의 읽기 속도보다 빠르면 **버퍼 오버플로**가 발생할 수 있다.
- 이를 막기 위해 수신 버퍼의 남은 공간인 **rwnd(receive window, 수신 윈도우)**를 사용한다.
- 수신자는 ACK를 보낼 때 rwnd를 함께 전달하고, 이를 받은 송신자가 전송량을 조절한다.

## Congestion Control (혼잡 제어)
- 네트워크 자체의 혼잡함을 보호하는 메커니즘.
- 네트워크 부하가 용량을 초과하면 **혼잡(congestion)**이 발생하며, 혼잡은 라우터·스위치의 큐 때문에 생긴다.
- 혼잡 제어는 네트워크 부하를 용량 이하로 유지한다.
- 혼잡 정도를 파악하기 위해 **cwnd(congestion window, 혼잡 윈도우)**를 사용한다.

> 실제 송신자의 윈도우 크기 = **min(rwnd, cwnd)**

### 혼잡 제어 메커니즘
- **Slow Start (느린 시작)**: 혼잡 윈도우는 임계값(threshold)에 도달할 때까지 **지수적**으로 증가한다.
- **Additive Increase (가산 증가)**: 혼잡 회피 단계에서는 **선형적**으로 증가한다.
- **Multiplicative Decrease (승산 감소)**: 혼잡 발생 시 윈도우를 **비율로 감소**시킨다.

## RED (Random Early Detection)
- 라우터가 큐가 가득 차기 **전에**패킷을 **확률적으로 미리 드롭**하여 네트워크 혼잡을 방지하는 기법.
- L3(네트워크 계층) 기법이다.
- 교수님 코멘트: TCP는 (자체적으로) 혼잡을 제어하니, RED 단에서 **UDP**를 제어해 주면 어떨까.

## 핵심 정리 (시험 포인트)
- TCP는 **버퍼 기반 + 연결 지향 + 신뢰성**전송 프로토콜이며, 바이트 스트림을 세그먼트로 나눠 전송한다.
- **Numbering**: 모든 byte에 번호, sequence number = 세그먼트 첫 byte 번호 → flow/error control의 기반.
- 연결 설정은 **3-way handshake (SYN → SYN+ACK → ACK)**, 종료는 **FIN → FIN+ACK → ACK**, Half-Close 가능.
- **Error Control 3요소**: Checksum, ACK, Time-out(재전송).
- **Flow Control**은 수신 버퍼의 **rwnd**로, **Congestion Control**은 **cwnd**로 제어 → 실제 윈도우 = **min(rwnd, cwnd)**.
- 혼잡 제어 3단계: **Slow Start(지수 증가) → Additive Increase(선형 증가) → Multiplicative Decrease(혼잡 시 비율 감소)**.
- **RED**는 라우터가 큐가 차기 전에 확률적으로 패킷을 드롭하는 L3 혼잡 회피 기법.
