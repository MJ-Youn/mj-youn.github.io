---
layout: post
title: "VSCode로 원격 파일을 수정해보자!"
date: 2018-10-12
excerpt: "VSCode의 플러그인을 사용하여 VM의 원격 파일을 수정하기 위한 세팅"
tags: [vscode, ssh, vm]
comments: true
---

# 환경 설정

**전제 조건**

| 구분     | 종류           |
| ------ | ------------ |
| Client | windows 10   |
| vscode | 1.25.1       |
| Server | Ubuntu 16.04 |

- vscode가 깔린 windows pc에서 진행

## Client(windows) 설정

1. `Remote VSCode` 플러그인 설치

### 문제 해결

1. terminal에서 인코딩이 깨지는 문제 해결

```
"terminal.integrated.shellArgs.windows": ["-NoExit", "/c", "chcp.com 65001"],
```
VSCode 설정 화면에서 위와 같은 설정 추가

## Server(linux) 설정

1. `rmate` 설치

```
# rmate 설치
cd /use/local
mkdir rmate
cd ./rmate

wget https://raw.github.com/aurora/rmate/master/rmate

...
# /.bashrc 수정
# 맨 마지막에 추가
export PATH=$PATH:/usr/local/rmate
```

### 문제 해결

1. client에서 server 접속시 `no kex alg`에러 발생

```
# vi /etc/ssh/sshd_config
KexAlgorithms diffie-hellman-group1-sha1

# restart sshd
systemctl restart sshd
```

`/etc/ssh/sshd_config` 파일에 위와 같은 명령어 추가후 재실행

## 실행

**In VSCode terminal**
```
# 접속
ssh -R 52698:localhost:52698 <REMOTE_SERVER_USER>@<REMOTE_SERVER_URL>

# 파일 실행
rmate /home/ymtech/extract/archive.py
```

- `52698`은 `Remote VSCode`에서 사용하는 기본 포트, 변경을 원하면 VSCode 설정에서 `remote.port`값 수정

