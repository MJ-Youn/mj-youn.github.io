---
layout: post
title: "Spring boot에서 error page 처리하는 방법"
date: 2020-02-12
tags: [spring boot, error, exception]
comments: true
---

## AbstractErrorController 사용 예제

```java
package kr.co.ymtech.lafs.web.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.web.servlet.error.AbstractErrorController;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author MJ Youn
 * @since 2020. 02. 12.
 *
 */
@Controller
@RequestMapping("${server.error.path:${error.path:/error}}") // server.error.path를 불러오고, error.path를 불러오고 없을 경우 '/error'로 설정한다.
public class CustomErrorController extends AbstractErrorController {

	@Value("${server.error.path:${error.path:/error}}")
	private String ERROR_PATH;

	/**
	 * @param errorAttributes
	 */
	public CustomErrorController(ErrorAttributes errorAttributes) {
		super(errorAttributes);
	}
	
	/**
	 * @see org.springframework.boot.web.servlet.error.ErrorController#getErrorPath()
	 */
	@Override
	public String getErrorPath() {
		return ERROR_PATH; // error page path를 설정하지만, 언제 동작하는지 모르겠음..
	}
	
	@RequestMapping(produces = MediaType.TEXT_HTML_VALUE) // page 요청하는 과정에서 에러가 발생하는 경우 동작하는 함수
	public ModelAndView pageError(HttpServletRequest request, HttpServletResponse response) {
		// request에서 status를 가져옴
		HttpStatus status = getStatus(request);
		// 발생 시간, status code, message를 가져옴
		Map<String, Object> model = getErrorAttributes(request, false);

		// error code 설정
		response.setStatus(status.value());
		
		return new ModelAndView(ERROR_PATH, model);
	}
	
	@RequestMapping // page를 요청하지 않는 과정에서 에러가 발생하는 경우 동작, API 호출시 동작함
	public ResponseEntity<Map<String, Object>> apiError(HttpServletRequest request) {
		// request에서 status를 가져옴
		HttpStatus status = getStatus(request);
		// 발생 시간, status code, message를 가져옴
		Map<String, Object> model = getErrorAttributes(request, false);
		
		return new ResponseEntity<>(model, status);
	}

}
```

 - 모든 `Exception`을 하나의 method에서 처리한다는 문제가 있음.
 - `Exception`별로 나누기 위해서는 하단의 `ExceptionHanlder`와 같이 사용해야 할 듯?

## ExceptionHandler를 사용한 예제

```java
package kr.co.ymtech.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import kr.co.ymtech.dto.ResultDTO;
import kr.co.ymtech.exception.FileDownloadException;

/**
 * Error가 났을 경우 동작하는 controller
 * 
 * @author MJYoun
 * @since 2019. 04. 16.
 *
 */
@ControllerAdvice // 모든 controller에 대해서 적용하기 위한 설정
public class ExceptionController {

	/**
	 * 모든 exception에 대해서 처리
	 * 
	 * @param e
	 * @return
	 */
	@ExceptionHandler(Exception.class)
	public ResponseEntity<Object> handler(Exception e) {
		ResultDTO<Object> result = new ResultDTO<>();

		result = ResultDTO.error(e.getMessage());

		return new ResponseEntity<Object>(result, HttpStatus.BAD_REQUEST);
	}

	/**
	 * 
	 * 
	 * @param e
	 * @return
	 */
	@ExceptionHandler(FileDownloadException.class)
	public ResponseEntity<Object> downloadHandler(Exception e) {
		return new ResponseEntity<Object>(HttpStatus.NOT_FOUND);
	}

}
```

 - `AbstractErrorController`를 사용하는 것과 뭐가 다른지 모르겠음.
 - 차이라면 `ExceptionHandler`의 경우 Exception 별로 처리할 수 있다는 차이 정도 ???
