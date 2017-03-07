---
layout: post
title: "property를 bean으로 추가하는 방법"
date: 2016-12-12
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
    xmlns:util="http://www.springframework.org/schema/util"
    ```

2. xsi:schemaLocation=에 추가해줍니다.
    ```xml
    http://www.springframework.org/schema/util
    http://www.springframework.org/schema/util/spring-util-4.0.xsd
    ```

3. 아래와 같이 읽어들일 properties를 지정해줍니다. (예제처럼 작성하면 클래스패스에 있는 모든 properties들을 읽어서 config란 이름으로 읽습니다..)

```xml
<util:properties id="config" location="classpath:/*.properties"></util:properties>
```

# 참고자료
<http://springsource.tistory.com/116>
