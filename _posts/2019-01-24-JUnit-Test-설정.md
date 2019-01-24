---
layout: post
title: "JAVA의 JUnit을 사용한 테스트 코드 작성"
date: 2019-01-24
tags: [java, junit, spring, junit4, java test]
comments: true
---

# JUnit Test ?

- java로 작성된 코드를 외부 프로그램을 사용하지 않고 테스트를 진행 할 수 있는 단위 테스트 도구.
- 함수 별로, 기능 별로 동작을 테스트 하는 도구 이기 때문에 단위 테스트 도구이다.
- spring에서는 기본적으로 test code를 작성할 수 있는 folder 구조를 같이 생성한다.
- 또한 JUnit4 버전을 dependency가 포함되어 있다.

# JUnit Test를 도와줄 수 있는 유틸리티

## MoreUnit

> 테스트 파일을 생성하고, 실행시켜주는 유틸

- `ctrl + j`: 테스트 파일을 생성해준다.
- `ctrl + u`: 생성된 파일에 테스트 메소드를 생성해준다.
- `ctrl + r`: 테스트 실행

## EclEmma

> 소스의 테스트 커버리지를 확인 할 수 있는 유틸

- 테스트를 실행하면 테스트 소스를 제외한 모든 소스의 커버리지를 확인 할 수 있다.

# Test Code 예제

```java
import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.example.demo.domain.Board;
import com.example.demo.repository.BoardRepository;

@RunWith(SpringJUnit4ClassRunner.class)
public class BoardServiceImplTest {

	// 아무 값이 없는 mock을 생성
	// @Before에 각 메소드를 호출했을때의 동작을 설정해줘야 한다.
	@Mock
	private BoardRepository boardRepo;
	
	// Test를 하고자하는 mock 생성
	// 실제 class 내부에 autowired로 되어 있는 값은 @Mock을 사용하여 mock이 이미 만드어 있어야한다.
	@InjectMocks
	private BoardServiceImpl boardServiceImpl;
	
	private List<Board> boardList;
	
	@Before
	public void init() {
		System.out.println("boardRepo >> " + boardRepo);
		System.out.println("boardServcieImpl >> " + boardServiceImpl);
		
		boardList = new ArrayList<Board>();
		boardList.add(new Board().setId(1).setName("테스트"));
		
		// when-thenReturn으로 mock 설정
		// findAll()이 호출되면 thenReturn 값이 출력된다.
		when(boardRepo.findAll()).thenReturn(boardList);
	}
	
	@Test
	public void testFindAll() {
		List<Board> testBoardList = boardServiceImpl.findAll();

		assertThat(testBoardList, equalTo(boardList));
	}

}
```

 - 소스의 기본적인 구조는 `controller - service(serviceImpl) - repository - domain`의 구조를 가지고 있다.
 - 단위 테스트는 기능 위주의 테스트 이기 때문에 `service`를 위주로 테스트를 진행한다.
 - 실제 DB의 값을 가지고 조회/수정/삭제/추가 등을 진행하면 안되기 때문에 `repository`를 mock으로 생성하여 테스트를 진행한다.


