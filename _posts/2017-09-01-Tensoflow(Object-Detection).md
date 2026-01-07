---
layout: post
title: "Tensorflow - Obejct Detection"
date: 2017-09-01
excerpt: "Tensorflow를 사용한 Object Detection"
categories: [AI, Python]
tags: [tensorflow, object detection]
comments: true
---

# Tensorflow ?

 > 기계 학습과 딥러닝을 위해 구글에서 만든 오픈소스 라이브러리

# Object Detection ?

 > AI를 통해 사물을 자동으로 인식하는 기술

# 사용법

[사용 예제](https://bcho.tistory.com/1192)

### 1. Python 라이브러리 설치

```sh
pip install pillow
pip install lxml
pip install matplotlib
pip install jupyter


export TF_BINARY_URL=https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-1.3.0-cp27-none-linux_x86_64.whl
pip install -U $TF_BINARY_URL

pip install -U tensorflow
```

 - python 2.x 기준

### 2. git clone

```sh
git clone https://github.com/tensorflow/models
```

### 3. Path 설정

```sh
vi ~/.bashrc
```

```sh
export PYTHONPATH=$PYTHONPATH:{git_clone_folder}/models: {git_clone_folder}/models/slim
export PATH=$PATH: {git_clone_folder}/models: {git_clone_folder}/models/slim
```

### 4-1. protobuf-compiler 3.3 설치

```sh
cd {git_clone_folder}
mkdir protoc_3.3
cd protoc_3.3
wget wget https://github.com/google/protobuf/releases/download/v3.3.0/protoc-3.3.0-linux-x86_64.zip
chmod 775 protoc-3.3.0-linux-x86_64.zip
unzip protoc-3.3.0-linux-x86_64.zip
```

### 4-2. Protocol Buffer 컴파일

```sh
cd {git_clone_folder}/models/
{git_clone_folder}/protoc_3.3/bin/protoc object_detection/protos/*.proto --python_out=.
```

### 5. 테스트

```sh
python object_detection/builders/model_builder_test.py
```

### 6. 모델 설치

```sh
wget https://download.tensorflow.org/models/object_detection/ssd_mobilenet_v1_coco_11_06_2017.tar.gz
tar -xvzf ssd_mobilenet_v1_coco_11_06_2017.tar.gz
```

**모델 목록**

|Speed|주소|
|---|---|
|fast|<https://download.tensorflow.org/models/object_detection/ssd_mobilenet_v1_coco_11_06_2017.tar.gz>|
|fast|<https://download.tensorflow.org/models/object_detection/ssd_inception_v2_coco_11_06_2017.tar.gz>|
|medium|<https://download.tensorflow.org/models/object_detection/rfcn_resnet101_coco_11_06_2017.tar.gz>|
|medium|<https://download.tensorflow.org/models/object_detection/faster_rcnn_resnet101_coco_11_06_2017.tar.gz>|
|slow|<https://download.tensorflow.org/models/object_detection/faster_rcnn_inception_resnet_v2_atrous_coco_11_06_2017.tar.gz>|

### 7. Jupyter 설정

```sh
# 설정 파일 생성
sudo jupyter notebook --generate-config --allow-root
vi ~/.jupyter/jupyter_notebook_config.py
```

```sh
# 아래 변수의 주석을 풀고 localhost를 0.0.0.0으로 변경한다.
c.NotebookApp.ip = 'localhost' --> c.NotebookApp.ip = '0.0.0.0'
```

### 8. Jupyter 실행

```sh
sudo jupyter notebook --allow-root &
```