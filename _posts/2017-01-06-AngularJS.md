---
layout: post
title: "AngularJS ?"
date: 2017-01-06
excerpt: "기본적인 AngularJS 문법"
tags: [angularJS, angular, javascript framework, grammar]
comments: true
---

## AngularJS?

 > 2009년 Miško Hevery과 Adam Abrons에 의해 개발된 MVC 웹 프레임워크로, SPA 형태의 웹 어플리케이션을 빠르게 개발할 수 있도록하는 Library

## 장점

- 유지보수가 쉽다, 개발속도가 빠르다.
- 간편한 데이터 바인딩을 통해 뷰 업데이트가 쉽다.
- 코드 패턴이 동일해 개인간 차이에 따른 결과물의 차이가 적다. 코드량이 감소한다.
- SPA 개발에 최적화되어 있다.
- 기능적인 분리가 명확해 협업이 쉽다.

## 문법

### ng-app

> AngularJS application Define

### ng-medol

> value of HTML controls(input, select, textarea)
> input value validate check

### ng-bind

> application data to the HTML view

### ng-init

> initialize AngularJS application variables

```html
<div ng-app="" ng-init="firstName='John';">
  ...
</div>
```

### {{ expression }}

### ng-controller

> define the controller

```html
<script>
  var app = angular.module('myApp', []); <!-- creating module -->
  app.controller('myController', function($scope) { <!-- adding controller -->
    $scope.firstName = "John";
  });
</script>
```

### Directive

```html
<div ng-app="myApp" w3-test-directive>
  ...
</div>
...
<script>
  app.directive("w3TestDirective", function(){
    return {
      restrict: "A",
      template: "Hello World!"
    };
  });
</script>
```

**restrict option**

 - E: element name
 - A: attribute
 - C: class name
 - M: comment `<!-- directive:w3-test-directive -->`

### ng-repeat

> repeats an HTML element

```html
<ul>
  <li ng-repeat="x in names">{{ x }}</li>
</ul>
```
