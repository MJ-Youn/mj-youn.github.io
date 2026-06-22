---
layout: post
title: "Nginx 실전 설정 가이드: 리버스 프록시와 보안 설정 완벽 파헤치기"
date: 2026-06-22 13:25:00 +0900
excerpt: "실무에서 쓰이는 Nginx의 정적 파일 서빙, 철통 같은 HTTPS 보안 설정, 그리고 리버스 프록시(Reverse Proxy)를 활용한 서버 간 라우팅 설정 방법을 예제와 함께 완벽히 정리한다."
categories: [Server]
tags: [Nginx, Server, Proxy, Security, HTTPS]
comments: true
---

웹 애플리케이션을 배포할 때 빼놓을 수 없는 핵심 인프라 중 하나가 바로 **Nginx**다. 처음 Nginx를 접하면 복잡한 설정 파일(`nginx.conf`) 때문에 당황하기 쉽다. 

오늘은 실제 서비스 환경에서 사용 중인 설정 예제를 바탕으로 Nginx의 핵심 기능인 **정적 파일 서빙, HTTPS 보안 설정, 그리고 리버스 프록시(Reverse Proxy)** 설정을 하나씩 뜯어보며 완벽하게 이해해 본다. ✨

<br/>

## 1. Upstream: 백엔드 서버 그룹 정의하기 🏘️

가장 먼저 살펴볼 부분은 `upstream` 블록이다. Nginx가 트래픽을 전달할 실제 백엔드 서버(Spring Boot, Node.js 등)들의 주소와 포트를 정의하는 곳이다.

```nginx
# nccat-web 서비스로 트래픽을 전달하기 위한 업스트림 정의
upstream nccat-web {
    server 127.0.0.1:8082;
}

# mdtat-web 서비스로 트래픽을 전달하기 위한 업스트림 정의
upstream mdtat-web {
    server 127.0.0.1:8081;
}
```

*   **역할**: Nginx 뒤에 숨어있는 내부 서비스들의 별칭(Alias)을 만든다. 나중에 `proxy_pass http://nccat-web;` 형태로 간편하게 호출할 수 있다.
*   **확장성**: 여러 대의 서버 주소를 적어두면 Nginx가 알아서 **로드 밸런싱(Load Balancing)**을 수행하여 트래픽을 분산시켜 준다.

<br/>

## 2. HTTP를 HTTPS로 강제 변환하기 🔒

요즘 웹 브라우저에서는 HTTPS가 필수다. HTTP(80 포트)로 접속한 사용자를 안전한 HTTPS(443 포트)로 안내하는 설정이다.

```nginx
server {
    listen 80;
    server_name localhost;

    # 들어온 모든 요청을 301(영구 이동) 상태 코드로 HTTPS 주소로 리다이렉트
    return 301 https://$host$request_uri;
}
```

*   **`listen 80`**: HTTP 기본 포트인 80번으로 들어오는 트래픽을 수신한다.
*   **`return 301 ...`**: 브라우저에게 "이 사이트는 HTTP가 아니라 HTTPS 환경이니, 앞으로는 보안 연결로 이동해라"라고 알려준다.

<br/>

## 3. HTTPS 서버 및 철통 보안 설정 🛡️

이제 실제 메인 서버인 443(HTTPS) 포트 설정을 살펴본다. 인증서 적용부터 각종 보안 헤더까지 꼼꼼하게 설정되어 있다.

```nginx
server {
    listen 443 ssl http2;
    server_name localhost;

    # SSL 인증서 경로 지정 (와일드카드 인증서 사용)
    ssl_certificate /etc/nginx/cert/R3-wildcard.ymtech.co.kr.crt;
    ssl_certificate_key /etc/nginx/cert/R3-wildcard.ymtech.co.kr.key;

    # 안전한 프로토콜 및 암호화 방식 강제 적용
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;

    # 보안 헤더 추가 (클릭재킹, MIME 스니핑, XSS 방어)
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
```

*   **`ssl http2`**: SSL을 켜고 최신 웹 통신 규격인 HTTP/2를 활성화하여 웹 페이지 로딩 속도를 대폭 높인다.
*   **보안 헤더(`add_header`)**: 웹 해킹(XSS, 클릭재킹 등)을 브라우저 단에서 자체적으로 방어하도록 지시하는 매우 훌륭한 필수 보안 설정이다.

<br/>

## 4. 정적 파일 제공 및 IP 접근 제어 방어벽 🧱

Nginx는 빌드된 프론트엔드 파일(HTML, CSS, JS)을 제공하는 웹 서버로서 탁월한 성능을 발휘한다. 여기에 더해 **사내망이나 특정 IP만 접근**하도록 제한을 걸 수 있다.

