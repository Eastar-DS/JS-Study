1. 300번 폴더만으로 충분한가? — 반은 충분, 반은 외부 보강 필수
300번 폴더 노트들은 대부분 "무엇을 공부하라"는 가이드 + 미션의 형태이고, 실제 깊이 있는 설명은 React 공식문서 링크로 위임하는 구조야. 그래서:

항목	폴더 내 자료 충분성	비고
Render/Commit, 트리 멘탈 모델	✅ 충분 (301)	공식문서 한글로 보강
key/identity, state 보존	✅ 충분 (302)	디핑 이해 전제
VDOM, Diffing, Reconciliation	⚠️ 가이드만 (310)	핵심 알고리즘은 외부 보강 필요
리렌더 추적, memo/Compiler	✅ 충분 (309 + 314-05/06)	
Fiber, Suspense, Transition	⚠️ 가이드만 (312)	Fiber 아키텍처 설명은 외부 필요
Batching, 자동 batching(React 18)	⚠️ 302에 일부만	React 18 변경점 보강 필요
결론: 폴더는 좋은 학습 뼈대지만, "리액트가 비싼 연산을 어떻게 해결하는가"의 알고리즘적 설명(왜 O(n)인가) 과 Fiber의 시간 분할/우선순위 부분은 공식문서/외부 자료를 따로 읽어야 해.

2. 추천 학습 순서 (이번 주제에 맞춤)
이전 스터디의 Q5("VDOM은 리플로우를 줄이지 않는다")를 받아서, "그럼 무엇을 줄이는가 → 어떻게 줄이는가 → 그것도 비싸면 어떻게 쪼개는가" 흐름으로 짰어.


[전제 다지기]
1) 301-react-mental-model/01-render-commit-tree
   → "렌더 = 함수 호출 / 커밋 = DOM 반영" 분리
   → "리렌더 ≠ DOM 업데이트" 감각

2) 302-state-snapshot-and-identity/01-state-snapshot-key
   → key가 identity 장치라는 점 (디핑 이해의 전제)

[핵심 1: 무엇을 줄이는가 - Diffing]
3) 310-rendering-internals/01-virtual-dom-diffing-key  ← 본 스터디 메인
   → VDOM, Reconciliation, key의 역할

[핵심 2: 어떻게 더 안 부르는가 - Memoization]
4) 309-rerender-and-performance/01-profiler-memo-compiler
   + 314-reference-ko/05-memo, 06-usememo
   → 같은 input이면 트리 비교 자체를 건너뛰기
   → React Compiler의 자동 메모이제이션

[핵심 3: 그것도 비싸면 - Fiber와 시간 분할]
5) 312-advanced-react/01-fiber-suspense-transition
   + 314-reference-ko/07-suspense, 08-usetransition, 09-usedeferredvalue
   → 작업을 잘게 쪼개고 우선순위 부여
스터디원들이 짧게 진행하고 싶으면 3 → 4 → 5만 해도 핵심 메시지는 잡혀. 1~2는 사전 지식.

3. 폴더에서 부족해서 추가로 읽어야 할 자료
폴더가 링크만 걸고 깊이 안 다루는 부분이라 반드시 보강 권장:

(a) Diffing 휴리스틱 — 왜 O(n³)이 아니고 O(n)인가 (310의 빈자리)

Reconciliation - 한글 (legacy 문서) ← 이번 주제 필수
두 가정(다른 타입은 다른 트리 / key로 형제 식별)으로 O(n)으로 만든 트릭
신 문서엔 빠진 내용이라 legacy를 봐야 함
(b) Fiber 아키텍처 — 왜 Fiber인가 (312의 빈자리)

React 한글 블로그: React Fiber란 무엇인가 (개요 수준)
Lin Clark - A Cartoon Intro to Fiber (영문, 30분 영상) — 시각적 이해에 가장 좋음
핵심 메시지: Stack Reconciler(동기, 한 번에 다 처리) → Fiber(중단/재개 가능, 우선순위)
(c) Batching — React 18 변경점

Automatic Batching - 영문 — 한글 정식 번역 없음
핵심: 여러 setState를 1번의 렌더로 합쳐서 디핑/커밋 자체를 1회로 줄이는 것도 "비싼 연산 줄이기" 전략
(d) [선택] React Compiler

React Compiler - 한글 — 314-reference-ko에는 별도 노트 없으니 공식문서로
