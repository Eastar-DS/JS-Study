# memo | 메모 학습용 한국어 문서

원문:
- https://react.dev/reference/react/memo

## memo

`memo`는 props(프롭스)가 바뀌지 않았을 때 컴포넌트(component)의 리렌더링(re-render)을 건너뛰게 해줍니다.

형태:

```tsx
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

## 무엇을 하는가

부모가 다시 렌더되더라도, 현재 컴포넌트의 props가 이전과 같다면 React는 이 컴포넌트의 리렌더링을 생략(skip)할 수 있습니다.

중요:
- `memo`는 "항상 렌더 금지"가 아닙니다.
- props가 같을 때 React가 최적화할 수 있게 돕는 도구입니다.

## React Compiler와의 관계

공식 문서는 React Compiler가 `memo`와 비슷한 최적화를 자동으로 적용할 수 있다고 설명합니다.
즉 수동 메모이제이션(manual memoization)의 필요를 줄여줄 수 있습니다.

## 정말 중요한 주의점

공식 문서가 매우 강하게 강조하는 내용:

- `memo`는 성능 최적화(performance optimization)를 위한 도구입니다.
- 코드가 `memo` 없이 제대로 동작하지 않는다면, 먼저 근본 원인(root cause)을 수정해야 합니다.
- `memo`는 버그를 숨기기 위한 도구가 아닙니다.

## 문서가 권장하는 기본 태도

공식 문서의 핵심 권장 사항을 학습용으로 옮기면 다음과 같습니다.

1. 렌더링 로직(rendering logic)을 순수하게(pure) 유지합니다.
2. state를 다시 갱신하는 불필요한 Effect를 줄입니다.
3. props를 자주 바뀌는 새 객체/새 함수로 만들면 `memo`가 쉽게 깨질 수 있음을 이해합니다.

## 언제 도움이 되는가

- 자식 컴포넌트가 무겁다.
- 부모는 자주 렌더되지만 자식 props는 거의 안 바뀐다.
- 실제 측정(profiling) 결과, 이 컴포넌트의 리렌더링 비용이 의미 있게 크다.

## 학습 포인트

- `memo`는 설계의 기본값이 아니라 최적화 도구입니다.
- 먼저 "왜 렌더가 많이 일어나는가"를 이해해야 합니다.
- `memo`만 붙인다고 성능이 무조건 좋아지지는 않습니다.