```nginx
    root /usr/share/nginx/html;
    index index.html;

    location / {
        # 특정 IP 및 대역폭 허용
        allow 12.12.0.0/16;   # 사내망 대역
        allow 123.123.0.0/16;  # 사내망 대역
        allow xxx.xxx.xxx.xxx; # 사내 특정 IP
        
        # 위에서 명시적으로 허용되지 않은 모든 접근은 403 에러로 원천 차단!
        deny all;

        try_files $uri $uri/ =404;
    }
```

*   **`root` & `index`**: 사용자가 도메인만 치고 들어왔을 때 기본적으로 찾아서 보여줄 폴더와 파일이다.
*   **`allow` / `deny`**: Nginx는 위에서부터 순서대로 조건을 검사한다. 허용된 IP가 아니면 단호하게 `deny all`에 걸려 사이트를 볼 수 없다. 실무에서 아주 요긴하게 쓰이는 보안 기법이다. 👍

<br/>

## 5. 대망의 리버스 프록시 (Reverse Proxy) 라우팅 🚦

Nginx의 꽃이다. 클라이언트의 요청 경로(URL)를 분석하여 알맞은 백엔드 서버(Upstream)로 트래픽의 교통정리를 해주는 문지기 역할을 한다.

### 기본 라우팅 예시 (`/nccat/`)
```nginx
    location ^~ /nccat/ {
        # 앞서 upstream 블록에서 정의한 nccat-web 서비스로 전달
        proxy_pass http://nccat-web/nccat/;
        proxy_redirect off;

        # 사용자의 진짜 정보(IP, 포트, 도메인)를 백엔드에 넘겨주는 핵심 헤더들
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Prefix /nccat;
    }
```
*   **`proxy_pass`**: 트래픽을 넘길 최종 목적지다.
*   **`proxy_set_header`**: 사용자가 Nginx를 거치면서 클라이언트의 원래 IP(`X-Real-IP`)가 Nginx 서버 IP로 둔갑하는 것을 막기 위해, 진짜 접속자 정보를 백엔드로 전달해 주는 필수 설정이다. `X-Forwarded-Prefix`는 백엔드 앱(Spring 등)이 자신이 `/nccat`이라는 하위 경로에서 서비스 중임을 인지하게 해준다.

### 고급 기법: 응답 본문 치환 (OpenProject 예제) 🛠️
```nginx
    location ^~ /openproject/ {
        proxy_pass http://openproject/openproject/;
        
        # [핵심] 응답 Body 데이터 내의 고정 텍스트를 접속한 현재 도메인으로 실시간 치환
        sub_filter 'third.ymtech.co.kr:10066' $http_host;
        sub_filter_once off;
        sub_filter_types application/json application/javascript text/css;
    }
```
*   **`sub_filter`**: 백엔드(OpenProject)가 클라이언트에게 응답을 보낼 때, HTML 내부에 `third.ymtech.co.kr:10066`라는 하드코딩된 주소가 박혀있을 경우 Nginx가 이를 가로챈다. 그리고 현재 사용자가 접속한 도메인(`$http_host`)으로 글자를 싹 바꿔치기해서 내려준다. 복잡한 솔루션을 포팅할 때 매우 유용한 고급 스킬이다!

### WebSocket 통신 지원 (Grafana 예제) 🔄
```nginx
    location ^~ /grafana/ {
        proxy_pass http://grafana-web/grafana/;
        
        # WebSocket 업그레이드 지원을 위한 핵심 설정
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
    }
```
*   실시간 대시보드 차트를 보여주는 Grafana 같은 서비스는 브라우저와 지속적인 연결(WebSocket)이 필요하다. 일반 HTTP 요청을 WebSocket으로 업그레이드해 주는 위 두 줄의 헤더 설정이 없으면 실시간 데이터 갱신이 불가능하다.

<br/>

## 🎯 마치며

정리한 Nginx 설정은 
1. **철저한 접근 제어 (IP 화이트리스트 기반 방어)**
2. **강력한 HTTPS 통신 및 보안 헤더 규격**
3. **각 서비스 성격에 맞춘 디테일한 다중 서비스(MSA) 라우팅**

이 세 가지가 매우 훌륭하게 조화된 **"정석적인 실무형 리버스 프록시 아키텍처"** 다. Nginx는 처음엔 낯설지만, 이처럼 블록 단위(`server`, `location`)로 용도를 나누어 이해하면 애플리케이션 트래픽을 자유자재로 다룰 수 있는 아주 강력한 무기가 된다. 🚀

