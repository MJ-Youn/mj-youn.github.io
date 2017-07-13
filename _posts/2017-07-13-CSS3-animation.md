---
layout: post
title: "CSS3 Animation"
date: 2017-07-13
excerpt: "CSS3에서 사용가능한 animation"
tags: [css, css3, animation]
comments: true
---

# 지원 브라우저

|Browser|Version|
|---|---|
|Chrome|43.0<br/>4.0 -webkit-|
|Internet Explorer|10.0|
|FireFox|16.0<br/>5.0 -moz-|
|Safari|9.0<br/>4.0 -webkit-|
|Opera|30.0<br/>15.0 -webkit-<br/>12.0 -o-|

# 문법

## keyframe

```css
@keyframes {
  from {

  }

  to {

  }
}
```

 - from: 시작 할 때의 css
 - to: 변경될 css

## animation-name

```css
animation-name: keyframename/none
```

 - keyframename: 선언되어 있는 keyframes의 id

## animation-delay

```css
animation-delay: time
```

 - time: s, ms의 값. 음수 일 경우 중간부터 시작(ex. 5s, 80ms, -2s)

## animation-duration

```css
animation-duration: time
```

 - time: s, ms의 값. 애니메이션이 동작하는 시간 설정

## animation-direction

```css
animation-direction: normal/reverse/alternate/alternate-reverse
```

 - normal: 정상적인 재생
 - reverse: 역재생
 - alternate: normal > reverse 순서로 진행
 - alternate-reverse: reverse > normal 순서로 진행

## animation-iteration-count

```css
animation-iteration-count: number/infinite
```

 - number: 반복할 횟수 설정
 - infinite: 영구 반복

 ## animation-play-state

 ```css
 animation-play-state: paused/running
 ```

  - paused: 애니메이션 중지
  - running: 애니메이션 중지한 시점 이후로 시작

## animation-timing-function

```css
animation-timing-function: linear/ease/ease-in/ease-out/ease-in-out/step-start/step-end/steps(int, start/end)/cubic-bezier(n,n,n,n)
```

애니메이션 동작 속도 설정

 - linear: 보통 속도로 설정
 - ease: 시작과 종료 속도를 늦춤. default value
 - ease-in: 시작 속도를 늦춤
 - ease-out: 종료 속도를 늦춤
 - ease-in-out: 시작과 종료 속도를 늦춤
 - step-start: ?
 - step-end: ?
 - step(int, start/end): ?
 - cubic-bezier(n, n, n, n): ?

## animation-fill-mode

```css
animation-fill-mode: none/forwards/backwards/both
```

애니메이션이 종료된 후에 property 결정

 - none: 스타일을 변경하지 않는다. default value
 - forwards: 애니메이션이 종료된 후의 스타일을 유지한다.
 - backwards: 애니메이션이 시작할 때의 스타일로 변경한다.
 - both: forwards, backwards의 중간 스타일로 변경한다 ??

## animation

```css
animation: name duration timing-function delay iteration-count direction fill-mode play-state;
```

 - 위의 순서대로 애니메이션을 설정한다.
