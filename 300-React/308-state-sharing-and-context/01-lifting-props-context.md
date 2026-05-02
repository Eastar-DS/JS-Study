# Step 8. State Sharing | State 공유: Lifting, Props Drilling, Context

## 목표

- state를 어디까지 끌어올릴지 판단할 수 있다.
- props drilling을 유지할지 context로 바꿀지 기준을 세운다.

## 읽을 것

- [Sharing State Between Components - 영문](https://react.dev/learn/sharing-state-between-components)
- [컴포넌트 간 State 공유하기 - 한글](https://ko.react.dev/learn/sharing-state-between-components)

## 예시 코드

- [02-example-lifting-props-context.tsx](./02-example-lifting-props-context.tsx)
- 추천 실행 방법: [docs/react/01-실행가이드.md](../01-실행가이드.md)를 따라 `StackBlitz React 템플릿`의 `App.tsx`에 붙여넣어 실행하는 방법을 가장 추천합니다.

## 학습 포인트

- shared state는 가장 가까운 공통 부모로 올리는 것이 기본이다.
- props drilling은 항상 나쁜 것이 아니다.
- context는 전달 편의성을 높이지만, 구독 단위가 거칠면 리렌더링 범위가 넓어질 수 있다.

## 미션

1. 3단계 깊이의 props 전달 예제를 만든다.
2. 같은 예제를 context로 바꾼다.
3. 어떤 경우에 props 전달이 오히려 읽기 좋은지 비교한다.

## 프로젝트 연결 연습

- `cardNumbers`, `expirationDate`, `cvc` 중 어떤 값이 `PaymentForm`에 모여 있어야 하는지 정리한다.
- `CardPreview`에 props로 전달하는 방식과 context로 전달하는 방식을 비교한다.
- "지금 프로젝트에서 context가 과한 이유 또는 필요한 이유"를 글로 답한다.

## 완료 기준

- "props drilling을 없애는 것"이 목적이 아니라 "데이터 소유권을 명확히 하는 것"이 목적임을 설명할 수 있다.
