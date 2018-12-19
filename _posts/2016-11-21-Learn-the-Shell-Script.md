---
layout: post
title: "Learn the Shell Script"
date: 2016-11-21
excerpt: "기본적인 shell script 문법"
tags: [shell, shell script, grammar]
comments: true
---

# 기본 문법

### 변수

 - 변수를 선언할때 '=' 양 옆의 공백이 없어야 한다.
 - `변수명=` : NULL로 초기화된 변수 선언
 - `unset 변수명` : 변수를 제거
 - `readonly 변수명` : 상수로 생성
 - `set` : 사용하고 있는 변수들의 리스트

<br/>

**특별한 변수 할당 방법**

 - `${X:-Y}` : x에 값이 있으면 그대로 출력, 그렇지 않으면 Y값을 사용
 - `${X:=Y}` : 위와 동일 하게 실행. Y가 사용되면 X에 Y값을 할당
 - `${X:?에러메세지}` : X에 값이 ㅇ벗으면 에러메세지와 함께 종료

**변수 타입선업(declare)**

 - `declare -r 변수명` : 읽기 전용 변수 선언
 - `declare -i 변수명` : 정수형 변수 선언
 - `declare -a 변수명` : 배열 변수 선언
 - `declare -f` : 스크립트 안에 정의된 모든 함수들을 보여준다
 - `declare -f 함수명` : 해당 함수 내용을 보여준다.
 - `declare -x 변수명` : 환경변수로 export

### let

 - 산술 연산을 쉽게 할 수 있는 명령어
   - ex) ```sh let a=2*3```
   - ex) ```sh let a+=1```

### $\#

 > number of params

ex)
```sh
./program param01 param02
```

 - param01은 스크립트내에서 `$1`로 불러올 수 있다.
 - 마찬가지 방법으로 program name과 param02는 `$0`, `%2`로 불러올 수 있다.
 - `$\*`로 `$0`을 제외한 모든 파라미터들을 문자열로 가져올 수 있다.

### read

 - 사용자로 부터 변수를 입력 받을 때 사용한다.
   - ex) ```sh read 변수명```

### 제어문

 - `||` : 앞의 명령어 실행이 실패 했을 때, 뒤의 명령어가 실행되도록 한다.
   - ex) ```sh Run Command1 || echo 실패 >> log.txt ```
 - `&&` : 앞의 명령어 실행이 성공 했을 때, 뒤의 명령어가 실행되도록 한다.
   - ex) ```sh Run Command2 && echo 성공 >> log.txt ```

### 반복문

 - `while [ Condition ]` : condition이 true이면 반복 실행
 - `until [ Condition ]` : condition이 false이면 반복 실행
 - `for 변수 in 값; do ~~~ done`
 - `for ((초기값;조건식;증감));do ~~~ done`

# 비교 옵션

### 문자열

 - `-n` : 문자열 사이즈가 0이 아닌지 확인
   - ex) ```sh [ -n $stringName ]```
 - `-z` : 문자열 사이즈가 0인지 확인
   - ex) ```sh [ -z $stringName ]```
 - `==` : 같은 문자열인지 확인
 - `!=` : 다른 문자열인지 확인

### 숫자 대소 관계

- `[ A -ge B ]` : A보다 B가 크거나 같은지 확인
- `[ A -gt B ]` : A보다 B가 큰지 확인
- `[ A -le B ]` : A보다 B가 작거나 같은지 확인
- `[ A -lt B ]` : A보다 B가 작은지 확인
- `[ A -eq B ]` : A와 B가 같은지 확인

### 파일 체크

 - `[ -r filename ]` : 읽기 가능한 파일인지 확인
 - `[ -w filename ]` : 쓰기 가능한 파일인지 확인
 - `[ -x filename ]` : 실행 가능한 파일인지 확인
 - `[ -s filename ]` : 파일 크기가 0이 아닌지 확인
 - `[ -d filename ]` : 디렉토리 인지 확인
 - `[ -f filename ]` : 디렉토리가 아닌, 파일인지 확인
 - `[ -h filename ]` : 링크파일인지 확인

### 조건문의 결합

 - `[ A -a B ]` : and 조건 연산
 - `[ A -o B ]` : or 조건 연산
