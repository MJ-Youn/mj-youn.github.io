---
layout: post
title: "Spring Boot 배포 템플릿 프로젝트 소개 (build-template)"
date: 2026-03-26 17:30:00 +0900
categories: [DevOps, Spring Boot]
tags: [spring-boot, gradle, docker, deployment, shell-script, build-template, devops]
---

회사에서 Spring Boot 프로젝트를 새로 시작할 때마다 배포 환경 구성을 반복하는 것이 번거로웠다.
Gradle 빌드 설정, 환경별 설정 파일 분리, Linux 서비스 등록 스크립트, Docker 이미지 빌드 등
매 프로젝트마다 비슷한 내용을 처음부터 다시 만들었다.

이를 해결하기 위해 **Spring Boot 배포 자동화 보일러플레이트 프로젝트**를 만들어 공개했다.

> 📦 **GitHub 저장소**: [MJ-Youn/build-template](https://github.com/MJ-Youn/build-template)

---

## 어떤 문제를 해결하는가

Spring Boot 애플리케이션을 서버에 배포할 때 보통 이런 과정을 거친다.

1. `./gradlew build`로 JAR 생성
2. JAR 파일, 설정 파일, 실행 스크립트를 묶어서 서버로 전송
3. 서버에서 압축 해제 후 수동으로 서비스 등록 (systemd 또는 SysVinit)
4. Docker로 배포한다면 Dockerfile 작성 → 이미지 빌드 → 컨테이너 실행

이 과정들을 **Gradle 태스크와 Shell 스크립트로 완전히 자동화**한 것이 이 프로젝트의 핵심이다.

---

## 프로젝트 초기화: `init.sh`

새 프로젝트에 이 템플릿을 적용할 때 가장 먼저 실행하는 스크립트다.

```bash
./init.sh
```

프로젝트 이름, 그룹명, 포트 번호를 입력하면 `settings.gradle`, `build.gradle`, 각종 설정 파일 내의
placeholder(`@appName@` 등)가 일괄 치환된다. 매번 손으로 찾아서 바꿀 필요가 없다.

---

## 핵심 기능 1. 환경별 Overlay 빌드

`config/`와 `scripts/` 폴더는 **덮어쓰기 전략**을 따른다.

```
config/
├── application.yml       ← 공통 기본 설정
├── log4j2.yml
├── dev/
│   └── application-dev.yml   ← dev 환경 전용 (공통을 덮어씀)
└── prod/
    └── application-prod.yml  ← prod 환경 전용
```

빌드 시 `-Penv=prod`를 지정하면 `config/prod/` 내의 파일이 공통 파일보다 우선 적용된다.
소스 코드 변경 없이 파일 추가만으로 환경별 커스터마이징이 가능하다.

```bash
./gradlew package -Penv=dev   # 개발 환경 패키지 생성
./gradlew package -Penv=prod  # 운영 환경 패키지 생성
```

---

## 핵심 기능 2. 세 가지 배포 전략

### 📦 Strategy 0. Legacy (Java + Systemd)

Docker 없이 Java(JDK)만 설치된 서버에 배포하는 가장 기본적인 방식이다.

```bash
# 1. 빌드 (결과물: build/dist/{APP_NAME}-{version}-prod.dist.zip)
./gradlew package -Penv=prod

# 2. 서버로 전송 후 압축 해제
unzip {APP_NAME}-*.dist.zip -d {APP_NAME}
cd {APP_NAME}

# 3. 설치 (배포 방식 선택 → 설치 경로 → 로그 경로 입력)
sudo ./bin/install_service.sh
```

`install_service.sh`를 실행하면 **Legacy (Java 직접 실행)** 또는 **Docker** 방식 중 선택할 수 있다.
설치 경로와 로그 경로를 대화형으로 입력받고, Systemd 또는 SysVinit에 서비스를 자동 등록한다.

기존 설치 위치가 있으면 자동으로 감지해서 덮어쓰기 여부를 물어보기 때문에, **재배포 시에도 동일한 스크립트**를 사용하면 된다.

### 🐳 Strategy 1. 로컬 빌드 + 이미지 파일 전송

소스 코드나 Docker 빌드 환경을 서버에 구성하기 싫을 때 사용하는 방식이다.
로컬에서 Docker 이미지를 빌드하고 `.tar` 파일로 묶어서 서버에 전송한다.

```bash
# 1. 빌드 (이미지 빌드 + 배포 파일 Zip 생성)
./gradlew dockerBuild -Penv=prod

# 결과물: build/dist/{APP_NAME}-docker-prod.zip
# 포함 내용: image.tar + docker-compose.yml + install_docker_service.sh + config/
```

서버에서는 Zip을 풀고 `install_docker_service.sh`만 실행하면 Docker 이미지 로드부터 서비스 등록까지 자동으로 처리된다.

### 🐳 Strategy 2. 서버 빌드 (소스 전송)

소스 코드를 서버에 직접 올리고, 서버에서 이미지를 빌드하는 방식이다.
이미지 파일을 전송하지 않아도 되므로 네트워크 대역폭을 절약할 수 있다.

```bash
# 서버에서 실행
./gradlew dockerBuildImage -Penv=prod
cd build/docker-dist
sudo ./install_docker_service.sh
```

### ☁️ Strategy 3. Registry (Push & Pull)

Docker Hub, 사설 Registry 등 원격 저장소를 활용하는 CI/CD 표준 방식이다.

```bash
# 빌드 후 Registry로 Push
./gradlew dockerPushImage -Penv=prod -PdockerRegistry=my-registry.com/repo
```

Push가 완료되면 콘솔에 단계별 배포 명령어가 실제 이미지명으로 채워져 출력된다.

```
╔══════════════════════════════════════════════════════════════════╗
║  ✅  Docker 이미지 Push 완료                                     ║
╠══════════════════════════════════════════════════════════════════╣
║  🖼️   이미지  : my-registry.com/repo/app:1.0.0
║  [1] scp -r .../docker-dist/ user@your-server:/home/user/
║  [2] docker login my-registry.com
║  [3] docker pull my-registry.com/repo/app:1.0.0
║  [4-a] sudo ./install_docker_service.sh
╚══════════════════════════════════════════════════════════════════╝
```

`build/docker-dist/DEPLOY-GUIDE.md` 파일도 자동 생성되어, 폴더를 서버 담당자에게 전달하면 별도 설명 없이 바로 배포할 수 있다.

### ☸️ K8s (Kubernetes) 배포

Kubernetes 환경을 위한 매니페스트 YAML 파일도 자동으로 생성된다.

```bash
./gradlew k8sBuild -Penv=prod -PdockerRegistry=my-registry.com
# 결과물: build/dist/{APP_NAME}-k8s-prod.zip (deployment.yaml, service.yaml 등)
```

---

## 핵심 기능 3. 원스탑 배포 자동화: `build_deploy.sh`

서버에 소스 코드가 올라가 있는 Legacy/서버 빌드 환경에서, 반복 배포를 완전히 자동화한다.

```bash
./build_deploy.sh -Penv=dev
```

내부 동작:
1. `.git` 폴더가 있으면 `git pull`로 최신 코드 수신
2. `./gradlew package -Penv=<env>` 실행
3. 생성된 ZIP을 자동으로 찾아 압축 해제 후 `bin/install_service.sh` 실행

배포 담당자가 서버에서 한 줄만 실행하면 된다.

---

## 핵심 기능 4. 운영 스크립트 모음

`scripts/` 폴더에는 배포 이후 운영에 필요한 스크립트들이 기본 제공된다.

| 스크립트 | 설명 |
|---------|------|
| `start.sh` | JAR 실행 (Docker/일반 환경 자동 감지, PID 파일 관리) |
| `stop.sh` | 서비스 종료 (PID 기반, graceful stop) |
| `status.sh` | 실행 상태 및 포트 바인딩 확인 |
| `install_service.sh` | 서비스 설치 (Legacy/Docker 선택, Systemd/SysVinit 자동 감지) |
| `uninstall_service.sh` | 서비스 제거 및 설치 파일 정리 |
| `utils.sh` | 공통 로그 유틸리티 (컬러 출력, log_step, log_info 등) |

`start.sh`는 `.dockerenv` 파일 존재 여부로 Docker 환경을 자동 감지한다.
Docker라면 포그라운드로 실행(PID 1 유지), 일반 환경이라면 `nohup` 백그라운드로 실행한다.

---

## Dockerfile 구조

`eclipse-temurin:25-jdk-alpine` 베이스 이미지를 사용한다.
`latest` 대신 구체적인 버전을 명시하여 재현 가능한 빌드를 보장한다.

```dockerfile
FROM eclipse-temurin:25-jdk-alpine

WORKDIR /app

RUN apk add --no-cache bash

COPY libs/      /app/libs/
COPY config/    /app/config/
COPY bin/start.sh     /app/bin/start.sh
COPY bin/utils.sh     /app/bin/utils.sh
COPY bin/bootstrap.sh /app/bin/bootstrap.sh

RUN chmod +x /app/bin/*.sh

CMD ["./bin/start.sh"]
```

---

## 사용 가이드 요약

```bash
# 1. 초기화 (프로젝트 이름, 그룹, 포트 설정)
./init.sh

# 2. 사용 가능한 빌드 명령어 확인
./gradlew help

# 3. 환경별 빌드 및 배포 (원하는 방식 선택)
./gradlew package         -Penv=dev  # Legacy 배포
./gradlew dockerBuild     -Penv=dev  # Docker (로컬 이미지 파일 전송)
./gradlew dockerBuildImage -Penv=dev  # Docker (서버 빌드)
./gradlew dockerPushImage  -Penv=dev -PdockerRegistry=...  # Docker (Registry)
./gradlew k8sBuild         -Penv=dev  # Kubernetes

# 4. [서버에서] 반복 배포 자동화
./build_deploy.sh -Penv=dev
```

---

새 Spring Boot 프로젝트를 시작할 때 이 템플릿을 fork 해서 `init.sh`를 한 번 실행하면 배포 환경 구성 없이 바로 개발에 집중할 수 있다.
