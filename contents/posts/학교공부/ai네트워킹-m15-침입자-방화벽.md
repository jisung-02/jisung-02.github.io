---
title: "AI for Network Security: Intruders & Firewalls"
date: 2026-06-20
publish: true
category: "AI네트워킹"
tags: ["AI네트워킹"]
description: "Masquerader: 계정이 없으면서 계정 있는 정상 사용자인 것처럼 위장 (외부자)."
---

> AI 네트워킹 **중간**범위 — 노션 강의 노트를 옵시디언용으로 정리한 노트.
> [← 전체 목차](/posts/ai네트워킹-목차/)

## 1. Intruders (침입자 유형)
- **Masquerader**: 계정이 없으면서 계정 있는 정상 사용자인 것처럼 위장 (외부자).
- **Misfeasor**: 정상 사용자이지만 권한 없는 자원에 접근 시도 (내부자).
- **Clandestine user**: root 권한을 탈취해 흔적 없이 시스템을 장악 (내·외부 모두 가능).

## 2. Intrusion Techniques (침입 기법)
### 비밀번호 보호 방식
- Password file 관리: One-way encryption(역연산 불가), Access Control(접근 제한).

### 비밀번호 공격 기법
- 기본(default) 비밀번호 시도, 짧은 문자열 brute-force(1~3 chars), 사전 공격(dictionary attack).
- 개인 정보 기반 추측(생일·가족 이름·취미), 전화번호/주소/SSN 활용, 차량 번호 brute-force.
- Trojan horse, 네트워크 도청(sniffing).
- 대응: 강력한 비밀번호 정책 적용.

### UNIX Password Scheme
- 저장 구조: `password + salt → crypt 함수 → 저장`.
- salt 역할: 동일 비밀번호 구분(같은 비밀번호도 다르게 저장), 길이 증가 효과, DES 기반 공격 방어.
- 과거: `/etc/password` 공개 파일 → 현재: **shadow file (root만 접근)**.

### Password Selection 전략
- 사용자 교육, 시스템 생성 비밀번호, Reactive checking(사후 검사), Proactive checking(사전 검사).

### 침입 단계 (Attack Lifecycle)
1. 네트워크 스캔 (IP, OS, open port 탐색)
2. 취약점 exploit
3. root shell 획득 (suid)
4. 백도어 설치
5. IRC로 공격자 공유

## 3. Intrusion Detection (침입 탐지)
- 목적: 침입 탐지 및 제거, 공격 정보 수집 → 보안 강화.

### 탐지 방식
- **1) Statistical anomaly detection (통계적 이상 탐지)**: Threshold 기반 + 사용자 프로파일 기반(Counter, Gauge, Interval timer, Resource usage). 분석 기법: 평균/표준편차, 시계열, Markov process.
- **2) Rule-based detection (규칙 기반 탐지)**: Anomaly detection(이상행위), Penetration detection(전문가 시스템 기반).

### 탐지 지표
- 로그인 빈도, 로그인 위치, 마지막 로그인 시간, 로그인 실패 횟수, 프로그램 실행 빈도, 파일 접근(read/write/delete), 실패 횟수.

### Distributed IDS
- Agent 기반 분산 탐지, 중앙 관리 시스템 존재.

## 4. Firewalls
- 정의: 내부 네트워크 보호 + 외부 인터넷 연결 제공.
- 설계 목적: Controlled link 제공, 내부 네트워크 보호, **Single choke point**제공.
- 설계 원칙: 모든 트래픽은 firewall를 통과, 정책 기반 허용만 가능, firewall 자체는 침투 불가해야 함.
- 제어 방식 4가지: **Service control / Direction control / User control / Behavior control**.

## 5. Types of Firewalls
### 5.1 Packet Filtering Router (패킷 필터링 라우터)
- 동작: IP/TCP header 기반 rule 매칭 → 패킷 전달 or 폐기. 양방향 필터링, default 정책 존재.
- 장점: 단순, 빠름, 사용자 투명성.
- 단점: rule 설정 어려움, 인증 기능 없음.
- 공격 유형: IP spoofing, Source routing attack, Tiny fragment attack.

### 5.2 Application-Level Gateway (Proxy)
- 특징: application layer에서 동작, proxy 역할 수행.
- 장점: 높은 보안성, 로그/감사 용이.
- 단점: 성능 저하 (connection마다 처리).

### 5.3 Circuit-Level Gateway
- 특징: TCP connection 2개 생성, payload는 검사하지 않음.
- 목적: 연결 허용 여부만 판단. 예시: SOCKS.

### 5.4 Bastion Host
- 보안 핵심 시스템, gateway 역할 수행.

## 6. Firewall Configurations
- **6.1 Screened Host (Single-homed)**: Packet filter router + Bastion host 구성. router는 bastion만 통과 허용, bastion이 인증 및 proxy 수행.
- **6.2 Screened Host (Dual-homed)**: bastion host가 네트워크를 물리적으로 분리, 모든 트래픽이 bastion 통과.
- **6.3 Screened Subnet (가장 안전)**: router 2개 사용, **DMZ**(isolated subnet) 구성. 장점: 3단계 방어, 내부 네트워크 숨김.

## 7. Trusted Systems
- 개념: 보안 정책을 강제하는 시스템.

### Access Control
- 모델: Access Matrix, Access Control List(ACL), Capability List.
- Access Matrix 구성: Subject(사용자/프로세스), Object(파일 등), Access Right(read/write/execute).

### Multilevel Security
- 규칙: **No read up**(상위 등급 읽기 금지), **No write down**(하위 등급 쓰기 금지).

### Reference Monitor
- 역할: 접근 제어 핵심 모듈. 모든 접근 통제, 보안 DB 활용, 정책 강제.
- 속성: **Complete mediation**(완전한 중재), **Isolation**(격리), **Verifiability**(검증 가능성).
- Trojan Horse 방어: Trusted OS 사용.

## 핵심 정리 (시험 포인트)
- 침입자 3유형: Masquerader(위장·외부자), Misfeasor(권한 초과·내부자), Clandestine user(root 장악).
- UNIX 비밀번호는 password+salt→crypt 저장. salt는 동일 비밀번호 구분·DES 공격 방어 역할, 현재는 shadow file(root 전용).
- 침입 탐지 2방식: Statistical anomaly(통계·프로파일) vs Rule-based(이상행위·침투 탐지).
- 방화벽 4대 제어: Service / Direction / User / Behavior control. 설계 핵심은 Single choke point.
- 방화벽 유형: Packet Filter(빠르나 인증 없음), Application Gateway(보안↑ 성능↓), Circuit-Level(payload 미검사, SOCKS).
- 구성 중 Screened Subnet(라우터 2개+DMZ)이 가장 안전. Multilevel Security는 No read up / No write down 규칙.
