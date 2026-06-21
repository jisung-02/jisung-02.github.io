---
title: "AI 네트워킹 강의 정리"
date: 2026-06-20
publish: true
category: "학교공부/AI네트워킹"
tags: ["AI네트워킹"]
description: "경희대학교 AI 네트워킹(허의남 교수님) 수업의 강의 슬라이드(PDF)를 정리한 Obsidian Vault입니다."
---

경희대학교 **AI 네트워킹**(허의남 교수님) 수업의 강의 슬라이드(PDF)를 정리한 Obsidian Vault입니다.
**중간 범위 + 기말 범위** 전체를 하나의 Vault에 모았습니다.

> - **기말 범위** 노트: `강의/` — 슬라이드 이미지 → 직역 → (있을 경우) 녹취 설명 구성.
> - **중간 범위** 노트: `강의/중간/` — 노션 강의 노트를 옵시디언용으로 정리(텍스트·표 중심).
> - 종합 요약: `_summary/` (중간·기말 각 1개 + PDF). 생성 PDF: `PDF/` (중간·기말·요약).

## 📝 종합 요약 (시험용)
- [AI네트워킹 중간 요약](/posts/ain-AI네트워킹-중간-요약/) — 중간 15개 강의 통합 압축본
- [AI네트워킹 요약](/posts/ain-AI네트워킹-요약/) — 기말 강의 통합 압축본
- [AI네트워킹 기말 족보](/posts/ain-AI네트워킹-기말-족보/) — 기말 기출 문항 + **교수님 모범답안**(간결)

## 📕 중간 범위 강의 목록 (강의/중간/)

| # | 노트 | 주제 |
|---|---|---|
| M01 | [M01 Introduction to AI Networking](/posts/ain-m01/) | AI 네트워킹 개론 · AIOps |
| M02 | [M02 OSI 7계층](/posts/ain-m02/) | OSI 7계층 · PDU · 캡슐화 |
| M03 | [M03 TCP-IP Protocol Suite & Address](/posts/ain-m03/) | TCP/IP 4계층 · 주소 4종 |
| M04 | [M04 Physical Layer - Bandwidth Utilization](/posts/ain-m04/) | 멀티플렉싱 · 확산 스펙트럼 |
| M05 | [M05 Data Link Layer - Switching](/posts/ain-m05/) | 회선/패킷/가상회선 교환 |
| M06 | [M06 Data Link Layer - Data Link Control](/posts/ain-m06/) | ARQ · 흐름/오류 제어 |
| M07 | [M07 Data Link Layer - Multiple Access](/posts/ain-m07/) | ALOHA · CSMA · 채널화 |
| M08 | [M08 Error Detection and Correction](/posts/ain-m08/) | 패리티 · 해밍 · CRC · 체크섬 |
| M09 | [M09 Network Layer - Addressing](/posts/ain-m09/) | IPv4 · 서브넷 · NAT |
| M10 | [M10 Network Layer - Routing](/posts/ain-m10/) | 포워딩 · RIP/OSPF/BGP |
| M11 | [M11 TCP](/posts/ain-m11/) | 3-way handshake · 혼잡 제어 |
| M12 | [M12 Future Internet](/posts/ain-m12/) | SDN · ICN · 미래 인터넷 |
| M13 | [M13 AI for Security - 네트워크 보안 소개](/posts/ain-m13/) | 위협·서비스·메커니즘 |
| M14 | [M14 Message Authentication & Key Management](/posts/ain-m14/) | 해시 · HMAC · RSA/DH |
| M15 | [M15 Intruders & Firewalls](/posts/ain-m15/) | 침입자 · 방화벽 유형 |

## 📘 기말 범위 강의 목록

기말 범위 강의 노트는 `강의/기말/` 에 있습니다. (슬라이드 이미지 → 직역 → 녹취 설명 구성)

| # | 노트 | 주제 | 원본 |
|---|---|---|---|
| F01 | [F01 Application Layer - HTTP](/posts/ain-f01/) | HTTP / 웹 | 9.1 (29장) |
| F02 | [F02 Application Layer - FTP & SMTP](/posts/ain-f02/) | FTP · 이메일(SMTP/POP/IMAP) · DNS | 9.2 (68장) |
| F03 | [F03 Parallel ML](/posts/ain-f03/) | 병렬/분산 머신러닝 | 11-1 (51장) |
| F04 | [F04 Federated & Split Learning](/posts/ain-f04/) | 연합학습 · 스플릿 러닝 | 11-2 (36장) |
| F05 | [F05 Communication Challenge in ML](/posts/ain-f05/) | 분산 ML의 통신 문제 | 11-3 (24장) |
| F06 | [F06 AI Agent](/posts/ain-f06/) | AI 에이전트 | 11-4 (55장) |
| F07 | [F07 AI-Enabled 6G](/posts/ain-f07/) | AI 기반 6G 네트워크 | 14-1 (66장) |
| F08 | [F08 실습 - 시험 핵심개념](/posts/ain-f08/) | 이상탐지 · 연합학습 · SYN Flood (개념·방법론) | 실습 |

## 강의 ↔ 녹음 매핑

| 강의 | 발췌 녹음 |
|---|---|
| 11.1 HTTP | 4/27 |
| 11.2 FTP/이메일/DNS | 4/27 후반 + 4/29 |
| 11-1 병렬/분산 ML | 4/29 후반 + 5/27 |
| 11-2 연합학습/스플릿 | 5/11 후반 + 5/13 |
| 11-3 통신 문제 | 5/27 (+5/13 일부) |
| 11-4 AI 에이전트 | 5/27 후반 + 5/13 도입 + 6/8 후반 |
| 14-1 AI 6G | 6/8 |

## 사용 안내
- 이 폴더(`AI네트워킹_정리`)를 Obsidian에서 **Open folder as vault** 로 열면 됩니다.
- 원본 PDF·txt 파일은 수정하지 않았으며, 이 Vault는 별도로 생성된 정리본입니다.
