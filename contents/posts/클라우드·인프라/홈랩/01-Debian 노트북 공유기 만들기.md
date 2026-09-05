---
title: Debian 노트북으로 홈랩 공유기 만들기
date: 2026-07-12
featured: true
publish: true
tags:
  - 홈랩
  - Debian
  - 네트워크
description: 남는 Debian 노트북에 NAT와 DHCP를 설정해 홈랩 공유기로 만든 기록
---

> 이 글은 아직 작성 중입니다.

K3s 같은 것도 직접 설치해 보고 싶어서 집에 남은 장비들로 홈랩을 만들기로 했다.

장비는 노트북 한 대와 Lenovo M72e Tiny 두 대였다. 미니 PC를 스위치에 연결하고 나니 문제가 하나 있었는데, 인터넷에 연결해 줄 공유기가 따로 없었다.

그래서 노트북을 그냥 공유기로 만들었다.

## 만들려던 구조

```text
휴대폰 핫스팟 또는 외부 Wi-Fi
             │
             │ wlp1s0 (Wi-Fi)
             ▼
        Debian 노트북
        ├─ NAT 라우터
        ├─ DHCP 서버
        └─ 나중에는 이것저것 올릴 서버
             │
             │ enp2s0 (Ethernet)
             ▼
           L2 스위치
           ├─ M72e mini-1
           └─ M72e mini-2
```

주소는 다음처럼 정했다.

```text
내부 네트워크: 192.168.50.0/24
노트북:        192.168.50.1
DHCP 범위:     192.168.50.100 ~ 192.168.50.200
```

노트북의 Wi-Fi로 인터넷을 받고, 유선 랜으로 스위치와 미니PC에 나눠 주는 구조다.

## 사용한 장비

- Debian 13 minimal을 설치한 노트북, RAM 16GB
- Lenovo ThinkCentre M72e Tiny 2대
- L2 스위치

M72e 한 대의 사양은 BIOS에서 확인했다.

```text
CPU: Intel Pentium G2020T @ 2.50GHz
RAM: 4GB DDR3-1333
SSD: BITS-S128GSATA3 128GB
```

좋은 사양은 아니지만 홈랩에서 이것저것 해보기에는 괜찮아 보였다.

## Debian 설치와 root 비밀번호

노트북에 Debian minimal을 설치할 때 root 비밀번호를 따로 설정했다. 설치하고 일반 사용자로 들어가서 `sudo`를 썼는데 다음 오류가 났다.

```text
-bash: sudo: command not found
```

처음에는 왜 없는지 의아했는데, root 계정을 따로 만들어 일반 사용자에게 `sudo`가 준비되지 않은 상태였다. 일단 root로 바꿔서 작업했다.

```bash
su -
```

이후 명령은 전부 root에서 실행했기 때문에 `sudo`를 붙이지 않았다.

```text
root@laptop1:~#
```

필요하면 나중에 아래처럼 설치하면 된다.

```bash
apt update
apt install -y sudo
adduser laptop1 sudo
```

그런데 이후 미니PC에 Debian을 설치할 때는 root 비밀번호를 따로 설정하지 않았다. Debian 설치할 때 root 비밀번호를 설정하면 이런 차이가 생긴다는 것을 한 번 겪었으니 다음부터는 그냥 안 했다.

## NetworkManager가 없었다

minimal 설치라 `NetworkManager`도 없었다.

```bash
systemctl status NetworkManager
```

```text
Unit NetworkManager.service could not be found.
```

고장은 아니고 minimal 설치라 그런 것 같았다. NetworkManager의 인터넷 공유 기능을 쓰는 대신 직접 구성하기로 했다.

필요한 것은 대충 다음 네 가지였다.

```text
iproute2
sysctl
nftables
dnsmasq
```

## 인터페이스 확인

먼저 노트북의 네트워크 인터페이스 이름을 확인했다.

```bash
ip -br link
```

```text
lo       UNKNOWN
enp2s0   DOWN
wlp1s0   UP
```

역할은 이렇게 정했다.

```text
wlp1s0 = WAN, 외부 Wi-Fi 방향
enp2s0 = LAN, 스위치 방향
```

중간에는 USB 랜카드 때문에 `enx...`로 시작하는 장치도 보였는데 최종적으로 사용한 것은 노트북의 `enp2s0`이었다.

## 노트북에 LAN 주소 설정

`enp2s0`에 홈랩 내부 게이트웨이 주소를 넣었다.

```bash
ip addr flush dev enp2s0
ip addr add 192.168.50.1/24 dev enp2s0
ip link set enp2s0 up
```

확인:

```bash
ip addr show enp2s0
```

```text
inet 192.168.50.1/24 scope global enp2s0
```

중간에 아래처럼 입력하기도 했다.

```text
ip paddr show enp2s0
```

당연히 안 됐다.

```text
Object "paddr" is unknown
```

그냥 `ip addr show enp2s0`가 맞다.

여기서 넣은 주소는 재부팅하면 사라지는 임시 설정이다. 영구 설정은 아직 마지막에 남겨 두었다.

