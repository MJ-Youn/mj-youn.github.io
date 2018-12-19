---
layout: post
title: "ResponseEntity"
date: 2017-04-24
excerpt: "ResponseHeader Util을 따로 만들지 않아서 header를 만들어 보낼 수 있는 데이터 타입"
tags: [spring, java, responseheader, responseentity]
comments: true
---

# ResponseEntity

 - API Server를 구축할 때 response header와 body를 만들어서 보낼 수 있는 Object

# 사용법

```java
public class CommonController {

	@Autowired
	@Qualifier(AdminServiceImpl.BEAN_QUALIFIER)
	private AdminService adminService;

	protected ResponseEntity<Object> createResponseEntity(String token, Object body) {
		if (adminService.checkValidToken(token)) {
			return new ResponseEntity<Object>(body, HttpStatus.OK);
		} else {
			return new ResponseEntity<Object>(HttpStatus.UNAUTHORIZED);
		}
	}

}
```

 - 위는 실제 사용했던 프로젝트의 실부를 가져온 것이다.
 - token으로 권한을 확인한 뒤에 유효할 경우 data를 body에 담아서 데이터를 보낸다.
 - 권한이 없을 경우, body에 데이터를 넣지 않고 error 코드만 생성해서 보낸다.

 ```javascript
 $.ajax({
 		url : ,
 		type : "POST",
 		dataType : "json",
 		data : ,
 		beforeSend: function(xhr) {
 			xhr.setRequestHeader("Token", TOKEN);
 		},
 		success : function(data) {

 		},
 		error: function(xhr, exception) {
 			if (xhr.status === 401) {
 				alert("세션이 만료되었습니다.");
 				$(location).attr('href', '/perform_logout');
 			}
 		}
 	});
 ```

  - 받는 쪽(JQuery)에서는 error로 들어간다.
  - error를 받아서 처리하면 된다.
