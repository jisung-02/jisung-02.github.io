---
title: "AI for Security: 네트워크 보안 소개"
date: 2026-06-20
publish: true
category: "학교공부/AI네트워킹"
tags: ["AI네트워킹"]
description: "Security Attack (보안 공격): 정보의 보안을 침해하는 모든 행위. 실제로 시스템에 영향이 발생하며 기밀성/무결성/가용성 등이 깨짐. 예) 패킷…"
---

> AI 네트워킹 **중간**범위 — 노션 강의 노트를 옵시디언용으로 정리한 노트.
> [← 전체 목차](/posts/ain-overview/)

## 기본 개념 (5대 용어)
- **Security Attack (보안 공격)**: 정보의 보안을 침해하는 모든 행위. 실제로 시스템에 영향이 발생하며 기밀성/무결성/가용성 등이 깨짐. 예) 패킷 도청, 데이터 변조, DoS.
- **Security Mechanism (보안 메커니즘)**: 공격을 탐지/방지/복구하기 위한 기술적 수단. 공격에 대한 직접 대응 로직. 예) 암호화(Encryption), 인증(Authentication protocol), IDS/IPS, 접근제어(Access Control).
- **Security Service (보안 서비스)**: 시스템/데이터 전송의 보안을 향상시키는 기능적 서비스. 내부적으로 하나 이상의 메커니즘을 사용. 예) 기밀성, 무결성, 인증, 부인 방지.
- **Threat (위협)**: 취약점을 악용할 "가능성". 아직 공격이 발생하지 않은 잠재적 위험. 구성요소: 취약점(vulnerability) + 상황(circumstance) + 능력/의도.
- **Attack (공격)**: 위협이 실제로 실행된 상태. Threat이 현실화된 결과이며 능동적 행위.

## 보안 위협의 종류 (4분류)
| Threat | 의미 | 깨지는 보안 속성 |
| --- | --- | --- |
| Interruption (중단) | 자원/서비스가 중단됨 | Availability (가용성) |
| Interception (가로채기) | 정보가 유출됨 | Confidentiality (기밀성) |
| Modification (변조) | 데이터가 변경됨 | Integrity (무결성) |
| Fabrication (위조) | 가짜 데이터 생성 | Authenticity (인증성) |

- **Interruption**: 시스템/네트워크 사용 불가(서버 다운, DoS). 리소스 접근 자체를 막아 Availability 붕괴.
- **Interception**: 데이터가 "읽힘"(패킷 스니핑, eavesdropping). 데이터는 그대로지만 비밀성이 깨짐.
- **Modification**: 데이터 내용 변경(MITM 패킷 변조). 원본과 달라져 Integrity 붕괴.
- **Fabrication**: 존재하지 않는 데이터 생성(가짜 메시지, spoofing). 출처 신뢰 불가 → Authenticity 붕괴.

## Security Attacks 분류 (Passive vs Active)
### Passive Attack (수동 공격)
- 특징: 시스템에 변화 없음, 탐지 어려움, 목적은 정보 수집. 깨지는 속성은 **Confidentiality**.
- **(1) Release of message contents**: 실제 메시지 내용 탈취 (예: 이메일 내용 도청).
- **(2) Traffic analysis**: 통신 패턴 분석. 송신자/수신자, 메시지 길이, 전송 빈도 관찰. 암호화되어 있어도 가능.

### Active Attack (능동 공격)
- 특징: 시스템 상태 변경, 탐지 가능하지만 피해 큼, 목적은 조작/파괴.
- **(1) Masquerade**: 다른 사용자로 위장(권한 상승 가능) → Authentication/Authenticity 공격(= Fabrication 성격).
- **(2) Replay**: 이전 메시지 재전송(정상 메시지 재사용) → Authentication/Integrity 문제.
- **(3) Modification of message**: 메시지 변경/지연/순서 변경 → Integrity 공격.
- **(4) Denial of Service (DoS)**: 서비스 사용 불가(메시지 차단, 네트워크 마비, 과부하 유도) → Availability 공격.

## Security Service 분류 (6가지)
- **(1) Authentication (인증)**: 데이터 출처 확인, 통신 주체 확인. 키를 안전하게 전달해야 함(비대칭키 public key, 해시+암호화). 송신자: hash(message)→암호화→전송 / 수신자: 복호화→hash 비교.
- **(2) Access Control (접근 제어, Authorization)**: 자원 접근 제한, 사용자 권한 관리. RBAC(Role-Based), CBAC(Context-Based).
- **(3) Data Confidentiality (기밀성)**: 데이터 내용 보호.
- **(4) Data Integrity (무결성)**: 데이터 변경 방지.
- **(5) Nonrepudiation (부인 방지)**: 송신/수신 사실 부인 방지. 디지털 서명, 로그 기록(audit trail).
- **(6) Availability (가용성)**: 시스템/서비스 정상 사용 보장.

## Security Mechanism 분류
- **(1) Specific Security Mechanisms**: 특정 프로토콜 계층에 종속(Layer-dependent), 특정 보안 서비스 구현 목적. 예) Encryption, Digital Signature, Access Control Mechanism, Authentication Protocol, Traffic Padding, Routing Control.
- **(2) Pervasive Security Mechanisms**: 특정 계층/서비스에 비종속(Layer-independent), 시스템 전반에 적용되는 공통/보조 기능. 예) Trusted Function, Security Label, Event Detection, Security Audit Trail(로그), Security Recovery.

## 네트워크 접근 보안 모델 (Gatekeeper)
- 흐름: Opponent → Access Channel → **Gatekeeper**→ Information System.
- **Gatekeeper Function**이 핵심: 모든 접근을 통제하는 지점.
- 기능: 인증(Authentication), 접근 제어(Access Control), 필터링.

## 방어의 방법 (5가지 Controls)
- **Encryption (암호화)**: 데이터 보호, 통신 내용 은닉.
- **Software Controls (소프트웨어 제어)**: 접근 제한(DB, OS), 사용자 간 격리, 권한 관리.
- **Hardware Controls (하드웨어 제어)**: 물리적 장치 기반 보안. 예) Smartcard, 보안 토큰.
- **Policies (정책)**: 운영/관리 규칙. 예) 비밀번호 주기적 변경, 보안 정책 적용.
- **Physical Controls (물리적 제어)**: 물리적 접근 제한. 예) 출입 통제, 장비 보호.

## 핵심 정리 (시험 포인트)
- 5대 용어 구분: Attack(실행됨) vs Threat(가능성), Mechanism(수단) vs Service(기능).
- 4대 위협-속성 매핑: Interruption→가용성, Interception→기밀성, Modification→무결성, Fabrication→인증성.
- Passive(수동)는 기밀성만 깸·탐지 어려움(도청, 트래픽 분석) / Active(능동)는 상태 변경·탐지 가능(위장, 재전송, 변조, DoS).
- Security Service 6종: 기밀성·무결성·인증·접근제어·부인방지·가용성.
- Security Mechanism은 Specific(계층 종속) vs Pervasive(계층 비종속, 감사·복구 등)로 나뉜다.
- 네트워크 보안 모델의 핵심은 Gatekeeper(인증·접근제어·필터링)이며, 방어는 암호화·SW·HW·정책·물리 5가지 통제로 구성.
