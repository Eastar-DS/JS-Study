# Suspense | 서스펜스 학습용 한국어 문서

원문:
- https://react.dev/reference/react/Suspense

## `<Suspense>`

`<Suspense>`는 자식(children)이 로딩(loading)을 마칠 때까지 fallback(대체 UI)을 보여주게 해줍니다.

형태:

```tsx
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

## 기본 개념

Suspense boundary(서스펜스 경계) 안의 어떤 부분이 아직 준비되지 않았으면, React는 그 부분 대신 fallback을 보여줄 수 있습니다.

공식 문서가 보여주는 주요 사용 방식:

- 콘텐츠가 로딩되는 동안 fallback 보여주기
- 여러 콘텐츠를 함께 한 번에 드러내기(reveal together)
- 중첩된 콘텐츠를 로딩 순서대로 드러내기
- 새 콘텐츠가 로딩되는 동안 이전(stale) 콘텐츠를 유지하기
- 이미 보여준 콘텐츠가 다시 숨겨지지 않게 막기
- Transition이 진행 중임을 표시하기
- navigation 중에 Suspense boundary를 초기화하기

## 무엇을 해결하는가

Suspense는 단순한 "로딩 스피너 컴포넌트"가 아닙니다.
준비되지 않은 UI를 어떤 경계(boundary)에서 어떻게 기다릴지에 대한 렌더링 모델입니다.

## 학습 포인트

- fallback은 "로딩 상태 state"의 또 다른 이름이 아닙니다.
- Suspense는 비동기 준비 상태와 렌더링 표시 방식을 연결하는 도구입니다.
- Transition과 함께 보면 더 의미가 분명해집니다.
