---
layout: post
title: "SSH key를 사용하여 git 인증을하는 방법 (gitlab)"
date: 2020-02-07
categories: [DevOps, Git]
tags: [git, gitlab, ssh]
comments: true
---

# Why ??

> 회사 내에서 사용하는 gitlab의 pwd 유효기간이 3달이라서, <br/>
> 3달마다 gitlab의 source를 받는 서버의 gitlab pwd를 일일히 바꿔줘야하는 번거로움을 해결하기 위해서 ssh를 사용한 인증방법 테스트

## 1. SSH Key 생성

```shell
$ ssh-keygen -t rsa -C "gitlab.ymtech" -b 4096
Generating public/private rsa key pair.
Enter file in which to save the key (/home/mjyoun/.ssh/id_rsa): /home/mjyoun/Utils/ssh/id_rsa.gitlab.ymtech
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/mjyoun/Utils/ssh/id_rsa.gitlab.ymtech.
Your public key has been saved in /home/mjyoun/Utils/ssh/id_rsa.gitlab.ymtech.pub.
The key fingerprint is:
SHA256:kv+LL2MUQYAPJw8wvBz/Xr31JtaefE8P7DRXILVRQvg gitlab.ymtech
The key's randomart image is:
+---[RSA 4096]----+
| .o. ..o.    o=..|
|  o.= . .   .. + |
| . + B   .  ..o  |
|  o . o..    .E. |
|     .o So      .|
|      .oo . ..  .|
|     . o.  o o= o|
|      . +o. o++*o|
|       ..++o +=.+|
+----[SHA256]-----+

```
 - `ssh-keygen` 명령어를 사용하여 새로운 key 생성

### 입력 데이터 설명

1. `Enter file in which to save the key (/home/mjyoun/.ssh/id_rsa): /home/mjyoun/Utils/ssh/id_rsa.gitlab.ymtech`
    - `/home/mjyoun/Utils/ssh` 디렉토리 밑에 `id_rsa.gitlab.ymtech`이라는 이름으로 key 파일 생성
    - 입력을 안할시 기본값 위치에 파일 생성 `(/home/mjyoun/.ssh/id_rsa)`
2. `Enter passphrase (empty for no passphrase): `
    - key 사용시 입력할 패스워드 입력

### 결과 확인

생성이 완료된 후에 설정한 위치(`/home/mjyoun/Utils/ssh`)에 설정한 이름(`id_rsa.gitlab.ymtech`)의 2개의 파일이 생성됨

```shell
$ ls
id_rsa.gitlab.ymtech  id_rsa.gitlab.ymtech.pub
```

## 2. gitlab에 key 등록

생성된 2개의 key 값중 `*.pub`의 데이터를 확인

```shell
$ cat id_rsa.gitlab.ymtech.pub 
ssh-rsa UsCyXWby4MBfKAk29kGostWPTNMNepp0uBJPUi6lmvMOfAvIhO03Uy1tSLR4HrtdmmWpmf59l6xmCioiLHTPMRiWvXSXrVpSxzHswzkal2ZnoRRe6qFLjimfIPvRjTDVfQAEyPAFK/AHBT2GNC7WF42As6Qwpst5sbFogVVMuBGV6oFViVXDBkjK7zmbggjoFwY4/xfQqi9+8bpljKJUEDTOXLbAuExTX3epEOA7IDuLsY7PkiEbj2u7lMxO6oFqvLvkdcOlxK9tAC2FQWj+wBBBhX42uZ9W6GiPuQlWtZVHL7H3ykQpcMPUZlYZGEDTFwPTJQAIjnpHo3FHI3MwBwT9WBN5reWPYFke0gbO0Jv59fV1dCdud/oEXtxl/n7CVB5okQuq+ISCdoLPmgIGrdDDzvM6UHw== gitlab.ymtech
```

해당 값을 복사하여 "gitlab.co.kr >> User settings >> SSH 키" 화면에 입력

![이미지_1581055194001.png](/assets/imgs/2020-02-07/이미지_1581055194001.png)

## 3. SSH config 설정

```shell
$ vim ~/.ssh/config
```

```
Host gitlab.ymtech.co.kr # gitlab.ymtech.co.kr 페이지에 대해서 인증
        User git # 아이디
        IdentityFile /home/mjyoun/Utils/ssh/id_rsa.gitlab.ymtech # 파일 이름 (.pub파일이 아닌 파일로 설정)
        IdentitiesOnly true # ??
        Preferredauthentications publickey # ??
```

만약 실행시 `~/.ssh/config`의 권한이 없다고 에러가 발생할 경우

```
chmod 600 ~/.ssh/confg
```

위와 같이 실행 권한을 변경해주면 된다.

## 4. git clone

gitlab repository에서 지원하는 clone 방식중 하나인 ssh 방식의 url을 복사하여 git clone

![이미지_1581055413001.png](/assets/imgs/2020-02-07/이미지_1581055413001.png)

```shell
$ git clone git@gitlab.ymtech.co.kr:beeai/beeai-webtoolkit-2020.git
```

## 5. (추가) 접속시 마다 passphrase를 입력하지 않도록하는 설정

생성한 key 파일을 ssh에 등록하면 key 파일을 사용할 때마다(pull/push 등등) passphrase를 입력하지 않아도 된다.

```shell
$ ssh-add /home/mjyoun/Utils/ssh/id_rsa.gitlab.ymtech
Enter passphrase for /home/mjyoun/Utils/ssh/id_rsa.gitlab.ymtech: 
Identity added: /home/mjyoun/Utils/ssh/id_rsa.gitlab.ymtech (/home/mjyoun/Utils/ssh/id_rsa.gitlab.ymtech)
```

## ※※참고.

회사내에서 사용중인 gitlab은 공인인증서가 아닌 사설(let's encrypt) 인증서를 사용하기 때문에 추가 설정이 필요하다.

```shell
$ git config --global http.sslVerify false
```

 - 인증서 유효성(?)을 확인하지 않는 설정
