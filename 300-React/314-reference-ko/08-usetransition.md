# useTransition | 유즈트랜지션 학습용 한국어 문서

원문:
- https://react.dev/reference/react/useTransition

## useTransition

`useTransition`은 UI의 일부를 background(백그라운드)에서 렌더하게 해주는 React Hook입니다.

형태:

```tsx
const [isPending, startTransition] = useTransition()
```

## 기본 개념

모든 state 업데이트(update)가 똑같이 급한 것은 아닙니다.

예를 들어:
- input에 타이핑한 즉시 글자가 보이는 것은 매우 급합니다.
- 그 입력에 따라 무거운 리스트가 다시 계산되는 일은 상대적으로 덜 급할 수 있습니다.

이럴 때 `startTransition` 안에서 일어난 업데이트를 Transition(트랜지션)으로 표시(mark)할 수 있습니다.

## 반환값

- `isPending`: Transition이 진행 중인지 알려줍니다.
- `startTransition`: 내부의 state 업데이트를 Transition으로 표시합니다.

## 중요한 주의점

공식 문서가 말하는 주요 caveat(주의사항):

- Hook이므로 컴포넌트 또는 커스텀 훅 안에서만 호출할 수 있습니다.
- 어떤 state의 `set` 함수에 접근할 수 있을 때만 그 업데이트를 Transition으로 감쌀 수 있습니다.
- `startTransition`에 넘긴 함수는 즉시 호출됩니다.
- 그 함수가 실행되는 동안 발생한 state 업데이트만 Transition으로 표시됩니다.
- `setTimeout` 안에서 나중에 일어난 업데이트는 자동으로 Transition이 되지 않습니다.
- async 요청 이후의 state 업데이트는 다시 `startTransition`으로 감싸야 할 수 있습니다.

## 학습 포인트

- `useTransition`은 "비동기 함수 실행 도구"가 아닙니다.
- "덜 급한 업데이트"의 우선순위를 낮추는 렌더링 도구입니다.
