# JS 이벤트 루프 완벽 이해를 위한 학습 로드맵

## 1단계: 기초 — JS 런타임 환경

- **싱글 스레드 (Single Thread)** — JS가 왜 한 번에 하나만 실행하는지
- **Call Stack (호출 스택)** — 함수 실행이 쌓이고 빠지는 구조
- **Execution Context (실행 컨텍스트)** — 코드가 실행되는 환경 단위
- **Heap (힙 메모리)** — 객체가 저장되는 메모리 공간
- **Web APIs / Node APIs** — 브라우저/Node가 제공하는 비동기 기능 (setTimeout, fetch, DOM 이벤트 등)

## 2단계: 핵심 — 이벤트 루프 메커니즘

- **Event Loop (이벤트 루프)** — Call Stack이 비었을 때 큐에서 작업을 꺼내오는 순환 구조
- **Task Queue (Macrotask Queue)** — setTimeout, setInterval, I/O, UI 렌더링 콜백
- **Microtask Queue** — Promise.then/catch/finally, queueMicrotask, MutationObserver
- **Macrotask vs Microtask 실행 순서** — Microtask가 항상 먼저 전부 소진된 후 Macrotask 1개 실행
- **Run-to-completion** — 하나의 태스크는 중간에 끊기지 않고 끝까지 실행

## 3단계: 비동기 패턴

- **Callback** — 비동기의 가장 원시적 형태
- **Callback Hell** — 콜백 중첩의 문제
- **Promise** — 비동기 결과를 나타내는 객체 (pending → fulfilled/rejected)
- **Promise Chaining** — .then().then() 체이닝
- **async / await** — Promise의 문법적 설탕, 동기처럼 읽히는 비동기
- **Error Handling** — try/catch와 .catch()의 관계

## 4단계: 심화 — 실행 순서 예측

- **setTimeout(fn, 0)의 의미** — 0ms여도 즉시 실행이 아닌 이유
- **Promise.resolve().then() vs setTimeout** — Microtask vs Macrotask 우선순위
- **queueMicrotask()** — 명시적 마이크로태스크 등록
- **requestAnimationFrame (rAF)** — 렌더링 직전에 실행되는 콜백 (별도 큐)
- **requestIdleCallback** — 브라우저가 한가할 때 실행
- **MutationObserver** — DOM 변경 감지 (Microtask로 처리)

## 5단계: 브라우저 렌더링과의 관계

- **렌더링 파이프라인** — Style → Layout → Paint → Composite
- **렌더링 타이밍** — Macrotask 사이에 렌더링이 끼어드는 구조
- **Microtask가 렌더링을 블로킹하는 이유** — Microtask 전부 소진 후에야 렌더링
- **Long Task** — 50ms 이상 메인 스레드를 점유하는 태스크
- **Blocking vs Non-blocking** — UI가 멈추는 원인

## 6단계: 추가 개념

- **Web Worker** — 메인 스레드 밖에서 JS 실행 (멀티 스레드)
- **Node.js 이벤트 루프** — 브라우저와 다른 6단계 Phase (timers, poll, check 등)
- **process.nextTick vs setImmediate** — Node.js 전용 실행 순서
- **Starvation (기아 상태)** — Microtask가 무한 생성되면 Macrotask가 영원히 실행 안 되는 문제

---

**추천 학습 순서**: 1단계 → 2단계 → 4단계(코드로 실행 순서 예측 연습) → 3단계 → 5단계 → 6단계

특히 **2단계 + 4단계를 코드로 직접 실행해보며** 순서를 예측하는 연습이 가장 중요합니다. 개념만 읽으면 금방 잊히지만, `console.log` 순서를 맞춰보는 퀴즈를 풀면 체화됩니다.

원하는 단계부터 깊이 들어가면 학습 자료를 만들어줄 수 있습니다.