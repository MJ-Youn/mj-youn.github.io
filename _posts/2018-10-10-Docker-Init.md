---
layout: post
title: "Docker Init"
date: 2018-10-10
excerpt: "Docker를 시작하기 위한 Docker 기본 사용법 및 명령어"
categories: [DevOps, Docker]
tags: [docker]
comments: true
---

## Docker??

### image

 - OS에서 program과 비슷한 의미
 - 실행하면 `container`가 된다.

### Container

 - `image`가 실행된 형태
 - 하나의 `image`가 여러개의 `container`가 될 수 있다.

## 환경

| OS                                | Kernel                         |
| --------------------------------- | ------------------------------ |
| Ubuntu 16.04.5 LTS (Xenial Xerus) | Linux 4.4.0-127-generic x86_64 |

| Docker Client/Server                   |
| -------------------------------------- |
| 18.06.1-ce 1.38 (minimum version 1.12) |


## 설치

**설치 스크립트**

```
sudo wget -qO- https://get.docker.com/ | sh
```


**서비스 실행**

```
sudo service docker start
```

**부팅했을 때 자동으로 실행하기**

```
sudo chkconfig docker on
```

## 명령어

| SCRIPT                       | DESCRIPTION                               |
| ---------------------------- | ----------------------------------------- |
| `docker ps`                  | Docker running container list             |
| `docker ps -a`               | Docker container list(contain terminated) |
| `docker search [image]`      | Search image                              |
| `docker pull [image:tag]`    | Pull remote image                         |
| `docker images`              | Local image lists                         |
| `docker rmi [image]`         | Remove local image                        |
| `docker run [image]`         | Run container                             |
| `docker stop [container id]` | Stop running container                    |
| `docker kill [container id]` | Kill running container                    |
| `docker rm [container id]`   | Remove container in `ps`                  |
| `docker logs [container id]` | Show container log                        |
| `docker exec [container id]` | Execute command in container              |

### `run`의 세부 옵션

> `docker run [options] [image] [command] [arg...]`

| Options                           | DESCRIPTION                                        |
| --------------------------------- | -------------------------------------------------- |
| `-p [container port]:[host port]` | Publish a container's port(s) to the host          |
| `-d`                              | Run container in background and print container ID |
| `--rm`                            | Automatically remove the container when it exits   |

### `log`의 세부 옵션

 > `docker logs [options] [container id]`

| Options    | DESCRIPTION                  |
| ---------- | ---------------------------- |
| `--tail #` | Show last # lines            |
| `-f`       | Show realtime container logs |

### `exec`의 세부 옵션

 > `docker exec [options] [container id] [command] [arg...]`

 | Options | DESCRIPTION                          |
 | ------- | ------------------------------------ |
 | `-i`    | Keep STDIN open even if not attached |
 | `-t`    | Allocate a pseudo-TTY                |

#### `docker stop`과 `docker kill`의 차이

- `docker stop`은 `container`에게 `SIGTERM`명령을 보낸다.
    - `SIGTERM`명령은 안전하게 프로세스를 종료하는 명령이다.
    - 프로세스가 interupt 할 수 없는 동작을 할경우 무시 할 수도 있다.
- `docker kill`은 `container`에게 `SIGKILL`명령을 보낸다.
    - `SIGKILL`은 프로세스를 당장 중단하라는 명령이다.
    - 프로세스는 이 명령을 무시 할 수 없다.


## Docker 이미지 만들기

### 명령어

|Command|option|DESCRIPTION|
|---|---|---|
|`FROM [image]:[tag]`|`neccessary`|Setting base image ([base image list](https://hub.docker.com/explore/))|
|`MAINTAINER [email`|`optional`|Email of the person managing|
|`COPY [src] [dest]`|`optional`|Copy file or directory. if `dest` does not exist, create file or directory|
|`ADD [src] [desc]`|`optional`|Similar `COPY`. `src` can be URL. if `src` is archive, uncompress it|
|`RUN [command]`|`optional`|Run ubuntu command. Run `/bin/sh -c [command]`|
|`CMD [command]`|`optional`|This command is executed after the docker container is executed. `CMD` run only last one|
|`WORKDIR [path]`|`optional`|Setting default directory path in which the command will be executed|
|`EXPOSE [port]`|`optional`|Setting listen port|
|`ENV [key] [value]`|`optional`|Setting env value. You can change the `-e` option when you run container|

#### Exmaple

**Shell Command**
```sh
# 1. ubuntu 설치 (패키지 업데이트)
apt-get update

# 2. ruby 설치
apt-get install ruby
gem install bundler

# 3. 소스 복사
mkdir -p /usr/src/app
scp Gemfile app.rb root@ubuntu:/usr/src/app  # From host

# 4. Gem 패키지 설치
bundle install

# 5. Sinatra 서버 실행
bundle exec ruby app.rb
```

**Dockerfile**
```sh
# 1. ubuntu 설치 (패키지 업데이트 + 만든사람 표시)
FROM       ubuntu:16.04
MAINTAINER subicura@subicura.com
RUN        apt-get -y update

# 2. ruby 설치
RUN apt-get -y install ruby
RUN gem install bundler

# 3. 소스 복사
COPY . /usr/src/app

# 4. Gem 패키지 설치 (실행 디렉토리 설정)
WORKDIR /usr/src/app
RUN     bundle install

# 5. Sinatra 서버 실행 (Listen 포트 정의)
EXPOSE 4567
CMD    bundle exec ruby app.rb -o 0.0.0.0
```

### Build Docker

*Dockerfile이 있는 위치에서 실행해야 한다.*

> `docker build [options] PATH | URL | -` <br/>
> ex> `docker build -t new-image:0.1 .`

 - `-t [name]:[tag]`: 새로운 이름과 태그로 생성한다.


### Push

> `docker tag [src image][:tag] [dest image][:tag]` <br/>
> ex> `docker tag ubuntu-python:16.04.2 yun0244/ubuntu-python:16.04.2`

> `docker push [options] [image tag]`
> ex> `docker push yun0244/ubuntu-python:16.04.2`

#### Image tag
> `[Registry URL]/[User Id]/[Image name]:[tag]`

 - `[Registry URL]`, `[User Id]` is optional.
 - `[Rehistry URL]` default `docker.io`
 - `[User Id]` defulat `library`

