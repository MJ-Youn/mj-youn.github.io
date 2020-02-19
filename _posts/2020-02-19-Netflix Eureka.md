---
layout: post
title: "Netflix Eureka"
date: 2020-02-19
tags: [spring boot, msa, eureka, spring cloud]
comments: true
---

## Eureka ??

 > netflix에서 개발한 MSA의 `Service Discovery` service <br />
 > 서비스들을 동적으로 관리하고, 상태를 확인할 수 있다.

## Eureka Example

### pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.1.4.RELEASE</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>io.github.mj-youn</groupId>
	<artifactId>Spring-Netflix-Eureka</artifactId>
	<version>0.1</version>
	<name>Spring-Netflix-Eureka</name>
	<description>Eureka</description>

	<properties>
		<java.version>1.8</java.version>
	</properties>

	<!-- spring cloud library를 사용하기 위한 설정 -->
	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>org.springframework.cloud</groupId>
				<artifactId>spring-cloud-dependencies</artifactId>
				<version>Greenwich.RELEASE</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
		</dependencies>
	</dependencyManagement>

	<dependencies>
		<!-- spring-boot-starter-web과 같은 web 관련 library가 필요없음 -->
		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
		</dependency>
	</dependencies>

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

### application.java

```java
package io.github.mjyoun;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@EnableEurekaServer // eureka server로 사용하기 위한 설정
@SpringBootApplication
public class SpringNetflixEurekaApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringNetflixEurekaApplication.class, args);
	}

}
```

### application.yml

```yml
spring:
  application:
    name: eureka

server:
  port: 8761
  
eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
    service-url:
      defaultZone: "http://127.0.0.1:8761/eureka"
  server:
    wait-time-in-ms-when-sync-empty: 0
```

## 실제 적용 예시

 - LG U+ 관련 업무를 진행하면서 MSA 구조를 적용시키면 좋을만한 프로젝트를 맡게 되어, spring cloud를 사용한 MSA 구조를 가지고 설계하여 개발한 적이 있음.

### Service Discovery (Eureka)

```yml
spring:
  profiles:
  application:
    name: .........

server:
  address: 0.0.0.0
  port: 18082
  
logging:
  config: ./config/log4j2.yml

eureka:
  client:
    register-with-eureka: false # 자기 자신을 다른 eureka server에 등록을 막는다.
    fetch-registry: false # client 서비스가 eureka 서버로 받는 서비스 리스트 정보를 local에 caching 할지 여부
    service-url:
      defaultZone: http://localhost:${server.port}/eureka
  server:
    eviction-interval-timer-in-ms: 1000 # client가 종료된 후 서버 목록에서 1000ms 후 제거
    wait-time-in-ms-when-sync-empty: 0
    enable-self-preservation: true
    response-cache-update-interval-ms: 5000 # client에게 전달할 서버 목록을 유지하는 시간
```

 - 실제 소스상의 구현은 없고, 위와 같이 설정만 작성하여 동작시켰다.
 - 요구사항중 하나로 micro-service가 수시로 on/off될 수 있기 때문에 service 목록을 cash로 유지하지 않고, 수시로 불러와야 했음.
 - 관련된 설절잉 `eureka.server.~`에 작성되어 있음. 정확한 설명은 검색이 필요함.

### API Gateway (Zuul)

#### pom.xml

```xml
...

	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>org.springframework.cloud</groupId>
				<artifactId>spring-cloud-dependencies</artifactId>
				<version>Greenwich.RELEASE</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
		</dependencies>
	</dependencyManagement>

	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
			<exclusions>
				<exclusion>
					<groupId>org.springframework.boot</groupId>
					<artifactId>spring-boot-starter-logging</artifactId>
				</exclusion>
			</exclusions>
		</dependency>

		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-netflix-zuul</artifactId>
		</dependency>


		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-actuator</artifactId>
		</dependency>

		<!-- ************** -->
		<!-- begin: logging / log4j2 -->
		<!-- https://mvnrepository.com/artifact/com.lmax/disruptor -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-log4j2</artifactId>
		</dependency>

		<dependency>
			<groupId>com.lmax</groupId>
			<artifactId>disruptor</artifactId>
			<version>3.3.6</version>
		</dependency>
		<!-- end: logging -->
		<!-- ************** -->

		<!-- ************** -->
		<!-- begin: jackson (; for parse logging yml file) -->
		<dependency>
			<groupId>com.fasterxml.jackson.core</groupId>
			<artifactId>jackson-annotations</artifactId>
		</dependency>
		<dependency>
			<groupId>com.fasterxml.jackson.core</groupId>
			<artifactId>jackson-core</artifactId>
		</dependency>
		<dependency>
			<groupId>com.fasterxml.jackson.core</groupId>
			<artifactId>jackson-databind</artifactId>
		</dependency>
		<dependency>
			<groupId>com.fasterxml.jackson.dataformat</groupId>
			<artifactId>jackson-dataformat-yaml</artifactId>
		</dependency>
		<!-- end: jackson -->
		<!-- ************** -->
	</dependencies>

...
```

