---
title: WebSocket RFC 핵심만 빠르게 정리
description: RFC 6455, 8441, 9220을 기준으로 실무에서 먼저 볼 포인트를 짧게 정리한 메모
date: 2026-02-17
tags: [network, websocket, rfc]
---

WebSocket을 다시 볼 때 저는 RFC 원문을 처음부터 끝까지 읽기보다,
문제 지점이 자주 생기는 항목을 먼저 점검합니다.

## 먼저 보는 4가지

1. **Handshake가 정상적으로 완료됐는지**
2. **Ping/Pong으로 연결 생존을 관리하는지**
3. **Close code를 기록하고 종료하는지**
4. **프록시/로드밸런서 환경에서 업그레이드가 유지되는지**

## RFC별 체크 포인트

- **RFC 6455**: 기본 프로토콜(핸드셰이크, 프레임, 마스킹, 종료 코드)
- **RFC 8441**: HTTP/2 환경의 WebSocket 확장(Extended CONNECT)
- **RFC 9220**: HTTP/3(QUIC) 환경에서의 WebSocket 매핑

## 운영 메모

- 클라이언트/서버 양쪽 로그에 `open`, `ping/pong`, `close` 이벤트를 남겨야 재현이 쉽습니다.
- 네트워크 단절 이슈는 애플리케이션 버그보다 타임아웃/프록시 설정 문제인 경우가 많습니다.

참고:
- https://datatracker.ietf.org/doc/html/rfc6455
- https://datatracker.ietf.org/doc/html/rfc8441
- https://datatracker.ietf.org/doc/html/rfc9220
