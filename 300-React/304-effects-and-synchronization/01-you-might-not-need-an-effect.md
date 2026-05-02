# Step 4. Effects and Synchronization | 이펙트와 동기화

## 목표

- effect가 필요한 경우와 필요 없는 경우를 구분할 수 있다.
- 렌더 계산, 이벤트 처리, 외부 동기화를 분리할 수 있다.

## 읽을 것

- [You Might Not Need an Effect - 영문](https://react.dev/learn/you-might-not-need-an-effect)
- [Effect가 필요하지 않을 수도 있습니다 - 한글](https://ko.react.dev/learn/you-might-not-need-an-effect)
- [Lifecycle of Reactive Effects - 영문](https://react.dev/learn/lifecycle-of-reactive-effects)
- [반응형 Effect의 생명주기 - 한글](https://ko.react.dev/learn/lifecycle-of-reactive-effects)

## 예시 코드

- [02-example-effects-and-synchronization.tsx](./02-example-effects-and-synchronization.tsx)
- 추천 실행 방법: [docs/react/01-실행가이드.md](../01-실행가이드.md)를 따라 `StackBlitz React 템플릿`의 `App.tsx`에 붙여넣어 실행하는 방법을 가장 추천합니다.

## 학습 포인트

- effect는 외부 세계와 동기화할 때 사용한다.
- 계산 가능한 값은 render에서 계산한다.
- 사용자 이벤트의 결과는 이벤트 핸들러에서 처리하는 것이 우선이다.
- effect dependency는 "개발자가 고르는 옵션"이 아니라 "reactive value에 대한 설명"에 가깝다.

## 미션

1. effect로 계산하던 값을 render 계산으로 바꾸는 예제를 만든다.
2. effect에서 하던 이벤트성 로직을 클릭 핸들러로 옮기는 예제를 만든다.
3. timer 또는 event listener를 등록하고 cleanup을 실험한다.

## 프로젝트 연결 연습

- 현재 프로젝트에서 validator 호출, 에러 메시지 계산, 카드 브랜드 판별 중 effect가 필요한 것이 있는지 검사한다.
- "입력값이 바뀌면 브랜드를 effect로 setState 해야 하는가?"를 글로 답한다.
- form 제출 기능을 추가한다고 가정하고, 어떤 로직이 이벤트 핸들러에 들어가야 하는지 적는다.

## 완료 기준

- "effect는 무엇을 위한 escape hatch인가"를 설명할 수 있다.
- "파생값을 effect로 state 동기화하면 왜 코드가 꼬이기 쉬운가"를 설명할 수 있다.
