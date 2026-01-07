---
layout: post
title: "Git repository auto deploy shell"
date: 2020-03-09
tags: [bash shell, shell, git]
comments: true
---

## Why??

 - 회사에서 프로젝트를 개발하고 배포함에 있어서, 편하게 할수 있도록하는 배포용 shell 개발
 - 또한 commit후 배포하지 않아도 새벽마다 재배포 할 수 있는 cron 작성
 - 주로 java 기반의 maven 프로젝트를 위주로 개발하기 때문에 이를 위한 shell이다.
 - maven 빌드 후의 결과로 떨어지는 `deploy.sh`을 실행하면 서비스 파일 위치, 서비스 등록 등의 배포 작업을 해준다.
 - `deploy.sh`은 직접 개발한 것이 아니라 현재 팀의 팀장님께서 개발한 내용으로 팀장님께 문의 후, 기회가 되면 포스팅할 예정

## deploy.sh

```bash
#!/bin/bash

usage() {
    echo
    echo ">>> CALLED BY [[ $1 ]]"
    echo
    echo "[Usage]"
    echo
    echo "./update.sh -c <configuration> [-p|--profile] <profile-name> [-f|--force] [-rgd|--remove-git-directory]"
    echo
    echo "[Option]"
    echo " -c: 설정파일 경로"
    echo " -p, --profile: springboot profile name"
    echo " -f, --force: commit된 내용이 없어도 배포를 실행함"
    echo " -rgd, --remove-git-directory: 배포가 끝난 후 clone받은 git-directory를 삭제함"
    echo " -h, --help: 도움말"
    echo
}


# 파라미터가 없는 경우 종료
if [ "$1" == "" ];
then
    usage "No Paramters."
    exit 1
fi


## 파라미터 읽기
while [ "$1" != "" ]; do
    case $1 in
    -c)
        shift
        CONFIG_FILE=$1
        ;;
    -p | --profile)
        shift
        PROFILE=$1
        ;;
    -f | --force)
        shift
        IS_FORCE=true
        ;;
    -h | --help)
        usage "--help"
        exit 0
        ;;
    -rgd | --remove-git-directory)
        shift
        REMOVE_GIT_DIRECTORY=true
        ;;
    *)
        usage "Invalid option. option: $1"
        exit 1
        ;;
    esac
    shift
done


## 설정파일 읽기
prop() {
    grep -v -e "^#" ${CONFIG_FILE_PATH} | grep -w "${1}" | cut -d "=" -f2-
}

## 있어보이기 위한 sleep
set_to_look_great() {
    sleep 0.3
}

## 설정파일이 전달되지 않은 경우 종료
if [ -f "$CONFIG_FILE" ];
then
    echo "[Configurations] $CONFIG_FILE FOUND!"
else
    echo "[Configurations] $CONFIG_FILE NOT FOUND!"
    usage "No Configuration file"

    exit 1
fi

## PROFILE이 전달되지 않은 경우 종료
if [ -z "$PROFILE" ];
then
    echo "[Profile] $PROFILE NOT FOUND!"
    usage "No Profile"

    exit 1
else
    echo "[Profile] $PROFILE FOUND!"
fi

################ 서비스 로직 시작

echo "========================================================="

#
# !!!! 주의 !!!!
# config 값은 최초에 전부 불러와야함!
# config file의 경로를 상대 경로로 받고 있고, 중간에 디렉토리 변경이 있기 때문에,,
#
# START
#

# 현재 위치 저장
# 배포가 끝난뒤 현재 위치로 오기 위함
CURRENT_LOCATION=$(pwd)

# CONFIG FILE 위치
CONFIG_FILE_PATH=$CONFIG_FILE


# git repository를 저장할 directory 정보
REPOSITORY_PATH=$(prop 'git_directory')

# git 정보
GIT_REPOSITORY_URL=$(prop 'git_repository_url')
GIT_BRANCH=$(prop 'git_repository_branch') # git branch 정보
GIT_ID=$(prop 'git_id')
GIT_PASSWORD=$(prop 'git_password')

# maven 실행 command
MVN_EXECUTE_COMMAND=$(prop 'mvn_execute_command')" -Dbuild.profile=$PROFILE"

# maven 실행 결과 directory
MVN_EXECUTE_RESULT_DIRECTORY=$REPOSITORY_PATH/$(prop 'mvn_execute_result_directory')"/$PROFILE"

# 서비스 실행 command
SERVICE_EXECUTE_COMMAND=$(prop 'service_execute_command')

#
#
# E N D
#
#

echo
echo
echo "REPOSITORY_PATH: " $REPOSITORY_PATH
echo

if [ -d "$REPOSITORY_PATH" ];
then # 01-1. repository가 있을 경우 pull받음.
    echo "[GIT] repository is founded"

    echo
    echo "[Linux] cd repository ('$REPOSITORY_PATH')"
    cd $REPOSITORY_PATH
    echo

    set_to_look_great

    echo
    echo "[GIT] switch branch to '$GIT_BRANCH'"
    git checkout $GIT_BRANCH
    echo

    set_to_look_great

    echo
    cd $REPOSITORY_PATH
    echo "[GIT] pull"
    GIT_PULL_RESULT=`git pull`
    echo
else # 01-2. repository가 없을 경우 clone 받음
    echo "[GIT] repository is not founded"

    set_to_look_great

    echo
    echo "[GIT] GIT_REPOSITORY_URL:" $GIT_REPOSITORY_URL

    set_to_look_great

    echo
    echo "[GIT] disable global http.sslVerify in git"
    git config --global http.sslVerify false
    echo

    set_to_look_great

    echo
    echo "[GIT] clone"
    echo
    git clone https://$GIT_ID:$GIT_PASSWORD@$GIT_REPOSITORY_URL $REPOSITORY_PATH
    echo

    set_to_look_great

    echo
    echo "[Linux] cd repository ('$REPOSITORY_PATH')"
    cd $REPOSITORY_PATH
    echo

    set_to_look_great

    echo
    echo "[GIT] switch branch to '$GIT_BRANCH'"
    git checkout $GIT_BRANCH
    echo
fi

echo
echo "[GIT] force update:" $IS_FORCE
echo "[GIT] git pull result:" $GIT_PULL_RESULT

# git에서 pull 받은 내용이 있는지 확인
if [[ $IS_FORCE ]] || ([[ $GIT_PULL_RESULT != "Already up-to-date." ]] && [[ $GIT_PULL_RESULT != "Already up to date." ]]);
then # 배포 실행
    echo
    echo "[MVN] execute maven command"
    echo "[MVN] command:" $MVN_EXECUTE_COMMAND
    $MVN_EXECUTE_COMMAND
    echo

    set_to_look_great

    # 배포 폴더가 있을 경우 진행
    if [ -d "$MVN_EXECUTE_RESULT_DIRECTORY" ];
    then
        echo
        echo "[Linux] cd deploy directory('$MVN_EXECUTE_RESULT_DIRECTORY' -Dspring.profile=$PROFILE)"
        cd $MVN_EXECUTE_RESULT_DIRECTORY
        echo

        set_to_look_great

        echo
        echo "[Service] execute service"
        echo "[Service] execute command('$SERVICE_EXECUTE_COMMAND' --profile=$PROFILE)"
        $SERVICE_EXECUTE_COMMAND
        echo
    else
        echo
        echo " !!! mvn_execute_result_directory('$MVN_EXECUTE_RESULT_DIRECTORY') NOT FOUND !!!"
        echo
    fi
else # 배포 중단
    echo
    echo "Alreay up to date."
    echo
fi

cd $CURRENT_LOCATION

if [[ $REMOVE_GIT_DIRECTORY ]] && [[ -d "$REPOSITORY_PATH" ]];
then # git directory 삭제 명령이 있으면 삭제
    echo
    echo "[Linux] rm repository('$REPOSITORY_PATH')"
    rm -rf $REPOSITORY_PATH
    echo

    set_to_look_great
fi

echo "-------------------------------------------"
echo "-------------------------------------------"
echo "-------------------------------------------"
echo
echo "Bye~"

```

