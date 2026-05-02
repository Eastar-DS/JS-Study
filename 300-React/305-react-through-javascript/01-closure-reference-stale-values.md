# Step 5. React Through JavaScript | JavaScript 관점에서 React 해석하기

## 목표

- React 코드를 클로저, 스코프, 참조 관점에서 해석할 수 있다.
- stale closure와 참조 동일성 문제를 이해한다.

## 읽을 것

- [State as a Snapshot - 영문](https://react.dev/learn/state-as-a-snapshot)
- [State as a Snapshot - 한글](https://ko.react.dev/learn/state-as-a-snapshot)
- [Queueing a Series of State Updates - 영문](https://react.dev/learn/queueing-a-series-of-state-updates)
- [Queueing a Series of State Updates - 한글](https://ko.react.dev/learn/queueing-a-series-of-state-updates)

## 예시 코드

- [02-example-closure-reference-stale-values.tsx](./02-example-closure-reference-stale-values.tsx)
- 추천 실행 방법: [docs/react/01-실행가이드.md](../01-실행가이드.md)를 따라 `StackBlitz React 템플릿`의 `App.tsx`에 붙여넣어 실행하는 방법을 가장 추천합니다.

## 학습 포인트

- 이벤트 핸들러는 해당 렌더 시점의 값을 캡처한다.
- 객체/배열/함수는 매 렌더마다 새 참조가 될 수 있다.
- 이 참조 변화가 props 비교, dependency array, memoization에 영향을 준다.

## 미션

1. setTimeout 안에서 이전 state가 캡처되는 예제를 만든다.
2. 같은 내용의 객체를 매 렌더마다 새로 만드는 경우와 바깥으로 빼는 경우를 비교한다.
3. 함수 prop이 자식 리렌더링에 미치는 영향을 관찰한다.

## 프로젝트 연결 연습

- `handleCardNumbersChange`, `handleExpirationDateChange`가 어떤 렌더의 값을 보고 있는지 설명한다.
- `placeholderArr`, `validator`, `onChange` 같은 props가 참조 안정성 측면에서 어떤 의미를 가지는지 분석한다.
- 현재 프로젝트에서 stale closure 가능성이 생길 만한 미래 기능을 2개 상상해 본다.

## 완료 기준

- "React에서 state 문제가 아니라 JavaScript closure 문제인 상황"을 구별할 수 있다.
