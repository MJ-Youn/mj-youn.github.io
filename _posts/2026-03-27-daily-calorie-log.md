---
layout: post
title: "Daily Calorie Log — AI가 칼로리를 대신 계산해주는 건강 기록 앱"
date: 2026-03-27 09:00:00 +0900
categories: [Project, Web]
tags: [react, cloudflare, gemini-ai, health, typescript, side-project]
---

새해 들어서 다이어트를 결심했다. 누구나 생각하는 것 처럼,
예전에 PT를 받으면서 음식 먹은 것과 운동한 것을 기록하면서 다이어트를 한 기억이 있어서 이번에도 관련된 여러 앱을 찾아았다.

하지만 마음에 드는 앱이 없었고, 올해 Gemini를 결재해서 사용하면서 AI에 대화를 하나 만들고 기록하면 좋다는 글을 어디선가 본적이 있었다.
채팅을 하나 만들고, 3~4일 정도 사용을 해봤는데 이력을 저장해주고 있지만 그래프나 한눈에 보기는 힘들다는 생각이 들었다.

회사에 개발을 좋아하는 한 부장님이 자기가 하는 게임에 필요한 기능을 cloudflare를 통해 개발, 배포하는 내용을 해준게 기억이 나서

나도 AI를 통해서 사이트를 만들고 처음 cloudflare를 통해 사이트를 배포해보기로 마음 먹고 시작했다.

그래서 **자연어로 그냥 말하면 AI가 알아서 분석해주는** 칼로리 트래커를 직접 만들어봤다.

> 🌐 **서비스 URL**: [https://daily-calorie-log.pages.dev](https://daily-calorie-log.pages.dev)  
> 📦 **GitHub**: [MJ-Youn/daily-calorie-db](https://github.com/MJ-Youn/daily-calorie-db)

---

## 어떻게 동작하는가

입력창에 평소 말하듯 그냥 쓰면 된다.

```
아침에 사과 1개랑 계란 2개 먹었어
```

그러면 Google Gemini AI (1.5 Flash, 무료 버전)가 분석해서 음식별 칼로리와 단백질을 자동으로 기록한다.
운동도 마찬가지다.

```
저녁에 러닝 30분 뛰었어
```

입력하면 소모 칼로리가 자동 계산되어 일일 순 칼로리에 반영된다.

---

## 주요 기능

### 🤖 AI 자동 분석

핵심 기능이다. 자연어로 입력하면 음식 이름, 섭취량, 칼로리, 단백질을 Gemini 1.5 Flash가 추출한다.
직접 음식 DB를 검색하거나 칼로리를 알 필요가 없다. 그냥 일기 쓰듯 쓰면 된다.

### 📊 스마트 대시보드

- 오늘 섭취한 칼로리 / 단백질과 일일 권장량 대비 현황을 시각화
- 음식(FOOD)과 운동(EXERCISE)의 순칼로리를 자동 합산
- 입력된 로그 항목의 내용을 분석해서 커피, 러닝 등 적절한 아이콘을 동적으로 표시

### 📈 통계 및 트렌드

최근 7일 / 30일 / 전체 기간의 칼로리 섭취 추이를 선 그래프로 확인할 수 있다.
단순히 오늘 얼마나 먹었는지 뿐 아니라, 전반적인 식습관 패턴을 파악하는 데 유용하다.

### 🛡️ 보안 및 인증

- **Google OAuth 2.0** 로그인 — 별도 회원가입 없이 구글 계정으로 바로 사용
- **JWT 세션** 관리
- **Cloudflare Turnstile** 도입으로 봇 접근 및 무분별한 API 호출 차단

### 🌗 다크 모드 지원

라이트/다크 테마 전환을 지원한다. 밤에 기록할 때 눈이 덜 피로하다.

---

## 기술 스택

Cloudflare 생태계를 중심으로 구성했다. 별도 서버를 운영할 필요 없이 Pages + Functions + D1 조합으로 완전한 풀스택 앱을 만들 수 있다.

| 분류 | 기술 |
|------|------|
| **Frontend** | React 18, Vite, TypeScript |
| **Styling** | Tailwind CSS, Recharts (차트), Lucide React (아이콘) |
| **인증** | Context API + Jose (JWT) |
| **Hosting** | Cloudflare Pages |
| **Backend** | Cloudflare Pages Functions (Serverless) |
| **Database** | Cloudflare D1 (SQLite 기반 분산 DB) |
| **AI** | Google Gemini 1.5 Flash API |

서버 없이 Cloudflare의 Edge 네트워크에서 직접 실행되기 때문에 응답 속도가 빠르고 운영 비용도 거의 없다.

---

## 로컬에서 실행하기

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정 (.dev.vars)
cat > .dev.vars <<EOF
GOOGLE_CLIENT_ID="your_google_id"
GOOGLE_CLIENT_SECRET="your_google_secret"
GOOGLE_REDIRECT_URI="http://localhost:8788/api/auth/callback"
JWT_SECRET="your_local_secret"
GEMINI_API_KEY="your_gemini_key"
EOF

# 3. 로컬 DB 마이그레이션
npx wrangler d1 migrations apply daily-calorie-db --local

# 4. 개발 서버 실행
npm run start
```

개발 중에 실제 운영 데이터로 테스트하고 싶다면 `npm run db:pull`로 원격 데이터를 로컬로 가져올 수 있다.

---

## 배포

Cloudflare Pages에 한 줄로 배포한다.

```bash
npm run deploy
```

내부적으로 빌드 → 설정 적용 → 배포 → 원복이 자동으로 처리된다.

---

## 릴리즈 이력

> 📋 전체 릴리즈 이력은 GitHub에서 확인할 수 있다.  
> 👉 [MJ-Youn/daily-calorie-db Releases](https://github.com/MJ-Youn/daily-calorie-db/releases)

---

칼로리 계산이 귀찮아서 포기하는 분들에게 추천한다. AI가 계산해주니까 입력만 하면 된다.
