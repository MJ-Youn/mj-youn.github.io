---
layout: post
title: "TOAST UI Component 설치"
date: 2016-06-28
excerpt: "windows 환경에서 TOAST UI Component 설치 가이드"
tags: [toast ui]
comments: true
---

TOAST Ui 컴포넌트를 설치하기 위해서 `bower install tui-code-snippet`명령어를 사용하면 된다.  
하지만 Windows는 기본적오르 `bower`가 설치되어 있기 않기 때문에 이를 설치해 `npm install bower` 명령어를 가지고 설치해주면 된다.   
하지만 역시!! `npm` 또한 Windows에 깔려있지 않기 때문에 이를 위해 **Node.js**를 깔아줘야한다.

[Node.js](https://nodejs.org/en/) 홈페이지에 들어가면 OS에 맞는 Node.js를 추천해 주기 때문에 쉽게 설치 할 수 있다.

![Node.js](/assets/img/post/TOAST_UI_Component_설치/nodejs.png)  

여기서 끝난 것은 아니다. `npm`명령어로 `bower`를 설치하기 위해서는 **git bash**가 필요하다.


[Windows용 git 다운로드 페이지](https://git-for-windows.github.io/)에 들어가면 쉽게 받을 수 있다.

![git](/assets/img/post/TOAST_UI_Component_설치/git.png)

Code Snippet을 받기 위한 환경설정이 끝이 났다.  
이제 설치를 시작하면 된다.

**git bash**를 키고 `bower install tui-code-snippet` 명령어를 입력해 설치를 진행한다. 여기선 예제로 **color picker**를 사용할 것이 때문에 같이 설치한다. `bower install tui-component-colorpicker`

![git_bash](/assets/img/post/TOAST_UI_Component_설치/git_bash.png)

각 파일들은 **'C:\Users\(USER NAME)\bower_components\'**경로에 설치된다. 테스트용 코드를 작성해 정상 작동하는지 확인해보자.

다음과 같은 코드를 작성해 **'C:\Users\(USER NAME)\bower_components\'**에 저장한다.

![test_code.html](/assets/img/post/TOAST_UI_Component_설치/test_code.png)

이 파일을 실행시키면

![test_view](/assets/img/post/TOAST_UI_Component_설치/test_view.png)

정상 동작하는 것을 확인 할 수 있다.
