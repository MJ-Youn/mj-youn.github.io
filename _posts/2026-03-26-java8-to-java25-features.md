---
layout: post
title: "Java 8 → Java 25: 실무 백엔드 개발자를 위한 핵심 신규 기능 총정리"
date: 2026-03-26 17:00:00 +0900
categories: [Java, Backend]
tags: [java, java21, java25, spring-boot, virtual-threads, record, pattern-matching, backend]
---

최근 회사에서 일을 진행하면서 기존에 유지하던 java8 시스템을 java25로 업그레이드하는 작업을 진행했다. 
보안적인 이슈가 가장 큰 이슈로, 보안 패치를 지원하는 최신 버전으로 업그레이드를 진행하게 되었다. 

기존 개발했던 내용을 그대로 개발을 해도 되지만, 그래도 최신 버전의 자바에서 지원하는 기능을 사용하면 더 좋겠다는 생각에
변경되는, 더 좋은 기능을 정리해본다.

---

## 1. 데이터 모델링 & 코드 간결화 ✂️

### 1.1. Record (Java 14 Preview / 16 정식)

기존의 DTO나 VO를 만들 때 필요했던 getter, equals, hashCode, toString 보일러플레이트 코드를 완벽히 제거한다.

```java
// Java 8 방식
public class UserDto {
    private final String name;
    private final int age;
    // 생성자, getter, equals, hashCode, toString... (수십 줄 반복)
}

// Java 16+
public record UserDto(String name, int age) {}
```

`record`는 선언 한 줄로 모든 것을 대체한다. Spring Boot의 Request/Response DTO에 특히 잘 맞는다.

> **실무 Tip**: 다만 `record`는 불변(Immutable) 객체이므로, JPA Entity처럼 setter가 필요한 경우엔 적합하지 않다. DTO/VO 전용으로 활용하는 것이 좋다.

### 1.2. 로컬 변수 타입 추론 `var` (Java 10)

타입이 명확한 지역 변수 선언 시 `var`를 사용해 타이핑 피로도를 줄인다.

```java
// Java 8
Map<String, List<UserDto>> userMap = new HashMap<String, List<UserDto>>();

// Java 10+
var userMap = new HashMap<String, List<UserDto>>();
var users = List.of(new UserDto("MJ Yune", 35));
```

제네릭이 복잡한 `Map`이나 `List`를 선언할 때 특히 유용하다. IDE가 타입을 추론해주기 때문에 가독성은 오히려 올라간다.

### 1.3. 텍스트 블록 (Text Blocks) (Java 15)

여러 줄의 문자열을 작성할 때 `+` 연산자와 이스케이프(`\n`, `\"`) 지옥에서 벗어나게 해준다.

```java
// Java 8
String json = "{\n" +
              "    \"name\": \"MJ Yune\",\n" +
              "    \"role\": \"Team Leader\"\n" +
              "}";

// Java 15+
String json = """
        {
            "name": "MJ Yune",
            "role": "Team Leader",
            "company": "(주)유미테크"
        }
        """;
```

네이티브 SQL 쿼리, JSON 목업 데이터, HTML 템플릿 작성 시 코드 가독성이 압도적으로 좋아진다.

### 1.4. 봉인된 클래스 (Sealed Classes) (Java 17)

상속받을 수 있는 하위 클래스를 엄격하게 제한하여 도메인 모델의 의도를 명확히 한다.

```java
// Shape은 Circle과 Square만 구현할 수 있음
public sealed interface Shape permits Circle, Square {}

public final class Circle implements Shape {
    private final double radius;
    // ...
}

public final class Square implements Shape {
    private final double side;
    // ...
}
```

DDD(Domain-Driven Design)를 적용할 때 하위 타입을 통제할 수 있어서, 아래 소개할 패턴 매칭과 함께 쓰면 시너지가 크다.

---

## 2. 강력한 제어 흐름 & 패턴 매칭 🔀

### 2.1. 향상된 Switch 식 (Switch Expressions) (Java 14)

`break` 누락 버그를 방지하고, 값을 바로 반환할 수 있다.

