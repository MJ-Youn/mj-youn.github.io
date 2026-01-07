---
layout: post
title: "Spring Security 기본설정"
date: 2017-03-10
excerpt: "Spring Security의 기본설정, 하는 방식이 너무 많아 헷갈리지 않도록 정리."
categories: [Back-end, Spring]
tags: [java, spring, spring security]
comments: true
---

# sprint-security-context.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans:beans xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance"
	xmlns:beans="https://www.springframework.org/schema/beans"
	xmlns:security="https://www.springframework.org/schema/security"
	xsi:schemaLocation="https://www.springframework.org/schema/security https://www.springframework.org/schema/security/spring-security-4.2.xsd
		https://www.springframework.org/schema/beans https://www.springframework.org/schema/beans/spring-beans-4.2.xsd">

    <!-- 권한이 없는 페이지 -->
    <security:http pattern="/css/**" security="none" />
    <security:http pattern="/images/**" security="none" />
    <security:http pattern="/javascripts/**" security="none" />
    <security:http pattern="/libs/**" security="none" />
    <security:http pattern="/templates/**" security="none" />

    <security:http auto-config="true">
      <!-- csrf 사용 불가 설정 -->
    	<security:csrf disabled="true"/>
      <!-- 페이지 권한 설정 -->
    	<security:intercept-url pattern="/login" access="permitAll"/>
    	<security:intercept-url pattern="/logout" access="permitAll"/>
    	<security:intercept-url pattern="/**" access="hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR', 'ROLE_USER1', 'ROLE_USER2')" />

  		<security:form-login
  			login-page="/login"
  			username-parameter="j_username"			
  			password-parameter="j_password"
  			login-processing-url="/j_security_check"
  			authentication-success-handler-ref="loginSuccessHandler"
  			authentication-failure-handler-ref="loginFailureHandler"
  			always-use-default-target="true"/>

  		<security:logout logout-url="/j_spring_security_logout"  logout-success-url="/logout" />
    </security:http>

  	<security:authentication-manager>
      <!-- 로그인을 처리하는 Service -->
  		<security:authentication-provider user-service-ref="customLoginService" />
  	</security:authentication-manager>

	<beans:bean id="webexpressionHandler" class="org.springframework.security.web.access.expression.DefaultWebSecurityExpressionHandler"/>

	<!-- 로그인 성공 시 핸들러 -->
	<beans:bean id="loginSuccessHandler" class="net.lguplus.subwaywifi.security.LoginSuccessHandler"/>

	<!-- 로그인 실패 시 핸들러 -->
	<beans:bean id="loginFailureHandler" class="net.lguplus.subwaywifi.security.LoginFailureHandler"/>
</beans:beans>
```

# CustomLoginService.java

```java
@Service
public class CustomLoginService implements AuthenticationProvider {

  @Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		String id = authentication.getName();
		String password = (String) authentication.getCredentials();

    // 로그인이 성공 할 경우
    String userGrade = UserGradeUtil.getGradeNameByLevel(userLevel);
    Collection<? extends GrantedAuthority> authorities = Collections.singleton(new SimpleGrantedAuthority(userGrade));
    return new UsernamePasswordAuthenticationToken(id, password, authorities);

		// 로그인이 실패 할 경우
    throw new BadCredentialsException("login failure");
		}
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return Authentication.class.isAssignableFrom(authentication);
	}
}
```

# LoginSuccessHandler.java

```java
public class LoginSuccessHandler implements AuthenticationSuccessHandler {
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
    // 로그인을 성공한 뒤에 후처리

    // 페이지 이동
		response.sendRedirect(request.getContextPath() + "/");
	}
}
```

# LoginFailureHandler.java

```java
public class LoginFailureHandler implements AuthenticationFailureHandler {
	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
    // 로그인을 실패한 뒤에 후처리

    // 페이지 이동
		response.sendRedirect(request.getContextPath() + "/login?error=true");
	}
}
```
