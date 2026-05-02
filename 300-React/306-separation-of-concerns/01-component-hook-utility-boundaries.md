# Step 6. Separation of Concerns | 관심사 분리: Component, Hook, Utility

## 목표

- 어떤 로직을 컴포넌트에 두고, 어떤 로직을 custom hook이나 utility로 빼야 하는지 기준을 세운다.
- container/presentational 분리와 hook 기반 분리의 차이를 이해한다.

## 읽을 것

- [Built-in React Hooks - 영문](https://react.dev/reference/react/hooks)
- [Built-in React Hooks - 한국어 학습용 문서](../314-reference-ko/01-built-in-react-hooks.md)
- [Rules of Hooks - 영문](https://react.dev/reference/rules/rules-of-hooks)
- [Rules of Hooks - 한국어 학습용 문서](../314-reference-ko/02-rules-of-hooks.md)
- [React calls Components and Hooks - 영문](https://react.dev/reference/rules/react-calls-components-and-hooks)
- [React calls Components and Hooks - 한국어 학습용 문서](../314-reference-ko/03-react-calls-components-and-hooks.md)

## 예시 코드

- [02-example-component-hook-utility-boundaries.tsx](./02-example-component-hook-utility-boundaries.tsx)
- 추천 실행 방법: [docs/react/01-실행가이드.md](../01-실행가이드.md)를 따라 `StackBlitz React 템플릿`의 `App.tsx`에 붙여넣어 실행하는 방법을 가장 추천합니다.

## 학습 포인트

- 컴포넌트는 UI 조립과 선언에 강하다.
- custom hook은 재사용 가능한 React 로직에 강하다.
- utility 함수는 React와 무관한 순수 계산에 강하다.
- hook은 "컴포넌트 대신 쓰는 것"이 아니라 "컴포넌트의 React 로직을 분리하는 것"이다.

## 미션

아래를 각각 분리해 본다.

1. 순수 validator 함수
2. input 상태와 touched/error를 관리하는 hook
3. 실제 렌더링을 담당하는 field 컴포넌트

## 프로젝트 연결 연습

- 현재 `FormField`, `InputFieldForm`, `PaymentForm`의 책임을 표로 쪼갠다.
- `usePaymentForm` 또는 `useFormField`가 생긴다면 어떤 상태와 핸들러를 반환해야 하는지 인터페이스를 설계한다.
- `validate.ts`에 남아야 할 것과 hook으로 옮겨야 할 것을 분류한다.

## 완료 기준

- "이 로직은 hook이 아니라 utility여야 한다"를 설명할 수 있다.
- "이 컴포넌트는 도메인 조립 컴포넌트다"라고 근거를 들어 말할 수 있다.
