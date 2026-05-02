# useDeferredValue | 유즈디퍼드밸류 학습용 한국어 문서

원문:
- https://react.dev/reference/react/useDeferredValue

## useDeferredValue

`useDeferredValue`는 UI의 일부 업데이트를 지연(defer)하게 해주는 React Hook입니다.

형태:

```tsx
const deferredValue = useDeferredValue(value)
```

## 기본 개념

어떤 값(value)이 너무 자주 바뀌고, 그 값을 사용하는 무거운 UI가 즉시 같이 따라오면 인터랙션이 둔해질 수 있습니다.

이때:
- 원래 값은 즉시 바뀌고
- 지연된 값(deferred value)은 조금 늦게 따라오게 해서
- UI 일부를 덜 급하게 갱신할 수 있습니다.

공식 문서의 사용 예:
- 새 콘텐츠가 로딩되는 동안 이전(stale) 콘텐츠 보여주기
- 현재 콘텐츠가 오래된(stale) 상태임을 표시하기
- UI 일부의 리렌더링을 지연시키기

## 언제 고려하는가

- 검색어 입력은 즉시 반영돼야 한다
- 하지만 검색 결과 리스트는 조금 늦게 따라와도 된다

같은 상황에서 자주 사용합니다.

## useTransition과의 관계

- `useTransition`: 업데이트를 시작하는 쪽에서 우선순위를 낮춤
- `useDeferredValue`: 이미 있는 값을 소비하는 쪽에서 덜 급하게 반영

## 학습 포인트

- `useDeferredValue`는 "값을 비동기로 바꾸는 것"이 아닙니다.
- 렌더링 반응성을 유지하기 위한 우선순위 조절 도구입니다.
