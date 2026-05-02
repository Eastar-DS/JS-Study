# Step 9. Rerender and Performance | 리렌더링 추적과 성능 최적화

## 목표

- 왜 컴포넌트가 다시 렌더링되는지 추적할 수 있다.
- `memo`, `useMemo`, `useCallback`을 언제 써야 하는지 측정 기반으로 판단한다.
- React Compiler의 위치를 이해한다.

## 읽을 것

- [React Developer Tools - 영문](https://react.dev/learn/react-developer-tools)
- [React Developer Tools - 한글](https://ko.react.dev/learn/react-developer-tools)
- [`memo` - 영문](https://react.dev/reference/react/memo)
- [`memo` - 한국어 학습용 문서](../314-reference-ko/05-memo.md)
- [`useMemo` - 영문](https://react.dev/reference/react/useMemo)
- [`useMemo` - 한국어 학습용 문서](../314-reference-ko/06-usememo.md)
- [React Compiler - 영문](https://react.dev/learn/react-compiler)
- [React Compiler - 한글](https://ko.react.dev/learn/react-compiler)

## 예시 코드

- [02-example-profiler-memo-compiler.tsx](./02-example-profiler-memo-compiler.tsx)
- 추천 실행 방법: [docs/react/01-실행가이드.md](../01-실행가이드.md)를 따라 `StackBlitz React 템플릿`의 `App.tsx`에 붙여넣어 실행하는 방법을 가장 추천합니다.

## 학습 포인트

- 최적화 전에 먼저 리렌더링 원인을 관찰해야 한다.
- 메모이제이션은 성능 최적화 도구이지 정답 패턴이 아니다.
- props가 객체/배열/함수일 때 memo가 잘 깨질 수 있다.
- 최신 React에서는 React Compiler가 자동 메모이제이션을 도와줄 수 있다.

## 미션

1. 일부러 무거운 자식 컴포넌트를 만든다.
2. Profiler로 병목을 확인한다.
3. `memo`, `useMemo`, `useCallback`을 각각 적용하고 실제 차이를 측정한다.
4. 오히려 느려지는 경우를 재현한다.

## 프로젝트 연결 연습

- 카드 입력 시 `CardPreview`와 개별 field가 얼마나 자주 렌더되는지 측정한다.
- `CardPreview`를 memo할 가치가 있는지 측정 근거를 적는다.
- "CVC 상태를 상위에 둬도 되는가"를 성능보다 설계 이점과 함께 평가한다.

## 완료 기준

- "최적화해야 할 문제"와 "그냥 두어도 되는 리렌더링"을 구별할 수 있다.