## IPv4 forwarding 켜기

노트북이 한 인터페이스에서 받은 패킷을 다른 인터페이스로 보내려면 IP forwarding을 켜야 한다.

```bash
sysctl -w net.ipv4.ip_forward=1
```

확인:

```bash
cat /proc/sys/net/ipv4/ip_forward
```

결과가 `1`이면 된다.

재부팅 후에도 적용되도록 설정 파일도 만들었다.

```bash
printf 'net.ipv4.ip_forward=1\n' > /etc/sysctl.d/99-router.conf
sysctl --system
```

처음에는 아래처럼 `=1`을 빼먹었다.

```text
net.ipv4.ip_forward1
```

잘못 만든 파일을 지우고 다시 만들었다.

```bash
rm -f /etc/sysctl.d/99.router.conf
```

파일 이름도 중간에 `99.router.conf`와 `99-router.conf` 두 가지로 만들었기 때문에 최종 파일만 남겼다.

## nftables로 NAT 설정

미니PC의 `192.168.50.x` 주소는 인터넷에서 바로 사용할 수 없다. 노트북 Wi-Fi 주소로 바꿔서 보내기 위해 NAT가 필요했다.

`nftables`는 이미 설치되어 있었다.

```bash
nft --version
```

설정은 `/etc/nftables.conf`에 작성했다.

```text
#!/usr/sbin/nft -f

flush ruleset

table inet router {
    chain forward {
        type filter hook forward priority filter;
        policy drop;

        iifname "enp2s0" oifname "wlp1s0" accept
        iifname "wlp1s0" oifname "enp2s0" ct state established,related accept
    }

    chain postrouting {
        type nat hook postrouting priority srcnat;
        oifname "wlp1s0" masquerade
    }
}
```

적용하고 부팅 시에도 실행되도록 했다.

```bash
nft -f /etc/nftables.conf
systemctl enable --now nftables
nft list ruleset
```

규칙은 다음 역할을 한다.

- `enp2s0 → wlp1s0` 트래픽은 밖으로 보낸다.
- 외부에서 돌아오는 패킷은 이미 내부에서 시작한 연결의 응답일 때만 받는다.
- `masquerade`로 미니PC의 주소를 노트북 Wi-Fi 주소로 바꾼다.
- 그 외의 외부에서 새로 들어오는 연결은 `policy drop`으로 막는다.

## dnsmasq로 DHCP 설정

이제 미니PC에 IP, 게이트웨이, DNS 주소를 자동으로 줘야 했다.

```bash
apt update
apt install -y dnsmasq
```

`/etc/dnsmasq.d/homelab.conf`를 만들었다.

```text
interface=enp2s0
bind-interfaces

dhcp-range=192.168.50.100,192.168.50.200,12h
dhcp-option=3,192.168.50.1
dhcp-option=6,1.1.1.1,8.8.8.8
```

각 항목은 다음 의미다.

```text
IP 범위: 192.168.50.100 ~ 192.168.50.200
게이트웨이: 192.168.50.1
DNS: 1.1.1.1, 8.8.8.8
임대 시간: 12시간
```

서비스를 재시작하고 자동 시작도 켰다.

```bash
systemctl enable dnsmasq
systemctl restart dnsmasq
systemctl status dnsmasq
```

여기서도 아래처럼 한 번 입력했다.

```bash
system restart dnsmasq
```

```text
-bash: system: command not found
```

`system`이 아니라 `systemctl`이다.

현재 설정에서는 클라이언트가 외부 DNS인 `1.1.1.1`과 `8.8.8.8`에 직접 질의한다. 따라서 dnsmasq는 지금 거의 DHCP 서버 역할만 한다.

나중에 내부 이름까지 쓰려면 DNS 주소를 노트북으로 주면 된다.

```text
dhcp-option=6,192.168.50.1
```

이것은 아직 적용하지 않았다.

## DHCP는 되는데 계속 PXE만 나왔다

노트북에서 DHCP 로그를 봤다.

```bash
journalctl -u dnsmasq -f
```

미니PC를 켜면 이런 로그가 계속 나왔다.

```text
DHCPDISCOVER(enp2s0)
DHCPOFFER(enp2s0) 192.168.50.189
```

이 로그가 보인다는 것은 적어도 다음 구간은 정상이라는 뜻이었다.

```text
미니PC 랜카드 → 랜선 → 스위치 → 노트북 enp2s0 → dnsmasq
```

일반적인 DHCP는 아래 순서로 끝난다.

```text
DHCPDISCOVER
DHCPOFFER
DHCPREQUEST
DHCPACK
```

그런데 이 미니PC는 `DISCOVER → OFFER`만 반복했다. 처음에는 DHCP 설정이 잘못된 줄 알았는데 화면을 보니 OS가 아니라 PXE 부트 ROM이었다.

```text
Intel UNDI, PXE-2.1
Realtek PCIe GBE Family Controller
DHCP...
```

부팅할 디스크나 USB를 못 찾고 마지막 순서인 네트워크 부팅으로 넘어간 것이었다. PXE 서버는 만들지 않았으니 부팅 파일을 못 받고 다시 DHCP를 요청했다.

