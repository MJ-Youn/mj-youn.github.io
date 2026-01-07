---
layout: post
title: "Spring boot async method"
date: 2020-02-28
categories: [Back-end, Spring]
tags: [spring boot, aync]
comments: true
---

## aync method

 > 비동기 실행

 - 회사 프로젝트중 비동기 실행을 처리해야하는 부분이 있어서 조사하던중. spring에서 지원하는 `@aync` 기능이 있는 것을 알고 조사하여 개발했다.
 - 이전까지는 `Threadable` 클래스를 정의하고, thread들을 관리하는 `monitoring thread`를 같이 선언하여 했으나 결과에 상관없이 작업을 비동기로 실행하는 로직이 있으면 됐기 때문에 해당기능을 조사하여 개발하였다.
 - thread를 나눠서 실행하고, 실행한 모든 thread가 완료될 때까지 기다리는 로직은 다른 방법으로 구현하였다.


## Example

### Application

```java
package kr.co.lguplus.nw.cert.mgmt.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@EnableAsync // @async method를 사용하기 위한 선언
@SpringBootApplication
public class Application {

	/** ACS/IDS 로그검색에서 사용하는 빈 네임 */
	public static final String ACS_IDS_THREAD_POOL_TASK_EXECUTOR_NAME = "kr.co.lguplus.nw.cert.mgmt.api.Application#getAcsIdsThreadPoolTaskExecutor()";
	public static final String ACS_IDS_THREAD_NAME = "ACS/IDS 로그검색";
	
	// queue가 full 됬을 때의 최대 pool의 개수
	private static final int MAX_POOL_SIZE = 128;
	// queue에 데이터가 없을 때의 최대 pool의 개수
	private static final int CORE_POOL_SIZE = 64;
	// queue의 개수
	private static final int QUEUE_CAPACITY = 64;
	
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	/**
	 * ACS/IDS 로그검색에서 비동기 처리를 하기 위해 생성하는 BEAN
	 * 비동기 호출하는 @async 메소드의 pool을 관리하기 위한 설정 값
	 * 
	 * @return
	 */
	@Bean(name = ACS_IDS_THREAD_POOL_TASK_EXECUTOR_NAME)
	public ThreadPoolTaskExecutor getAcsIdsThreadPoolTaskExecutor() {
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

		// thread의 이름 설정
		executor.setThreadFactory(new DefaultThreadFactory(ACS_IDS_THREAD_NAME));
		// thread의 group 설정
		executor.setThreadGroupName("async");
		
		// pool size 설정
		executor.setCorePoolSize(CORE_POOL_SIZE);
		executor.setMaxPoolSize(MAX_POOL_SIZE);
		executor.setQueueCapacity(QUEUE_CAPACITY);
		
		return executor;
	}
	
}
```

### async method

```java
package kr.co.lguplus.nw.cert.mgmt.api.service.impl;

...

import org.springframework.scheduling.annotation.Async;

...

/**
 * @see AcsIdsLogSearchService
 * 
 * @author mjyoun
 * @since 2020. 01. 20.
 *
 */
@Service(AcsIdsLogSearchServiceImpl.BEAN_NAME)
public class AcsIdsLogSearchServiceImpl implements AcsIdsLogSearchService {

	...

	/**
	 * @throws IOException 
	 * @see {@link kr.co.lguplus.nw.cert.mgmt.api.service.AcsIdsLogSearchService#executeLogSearch(Long)}
	 */
	@Override
	@Async(Application.ACS_IDS_THREAD_POOL_TASK_EXECUTOR_NAME) // application에 선언한 thread pool을 사용함
	public void executeLogSearch(Long seq) throws IOException {

		...

	}

	...
}

```

## 마지막으로...

 - spring boot에서는 위처럼 쉽게 비동기 메소드를 정의하고 실행할 수 있다.
 - 주의 사항으로 `@async` 메소드에서 `@async` 메소드 호출은 불가하다.
