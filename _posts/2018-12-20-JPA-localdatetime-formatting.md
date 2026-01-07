---
layout: post
title: "JPA에서 Localdatetime을 사용하는 방법"
date: 2018-12-20
tags: [java8, spring, jpa]
comments: true
---

## Jsr310JpaConverters.class 사용

 - Spring Data JPA 1.8 이상부터 사용 가능한 방법


```java
@EnableJpaAuditing
@EntityScan(
    basePackageClasses = { Jsr310JpaConverters.class },
    basePackages = { "com.domain" }
)
@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
```

### 장점

 - 가장 간단하게 선언하고 사용 할 수 있다.

### 단점

 - java.util.date 형식만을 변경해서 사용한다.



## Attribute Converter 사용

- JPA 2.1부터 사용 가능

```java
@Converter
public class TestConverter implements AttributeConverter<LocalDateTime, Date> {

    @Override
    public Date convertToDatabaseColumn(LocalDateTime localDateTime) {
        return Date.from(localDateTime.atZone(systemDefault()).toInstant());
    }

    @Override
    public LocalDateTime convertToEntityAttribute(Date date) {
        return ofInstant(ofEpochMilli(date.getTime()), systemDefault());
    }

}
```

```java
@Entity
public class TestEntity {

    @Convert(converter = TestConverter.class)
    @Column(name = "create_date_time")
    private LocalDateTime createDateTime;

}
```

- 위 처럼 사용할 컬럼에 converter를 정의해줘야한다.