## properties

```properties
# git repository 주소 (protocol은 제외하고 작성해야함)
# clone시 id:password@url 형태로 만들기 때문에
git_repository_url=gitlab.ymtech.co.kr/test/test.git

# git branch 정보
git_repository_branch=master

# git 계정정보
git_id=id
git_password=password

# git clone 받은 repository를 저장할 directory 
# 절대 경로로 설정
git_directory=/root/deploy/test-repository

# mvn 실행 명령어
# mvn_execute_command=mvn clean package
mvn_execute_command=mvn clean package

# mvn 실행 후 결과 directory
mvn_execute_result_directory=deploy

# service 실행 command
# 'mvn_execute_result_directory' 안에서 실행할 명령어
service_execute_command=./deploy.sh
```

## crontab

```bash
# 매일 새벽 1시 59분에 cron 동작 log를 남기기 위한 directory를 생성
59 1 * * * mkdir -p /opt/<service>/logs/cron_log

# 매일 새벽 2시에 배포하고, 로그를 남기는 cron 설정
0 2 * * * /root/deploy/deploy.sh -c /root/deploy/service.conf >> /opt/<service>/logs/deploy/service_$(date +\%Y\%m\%d\%H\%M\%S).log 2>&1

# 매일 새벽 2시 1분에 작성일 기준 28일이 지난 log를 삭제하는 cron 설정
1 2 * * * (/opt/<service>/logs/deploy/* -ctime + 28 -exec rm -rf {} \;)
```


