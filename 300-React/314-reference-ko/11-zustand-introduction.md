# Zustand Introduction | Zustand 소개 학습용 한국어 문서

원문:
- https://zustand.docs.pmnd.rs/getting-started/introduction
- 보조 확인:
  - https://stackblitz.com/examples/react
  - https://github.com/pmndrs/zustand

## Zustand 소개

공식 소개 문서의 핵심 설명:

Zustand는 작고(small), 빠르고(fast), 확장 가능한(scalable) 상태 관리(state management) 솔루션입니다.
Hook 기반 API를 가지고 있고, 보일러플레이트(boilerplate)가 많지 않으며, 강한 의견(opinionated)이 많지 않지만 충분한 규칙(convention)을 제공해 명시적(explicit)이고 flux-like한 구조를 만들 수 있다고 설명합니다.

문서는 다음 문제들을 다루기 위해 많은 시간이 들어갔다고 말합니다.

- zombie child problem
- React concurrency
- mixed renderer 사이의 context loss

## First create a store | 먼저 store 만들기

문서의 대표 문장:

- "Your store is a hook!"

즉 store 자체가 Hook처럼 사용됩니다.

store 안에는 아래를 넣을 수 있습니다.

- primitive(원시값)
- object(객체)
- function(함수)

또한 `set` 함수는 state를 갱신(update)하며, 소개 문서는 `set`이 state를 병합(merge)한다고 설명합니다.

## Then bind your components | 그 다음 컴포넌트를 연결하기

공식 소개 문서는 provider 없이도 Hook을 어디서나 쓸 수 있다고 설명합니다.
컴포넌트는 원하는 state 조각(slice)을 선택(select)해서 읽고, 그 조각이 바뀌면 다시 렌더링됩니다.

즉:
- 전역 store를 만든다
- 컴포넌트에서 selector로 필요한 값만 구독한다

는 흐름입니다.

## 공식 문서가 강조하는 인상

- provider가 필수가 아님
- hooks가 주된 사용 방식
- 비교적 적은 코드로 전역 상태를 만들 수 있음
- selector 기반으로 필요한 부분만 읽는 구조가 중심

## 학습 포인트

- Zustand는 Context보다 더 세밀한 구독(subscribe) 구조를 제공하기 쉽습니다.
- Redux보다 더 가볍고 빠르게 시작할 수 있다는 인상을 주는 도구입니다.
