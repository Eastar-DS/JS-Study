# Step 7. Reusable Components and Forms | 재사용 가능한 컴포넌트와 Form 설계

## 목표

- controlled / uncontrolled 입력의 차이를 이해한다.
- 재사용 가능한 form field 추상화의 적정선을 판단할 수 있다.

## 읽을 것

- [Sharing State Between Components - 영문](https://react.dev/learn/sharing-state-between-components)
- [컴포넌트 간 State 공유하기 - 한글](https://ko.react.dev/learn/sharing-state-between-components)

## 예시 코드

- [02-example-controlled-uncontrolled-form-abstraction.tsx](./02-example-controlled-uncontrolled-form-abstraction.tsx)
- 추천 실행 방법: [docs/react/01-실행가이드.md](../01-실행가이드.md)를 따라 `StackBlitz React 템플릿`의 `App.tsx`에 붙여넣어 실행하는 방법을 가장 추천합니다.

## 학습 포인트

- controlled input은 부모가 값을 소유한다.
- uncontrolled input은 DOM 또는 내부 상태가 값을 소유한다.
- 재사용성은 "무엇이든 받는 범용성"이 아니라 "같은 문제군을 자연스럽게 푸는 API"에 가깝다.
- 필드 그룹 추상화는 값 구조 전체보다 field config 구조가 더 나을 때가 많다.

## 미션

1. 같은 input을 controlled와 uncontrolled 두 방식으로 만든다.
2. `FieldGroup` 컴포넌트를 field config 배열 기반으로 설계한다.
3. render prop 또는 children 조합 방식으로 headless field를 간단히 실험한다.

## 프로젝트 연결 연습

- 현재 `InputFieldForm<T>`의 장점/단점을 5개씩 정리한다.
- `value: T` 기반 추상화와 `fields: FieldConfig[]` 기반 추상화를 비교한다.
- 카드번호, 유효기간, CVC를 같은 추상화로 묶을 때 어디까지 공통화할지 결정 기준을 적는다.

## 완료 기준

- "좋은 재사용성"과 "과한 추상화"를 구별하는 기준을 3개 이상 말할 수 있다.
