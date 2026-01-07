---
layout: post
title: "CSS3 Transform"
date: 2017-07-13
excerpt: "CSS3에서 사용가능한 transform"
tags: [css, css3, transform]
comments: true
---

# 지원 브라우저

## transform 2D

|Browser|Version|
|---|---|
|Chrome|36.0<br/>4.0 -webkit-|
|Internet Explorer|10.0<br/>9.0 -ms-|
|FireFox|16.0<br/>3.5 -moz-|
|Safari|9.0<br/>3.2 -webkit-|
|Opera|23.0<br/>15.0 -webkit-<br/>10.5 -o-|

## transform 3D

|Browser|Version|
|---|---|
|Chrome|36.0<br/>12.0 -webkit-|
|Internet Explorer|12.0|
|FireFox|10.0|
|Safari|9.0<br/>4.0 -webkit-|
|Opera|23.0<br/>15.0 -webkit-|

# 문법

## transform

[예제](https://www.w3schools.com/cssref/css3_pr_transform.asp)

```css
transform: none/transform-functions
```

**transform-functions list**

 - none: transformation 효과를 주지 않는다.
 - matrix(n,n,n,n,n,n): 2D transformation 효과를 준다.
 - matrix3d(n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n): 3D transformation 효과를 준다.
 - translate(x,y): x, y축의 크기 만큼 위치를 옮긴다.
 - translate3d(x,y,z): x, y, z축의 크기 만큼 위치를 옮긴다.
 - translateX(x): x축의 크기 만큼 위치를 옮긴다.
 - translateY(y): y축의 크기 만큼 위치를 옮긴다.
 - translateZ(z): z축의 크기 만큼 위치를 옮긴다.
 - scale(x,y): x, y축으로 x, y크기 만큼 확대한다.
 - scale(x,y,z): x, y, z축으로 x, y, z크기 만큼 확대한다.
 - scaleX(x): x축으로 x크기 만큼 확대한다.
 - scaleY(y): y축으로 y크기 만큼 확대한다.
 - scaleZ(z): z축으로 z크기 만큼 확대한다.
 - rotate(angle): deg. angle만큼 회전시킨다.(시계방향)
 - rotate3d(x,y,z,angle): deg. x, y, z, angle만큼 회전시킨다.
 - rotateX(angle): x축으로 angle만큼 회전시킨다.
 - rotateY(angle): y축으로 angle만큼 회전시킨다.
 - rotateZ(angle): z축으로 angle만큼 회전시킨다.
 - skew(x-angle, y-angle): deg. x, y축으로 x-angle, y-angle만큼 평행이동 시킨다. (찌그러트린다.)
 - skewX(angle): deg. x축으로 angle만큼 평행이동 시킨다.
 - skewY(angle): deg. y축으로 angle만큼 평행이동 시킨다.
 - perspective(n): n만큼 원근감을 만든다.

## transform-orgin

[예제](https://www.w3schools.com/cssref/css3_pr_transform-origin.asp)

```css
transform-origin: x-axis y-axis z-axis
```

 - x-axis: x축으로 위치를 움직인다. (left, center, right, length, %)
 - y-axis: y축으로 위치를 움직인다. (top, center, bottom, length, %)
 - z-axis: z축으로 위치를 움직인다. (length)

## transform-style

[예제](https://www.w3schools.com/cssref/css3_pr_transform-style.asp)

```css
transform-style: flat/preserve-3d
```

3D로 겹치는 효과를 준다.

 - flat: 겹치기 효과를 주지 않는다. default value
 - preserve-3d: 겹치기 효과를 준다.
