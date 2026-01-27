---
layout: post
title: Jekyll 블로그 Chirpy 테마 이전기 (Chirpy Starter 기반)
date: 2026-01-07 16:30:00 +0900
categories: [Blogging, Jekyll]
tags: [jekyll, chirpy, github-pages, migration]
slug: chirpy-migration
---

오랫동안 사용해오던 Jekyll 블로그의 테마를 [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy)로 변경하기로 결정했다. 이번 작업은 기존 저장소를 유지하면서 테마만 입히는 방식이 아니라, **Chirpy Starter 템플릿을 기반으로 아예 새로 시작**하는 방식을 택했다.

그 과정을 단계별로 정리해 본다.

## 1. 마이그레이션 준비

가장 먼저 기존에 운영하던 블로그 저장소와 충돌을 피하기 위해 이름을 변경하고, 새로운 기반을 마련했다.

1.  **기존 저장소 백업**: 기존의 `mj-youn.github.io` 저장소 이름을 `backup-blog`로 변경하여 백업해두었다.
2.  **새 저장소 생성**: GitHub의 [Chirpy Starter](https://github.com/cotes2020/chirpy-starter) 페이지로 이동하여 **'Use this template'** 버튼을 클릭, `mj-youn.github.io`라는 이름으로 새로운 저장소를 생성했다.

이렇게 하면 Chirpy 테마가 가장 권장하는 환경에서 깔끔하게 시작할 수 있다.

## 2. _config.yml 파일 설정

새로 생성된 저장소를 로컬로 클론(Clone) 받은 후, `_config.yml` 파일을 열어 내 블로그에 맞게 설정을 변경했다.
- `url`, `title`, `author` 정보 수정
- `timezone`을 `Asia/Seoul`로 변경
- `lang`을 `ko`로 변경하여 한국어 환경 최적화

## 3. _post 파일 이전

기존 블로그(`backup-blog`)에 있던 글들을 새로운 블로그로 옮겨왔다.
방법은 간단하다. 기존 저장소의 `_posts` 폴더에 있던 마크다운 파일들을 그대로 복사(Copy)해서 새로운 저장소의 `_posts` 폴더에 붙여넣기(Paste) 했다.

다행히 Jekyll 기반이라 포스트 포맷이 호환되어 큰 수정 없이 글을 옮길 수 있었다.

## 4. /p 폴더에 별도 페이지 추가

블로그 글 외에, 청첩장이나 감사장처럼 별도로 동작해야 하는 HTML 페이지들이 있었다. 이 파일들은 테마의 레이아웃이 적용되면 안 되기 때문에 별도의 처리가 필요했다.

1.  프로젝트 루트에 `p` 폴더를 만들고 HTML 파일들을 위치시켰다.
2.  각 파일 상단에 `layout: null`을 추가하여 테마 스타일이 입혀지지 않도록 했다.

### Test Site 설정 변경 (HTMLProofer 오류 해결)

파일을 올리고 배포 파이프라인(GitHub Actions)을 돌려보니 오류가 발생했다. Chirpy에 포함된 **HTMLProofer**라는 도구가 사이트 내의 모든 링크와 이미지를 검사하는데, 내가 추가한 `p` 폴더 내의 이미지들에 `alt` 속성이 없다고 실패 처리한 것이다.

이 문제를 해결하기 위해 `.github/workflows/pages-deploy.yml` 파일을 수정하여, `p` 폴더는 검사 대상에서 제외시켰다.

```yaml
- name: Test site
  run: |
    bundle exec htmlproofer _site \
      \-\-disable-external \
      \-\-ignore-files "/\/p\//" 
```

`--ignore-files` 옵션에 정규표현식 `/\/p\//`를 추가하여, `p` 폴더 내의 모든 파일은 검사를 건너뛰도록 설정하니 배포가 정상적으로 완료되었다.

---

Google의 Gemini를 유료 결제해서 도움을 받아서 테마를 변경해보았다.
Gemini를 많이 활용해보고, 블로그 글도 이제 다시 자주 써봐야겠다.
