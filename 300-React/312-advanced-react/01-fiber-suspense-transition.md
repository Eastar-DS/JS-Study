# Step 12. Fiber, Suspense, Transition | 파이버, 서스펜스, 트랜지션

## 목표

- Fiber가 왜 필요한지 개념적으로 이해한다.
- Suspense, transition, deferred rendering이 어떤 문제를 해결하는지 설명할 수 있다.

## 읽을 것

- [Suspense - 영문](https://react.dev/reference/react/Suspense)
- [Suspense - 한국어 학습용 문서](../314-reference-ko/07-suspense.md)
- [`useTransition` - 영문](https://react.dev/reference/react/useTransition)
- [`useTransition` - 한국어 학습용 문서](../314-reference-ko/08-usetransition.md)
- [`useDeferredValue` - 영문](https://react.dev/reference/react/useDeferredValue)
- [`useDeferredValue` - 한국어 학습용 문서](../314-reference-ko/09-usedeferredvalue.md)
- [React Compiler - 영문](https://react.dev/learn/react-compiler)
- [React Compiler - 한글](https://ko.react.dev/learn/react-compiler)

## 예시 코드

- [02-example-fiber-suspense-transition.tsx](./02-example-fiber-suspense-transition.tsx)
- 추천 실행 방법: [docs/react/01-실행가이드.md](../01-실행가이드.md)를 따라 `CodeSandbox` 또는 `StackBlitz`의 React 템플릿에서 실행하는 방법을 추천합니다. 이 예시는 `Suspense`, `transition` 실험이므로 콘솔보다 화면 반응을 같이 보는 편이 좋습니다.

## 학습 포인트

- Fiber는 React 작업을 더 잘게 나누고 우선순위를 다루기 위한 구조다.
- render phase와 commit phase는 역할이 다르다.
- Suspense는 로딩 UI 컴포넌트가 아니라 "렌더링 중 기다림"을 다루는 경계다.
- transition은 더 덜 급한 업데이트 우선순위를 낮추는 도구다.

## 미션

1. `React.lazy`와 `Suspense`를 사용해 fallback UI를 만든다.
2. `useTransition`으로 입력 반응성과 무거운 리스트 갱신을 분리한다.
3. `useDeferredValue`로 검색 입력 지연 렌더링을 실험한다.

## 프로젝트 연결 연습

- 현재 프로젝트에서는 Suspense가 왜 아직 핵심 주제가 아닌지 적는다.
- 미래에 BIN 조회, 카드사 추천, 서버 검증이 들어오면 어떤 비동기 UI 패턴이 필요할지 설계한다.

## 완료 기준

- "왜 Fiber를 초반 선행학습으로 두지 않았는가"를 스스로 설명할 수 있다.
