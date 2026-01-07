---
layout: post
title: "Spring Security Tips"
date: 2017-04-24
excerpt: "Spring Security를 사용하면서 얻게 되는 Tip을 정리하기 위한 포스트"
categories: [Back-end, Spring]
tags: [spring, spring security, security]
comments: true
---

## Authentication

 - `SecurityContextHolder.getContext().getAuthentication();`로 로그인 정보를 얻을 수 있다.
 - xml 상에서 `<http pattern="" security="none" />`으로 되어 있는 페이지에선 `authentication`을 불러올 수 없다.(null을 가져온다.)
 - `security="none"`으로 되어 있으면 `<intercept-url pattern="" access="" />`도 동작하지 않는다.

## AuthenticationProvider

 - 직접 정한 사용자 정보를 return하고 싶을 때는 `Authentication`을 상속받은 VO를 만들고 이를 return해 주면된다.

```java
package iot.smartshoes.lbs.webapp.dto;

import java.util.Collection;
import java.util.Date;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

public class Admin implements Authentication {

	private static final long						serialVersionUID	= 3502340419866769028L;
	private Collection<? extends GrantedAuthority>	authorities;

	@Override
	public String getName() {
    // 유저 아이디
		return this.adminId;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
    // 유저의 권한
		return this.authorities;
	}

	@Override
	public Object getCredentials() {
    // 유저의 패스워드
		return this.password;
	}

	@Override
	public Object getDetails() {
    // ???
		return null;
	}

	@Override
	public Object getPrincipal() {
    // 유저의 아이디
		return this.adminId;
	}

	@Override
	public boolean isAuthenticated() {
    // 인증된 사용자인지의 값
    // 항상 true면 된다.
		return true;
	}

	@Override
	public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
    // 인증된 사용자인지를 변경하기 위한 함수
	}

}
```

 - 위와 같이 생성하면 `AuthenticationProvider`의 return 값으로 사용할 수 있다.
 - 또한 모든 페이지에서 `SecurityContextHolder.getContext().getAuthentication();`를 사용하여 가져올 수 있다.
 
