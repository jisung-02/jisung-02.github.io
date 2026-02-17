---
title: OpenStack 장애 대응 루프 메모
description: Nova/Neutron 이슈를 진단-복구-재검증 순서로 반복하는 간단한 런북 요약
date: 2026-02-17
tags: [openstack, runbook, reliability]
---

OpenStack에서 "서비스가 죽었다"는 느낌이 들 때,
감으로 복구하지 않고 같은 순서를 반복하기 위한 메모입니다.

## 1) 진단

- `openstack compute service list`
- `openstack network agent list`
- `docker ps` / `docker logs`

증상과 원인을 분리해 확인합니다.
인스턴스 `ERROR`가 항상 Nova 자체 문제인 것은 아닙니다.

## 2) 복구

1. 컨테이너 재시작(1차)
2. Kolla 재구성(2차)
3. 필요 시 네트워크/가상화 설정 분기 확인

## 3) 재검증

- 테스트 인스턴스 생성
- `ACTIVE` 상태 확인
- 불필요한 테스트 리소스 정리

핵심은 "한 번 해결"이 아니라,
"같은 방식으로 다시 복구 가능"하게 문서를 남기는 것입니다.

참고:
- https://docs.openstack.org/nova/latest/admin/services.html
- https://docs.openstack.org/kolla-ansible/latest/user/operating-kolla.html
- https://docs.openstack.org/python-openstackclient/latest/cli/command-objects/network-agent.html
