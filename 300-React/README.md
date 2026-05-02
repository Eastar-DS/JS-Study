# 300 - React

React를 "문법"이 아니라 "동작 원리와 설계 기준"까지 이해하기 위해 만든 학습 문서 모음.

## 이 카테고리에서 무엇을 공부하게 되는가

아래 흐름으로 React를 학습하도록 설계되어 있다.

1. React가 화면을 어떻게 다시 그리는지 이해한다.
2. state, ref, key, effect 같은 핵심 도구를 구분한다.
3. JavaScript의 클로저(closure), 참조(reference), 스코프(scope)로 React 코드를 해석한다.
4. 컴포넌트, 커스텀 훅(custom Hook), 유틸리티 함수(utility function)의 책임을 나누는 기준을 세운다.
5. 재사용 가능한 폼(form)과 컴포넌트의 추상화 수준을 조절하는 연습을 한다.
6. props drilling, context, 상태 관리 도구를 비교하며 상태 소유권을 설계한다.
7. 리렌더링(re-render), 메모이제이션(memoization), Profiler를 통해 성능 문제를 추적한다.
8. virtual DOM, diffing, reconciliation, Hooks 내부 원리, Fiber, Suspense까지 심화한다.

## 이 학습을 통해 기르는 능력

- "왜 이 컴포넌트가 다시 렌더링되는가?"를 설명하는 능력
- "이 값은 state여야 하는가, ref여야 하는가, 계산값(derived state)이어야 하는가?"를 판단하는 능력
- `useEffect`가 정말 필요한지 구분하는 능력
- 폼 입력 컴포넌트와 검증 로직을 어디까지 분리해야 하는지 판단하는 능력
- 재사용 가능한 컴포넌트를 설계하되 과한 추상화를 피하는 능력
- props drilling, context, store 도구를 비교해서 상태 구조를 선택하는 능력
- React 공식 문서의 reference 문서를 읽고 실제 코드 설계에 연결하는 능력

## 시작하기

1. [[00-로드맵-개요]] 먼저 읽기
2. [[01-실행가이드]]를 보고 예시 코드를 실행할 환경 정하기
3. 301부터 313까지 순서대로 학습
4. 각 단계의 예시 코드(`02-example-*.tsx`)를 직접 실행
5. "읽고 끝내기"보다 "예측 → 실행 → 관찰 → 설명" 순서

## 세부 영역 (학습 순서)

| # | 주제 |
|---|---|
| [[301-react-mental-model/01-render-commit-tree\|301]] | React 멘탈 모델 (render/commit/tree) |
| [[302-state-snapshot-and-identity/01-state-snapshot-key\|302]] | state 스냅샷과 identity (key) |
| [[303-state-toolbox/01-state-ref-url-derived\|303]] | state 도구 상자 (state/ref/url/derived) |
| [[304-effects-and-synchronization/01-you-might-not-need-an-effect\|304]] | effect와 동기화 |
| [[305-react-through-javascript/01-closure-reference-stale-values\|305]] | JavaScript로 React 해석 (클로저/참조) |
| [[306-separation-of-concerns/01-component-hook-utility-boundaries\|306]] | 책임 분리 (컴포넌트/훅/유틸) |
| [[307-reusable-components-and-forms/01-controlled-uncontrolled-form-abstraction\|307]] | 재사용 가능한 컴포넌트와 폼 |
| [[308-state-sharing-and-context/01-lifting-props-context\|308]] | 상태 공유와 context |
| [[309-rerender-and-performance/01-profiler-memo-compiler\|309]] | 리렌더링과 성능 (Profiler/memo) |
| [[310-rendering-internals/01-virtual-dom-diffing-key\|310]] | 렌더링 내부 (virtual DOM/diffing/key) |
| [[311-hooks-internals/01-hooks-rules-and-mini-implementation\|311]] | Hooks 내부 원리 |
| [[312-advanced-react/01-fiber-suspense-transition\|312]] | 심화 (Fiber/Suspense/Transition) |
| [[313-state-management-ecosystem/01-context-redux-zustand-jotai\|313]] | 상태 관리 생태계 (Redux/Zustand/Jotai) |

## 참조 자료

[[314-reference-ko/01-built-in-react-hooks|314-reference-ko]] — React 공식 reference의 비공식 한국어 학습 문서 12개. 공식 번역이 부족하거나 학습용 정리가 필요한 부분만 모음.

각 step 폴더 구성:
- `01-*.md` — 해당 단계의 학습 문서
- `02-example-*.tsx` 또는 `02-example-*.ts` — 실행해볼 예시 코드

## 학습 일지

[[log|React 학습 일지]]
