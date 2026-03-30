---
title: "UTM 가상머신 설치 가이드 (Mac)"
---

# UTM 가상머신 설치 가이드 (Mac)

> 참고: [MAC 가상머신 UTM 설치 방법](https://cocococo.tistory.com/entry/MAC-%EA%B0%80%EC%83%81%EB%A8%B8%EC%8B%A0-UTM-%EC%84%A4%EC%B9%98-%EB%B0%A9%EB%B2%95#google_vignette)

---

## 1. 사전 준비

두 가지 파일이 필요하다.

1. **UTM 프로그램** — [mac.getutm.app](https://mac.getutm.app) 에서 무료 다운로드 (App Store 유료판 말고 여기서 받기)
2. **Ubuntu ISO 파일** — M1/M2/M3 Mac은 반드시 **ARM 아키텍처** 버전으로 받기

---

## 2. 가상머신 생성

### 새 가상머신 만들기
![[Pasted image 20260330145913.png]]
- UTM 실행 후 **새로운 가상머신 생성** 클릭

### 가상화 방식 선택
![[Pasted image 20260330145931.png]]
- **가상화(Virtualize)** 선택 (에뮬레이션보다 훨씬 빠름)

### OS 선택
![[Pasted image 20260330145952.png]]
- **Linux** 선택

### ISO 파일 연결
![[Pasted image 20260330150004.png]]
![[Pasted image 20260330150127.png]]
![[Pasted image 20260330150136.png]]
- 다운로드한 Ubuntu ARM ISO 파일 선택 후 Continue

### 사양 설정
![[Pasted image 20260330150145.png]]
![[Pasted image 20260330150204.png]]
- **메모리**: 4GB 이상 권장
- **CPU 코어**: 2개 이상 권장

---

## 3. Ubuntu 설치

![[Pasted image 20260330151432.png]]

Play 버튼을 누르면 Ubuntu 설치 과정이 시작된다.

- `Install Ubuntu Server` 선택
- 언어는 **English** 선택
- 나머지는 기본값 유지하며 `Done` 반복 클릭
- 사용자 계정(ID/PW) 생성
- 설치 완료까지 대기

---

## 4. 설치 완료 후 재부팅

![[Pasted image 20260330150535.png]]
![[Pasted image 20260330150545.png]]

`reboot` 요청이 오면 바로 누르지 말고:

1. UTM에서 **일시정지**
2. **외부 드라이브(ISO) 제거** — 이걸 안 하면 설치가 무한 반복됨
3. 이후 재부팅하면 정상 작동

---

## 5. GUI 설치 (선택)

서버 버전으로 설치했다면 터미널에서 아래 명령어로 데스크탑 환경 추가 가능:

```bash
sudo apt update
sudo apt install ubuntu-desktop
```

설치 후 재부팅하면 그래픽 인터페이스 사용 가능.

---
