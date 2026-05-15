---
layout: post
title: "[React #01] React, Vite, Cloudflare Pages 및 Zustand 핵심 개념 정리"
date: 2026-05-15 15:00:00 +0900
excerpt: "최신 프론트엔드 생태계인 React, Vite와 Cloudflare Pages 배포 환경, 그리고 Zustand 상태 관리와 주요 React Hooks의 기본 사용법과 동작 원리를 정리합니다."
categories: [Frontend]
tags: [React, Vite, Cloudflare, Zustand, Hooks, Frontend]
comments: true
---

이전에 작성했던 거처럼 필요한 기능을 cloudflare로 만들고 배포하는 것을 해보았다.
Gemini를 사용해서 프로젝트를 만들면서, React를 잘 알고 싶다는 생각이 들어서 정리를 시작해본다.
우선 지금 사용한 기술스택에 대해서 정리를 해본다. 

---

## 1. 📚 용어 및 관련 설명

### ⚛️ React & ⚡ Vite
- **React**: 컴포넌트 기반으로 사용자 인터페이스(UI)를 구축하기 위한 JavaScript 라이브러리다. 상태(State)의 변화에 따라 필요한 화면의 일부분만 효율적으로 다시 렌더링하는 특징이 있다.
- **Vite**: 프랑스어로 '빠르다'는 뜻을 가진 프론트엔드 빌드 툴이다. 기존 Webpack 등에 비해 ES Modules를 활용해 개발 서버 구동 및 핫 모듈 교체(HMR) 속도가 압도적으로 빠르다.

### 🤠 Wrangler
- **Wrangler**: Cloudflare의 Workers 및 Pages 프로젝트를 관리하고 배포하기 위한 공식 CLI(명령어 인터페이스) 도구다. `npx wrangler pages dev` 등의 명령어를 통해 실제 클라우드 환경과 동일한 API 백엔드 환경을 로컬에서 시뮬레이션하고 테스트할 수 있게 해준다.

### 🚂 Express
- **Express**: Node.js 환경에서 가장 널리 쓰이는 빠르고 유연한 웹 서버 프레임워크다. 각종 라우팅이나 API, 미들웨어 구성 등을 매우 직관적인 코드로 작성할 수 있도록 도와준다.

---

## 2. ☁️ Cloudflare Pages (Functions 백엔드)

Cloudflare Pages는 정적 웹사이트 호스팅뿐만 아니라, `functions` 폴더를 통해 별도의 서버 없이 서버리스 API(백엔드)를 쉽게 구축할 수 있게 해준다. ✨

### 🛣️ 선언 방법 및 라우팅 규칙
프로젝트 루트의 `functions` 디렉토리 구조가 그대로 API의 URL 경로가 된다.
- **`[].ts` (동적 라우팅)**: 대괄호를 사용하면 동적 파라미터를 받을 수 있다. 예를 들어 `functions/api/share/[shareId].ts` 파일은 `/api/share/123` 같은 동적인 요청을 처리한다.

```ts
// functions/api/share/[shareId].ts
export async function onRequestGet(context) {
  const shareId = context.params.shareId;
  return new Response(`요청한 공유 ID: ${shareId}`);
}
```

- **`[[]].ts` (Catch-all 라우팅)**: 이중 대괄호를 사용하면 해당 경로 아래의 모든 깊이의 하위 경로를 한 번에 매칭할 수 있다.

### 🔑 주요 특수 파일
- **`index.ts`**: 해당 디렉토리의 기본(루트) 진입점 역할을 한다. 예를 들어 `functions/api/index.ts` 파일은 `/api` 경로로 들어오는 요청을 처리한다.
- **`_middleware.ts`**: 특정 디렉토리나 그 하위의 모든 라우팅으로 향하는 요청을 **가장 먼저 가로채서 처리**하는 미들웨어다. 주로 사용자 인증(Token 검사), CORS 헤더 추가 등에 사용된다.

---

## 3. 🐻 Zustand (상태 관리)

Zustand는 Redux 등에 비해 설정이 매우 간단하고 직관적인 가벼운 React 상태 관리 라이브러리다. 💡

### 🛠️ `create` 함수
- Zustand 스토어를 선언하고 만드는 함수다. 초기 상태값들과 상태를 변경하는 액션 함수들을 담은 하나의 객체를 반환하도록 구성한다.

```ts
import { create } from 'zustand';

interface StoreState {
  count: number;
  inc: () => void;
}

const useStore = create<StoreState>((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}));
```

### 🔄 `get` / `set` 함수의 사용법
스토어 내부에서 상태를 읽고 쓸 때 사용한다.
- **`get`**: 현재 스토어의 전체 상태 값을 읽어올 때 사용한다.
- **`set`**: 상태를 변경할 때 사용하며, 파라미터로 넘기는 방식에 따라 두 가지로 나뉜다.
  1. **JSON(객체)을 파라미터로 넘길 때**: `set({ count: 1 })` 처럼 넘기면, 기존 상태 객체와 얕은 병합(Shallow merge)을 수행하여 업데이트한다.
  2. **함수를 파라미터로 넘길 때**: `set((state) => ({ count: state.count + 1 }))` 처럼 넘기면, 직전의 최신 상태(`state`)를 보장받으며 이를 바탕으로 새로운 상태를 계산하여 반환할 수 있다.

