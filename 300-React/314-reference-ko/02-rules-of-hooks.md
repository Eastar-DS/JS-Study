# Rules of Hooks | 훅 규칙 학습용 한국어 문서

원문:
- https://react.dev/reference/rules/rules-of-hooks

## Rules of Hooks | 훅 규칙

Hook(훅)은 JavaScript 함수(function)로 정의되지만, React에서는 특별한 종류의 재사용 가능한 UI 로직(reusable UI logic)입니다.
그래서 "어디서 호출할 수 있는가"에 대한 제약(restrictions)이 있습니다.

핵심 규칙은 두 가지입니다.

1. 최상위(top level)에서만 Hook을 호출합니다.
2. React 함수(React function) 안에서만 Hook을 호출합니다.

## Only call Hooks at the top level | Hook은 최상위에서만 호출하기

이름이 `use`로 시작하는 함수는 React에서 Hook이라고 부릅니다.

다음 위치에서는 Hook을 호출하면 안 됩니다.

- loop(반복문)
- condition(조건문)
- nested function(중첩 함수)
- `try` / `catch` / `finally`

대신 아래처럼 사용해야 합니다.

- 함수형 컴포넌트(function component) 본문의 최상위
- 커스텀 훅(custom Hook) 본문의 최상위

또한 early return(조기 반환)보다 앞에서 호출해야 합니다.

왜 중요한가:
- React는 Hook 호출 순서(order)를 기준으로 각 state와 Effect를 연결합니다.
- 조건에 따라 Hook 호출 순서가 바뀌면 React는 어떤 Hook이 어떤 state 슬롯(slot)에 대응되는지 안정적으로 판단할 수 없습니다.

## Only call Hooks from React functions | Hook은 React 함수에서만 호출하기

일반 JavaScript 함수(regular JavaScript function)에서 Hook을 호출하면 안 됩니다.

허용되는 곳:
- React 함수형 컴포넌트(function component)
- 커스텀 훅(custom Hook)

이 규칙을 따르면 컴포넌트 안의 stateful logic(상태를 가지는 로직)이 소스 코드(source code)에 명확하게 드러납니다.

즉:
- 이 컴포넌트가 어떤 Hook을 쓰는지
- 어떤 상태(state)와 Effect를 가지는지

를 코드만 보고 추론하기 쉬워집니다.

## 학습 포인트

- Hook 규칙은 "스타일 가이드"가 아니라 동작 규칙입니다.
- Hook은 호출 순서가 안정적이어야 합니다.
- Hook은 React가 렌더링(rendering)하는 문맥(context) 안에서만 의미가 있습니다.
