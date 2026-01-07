---
layout: post
title: "install shield로 다른 프로그램 설치"
date: 2017-04-04
excerpt: "install shield로 여러개의 실행파일을 포함한 실행파일 만드는 방법"
tags: [windows, install shield, exe, bat, msi]
comments: true
---

프로젝트를 진행하면서 프로젝트에 필요한 파일들을 한번에 설치할 수 있는 설치 파일을 만들어 달라는 요청이 있었다.

이를 위해 필요한 실행파일들을 가지고 있고 이를 직접 실행하기 위해 새로운 실행파일을 만들었다.


# 프로젝트 생성

 - install shield를 실행하고 새로운 프로젝트를 만든다.
 - 기본적으로 Basic MSI Project를 만들어서 실행파일을 만들지만, InstallScript를 쉽게 컨트롤하기 위해서 InstallScript Project로 만든다.

# 프로젝트 설정

 - 프로젝트 설정은 1분정도만 google 검색하면 쉽게 찾을 수 있으니 설명하지 않겠다.
 - 다른 블로그를 참조한다. <http://m.blog.naver.com/hji0223/220370639441>

# Install Script 수정

 - 상단의 `Installation Designer` 탭을 들어간다.
 - Behavior and Logic - InstallScript를 클릭한다.
 - 우측의 스크립트 창 상단에 Select box가 생기는데, 언제 동작하는 지를 결정하는 것이다.
 - 여기선 설치 중에 내부 실행파일들이 실행되게 하도록 만들기 위해서 DefaultFeature - Installing을 선택한다.

> 소스 첨부

```c
//---------------------------------------------------------------------------
// The Installed event is sent after the feature DefaultFeature
// is installed.
//---------------------------------------------------------------------------
export prototype DefaultFeature_Installed();

function DefaultFeature_Installed()
    STRING sCmdExe, sMsiExe, sParam1, sParam2;
    STRING sJavaPath, sPostgresqlPath, sActivemqPath;    
begin
    sMsiExe = "C:\\Windows\\System32\\msiexec.exe";
    sCmdExe = "C:\\Windows\\System32\\cmd.exe";
    sJavaPath = TARGETDIR + "\\jdk-8u121-windows-x64.exe";
    sMsxmlPath = TARGETDIR + "\\Prerequisite\\msxml\\msxml.msi";
    sActivemqPath = TARGETDIR + "\\apache-activemq-5.14.0\\bin\\win64\\activemq.bat";
    sParam1 = "/i " + "\"" + sMsxmlPath + "\"";
    sParam2 = "/c \"" + sActivemqPath + "\"";

    if(LaunchAppAndWait(sJavaPath, "", WAIT) < 0) then
		MessageBox("Failed to install Java.", SEVERE);
    endif;

    if(LaunchAppAndWait(sMsiExe, sParam1, WAIT) < 0) then
		MessageBox ("Failed to install msxml library.",SEVERE);
    endif;

    if(LaunchAppAndWait(sCmdExe, sParam2, WAIT) < 0) then
		MessageBox("Failed to install ActiveMQ.", SEVERE);
    endif;
end;

```

- 위의 소스는 쉽게 이해할 수 있을 것이다.
- exe파일, bat파일, msi파일 별로 실행하는 방법이 다르다는 것만 알면 쉽게 실행 시킬 수 있다.