### 💾 저장 위치
- Zustand의 상태는 기본적으로 브라우저의 **메모리(RAM)**에 저장된다. 따라서 새로고침을 하면 상태가 초기화된다. (단, `persist` 미들웨어를 함께 사용하면 LocalStorage 등에 자동으로 저장 및 복원시킬 수도 있다.)

---

## 4. 🪝 React 주요 Hooks 완벽 정리

### ♻️ useEffect
컴포넌트가 화면에 렌더링된 이후에 수행해야 하는 작업(Side Effect)을 처리한다. 주로 데이터 API 호출, 이벤트 리스너 등록 등에 쓰인다.

**배열(의존성 배열)의 형태에 따른 동작 방식**
1. **배열이 없을 때 (`useEffect(() => {...})`)**: 컴포넌트가 렌더링 될 때마다 매번 실행된다.
2. **빈 배열일 때 (`useEffect(() => {...}, [])`)**: 컴포넌트가 화면에 처음 나타날 때(Mount) 딱 1번만 실행된다.
3. **변수가 들어있을 때 (`useEffect(() => {...}, [A, B])`)**: 컴포넌트가 처음 나타날 때 실행되고, 이후 변수 `A`나 `B`의 값이 하나라도 변경될 때마다 다시 실행된다.

**의존성 변수는 항상 배열에 포함시켜야 하는 규칙 (exhaustive-deps)** 🚨
- `useEffect` 내부에서 사용하는 외부의 변수, 상태(State), 함수 등은 모두 의존성 배열에 명시해야 한다. 만약 빼먹는다면, `useEffect`는 해당 변수가 변경되었음을 알아채지 못하고 예전의 낡은 값을 참조하게 되어 심각한 버그를 유발할 수 있다.

```tsx
useEffect(() => {
  if (shareId) {
    fetchData(shareId); // 👈 shareId를 사용했으므로 반드시 배열에 넣어야 함!
  }
}, [shareId]); 
```

### 📦 useState
- 컴포넌트 내에서 변경될 수 있는 기억(상태)을 관리한다. `useState`를 통해 관리되는 데이터가 변경되면, React는 화면을 자동으로 다시 그린다(Re-render).

```tsx
const [count, setCount] = useState(0);

// 버튼 클릭 시 setCount가 호출되며 화면이 다시 그려짐
<button onClick={() => setCount(count + 1)}>{count}</button>
```

### 🧭 useNavigate
- `react-router-dom` 라이브러에서 제공하며, 사용자를 다른 페이지 주소(URL)로 코드를 통해 이동시킬 때 사용한다. (예: 로그인 성공 후 이동)

```tsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
const handleLogin = () => {
    // ... 로그인 로직 처리
    navigate('/travels'); // 성공 시 목록 페이지로 즉시 이동
};
```

### 🧠 useCallback
- 함수를 매번 렌더링할 때마다 새로 만들지 않고, 메모리에 기억(메모이제이션)해 두고 재사용하게 해주는 훅이다. 주로 `useEffect`의 의존성 배열에 함수를 넣어야 할 때, 무한 재실행 루프를 막기 위해 함수를 감싸는 용도로 사용한다.

```tsx
// shareId가 변하지 않는 이상, 컴포넌트가 다시 그려져도 이 함수는 새로 만들어지지 않음
const fetchSharedData = useCallback(async () => {
    const res = await fetch(`/api/share/${shareId}`);
    // ...
}, [shareId]); 
```

### 🔗 useParams
- URL의 동적 파라미터 값을 읽어올 때 사용한다. 라우터 설정이 `/board/:id` 라면, 주소창의 123 같은 값을 `const { id } = useParams()`로 뽑아낼 수 있다.

```tsx
import { useParams } from 'react-router-dom';

// 현재 브라우저 주소가 '/board/abc-123' 라면, id 변수에는 'abc-123'이 들어감
const { id } = useParams<{ id: string }>(); 
```

### 📌 useRef
- 특정 DOM 요소(예: `<input>`)에 직접 접근하고 싶을 때 사용한다.
- 또는 렌더링을 유발하지 않으면서 값이 변해도 기억되어야 하는 "조용한 변수"를 저장할 때도 널리 사용된다. (예: 타이머 ID 기억하기)

```tsx
import { useRef } from 'react';

const inputRef = useRef<HTMLInputElement>(null);

// 버튼 클릭 시 입력창으로 포커스 이동 (화면 렌더링은 발생 안 함)
const focusInput = () => inputRef.current?.focus();

<input ref={inputRef} />
<button onClick={focusInput}>입력창으로 이동</button>
```
