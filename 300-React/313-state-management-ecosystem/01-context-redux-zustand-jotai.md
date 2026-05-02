# Step 13. State Management Ecosystem | 상태 관리 도구의 흐름

## 목표

- Context, Redux, Zustand, Jotai가 각각 어떤 문제를 풀려고 나왔는지 이해한다.
- "유행하는 도구"가 아니라 "구독 구조와 상태 모델"로 비교할 수 있다.

## 읽을 것

- [Passing Data Deeply with Context - 영문](https://react.dev/learn/passing-data-deeply-with-context)
- [Context로 데이터를 깊게 전달하기 - 한글](https://ko.react.dev/learn/passing-data-deeply-with-context)
- [Scaling Up with Reducer and Context - 영문](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [Reducer와 Context로 확장하기 - 한글](https://ko.react.dev/learn/scaling-up-with-reducer-and-context)
- [Redux Toolkit Quick Start](https://redux-toolkit.js.org/tutorials/quick-start)
- [Redux Toolkit Quick Start - 한국어 학습용 문서](../314-reference-ko/10-redux-toolkit-quick-start.md)
- [Zustand Introduction](https://zustand.docs.pmnd.rs/getting-started/introduction)
- [Zustand Introduction - 한국어 학습용 문서](../314-reference-ko/11-zustand-introduction.md)
- [Jotai Quick Start](https://jotai.org/docs/introduction)
- [Jotai Introduction - 한국어 학습용 문서](../314-reference-ko/12-jotai-introduction.md)

## 예시 코드

- [02-example-context-redux-zustand-jotai.ts](./02-example-context-redux-zustand-jotai.ts)
- 추천 실행 방법: [docs/react/01-실행가이드.md](../01-실행가이드.md)를 먼저 읽고, 이 파일은 store 개념을 콘솔로 관찰하는 학습용이므로 `TypeScript Playground` 또는 샌드박스의 일반 TS 파일에서 실행하는 방법을 추천합니다.

## 학습 포인트

- Context는 전달 도구이지 자동 최적화 도구가 아니다.
- Redux는 예측 가능한 단방향 업데이트와 중앙 store, 선택적 구독 모델을 제공했다.
- Zustand는 store API를 더 단순하게 만들고 선택적 구독을 쉽게 제공한다.
- Jotai는 atom 단위의 작은 상태 조합을 강조한다.

## 미션

1. 같은 shared counter를 Context, Redux 스타일, Zustand 스타일, Jotai 스타일로 간단히 흉내 낸다.
2. 각 방식의 구독 단위를 비교한다.
3. 리렌더링 범위가 어떻게 달라지는지 기록한다.

## 프로젝트 연결 연습

- 현재 프로젝트에 전역 상태 도구가 필요한지 판단한다.
- 필요 없다면 왜 없는지, 필요해지는 순간은 언제인지 적는다.
- 다단계 결제 플로우, 로그인, 장바구니, 서버 캐시가 추가된다면 어떤 도구가 후보가 될지 이유와 함께 적는다.

## 완료 기준

- "왜 상태관리 도구가 계속 바뀌는가"를 역사와 구조 관점에서 설명할 수 있다.
