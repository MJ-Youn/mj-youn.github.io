---
layout: post
title: "property를 bean으로 추가하는 방법"
date: 2016-12-12
categories: [Back-end, Spring]
tags: [java, property, bean, spring]
comments: true
---

# 스프링 util:properties
아래와 같이 property를 바로 멤버 값으로 넣어줄 수 있습니다.
```java
@Value("#{config['facebook.clientId']}")
private String clientId;

@Value("#{config['facebook.clientSecret']}")
private String clientSecret;
...
```

# 사용법

1. ApplicationContext에서 beans element에 아래와 같이 namespace를 추가해줍니다.
		```xml
    xmlns:util="https://www.springframework.org/schema/util"
    ```

2. xsi:schemaLocation=에 추가해줍니다.
    ```xml
    https://www.springframework.org/schema/util
    https://www.springframework.org/schema/util/spring-util-4.0.xsd
    ```

3. 아래와 같이 읽어들일 properties를 지정해줍니다. (예제처럼 작성하면 클래스패스에 있는 모든 properties들을 읽어서 config란 이름으로 읽습니다..)

```xml
<util:properties id="config" location="classpath:/*.properties"></util:properties>
```

# 참고자료
<https://springsource.tistory.com/116>

# 다른 방법

위와 비슷하지만 다른 방식으로 추가할 수도 있다.

```xml
<context:property-placeholder location="classpath:properties/*.properties" />
```

이렇게 `property-placeholder`를 사용하여 추가 할 수도 있다.

```java
@Value("${web.systemAccess.ip}")
private String ipAccessRange
```

위와 같이 사용하면 된다.

# 또 다른 방법

단일 `bean`으로 가져와 사용 할 수도 있다.

```xml
<bean id="querySource" class="org.springframework.context.support.ReloadableResourceBundleMessageSource">
	<property name="basename" value="classpath:properties/query" />
	<property name="defaultEncoding" value="UTF-8" />
</bean>
```

이렇게 선언을 하게되면 properties폴더 안에 있는 query.properties 파일을 바라보게 되고,
거기에 있는 key값을 가지고 value를 가져올수 있다.

이 방식은 보통 query문을 가져오는데에 사용한다.
이유는 위에 두 방식처럼 properties를 추가 할때마다 `@Value`를 써가면서 추가하지 않아도 사용 할 수 있기 때문이다.

```java
@Autowired
private ReloadableResourceBundleMessageSource querSource;

protected String getQuery(String name) {
	String query = querSource.getMessage(name, null, null);

	return query;
}
```

위처럼 미리 생성한 bean을 가져와 `getMessage()`를 사용하면 프로퍼티를 가져올 수 있다.
필자의 경우 `CommonDAO`를 만들어 위와 같이 선언한 뒤에 모든 DAO에서 상속받아 사용한다.

```java
String query = getQuery("ApInfoDAO.bringObstacleApInfo");
```

상속받은 DAO들은 위처럼 사용해서 properties의 값을 가져올 수 있다.
