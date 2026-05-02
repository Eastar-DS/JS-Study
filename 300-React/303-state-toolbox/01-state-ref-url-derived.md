# Step 3. State, Ref, URL, Derived State | 상태, Ref, URL, 파생 상태

## 목표

- 일반 변수, state, ref, query parameter, derived state를 구분할 수 있다.
- 어떤 값을 어디에 보관해야 하는지 기준을 세울 수 있다.

## 왜 필요한가

React 코드의 대부분의 복잡도는 "값을 어디에 둘지"에서 시작합니다.
이 기준이 없으면 중복 state, 불필요한 effect, 억지 추상화가 생깁니다.

## 읽을 것

- [State: A Component's Memory - 영문](https://react.dev/learn/state-a-components-memory)
- [State: A Component's Memory - 한글](https://ko.react.dev/learn/state-a-components-memory)
- [Sharing State Between Components - 영문](https://react.dev/learn/sharing-state-between-components)
- [컴포넌트 간 State 공유하기 - 한글](https://ko.react.dev/learn/sharing-state-between-components)
- [You Might Not Need an Effect - 영문](https://react.dev/learn/you-might-not-need-an-effect)
- [Effect가 필요하지 않을 수도 있습니다 - 한글](https://ko.react.dev/learn/you-might-not-need-an-effect)

## 예시 코드

- [02-example-state-ref-url-derived.tsx](./02-example-state-ref-url-derived.tsx)
- 추천 실행 방법: [docs/react/01-실행가이드.md](../01-실행가이드.md)를 따라 `StackBlitz React 템플릿`의 `App.tsx`에 붙여넣어 실행하는 방법을 가장 추천합니다.

## 학습 포인트

- 일반 변수: 렌더 간 보존되지 않음
- state: UI에 영향을 주고 렌더를 유발함
- ref: 렌더 간 보존되지만 렌더를 유발하지 않음
- URL 상태: 공유/복원/뒤로가기와 연결됨
- derived state: 원본 state/props에서 계산 가능한 값

## 미션

같은 기능을 4가지 방식으로 구현한다.

1. 일반 변수
2. `useState`
3. `useRef`
4. URL query parameter

예시 기능:
- 현재 탭 보관
- 검색어 보관
- input focus 대상 기억

## 프로젝트 연결 연습

- 아래 값을 각각 어디에 두는 게 맞는지 표로 정리한다.
  - 카드 번호
  - 카드 브랜드
  - CVC
  - 에러 메시지
  - 마지막으로 포커스된 input
  - 현재 스토리북 시나리오 이름
- 특히 `cardBrand`, `errorMessage`, `isError`가 저장형 state인지 계산형 값인지 분석한다.

## 완료 기준

- "모든 값을 state로 두면 안 되는 이유"를 설명할 수 있다.
- "ref를 쓰면 안 되는 경우"를 설명할 수 있다.