#### application.yml

```yml
...

eureka:
  instance:
    prefer-ip-address: true # Eureka 등록시 사용한 IP를 가지고 Eureka에서 호출할 수 있게 함
  client:
    service-url:
      defaultZone: "http://127.0.0.1:18082/eureka"
    registry-fetch-interval-seconds: 5

# zuul 설정
zuul:
  ignoreSecurityHeaders: false # true면 spring security의 Authorization 값을 무시(제외)한다.
  sensitiveHeaders: # header에서 제외하는 목록. 여기에 값을 추가하면 제외하는 값이다. (목록 형태)
  routes:
    twamp-service:
      path: /ts/**
      strip-prefix: true # 매칭되는 값(/ts)을 제외하고 보낸다. ex> /ts/start --> /start
    tgw-rapidping:
      path: /ns/**
      strip-prefix: true

# actuator
management:
  endpoints:
    web:
      exposure:
        include: "*" # actuator에서 지원하는 모든 관리 port를 연다
      
endpoints:
  routes:
    enabled: false # endpoint 변경을 막는다.

# hystrix 설정
hystrix:
  command:
    default: # 모든 서버에 동일하게 적용. 필요시 서비스 이름으로 따로 정하면 됨
      execution:
        isolation:
          thread:
            timeoutInMilliseconds: 10000

# ribbon 설정
ribbon:
  ConnectTimeout: 5000
  ReadTimeout: 30000
  eureka:
    enabled: true
	ServerListRefreshInterval: 1000
	
...
```

#### application.java

```java
package kr.co.lguplus.tgw.api_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

@EnableZuulProxy // zuul 설정
@EnableDiscoveryClient // eureka client 설정
@SpringBootApplication
public class APIGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(APIGatewayApplication.class, args);
	}
	
}
```

 - zuul server 역시 java 소스는 없이 설정만으로 서버를 구동시켰다.
 - `ribbon`과 `hystrix` 역시 spring cloud에 존재하는 MSA 서비스 중에 하나로, 나중에 기회가 되면 포스팅하는 걸로.. (아직은 공부가 미흡함..)
 - `actuator`를 사용하기 위해 관련 library를 `pom.xml`에 추가

### Micro service

#### application.java

```java
...

@EnableDiscoveryClient
@SpringBootApplication
public class TwampServiceApplication {

...
```

#### application.yml

```yml
...

# actuator
management:
  endpoints:
    web:
      exposure:
        include: "*" # actuator에서 지원하는 모든 관리 port를 연다

eureka:
  instance:
    prefer-ip-address: true # Eureka 등록시 사용한 IP를 가지고 Eureka에서 호출할 수 있게 함
    instance-id: ${spring.application.name}:${vcap.application.instance_id:${spring.application.instance_id:${random.value}}} # random instance-id로 선언
  client:
    service-url:
      defaultZone: "http://127.0.0.1:18082/eureka" # eureka 접속 URL

...
```

 - 실제 API gateway를 통해 호출되는 micro-service는 두 종류지만, 본인이 직접개발했던 내용만을 포함시킴.
 - `service discovery`서버와 `api gateway`서버가 물리적으로 한 서버에 있고, micro-service가 물리적으로 다른 서버에 있었기 때문에, micro-service가 `service discovery`에 등록될 때 자기 자신의 IP를 가지고 등록되어야하고 호출도 그 IP를 가지고 해야하는 이슈가 있었음.
 - `eureka.instance.prefer-ip-address` 설정으로 해결했으나, 최근 다른 프로젝트의 MSA를 봐주던 중 설정을 위와 같이해도 nic이 여러 개일 경우, 첫번째 nic의 ip를 가져와서 호출하는 현상을 발견하였다... 운이 좋아서 해결이 됬다고 봐야할 듯하다. nic이 여러 개일 경우에 대한 해결 법은 추후 확인이 필요하다.
