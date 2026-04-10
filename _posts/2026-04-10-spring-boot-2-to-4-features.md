---
layout: post
title: "Spring Boot 2 → Spring Boot 4: 주요 차이점 및 실무 활용 기능 총정리 ✨"
date: 2026-04-10 16:00:00 +0900
categories: [Spring Boot, Backend]
tags: [spring-boot, spring-boot-4, backend, java]
---

최근 Java 업그레이드와 관련하여 Java 8에서 Java 25로의 변화를 정리한 데 이어, 오늘은 이와 함께 짝을 이루는 프레임워크인 **Spring Boot의 변화**를 정리해 보려 합니다. 🚀

기존 시스템에서 오랫동안 애용해 온 Spring Boot 2.x 버전과, 최근 발표되어 모던 백엔드 개발의 표준으로 자리 잡고 있는 **Spring Boot 4.x** (Spring Framework 7 기반) 사이에는 꽤 많은 아키텍처적 패러다임 변화가 있었습니다. 

어떤 점들이 달라졌는지, 그리고 실무에서 유용하게 사용할 만한 새로운 기능들은 무엇이 있는지 정리해 보았습니다.

---

## 1. Spring Boot 2 vs Spring Boot 4 핵심 차이점 🆚

Spring Boot 2에서 4로 넘어오면서 가장 크게 체감되는 변화는 **기반 기술의 완전한 세대 교체**입니다.

| 구분 | Spring Boot 2.x | Spring Boot 4.x | 비고 |
| --- | --- | --- | --- |
| **Java Baseline** | Java 8 | **Java 17 (Java 25 완벽 지원)** | 최소 요구 스펙 대폭 상승 |
| **Spring Framework** | Spring 5 | **Spring 7** | AOT 처리, 네이티브 이미지 지원 강화 |
| **EE 규격명** | Java EE (`javax.*`) | **Jakarta EE 11 (`jakarta.*`)** | `javax` 패키지 지원 완전 종료 🚨 |
| **스레드 모델** | OS 스레드 기반 다중 스레딩 | **Virtual Threads 전면 통합** | 고성능 동시성 처리 |
| **Auto Configuration** | 단일 대형 모듈 | **모듈화된 Auto Configuration** | 빌드 시간 단축 및 메모리 풋프린트 감소 최적화 |

특히, `javax.*`에서 `jakarta.*`로의 패키지명 변경은 피할 수 없는 허들이므로, 기존 코드를 마이그레이션 할 때 꼼꼼하게 `import` 문들을 점검해야 합니다.

---

## 2. 실무에서 유용하게 사용할 꿀 기능 🍯

단순한 버전 업데이트를 넘어, 개발 생산성과 유지보수성을 극적으로 끌어올려 줄 핵심 기능들을 소개합니다.

### 2.1. 선언적 HTTP 클라이언트 (Declarative HTTP Clients) 🌐

이전에는 외부 API를 호출하기 위해 `RestTemplate` 코드를 장황하게 작성하거나 `WebClient`를 이용해 복잡한 체이닝을 구성해야 했습니다. 이제는 인터페이스 선언만으로 통신이 가능해집니다.

```java
import org.springframework.web.service.annotation.GetExchange;

// HTTP 통신을 위한 인터페이스만 정의
public interface UserRestClient {
    
    // 1. 일반적인 GET 파라미터 호출
    @GetExchange("/api/v1/users/{id}")
    UserDto getUserById(@PathVariable("id") String id);

    // 2. 파일 첨부 (form-data) 통신 예시
    @PostExchange(value = "/api/v1/users/{id}/profile-image", contentType = MediaType.MULTIPART_FORM_DATA_VALUE)
    void uploadProfileImage(@PathVariable("id") String id, @RequestPart("file") MultipartFile file);

    // 3. Query Parameter와 Request Body를 동시에 보내는 통신 예시
    @PostExchange("/api/v1/users/{id}/documents")
    ResultDto saveUserDocument(
            @PathVariable("id") String id,
            @RequestParam("docType") String docType,
            @RequestBody DocumentDto document
    );
}
```

마치 Spring Data JPA에서 리포지토리 인터페이스를 만드는 것과 동일한 경험을 제공합니다. 

이렇게 선언된 인터페이스는 아래와 같이 `HttpServiceProxyFactory`를 사용해 스프링 빈(Bean)으로 등록한 후, 서비스 계층에서 일반 자바 메서드를 다루듯 쉽게 호출할 수 있습니다.

**1. 설정 (Configuration) 및 빈 등록:**

```java
@Configuration
public class RestClientConfig {

    @Bean
    public UserRestClient userRestClient(RestClient.Builder builder) {
        RestClient restClient = builder.baseUrl("https://api.example.com").build();
        HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(RestClientAdapter.create(restClient)).build();
        
        return factory.createClient(UserRestClient.class);
    }
}
```

**2. 비즈니스 로직(Service)에서의 호출:**

