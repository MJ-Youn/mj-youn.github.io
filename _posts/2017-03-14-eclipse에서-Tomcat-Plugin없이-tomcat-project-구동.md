---
layout: post
title: "eclipse에서 Tomcat Plugin없이 tomcat project 구동"
date: 2017-03-14
excerpt: "최근에 나온 eclipse(luna +)에선 tomcat plugin을 사용할 수 없다. 이를 해결하기 위한 방법"
tags: [tomcat, eclipse, sts, tomcat project, tomcat plugin]
comments: true
---

# Tomcat Project ?

- 프로젝트 구성이 war파일의 형식을 갖추고 있어 tomcat으로 직접 실행시키는 Project
- war파일을 만들어 실행 할 수도 있다.
- 직접 tomcat directory에 프로젝트를 넣어서 실행 할 수 있지만, debug가 안되기 때문에 eclipse로 사용
- eclipse에서 실행시에 tomcat plugin을 설치하여 tomcat을 실행시키는 방식으로 사용

> 용어 사전 참조

# Tomcat plugin없이 구동시키기

먼저 eclipse에서 tomcat을 사용하기 위해 server를 설정해둬야한다.

1. `Servers`창에서 Tomcat을 double click하여 톰캣 설정을 연다.
2. 아래의 `Modules`탭을 선택하여 modules 설정으로 넘어간다.
3. `Add External Web Module...`을 선택한다. (workspace에 있어도 되고, 없어도 된다.)
4. `Document base`에 프로젝트를 선택하고 `Path`를 설정한다.
5. 설정을 저장하고 Tomcat을 실행하면 프로젝트가 실행되는 것을 확인 할 수 있다.

위의 방법으로 war파일을 푼 폴더를 지정하면 역시 구동시킬 수 있다.

tomcat plugin을 지원하지 않는 버전에서 위처럼 사용할 수 있지만,

그러지 않는 버전에서도 plugin없이 구동하는 것을 추천한다.

plugin을 통해 구동을 하게 되면 프로젝트 별로 tomcat 설정파일이 tomcat 내부에 생기게 되고,

관리하는 프로젝트가 많아지게 되면 설정파일 역시 관리하기 힘들어진다.

위에 설명한 방식대로 구동을 하게 되면 설정파일이 프로젝트 내에 생기기 때문에 각각 관리하기 쉬워진다.

또한 eclipse 내에서 설정(path, port 등)을 직접 변경 할 수 있기 때문에 설정하기도 쉬워진다.