```java
// Java 8 (break 빠트리면 fall-through 버그!)
int numLetters;
switch (day) {
    case MONDAY:
    case FRIDAY:
    case SUNDAY:
        numLetters = 6;
        break;
    default:
        numLetters = 0;
}

// Java 14+
int numLetters = switch (day) {
    case MONDAY, FRIDAY, SUNDAY -> 6;
    case TUESDAY                -> 7;
    default -> {
        System.out.println("기타 요일 처리");
        yield 0; // 블록 내에서는 yield로 값 반환
    }
};
```

### 2.2. 패턴 매칭 (Pattern Matching) (Java 16, 21)

`instanceof` 타입 확인과 캐스팅을 한 번에 처리한다.

```java
// Java 8
if (obj instanceof String) {
    String s = (String) obj; // 캐스팅 한 번 더
    System.out.println(s.toLowerCase());
}

// Java 16+ (instanceof 패턴 매칭)
if (obj instanceof String s) {
    System.out.println(s.toLowerCase()); // 바로 사용 가능
}

// Java 21+ (Switch 패턴 매칭)
String result = switch (obj) {
    case String s  -> "문자열: " + s;
    case Integer i -> "정수: " + i;
    case UserDto u when u.age() > 30 -> "30대 이상 유저: " + u.name();
    default        -> "알 수 없음";
};
```

Sealed Class와 조합하면 컴파일러가 모든 하위 타입에 대한 처리 누락 여부를 체크해준다. 런타임 에러를 컴파일 타임에 잡는 것이다.

### 2.3. 이름 없는 변수 `_` (Java 22)

사용하지 않는 변수에 `_`를 써서 의도를 명확히 하고 경고를 방지한다.

```java
try {
    int number = Integer.parseInt(str);
} catch (NumberFormatException _) { // 예외 객체를 사용하지 않을 때
    System.out.println("숫자가 아닙니다.");
}

// for-each에서 인덱스가 필요 없을 때
for (var _ : list) {
    count++;
}
```

---

## 3. 컬렉션 & 스트림의 진화 🌊

### 3.1. 컬렉션 팩토리 메서드 (Java 9)

불변(Immutable) 컬렉션을 생성하는 가장 깔끔한 방법이다.

```java
// Java 8
List<String> list = Arrays.asList("A", "B", "C"); // 완전한 불변이 아님
Set<String> set = new HashSet<>(Arrays.asList("A", "B"));

// Java 9+ (완전한 불변 객체 반환)
List<String> list = List.of("A", "B", "C");
Set<String> set  = Set.of("A", "B");
Map<String, Integer> map = Map.of("MJ", 1, "Team", 3);
```

`List.of()`는 `null`을 허용하지 않고, 크기 변경이 불가능한 진짜 불변 객체를 반환하기 때문에 부작용(Side Effect) 없는 코드를 작성하는 데 도움이 된다.

### 3.2. `Stream.toList()` (Java 16)

매번 `Collectors.toList()`를 타이핑할 필요가 없어졌다.

```java
// Java 8
List<String> names = users.stream()
        .map(User::getName)
        .collect(Collectors.toList());

// Java 16+
List<String> names = users.stream()
        .map(User::name) // record의 accessor
        .toList();       // 불변 List 반환
```

### 3.3. 순차 컬렉션 (Sequenced Collections) (Java 21)

컬렉션의 첫 번째, 마지막 원소에 접근하거나 뒤집는 표준화된 API가 추가됐다.

```java
List<String> list = new ArrayList<>(List.of("A", "B", "C"));

String first   = list.getFirst();   // "A"
String last    = list.getLast();    // "C"
list.addFirst("Z");                 // ["Z", "A", "B", "C"]
List<String> reversed = list.reversed(); // ["C", "B", "A", "Z"]
```

기존에 `list.get(0)`, `list.get(list.size() - 1)` 처럼 쓰던 코드가 훨씬 명확해진다.

---

## 4. 유용한 유틸리티 API 강화 🛠️

### 4.1. `Optional` 강화 (Java 9~11)

`Optional` 처리가 훨씬 우아해졌다.

```java
Optional<String> opt = Optional.ofNullable(getValue());

// Java 9+: 값이 있을 때와 없을 때 처리를 한 줄에
opt.ifPresentOrElse(
    value -> System.out.println("값: " + value),
    ()    -> System.out.println("값 없음")
);

// Java 11+: !isPresent() 대신 직관적으로
if (opt.isEmpty()) {
    throw new IllegalStateException("값이 없습니다.");
}

// get() 대신 명시적으로
String value = opt.orElseThrow(); // NoSuchElementException 발생
```

