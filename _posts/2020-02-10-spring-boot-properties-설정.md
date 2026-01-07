---
layout: post
title: "Spring boot의 properties 설정 파일의 위치"
date: 2020-02-10
categories: [Back-end, Spring]
tags: [spring boot, application.yml, properties]
comments: true
---

## properties 파일 ?

 > Spring boot에서 서비스에 필요한 설정 정보 등을 텍스트 파일 형태로 관리하기 위한 설정 파일


## application.yml

 - spring boot에서 기본 설정되어 있는 properties 파일의 이름
 - *.yml, *.properties 파일 두가지 형태를 지원한다.
 - 초기 spring boot 프로젝트를 생성하면 `src/main/resources`에 위치함

![application.yml의 기본 위치](/assets/imgs/2020-02-10/그림2.png)

 - 이름을 `application-{profile}.properties`나 `application-{profile}.properties` 형태로 파일로 생성하면 그에 맞는 설정 파일을 읽어온다.

![profile이 포함된 application파일의 설정 방법](/assets/imgs/2020-02-10/그림4.png)

 - application 파일 자체에 profile 정보를 주거나, 실행시 profile의 정보를 주면 profile에 해당하는 파일을 읽어서 프로세스가 실행된다.

1. application 파일 설정 예제

![profile에 application 파일 설정](/assets/imgs/2020-02-10/그림3.png)

2. 프로세스 실행시 profile 설정 예제

![프로세스 실행시 profile 설정 예제](/assets/imgs/2020-02-10/그림5.png)

### application 파일의 위치

 - 기본 설정의 application의 파일은 `src/main/resources`에 위치하지만, 그럴 경우 설정이 변경될 때 마다 *.jar파일 생성을 위해 빌드를 다시해줘야 하는 불편함이 생긴다.
 - 그 불편함을 해결하기 위해서 `*.jar`이 존재하는 위치나 프로젝트 최상단에 `config/`를 생성하여 그 내부에 application 설정 파일을 넣어준다.
 
![config 폴더에 위치한 application 설정 파일](/assets/imgs/2020-02-10/이미지_1581315133001.png)

 - 화면상의 `config/{profile}/`이 존재하는 이유는 배포쉘에 해당 경로를 지정해두었기 때문에 spring boot의 기본 설정에서는 지원하지 않는 폴더 구조이다.

#### 참고

 - spring boot에서 지원하는 `application` 파일을 읽는 우선순위와 위치에 대한 가이드

![spring boot의 application 파일 읽는 순서](/assets/imgs/2020-02-10/그림6.png)

[Spring Boot Wiki](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-external-config)