```java
@Service
public class UserService {

    // 인터페이스 의존성 주입
    private final UserRestClient userRestClient;

    // 생성자 주입 (Spring 4.3 이상 단일 생성자 @Autowired 생략)
    public UserService(UserRestClient userRestClient) {
        this.userRestClient = userRestClient;
    }

    public void printUserInfo(String userId) {
        // 일반 메서드 호출하듯 사용! (내부적으로 알아서 HTTP 비동기/동기 통신 수행)
        UserDto user = userRestClient.getUserById(userId);
        System.out.println("User Name: " + user.getName());
    }

    public void updateProfile(String userId, MultipartFile file) {
        // 복잡한 HTTP 설정 없이 Multipart 파일 전송도 매끄럽게 처리됩니다.
        userRestClient.uploadProfileImage(userId, file);
        System.out.println("Profile image updated.");
    }

    public void saveDocument(String userId, String docType, DocumentDto document) {
        // Query param과 Body 데이터를 한 번의 메서드 호출로 깔끔하게 전송합니다.
        ResultDto result = userRestClient.saveUserDocument(userId, docType, document);
        System.out.println("Document save result: " + result.getStatus());
    }
}
```

비즈니스 로직에 통신과 관련된 복잡한 체이닝 코드나 매개변수 설정 등을 분리할 수 있어, 코드의 가독성과 테스트 용이성이 비약적으로 상승합니다. ✨

### 2.2. 네이티브 API 버저닝 (Native API Versioning) 🎯

API 버전을 관리하기 위해 매번 URL 경로를 분리하거나(` /api/v1/...`, `/api/v2/...`), 복잡하게 Header 기반의 라우팅을 커스텀해야 했던 시절은 끝났습니다. Spring Boot 4는 어노테이션 레벨에서 속성값으로 버저닝을 직접 지원합니다.

```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    // 클라이언트가 v1 버전을 요청할 때
    @GetMapping(version = "1.0")
    public Result<OrderDto> getOrderV1() {
        return Result.success(new OrderDto("v1"));
    }

    // 클라이언트가 v2 버전을 요청할 때
    @GetMapping(version = "2.0")
    public Result<OrderDto> getOrderV2() {
        return Result.success(new OrderDto("v2"));
    }
}
```

이렇게 설정된 버저닝 API는 클라이언트가 HTTP Header를 통해 매우 직관적으로 호출할 수 있습니다. 기본적으로 제공되는 버저닝 협상(Version Negotiation) 전략을 통해 헤더나 미디어타입을 활용합니다. (Spring Boot 기본 설정 외에도 프로젝트 환경에 맞게 `Api-Version` 같은 커스텀 헤더를 쓰도록 변경할 수 있습니다.)

**클라이언트 호출 예시 (cURL):**

```bash
# v1 API 호출
curl -H "Api-Version: 1.0" http://localhost:8080/api/orders

# v2 API 호출
curl -H "Api-Version: 2.0" http://localhost:8080/api/orders
```

이제 라우팅 구조를 지저분하게 흩트리지 않고, 더 우아하고 직관적인 API 생명주기 관리가 가능해졌습니다.

### 2.3. JSpecify 기반의 강력한 Null-Safety 보호막 🛡️

Java는 태생적으로 NullPointerException(NPE)의 위험성을 안고 있습니다. Spring Boot 4는 **JSpecify** 표준 어노테이션을 프레임워크 전반에 채택하여 타입 안정성을 최고 수준으로 끌어올렸습니다.

IDE와 컴파일러가 Spring API의 반환값과 입력 파라미터의 Null 허용 여부를 명확히 파악하므로, 코드 작성 중 NPE 발생 여지를 사전 차단해 줍니다. 안정적인 서비스를 운영해야 하는 백엔드 환경에서 매우 든든한 기능입니다.

### 2.4. 가상 스레드 (Virtual Threads) 전면 통합 🚀

Spring Boot 3.2에서 도입되기 시작했던 가상 스레드가 4 버전에 이르러서는 프레임워크 전반에 더욱 매끄럽게 녹아들었습니다. I/O 작업(DB I/O, 외부 API 통신 등)이 길어지더라도 시스템의 스레드를 고갈시키지 않습니다.

*   초경량 스레드 활용으로 **설정 하나로 마법 같은 트래픽 처리량 향상**을 경험할 수 있습니다.
*   Tomcat과 같은 서블릿 컨테이너가 기본적으로 가상 스레드를 활용하도록 전환되어, 별도의 WebFlux 기반 비동기 코딩 없이도 논블로킹(Non-blocking)에 버금가는 성능을 냅니다.

```yaml
# application.yml 에 한 줄만 추가
spring:
  threads:
    virtual:
      enabled: true
```

### 2.5. Observability (관측성) 고도화 👁️

MSA 환경 혹은 규모가 큰 모놀리틱 시스템에서 운영 가시성(Monitoring & Tracing)은 매우 중요합니다.
*   **SSL 만료 상태 모니터링**: 인증서 만료일이 다가올 때 Health Indicator를 통해 선제적으로 경고를 받을 수 있습니다.
*   새롭게 통합된 외부 플랫폼 및 데이터베이스(Redis 등)에 대한 디폴트 추적이 더욱 정교해졌습니다.

---

## 마치며 🏁

Spring Boot 2에서 4로의 도약은 그야말로 상전벽해입니다. 모듈화를 통한 경량화부터 네이티브 컴파일, 그리고 선언적 코드 작성을 유도하는 최신 트렌드까지 모두 응축되어 있습니다.

물론 `javax` → `jakarta` 전환이나 최소 요구 자바 버전(Java 17+) 등 넘어야 할 산이 있지만, **코드의 양이 획기적으로 줄고 성능은 올라간다는 점**에서 충분히 그만한 가치가 있는 투자일 것입니다.

아직, 검색만 하고 정리만 했지 실제 사용해보진 못했다. 실제로 적용해서 개발하면서 내용을 수정할 예정이다.
