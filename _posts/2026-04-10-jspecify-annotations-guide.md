---
layout: post
title: "JSpecify 핵심 어노테이션 가이드: Java Null-Safety 완벽 정복 🛡️"
date: 2026-04-10 17:00:00 +0900
categories: [Java, Backend]
tags: [java, jspecify, null-safety, spring-boot-4, backend]
---

회사에서 `Spring Boot 4.x` 버전으로 업그레이드를 진행하면서 JSpecify 관련된 내용을 접하게 되었다.
아직 사용하기 전이지만 내용을 정리할 겸 포스트를 작성해본다.

이러한 파편화를 종식시키고 Java의 표준 Nullness 규격을 정립하고자 탄생한 프로젝트가 바로 **JSpecify**이다. 이번 포스트에서는 JSpecify 1.0.0에서 제공하는 핵심 어노테이션 4가지와 그 사용법을 예제와 함께 정리해 보았다. 

---

## 1. @NullMarked 🎯

`@NullMarked`는 특정 클래스, 인터페이스, 메서드, 혹은 패키지 전체에 적용할 수 있는 영역(Scope) 어노테이션이다. 이 어노테이션이 선언된 하위 영역에서는 **"명시하지 않은 모든 타입은 무조건 Null이 될 수 없음(Non-Null)"**을 기본값으로 간주한다.

### 사용 예제
```java
import org.jspecify.annotations.NullMarked;

@NullMarked
public class UserService {
    
    // 별도 어노테이션이 없으므로 파라미터 id와 반환값 User 모두 Non-Null로 간주!
    public User findUserById(String id) {
        // id가 null일 수 없으므로, IDE에서 경고 없이 안전하게 체이닝 가능
        System.out.println("Finding user: " + id.trim());
        return new User(id);
    }
}
```
> **Tip:** 보통 프로젝트의 최상위 `package-info.java`에 `@NullMarked`를 명시하여 프로젝트 전역의 기본 Nullness 상태를 Non-Null로 강제하는 방식을 아주 강력히 권장한다.

---

## 2. @Nullable 🤷‍♂️

해당 변수, 파라미터, 반환값이 **Null일 수 있음**을 명시한다. 패키지에 `@NullMarked`가 선언되어 전체가 Non-Null 기본값이 된 상황에서, **예외적으로 Null을 허용해야 할 때** 주로 사용된다.

### 사용 예제
```java
import org.jspecify.annotations.NullMarked;
import org.jspecify.annotations.Nullable;

@NullMarked
public class OrderService {

    // id는 절대 null일 수 없지만, 발송지(shippingAddress)는 null일 수 있음!
    public void createOrder(String id, @Nullable String shippingAddress) {
        
        // 주의 🚨: shippingAddress는 Null일 수 있으므로 바로 메서드 호출 시 컴파일러/IDE 경고 발생!
        // System.out.println(shippingAddress.trim()); 
        
        if (shippingAddress != null) {
            // Null 체크(Guard) 이후에는 경고 없이 안전하게 사용 가능
            System.out.println("Shipping to: " + shippingAddress.trim());
        }
    }
    
    // 이 메서드는 Null을 반환할 수도 있음을 호출자에게 명확히 알림
    public @Nullable Order findRecentOrder(String userId) {
        // ... 로직 ...
        return null;
    }
}
```

---

## 3. @NonNull 🚧

대상이 **절대로 Null이 될 수 없음**을 보장한다. 
하지만 앞서 언급했듯 모던 Java 프로젝트는 보통 패키지 전체를 `@NullMarked`로 묶는 방식을 따르므로, 이 환경에서는 기본값이 Non-Null이라 **실제로는 거의 사용할 일이 없는 어노테이션**이다.

주로 `@NullUnmarked` 영역이나 외부 라이브러리 연동 등, 기본값이 정의되지 않은 영역 내에서 특정 파라미터나 필드만 명시적으로 Non-Null 임을 보장시켜야 할 때 가끔 쓰인다.

### 사용 예제
```java
import org.jspecify.annotations.NonNull;

// @NullMarked가 적용되지 않은 일반/레거시 클래스라고 가정
public class LegacyUtil {
    
    // 주변 환경과 관계없이, 이 파라미터만큼은 절대로 Null이 아니어야 함을 강력하게 표현
    public static int calculateLength(@NonNull String text) {
        return text.length();
    }
}
```

---

## 4. @NullUnmarked 🔓

`@NullMarked`의 반대 역할을 수행한다. 이 어노테이션이 선언된 스코프는 **Nullness가 전혀 지정되지 않은 상태(Unspecified)**로 되돌아간다. 

상위 패키지 혹은 상위 클래스에 강제로 `@NullMarked`가 걸려 있어서 컴파일러 경고가 쏟아질 때, 아직 Null-Safety 대응 리팩토링이 끝나지 않은 특정 레거시 메서드나 중첩 클래스에 한시적으로 예외를 두기(Opt-out) 위해 사용한다.

### 사용 예제
```java
import org.jspecify.annotations.NullMarked;
import org.jspecify.annotations.NullUnmarked;

@NullMarked
public class CoreService {

    // (기본 상태 적용) name 파라미터는 무조건 Non-Null 취급
    public void modernMethod(String name) {
        System.out.println(name.toUpperCase());
    }

    // (예외 처리 적용) 레거시 코드로 아직 Null 분석/대응이 완벽하지 않아 검사를 잠시 해제함
    @NullUnmarked
    public void legacyMethod(String data) {
        // data가 Null일 수도, 아닐 수도 있음. IDE가 엄격한 Non-Null 검증을 면제해줌.
        System.out.println(data.length());
    }
}
```

---

## JSpecify 어노테이션 요약 정리 📝

각각의 어노테이션과 역할을 한눈에 파악할 수 있도록 표로 정리해 보았다.

| 어노테이션 | 적용 대상 스코프 | 의미 및 용도 | 비고 |
| :--- | :--- | :--- | :--- |
| **`@NullMarked`** | 클래스, 패키지, 메서드 | **(스코프 지정)** 이 영역 내부에서 별도의 어노테이션이 없는 모든 타입은 기본적으로 **Non-Null**로 간주한다. | 프로덕션 코드에 가장 많이 활용 |
| **`@Nullable`** | 파라미터, 리턴, 필드 | **(타입 지정)** 해당 변수나 리턴 값이 **Null일 수도 있음**을 명시한다. 접근 전 Null 체크가 강제된다. | `@NullMarked` 내에서 예외가 필요할 때 |
| **`@NonNull`** | 파라미터, 리턴, 필드 | **(타입 지정)** 명시적으로 **Null이 될 수 없음**을 나타낸다. | `@NullMarked` 영역에서는 중복이므로 생략 |
| **`@NullUnmarked`** | 클래스, 패키지, 메서드 | **(스코프 지정)** `@NullMarked`의 영향을 취소하고, 해당 영역의 Nullness 검사를 **무효화(Unspecified)** 상태로 되돌린다. | 레거시 코드 마이그레이션 중 활용 |

---

아직 사용해보기 전이지만, 실제 사용해보면서 내용을 더 정리해볼 예정이다. Validation 관련된 내용도 한 번 정리해보면 좋을거 같다.