### 4.2. String API 추가 (Java 11, 12)

자주 쓰는 문자열 유틸이 기본 API에 추가됐다.

```java
" ".isBlank();            // true (trim().isEmpty() 대체)
"hello\nworld".lines()    // Stream<String> 반환
"ha".repeat(3);           // "hahaha"
"  hello  ".strip();      // "hello" (유니코드 공백까지 제거, trim()보다 강력)
```

### 4.3. 내장 HTTP Client (Java 11)

오래된 `HttpURLConnection`이나 외부 라이브러리(Apache, OkHttp) 없이도 내장 API로 HTTP 요청을 처리할 수 있다.

```java
HttpClient client = HttpClient.newHttpClient();

HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("https://api.example.com/users"))
        .header("Content-Type", "application/json")
        .GET()
        .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.statusCode()); // 200
System.out.println(response.body());
```

비동기 처리도 기본 지원한다. `client.sendAsync(request, BodyHandlers.ofString())`를 쓰면 `CompletableFuture`를 반환한다.

---

## 5. 성능 및 운영의 혁신 ⚡️

### 5.1. 가상 스레드 (Virtual Threads) (Java 21)

이번 업그레이드에서 가장 파급력이 큰 기능이다.

OS 스레드와 1:1로 매핑되던 기존 스레드와 달리, JVM이 관리하는 초경량 스레드다. 수십만 개를 생성해도 메모리(OOM) 걱정이 없다.

```java
// 가상 스레드로 직접 실행
Thread.startVirtualThread(() -> {
    // I/O 블로킹이 발생해도 OS 스레드를 점유하지 않음
    String result = callExternalApi();
    System.out.println(result);
});

// ExecutorService 방식 (Spring Boot와 연동 시 주로 사용)
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    executor.submit(() -> handleRequest());
}
```

Spring Boot 3.2 이상에서는 `application.yml`에 한 줄만 추가하면 톰캣의 모든 요청을 가상 스레드로 처리한다.

```yaml
spring:
  threads:
    virtual:
      enabled: true
```

외부 API 호출이나 DB 쿼리 등 I/O 블로킹이 잦은 웹 애플리케이션의 동시 처리량(Throughput)을 별도의 리팩토링 없이 크게 끌어올릴 수 있다.

### 5.2. 친절한 NullPointerException (Helpful NPEs) (Java 14)

NPE 발생 시 스택 트레이스에 **어떤 객체가 null인지** 정확히 명시해준다.

```
// Java 8 시절 NPE 메시지 (아무 정보 없음)
java.lang.NullPointerException

// Java 14+ NPE 메시지 (원인이 명확함)
Cannot invoke "UserDto.name()" because the return value of
"Team.getLeader()" is null
```

메서드 체이닝이 길수록 어디서 null이 발생했는지 파악하는 디버깅 시간이 눈에 띄게 단축된다.

---

## 마치며

AI를 통해, 해당 기능들의 적용 우선 순위를 작성해 보았다.

| 우선순위 | 기능 | 이유 |
|---------|------|------|
| ⭐⭐⭐ | `record`, Text Blocks, `var` | 기존 코드 개선 효과 즉각적 |
| ⭐⭐⭐ | 가상 스레드 | Spring Boot 3.2+ 한 줄 설정으로 성능 향상 |
| ⭐⭐ | Switch 식, 패턴 매칭 | if-else / instanceof 코드 정리에 효과적 |
| ⭐⭐ | `List.of()`, `Stream.toList()` | 불변 컬렉션 습관화 |
| ⭐ | Sealed Classes, `_` 변수 | 도메인 모델 설계 시 고려 |

위 처럼 우선순위를 두고 적용을 하면 된다고 하는데, 아직 적용해보지 않은 것들이 많이 있어서
하나씩 사용을 해보면서 적용해가면 어떨까 싶다. 

사용을 하면서 변경되는 내용이 있을 듯하고, 이와 비교해서 Spring 2 -> Spring 4 버전 변경 포스팅도 조만간 만들어야겠다.
