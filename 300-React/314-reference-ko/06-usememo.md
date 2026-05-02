# useMemo | 유즈메모 학습용 한국어 문서

원문:
- https://react.dev/reference/react/useMemo

## useMemo

`useMemo`는 리렌더 사이에서 계산 결과(calculation result)를 캐시(cache)하게 해주는 React Hook입니다.

형태:

```tsx
const cachedValue = useMemo(calculateValue, dependencies)
```

## 무엇을 하는가

컴포넌트가 다시 렌더될 때마다 계산을 새로 하지 않고, dependency(의존성)가 바뀌지 않았다면 이전 계산 결과를 재사용합니다.

즉:
- 계산이 비싸다(expensive)
- 매 렌더마다 다시 계산할 필요는 없다

는 상황에서 유용합니다.

## 중요한 제약

공식 문서는 `useMemo`가 Hook이므로 아래 규칙을 따른다고 설명합니다.

- 컴포넌트 본문 최상위(top level)에서만 호출할 수 있습니다.
- 커스텀 훅 본문 최상위에서도 호출할 수 있습니다.
- loop, condition 안에서는 호출할 수 없습니다.

필요하다면:
- 새 컴포넌트를 추출(extract)하거나
- 구조를 바꿔야 합니다.

## 무엇에 쓰는가

대표적인 사용 예:
- 필터링(filtering)
- 정렬(sorting)
- 큰 배열/객체 변환
- memoized child에 내려줄 파생값(derived value) 안정화

## 오해하면 안 되는 점

- `useMemo`는 "무조건 써야 하는 최적화"가 아닙니다.
- 계산이 싸다면 오히려 관리 비용만 늘 수 있습니다.
- `useMemo`가 코드를 더 복잡하게 만들 수 있습니다.

## 학습 포인트

- 먼저 계산 비용과 리렌더링 비용을 관찰합니다.
- 파생값(derived value)은 우선 그냥 계산해보고, 필요할 때만 `useMemo`를 적용합니다.
- `useMemo`는 correctness(정확성)를 위한 도구가 아니라 optimization(최적화) 도구입니다.
