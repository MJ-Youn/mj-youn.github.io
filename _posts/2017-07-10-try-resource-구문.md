---
layout: post
title: "JAVA7 try-resources 구문 활용."
date: 2017-07-10
excerpt: "JAVA7부터 지원하는 try-resources 구문 활용법"
tags: [java, java7, try-resources, AutoCloseable]
comments: true
---

## try-resources

 > 자바7에 추가된 리소스 객체 처리 방법
 > 예외 발생 여부와 상관럾이 정리해줘야했던 리소스 객체의 close()를 호출해준다.

### JAVA 6까지의 사용했던 코드

```java
try {
  FileWriter fileWriter = new FileWriter();
  ...
} catch (Exception e) {
  e.printStackTrace();
} finally {
  if (fileWriter != null) {
    fileWriter.close();
  }
}
```

### try-resources 구문 사용

```java
try (
  FileWriter fileWriter = new FileWriter();
) {
  ...
} catch (Exception e) {
  e.printStackTrace();
}
```

## try-resources 구문 활용

 - 사용자가 정의한 리소스 객체도 try-resources구문으로 사용할 수 있다.

### TestResourcesClass

```java
public class TestResourcesClass implements AutoCloseable {

	public TestResourcesClass() {
		System.out.println("Test is created.");
	}

	public void doSomething() {
		System.out.println("do something");
	}

	@Override
	public void close() {
		System.out.println("Test is closed.");
	}

}
```

 - AutoCloseable을 상속받아서 close() 함수를 override하여 동작을 설정한다.

### Test

```java
import org.junit.Test;

public class DataServiceTest {

	@Test
	public void tryResourceTest() {
		try (
				TestResourcesClass testResourcesClass = new TestResourcesClass();
			) {
			testResourcesClass.doSomething();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
```

#### 실행결과

```
Test is created.
do something
Test is closed.
```

- 굳이 사용자 정의 리소스 객체를 사용할 일이 있을까 싶긴하지만 알고 있으면 언젠간 쓸일이 있을지도...
