---
layout: post
title: Antigravity 설정 가이드 (Allow List & Rules)
date: 2026-01-27 17:00:00 +0900
categories: [AI, Tooling]
tags: [antigravity, cursor, configuration, rules]
---

Antigravity(AI Assistant)를 사용하면서 생산성을 높이기 위해 알아두면 좋은 두 가지 설정 방법을 정리한다. 
반복적인 승인 과정을 생략하는 **Allow List Terminal Command** 설정과, AI가 내 코딩 스타일을 일관되게 따르도록 **Rule**을 커스터마이징하는 방법이다.

## 1. Allow List Terminal Command 설정

Antigravity는 보안을 위해 `rm`, `curl` 등 시스템에 영향을 줄 수 있는 터미널 명령어를 실행할 때, 기본적으로 사용자의 승인을 받는다. 하지만 `npm install`, `source` 또는 단순 테스트용 스크립트 실행과 같이 안전하고 반복적인 명령어를 매번 승인하는 것은 번거로울 수 있다. 이를 해결하기 위해 자주 사용하는 명령어는 **Allow List**에 추가할 수 있다.

### 설정 방법

1. **명령어 실행 시**
   - AI가 터미널 명령어를 제안하고 실행 대기 상태일 때, 명령어 우측의 **'Always Allow'** (또는 유사한 문구) 체크박스나 아이콘을 클릭한다.
   - 이렇게 하면 해당 명령어 패턴은 이후부터 묻지 않고 즉시 실행된다.

2. **설정 메뉴에서 관리**
   - `Settings` (설정) > `Features` > `Terminal` > `Allowed Commands` 로 이동한다.
   - 여기서 이미 허용된 명령어 목록을 확인하고, 불필요한 항목은 삭제하거나 새로운 패턴을 추가할 수 있다.

> **Tip**: `git status`, `ls -al` 등 정보 조회용 명령어는 미리 등록해 두면 편리하다.

## 2. Rule Customize (규칙 설정)

AI에게 "항상 한글로 대답해줘", "DTO에는 Getter/Setter를 꼭 넣어줘"와 같은 나만의 규칙을 학습시킬 수 있다. 설정 범위에 따라 모든 프로젝트에 적용되는 **Global Rule**과 특정 프로젝트에만 적용되는 **Project Rule**이 있다.

### Global Rule (전역 설정)

내가 여는 모든 코드 베이스에 공통적으로 적용하고 싶은 규칙이다. `Settings` 내의 규칙 설정 메뉴를 통해 입력한다.

- **위치**: `Settings` > `General` > `Rules for AI`
- **내 예시 (현재 적용중인 규칙)**:

```text
### 1. 기본 소통 및 언어 설정 (Language & Communication)
 - 항상 한글 대답: 모든 답변은 반드시 한글로 작성합니다. 🇰🇷
 - 소스 코드 및 주석: 소스 코드를 작성할 때, 주석 및 API 문서는 항상 한글로 상세히 작성합니다.
 - 산출물 작성: 개발 계획(Plan), 작업 목록(Task List), 코드 설명(Walkthrough)은 항상 한글을 사용하여 명확하게 전달합니다.

### 2. 내 정보 및 메타데이터 (Identity)
 - 이름(Author): OOO
 - 회사: OOO
 - 직급/직위: OOO
 - 이메일: email@address.com

### 3. 소스 코드 작성 표준 (Coding Standards)

#### 3.1 Java 공통 규칙

 - Block 구문 준수: if, for, while, do-while 등의 제어문은 내부 코드가 단 한 줄이라도 반드시 중괄호 {}를 사용하여 작성합니다.
 - Import 최적화: 모든 import 구문은 소스 파일의 최상단에 작성하며, 사용하지 않는 import는 실시간으로 제거합니다.
 - 객체 정의 (DTO, VO, Entity): 모든 데이터 객체에는 getter, setter, toString 메서드를 반드시 작성해야 합니다.
 - 프로젝트 환경에 따라 Lombok(@Data, @Getter, @Setter 등) 사용을 우선적으로 제안하되, 직접 작성이 필요할 경우 표준 관례를 따릅니다.
 - 의존성 주입: Spring Framework 환경에서는 필드 주입(@Autowired)보다는 생성자 주입(Constructor Injection) 방식을 권장합니다.

#### 3.2 JavaScript & AngularJS 규칙

 - 명명 규칙: 변수 및 함수 명명 규칙은 CamelCase를 엄격히 준수합니다.
 - 디버깅 코드: console.log는 개발 및 디버깅 시에만 사용하며, 최종 코드 제출 전에는 제거하거나 적절한 로깅 라이브러리로 대체합니다.

### 4. 문서화 및 API 주석 (Documentation / Javadoc)

#### 4.1 기본 API 주석 가이드

 - 모든 class와 public method에는 Javadoc 스타일의 API 주석을 작성합니다.
 - 필수 포함 태그: 

| tag | 내용 |
|---|---|
| @author | OOO |
| @since | 작성 시점의 날짜 (형식: YYYY-MM-DD) |

 - Override 메서드 처리: @Override 어노테이션을 반드시 명시합니다.
 - 상속받은 메서드의 API 주석에는 @see, @author, @since 정보만 포함하여 중복을 최소화합니다.

### 5. 소스 리팩토링 및 품질 관리 (Refactoring & Quality)

 - Dead Code 제거: 사용하지 않는 변수, 메서드, 파라미터는 발견 즉시 삭제하여 코드를 깨끗하게 유지합니다.
 - 로직 추출: 복잡도가 높은 로직은 의미 있는 단위의 메서드로 추출(Extract Method)하여 가독성을 극대화합니다.
 - 예외 처리 및 로깅: 예외 발생 시 단순히 e.printStackTrace()를 출력하지 않고, 비즈니스 요구사항에 맞는 적절한 예외 처리와 로깅을 수행합니다.
 - 문서 정비: 주석이나 API 문서 중 과거의 잔재나 불필요한 정보(완료된 To-do 등)는 정기적으로 삭제합니다.
 - 일관성 유지: 조건문이나 반복문 내부의 한 줄 코드 블록 처리 규칙은 리팩토링 시에도 예외 없이 적용합니다.
```

### Project Rule (프로젝트별 설정)

특정 프로젝트에서만 지켜야 할 규칙(예: `Mybatis` 사용, 특정 네이밍 컨벤션 준수 등)은 프로젝트 루트에 파일로 저장하여 관리한다.

- **방법**: 프로젝트 최상위 디렉토리에 `.cursorrules` 파일을 생성한다.
- **작성 요령**: 위 Global Rule과 동일하게 자연어로 상세히 기술하면 된다.

이 두 가지 설정을 통해 AI가 매번 컨텍스트를 주입받지 않아도 내 의도에 맞게, 원하는 스타일로 코드를 작성해주어 훨씬 쾌적한 개발이 가능하다.
