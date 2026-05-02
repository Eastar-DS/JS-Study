# Step 11. Hooks Internals and Rules | Hooks 내부 원리와 Rules of Hooks

## 목표

- 왜 hook은 조건부로 호출하면 안 되는지 구조적으로 이해한다.
- `useState`, `useRef`, `useEffect`를 학습용으로 작게 흉내 내볼 수 있다.

## 읽을 것

- [Rules of Hooks - 영문](https://react.dev/reference/rules/rules-of-hooks)
- [Rules of Hooks - 한국어 학습용 문서](../314-reference-ko/02-rules-of-hooks.md)
- [eslint-plugin-react-hooks: rules-of-hooks - 영문](https://react.dev/reference/eslint-plugin-react-hooks/lints/rules-of-hooks)
- [eslint-plugin-react-hooks: rules-of-hooks - 한국어 학습용 문서](../314-reference-ko/04-eslint-rules-of-hooks.md)
- [React calls Components and Hooks - 영문](https://react.dev/reference/rules/react-calls-components-and-hooks)
- [React calls Components and Hooks - 한국어 학습용 문서](../314-reference-ko/03-react-calls-components-and-hooks.md)

## 예시 코드

- [02-example-hooks-rules-and-mini-implementation.ts](./02-example-hooks-rules-and-mini-implementation.ts)
- 추천 실행 방법: [docs/react/01-실행가이드.md](../01-실행가이드.md)를 먼저 읽고, 이 파일은 `tsx`가 아니라 콘솔 학습용이므로 `TypeScript Playground` 또는 샌드박스의 일반 TS 파일에서 실행하는 방법을 추천합니다.

## 학습 포인트

- hook은 호출 순서에 기대어 state 슬롯을 매칭한다.
- React는 컴포넌트와 hook 호출을 스스로 오케스트레이션한다.
- "그냥 함수 호출"과 "React가 렌더 중 호출"은 다르다.

## 미션

1. 모듈 레벨 배열과 인덱스로 `useState` 흉내를 낸다.
2. 의존성 배열 비교로 `useMemo`와 `useEffect`를 축소 구현한다.
3. 조건부 hook 호출로 왜 슬롯이 꼬이는지 예제를 만든다.

## 프로젝트 연결 연습

- `useFormField`를 만든다고 가정하고, 내부에서 어떤 hook이 어떤 순서로 호출될지 적어본다.
- "왜 `FormField`를 그냥 함수처럼 직접 호출하면 안 되는가"를 설명한다.

## 완료 기준

- "Rules of Hooks가 문법 규칙이 아니라 state 연결 규칙"이라는 점을 설명할 수 있다.
