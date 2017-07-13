---
layout: post
title: "CSS3 Transition"
date: 2017-07-13
excerpt: "CSS3에서 사용가능한 transition"
tags: [css, css3, transition]
comments: true
---

# 지원 브라우저

|Browser|Version|
|---|---|
|Chrome|26.0<br/>4.0 -webkit-|
|Internet Explorer|10.0|
|FireFox|16.0<br/>4.0 -moz-|
|Safari|6.1<br/>3.1 -webkit-|
|Opera|12.1<br/>10.5 -o-|

# 문법

## trasition-delay

[예제](https://www.w3schools.com/cssref/css3_pr_transition-delay.asp)

```css
transition-delay: time;
```

 - time: s. transition이 동작할 때 지연 시간을 설정한다.

## transition-duration

[예제](https://www.w3schools.com/cssref/css3_pr_transition-duration.asp)

```css
transition-duration: time;
```

 - time: s. transition이 동작할 시간을 설정한다.

## transition-property

[예제](https://www.w3schools.com/cssref/css3_pr_transition-property.asp)

```css
transition-property: none/all/property
```

 - none: transition 효과를 주지 않는다.
 - all: 모든 properties에 transition 효과를 준다. default value
 - property: 특정 property에만 transition 효과를 준다.

## transition-timing-function

[예제](https://www.w3schools.com/cssref/css3_pr_transition-timing-function.asp)

```css
transition-timing-function: linear/ease/ease-in/ease-out/ease-in-out/step-start/step-end/steps(int, start/end)/cubic-bezier
```

효과의 속도를 조절한다.

 - linear: 같은 속도로 동작한다. default value
 - ease: 시작과 끝에 천천히 동작한다.
 - ease-in: 시작 할때 천천히 동작한다.
 - ease-out: 끝 날때 천천히 동작한다.
 - ease-in-out: 시작과 끝에 천천히 동작한다.
 - step-start: ?
 - step-end: ?
 - steps(int, start/end): ?
 - cubic-bezier(n, n, n, n): ?

## transition

[예제](https://www.w3schools.com/cssref/css3_pr_transition.asp)

```css
transition: property duration timing-function delay
```

 - 위의 순서대로 transition을 설정한다.
