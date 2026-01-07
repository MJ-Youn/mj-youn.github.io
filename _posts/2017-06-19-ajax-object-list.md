---
layout: post
title: "Object List를 Ajax로 보내는 방법"
date: 2017-06-19
excerpt: "할때 마다 까먹고, 하두 뻘짓을 많이 해서 정리해 둠..."
categories: [Back-end, Spring]
tags: [ajax, jquery, javascript, spring, java]
comments: true
---

## javasciprt

 - ajax의 data를 JSON.stringify()함수를 사용하여 json 형태로 만들어 보낸다.
 - contentType은 "application/json;charset=UTF-8"로 설정한다.

```javascript
$.ajax({
	url : API_SERVER + "/addCSVShoes",
	type : "POST",
	contentType: "application/json; charset=UTF-8",
	data : JSON.stringify(shoesList),
	crossDomain: true,
	beforeSend: function(xhr) {
		xhr.setRequestHeader("Token", TOKEN);
	},
	success : function(data) {
		if(data.toString() === "true") {
			alert("신발 등록을 완료하였습니다.");
			window.opener.location.reload();
			window.close();
		}
		else {
			alert("신발 등록에 실패하였습니다.");
		}
	},
	error: function(xhr, exception) {
		if (xhr.status === 401) {
			alert("세션이 만료되었습니다.");
			$(location).attr('href', '/perform_logout');
		}
	}
});
```

## java

 - jackson library를 사용하여 json을 받아서 object 형태로 받을 수 있게 한다.
 - 파라미터는 "@ReqeustBody TestDTO [] testDTO" 형태의 배열로 받는다.
 - content-type의 설정에 javascript에서 호출하는 값일 없을 경우 설정해준다.

```java
@RequestMapping(value = "/addCSVShoes")
public ResponseEntity<Object> addCSVShoesInfo(@RequestHeader(value = "token") String token,
    @RequestBody ShoesDTO [] shoesDTOList) {
  return createResponseEntity(token, shoesService.registNewShoesList(shoesDTOList));
}
```
