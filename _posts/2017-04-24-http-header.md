---
layout: post
title: "Http Header"
date: 2017-04-24
excerpt: "Http Header 통신을 하면서 알게된 내용"
tags: [http, http header, spring, jquery]
comments: true
---

# Http Header

 - http 통신을 할때, body의 데이터를 담는것보단 상대적으로 안전한 방법
 - 데이터를 요청하는 쪽과 받는 쪽의 헤더를 맞춰줘야한다.

# Sample Code

## Javascript(JQuery) - 보내는 쪽

```javascript
$.ajax({
		url : ,
		type : "POST",
		dataType : "json",
		data : ,
		crossDomain: true,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Token", TOKEN);
		},
		success : function(data) {

		},
		error: function(xhr, exception) {

		}
	});
```

 - beforeSend() 함수를 사용하여 Header에 넣고 싶은 데이터를 넣는다.
 - "Token"이라는 이름으로 데이터를 넣어서 보내고 있다.

## Java(spring) - 받는 쪽

```java
// 필터
@Component
public class CorsFilter implements Filter {

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {

	}

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
		HttpServletResponse response = (HttpServletResponse) servletResponse;
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
		response.setHeader("Access-Control-Max-Age", "3600");
		response.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Token");

		filterChain.doFilter(servletRequest, servletResponse);
	}

	@Override
	public void destroy() {

	}

}
```

 - 필터를 사용하여 들어오는 데이터의 값을 확인한다.
 - `Access-Control-Allow-Headers`의 값으로 `Token`이 들어있는 것을 확인 할 수 있다.

```java
@RestController
public class ShoesInfoController extends CommonController {

	@RequestMapping(value = "/getShoesList")
	public ResponseEntity<Object> getShoesList(@RequestHeader(value = "token") String token) {
		return createResponseEntity(token, shoesInfoService.bringUnassignedList());
	}
}
```

 - header에 들어 있는 token의 값을 위와 같이 받아 올 수 있다.
