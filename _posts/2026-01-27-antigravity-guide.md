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
1. 기본 설정
 - 항상 한글로 대답해줘
 - 소스 코드를 작성하고, 주석/API를 작성할 때는 항상 한글로 작성해줘
 - plan, task, walkthrough 작성은 항상 한글로 해줘

2. 내 정보
 - 이름: OOO
 - 회사: OOO
 - 직급: OOO
 - 직위: OOO

3. 소스 코드 작성
 - 모든 class, method에는 API 작성, API에는 @author, @since 정보는 항상 포함
   (단 override된 method의 API는 @see, @author, @since 정보만 포함)
 - if, for 문 같이 사용하는 block 함수는 내부 코드가 한줄이라도 '{}'로 묶어서 작성해줘
 - import는 항상 소스 파일의 상단에 작성해줘
 - java에서 DTO, VO, Entity같은 객체는 항상 getter, setter, toString 함수를 작성해야해

4. 소스 리팩토링
 - 사용하지 않는 변수, 메소드 삭제
 - import는 항상 소스 파일의 상단에 작성
 - 주석, API, Document 정보중 필요 없는 정보는 삭제
 - 주석, API, Document 는 항상 한글로 작성
 - class, method의 API, Document에는 @since, @author 정보를 항상 포함
 - override method에는 @see 정보 작성
 - if, for 문 등의 내부의 코드가 한줄인 코드도 '{}'로 묶어서 작성
```

### Project Rule (프로젝트별 설정)

특정 프로젝트에서만 지켜야 할 규칙(예: `Mybatis` 사용, 특정 네이밍 컨벤션 준수 등)은 프로젝트 루트에 파일로 저장하여 관리한다.

- **방법**: 프로젝트 최상위 디렉토리에 `.cursorrules` 파일을 생성한다.
- **작성 요령**: 위 Global Rule과 동일하게 자연어로 상세히 기술하면 된다.

이 두 가지 설정을 통해 AI가 매번 컨텍스트를 주입받지 않아도 내 의도에 맞게, 원하는 스타일로 코드를 작성해주어 훨씬 쾌적한 개발이 가능하다.