## 이것저것 뜯어봤다

처음에는 다음을 의심했다.

```text
USB 문제
SSD 문제
SATA 케이블 문제
RAM 접촉 문제
CMOS 문제
메인보드 문제
```

RAM을 뺐다가 다시 꽂았고, 빠져 있던 SATA 케이블도 다시 연결했다. 기존 SSD 대신 다른 2.5인치 HDD도 연결해 봤다. 그래도 똑같이 PXE로 넘어갔다.

BIOS에서는 SSD가 정상적으로 보였다.

```text
SATA Drive 1
Hard Disk BITS-S128GSATA3
```

그러면 SSD나 SATA 컨트롤러가 완전히 죽은 것은 아니었다.

메인보드의 `CLR_CMOS` 점퍼까지 찾았지만 CMOS 초기화는 하지 않았다. 그 전에 BIOS 설정에서 원인을 찾았다.

## 실제 원인은 BIOS 부팅 순서

전원을 켠 직후 `F1`을 계속 눌러 BIOS Setup에 들어갔다.

```text
F1 = BIOS Setup
F12 = Boot Menu
```

`Startup → Primary Boot Sequence`로 들어가 보니 USB 메모리가 아예 인식되지 않은 것은 아니었다. 대신 아래에 있었다.

```text
Excluded from boot order:
└─ USB HDD
   └─ USB HDD 1: US
```

USB가 부팅 순서에서 제외되어 있었다.

그래서 실제 부팅 순서는 대충 이랬다.

```text
USB는 제외
→ OS가 없는 SATA SSD 시도
→ Network PXE 시도
→ DHCP 요청 반복
```

`USB HDD 1: US`를 선택하고 `X`를 눌러 다시 부팅 순서에 포함했다.

```text
<x> excludes / includes the device to boot
```

수정 후에는 다음처럼 됐다.

```text
Primary Boot Sequence
├─ USB HDD
│  └─ USB HDD 1: US
├─ SATA 1: BITS-S128GSATA3
└─ Network 1: Realtek PXE
```

`F10`으로 저장하고 나오니 바로 USB로 부팅됐다. 이후 Debian 설치도 정상적으로 끝났다.

결국 DHCP 문제처럼 보였지만 DHCP는 처음부터 응답하고 있었다. BIOS에서 USB 부팅이 제외된 것이 문제였다.

## 현재 된 것

```text
[완료] 노트북 Debian 13 minimal 설치
[완료] 미니PC 두 대 Debian 설치
[완료] 노트북 Wi-Fi 인터넷 연결
[완료] enp2s0 내부망 주소 설정
[완료] IPv4 forwarding 설정
[완료] nftables NAT 설정
[완료] dnsmasq DHCP 설정
[완료] 스위치를 통한 미니PC 인터넷 연결
[완료] M72e USB 부팅 문제 해결
```

아직 남은 것도 있다.

```text
[미완료] enp2s0의 192.168.50.1 영구 설정
[미확인] 재부팅 후 Wi-Fi 자동 연결
[미완료] 미니PC DHCP 주소 예약
[미완료] 내부 DNS 이름 설정
```

특히 `ip addr add`로 넣은 `192.168.50.1`은 재부팅하면 사라진다. `/etc/network/interfaces`에 아래 내용을 추가할 예정이다.

```text
allow-hotplug enp2s0
iface enp2s0 inet static
    address 192.168.50.1/24
```

재부팅 후에는 노트북에서 다음을 확인하면 된다.

```bash
ip -4 addr show enp2s0
sysctl net.ipv4.ip_forward
systemctl is-active nftables
systemctl is-active dnsmasq
ip route
```

미니PC에서는 순서대로 확인한다.

```bash
ping -c 3 192.168.50.1
ping -c 3 8.8.8.8
getent hosts deb.debian.org
```

- `192.168.50.1`이 되면 내부 LAN은 된다.
- `8.8.8.8`이 되면 forwarding과 NAT도 된다.
- 도메인 조회가 되면 DNS도 된다.

## 다음에 할 것

미니PC 주소는 DHCP 예약으로 아래처럼 고정할 생각이다.

```text
노트북: 192.168.50.1
mini-1: 192.168.50.11
mini-2: 192.168.50.12
```

그다음 hostname과 SSH를 정리하고 이 홈랩에 K3s도 설치해 볼 예정이다.

한 가지 신경 쓸 점은 현재 `/etc/nftables.conf` 맨 위의 `flush ruleset`이다. 나중에 K3s나 다른 프로그램이 방화벽 규칙을 추가한 뒤 `nft -f /etc/nftables.conf`를 실행하면 그 규칙까지 지울 수 있다. 그때는 전체 ruleset 대신 내가 만든 `table inet router`만 관리하도록 바꿔야 한다.

일단 지금은 공유기 없이 노트북, 스위치, 미니PC 두 대가 인터넷에 연결되는 것까지 됐다. 홈랩의 네트워크 바닥은 만든 셈이다.
