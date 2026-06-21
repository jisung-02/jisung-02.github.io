---
title: "의존성 역전"
date: 2026-04-05
publish: true
category: "소프트웨어공학/의존성·설계 원칙"
tags: ["설계", "OOP"]
description: "의존성 역전 원칙(DIP)을 언어별 배치까지 정리"
---

## 의존성 역전 (Dependency Inversion Principle, DIP)
> 상위 모듈과 하위 모듈이 서로 직접 의존하지 않고, 둘 다 “추상(인터페이스)”에 의존하도록 만드는 설계 원칙

## **0. 핵심 모델 (언어 공통)**
```
[ Consumer ] ---depends on---> [ Interface ] <---implements--- [ Producer ]
```

-> 아래는 consumer와 producer의 배치까지 고려한 각 언어별 예시
	•	Consumer (상위 모듈): Service / UseCase
	•	Producer (하위 모듈): DB, API client, external infra
	•	Interface 위치: Consumer 쪽

## Go
```
// consumer package

type UserRepository interface {
    FindByID(id int) (User, error)
}

type UserService struct {
    repo UserRepository
}
```

```
// producer package

type MySQLRepo struct{}

func (r *MySQLRepo) FindByID(id int) (User, error) {
    return User{}, nil
}
```

- 서비스 레이어가 Consumer, Repository 레이어가 Producer다
- go는 implicit interface를 지원한다
	- go의 duck typing
- interface는 consumer에 위치하고, producer의 구현체는 이 interface를 명시적으로 구현하지 않고 따르면 된다
	- 결합 방향이 자연스럽게 역전된다
```
[[ Consumer ] ---depends on---> [ Interface ]] <---implements--- [ Producer ]
```
- consumer의 생성 시점에 구현된 producer가 주입된다

```
var _ UserRepository = (*MySQLRepo)(nil) // optional compile-time check
```
- 이 형태로 compile time에 명시적인 구현 체크가 가능하다

---
## Java
### 일반적인 Spring 구조에서의 DIP
```
com.example.app
 ├── controller
 ├── service
 ├── repository
 ├── entity
```

```
controller → service → repository(interface) → repository impl
```

```
@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }
}
```

```
@Repository
public interface UserRepository extends JpaRepository<User, Long> {}
```
- 이때 UserRepository의 구현체는 Spring이 JpaRepository를 보고 생성해준다
- 일반적인 Java, Spring의 interface는 consumer가 아닌 producer에 위치한다

### Port and Adaptor
```
com.example.app

 ├── user
 │   ├── application         ← consumer (service / usecase)
 │   │   ├── UserService.java
 │   │   └── port
 │   │       └── UserRepository.java   ← 인터페이스 (여기에 둠)
 │   │
 │   ├── domain
 │   │   └── User.java
 │   │
 │   ├── infrastructure      ← producer
 │   │   ├── persistence
 │   │   │   └── JpaUserRepository.java
 │   │   └── config
 │   │
 │   └── presentation
 │       └── UserController.java
```
- 이때는 인터페이스가 consumer 패키지에 위치한다
- producer는 이를 구현한다
```
// user/application/port/UserRepository.java

public interface UserRepository {
    User findById(Long id);
}
```

```
// user/infrastructure/persistence/JpaUserRepository.java

@Repository
public class JpaUserRepository implements UserRepository {
    @Override
    public User findById(Long id) {
        return new User();
    }
}
```

```
// user/application/UserService.java

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }
}
```
- 이 경우 consumer 패키지에서 인터페이스를 정의한다

-> producer가 interface를 정의하더라도 구현체를 숨기는 DIP는 만족한다
-> 그러나 interface는 계약이고, 이 계약이 누가 원하는 형태인지가 중요하다
	- 시스템은 서비스(유스케이스)가 하고 싶은 일을 수행하는 형태여야 한다
	- 그러므로 계약의 설정도 서비스(유스케이스, consumer)가 수행해야 한다

## 전체적인 구조
### 일반적 스프링
```
Controller → Service → Repository(interface) → JPA/DB
                        ↓
                      Entity
```

```
Presentation → Application → Infrastructure
                        ↓
                      Domain
```

### Port & Adaptor 스프링
```
Controller → Application(Service)
                   ↓
                Domain
                   ↑
          Infrastructure (Repository impl)
                   ↓
          Application Port(interface)
```


---
## Python
- DIP 방식이 불분명하다
#### Protocol
```
from typing import Protocol

class UserRepository(Protocol):
    def find_by_id(self, id: int) -> "User": ...
```

```
class UserService:
    def __init__(self, repo: UserRepository):
        self.repo = repo
```

```
class MySQLRepo:
    def find_by_id(self, id: int):
        return User()
```
