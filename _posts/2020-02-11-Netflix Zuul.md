---
layout: post
title: "Netflix Zuul"
date: 2020-02-11
categories: [Back-end, Spring]
tags: [MSA, Netflix Zuul, Zuul, Spring boot]
comments: true
---

## Netflix Zuul ??

 > Netflix에서 개발한 MSA의 API Gateway 오픈소스 프로젝트

## 예제

### dependency

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="https://maven.apache.org/POM/4.0.0"
	xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="https://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>1.4.1.RELEASE</version>
		<relativePath /> <!-- lookup parent from repository -->
	</parent>
	<groupId>kr.co.ymtech</groupId>
	<artifactId>Zuul-example</artifactId>
	<version>0.1</version>
	<name>Zuul-example</name>

	<properties>
		<java.version>1.8</java.version>
	</properties>

	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>

		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-zuul</artifactId>
		</dependency>
	</dependencies>

    <!-- spring cloud dependency를 사용하기위해 추가하는 정보 -->
    <!-- spring cloud를 사용하는 모든 프로젝트에 추가되어야 한다. -->
	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>org.springframework.cloud</groupId>
				<artifactId>spring-cloud-dependencies</artifactId>
				<version>Brixton.SR5</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
		</dependencies>
	</dependencyManagement>


	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

</project>
```

### Main class

```java
package kr.co.ymtech;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

@SpringBootApplication
@EnableZuulProxy
public class ZuulExampleApplication {

	public static void main(String[] args) {
		SpringApplication.run(ZuulExampleApplication.class, args);
	}

}
```

### application.yml

```yml
server:
  port: 9000

zuul:
  routes:
    pims:
      path: /naver/** # context path가 naver로 들어오는 것들에 대하여
      url: https://www.naver.com # 해당 url을 호출한다.
      stripPrefix: true # true면 해당 context path를 삭제하고 보낸다.
    lafs:
      path: /google/**
      url: https://www.google.com
      stripPrefix: true
```

### prefilter

 - redirect하기 전에 zuul에서 전처리를 할 수 있는 filter

```java
package kr.co.ymtech.filter;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

@Component
public class PreFilter extends ZuulFilter {

	@Override
	public String filterType() {
		return "pre";
	}
	
	@Override
	public int filterOrder() {
		return 1;
	}
	
	@Override
	public boolean shouldFilter() {
		return true;
	}

	@Override
	public Object run() {
		RequestContext ctx = RequestContext.getCurrentContext();
		HttpServletRequest request = ctx.getRequest();
		
		System.out.println(request.getMethod() + " " + request.getRequestURL().toString());
		
		return null;
	}

}

```

## Test

![web](/assets/imgs/2020-02-11/이미지_1581408818001.png)

![log](/assets/imgs/2020-02-11/이미지_1581408832001.png)

