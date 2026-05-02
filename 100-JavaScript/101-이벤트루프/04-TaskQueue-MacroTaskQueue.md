## 자세한 설명

### Task Queue란?

> **비동기 작업이 완료된 후 실행될 콜백 함수들이 대기하는 줄(Queue)**

이벤트 루프에서 배운 내용을 떠올리면, Task Queue는 **일반 대기열**이었습니다. Microtask Queue(VIP 대기열)가 전부 소진된 후에, **1개씩** 꺼내져서 실행됩니다.

### Task Queue에 들어가는 것들

```
┌─────────────────────────────────────────────────────────┐
│  Task Queue (= Macrotask Queue)                         │
│                                                         │
│  • setTimeout / setInterval 콜백                        │
│  • UI 이벤트 핸들러 (click, keydown, scroll 등)           │
│  • I/O 완료 콜백 (네트워크 응답 후 처리 등)                 │
│  • MessageChannel의 onmessage                           │
│  • requestAnimationFrame (일부 분류에서는 별도 취급)       │
│  • HTML 파싱                                             │
└─────────────────────────────────────────────────────────┘
```

### Task는 어떻게 Queue에 들어오는가

Task Queue에 콜백이 들어오는 과정을 살펴보면:

```
코드 실행                Web API (별도 스레드)           Task Queue

setTimeout(cb, 1000)
  → "1000ms 후에         → 타이머 스레드에서
     cb를 실행해줘"         카운트다운 시작
                                │
                           1000ms 경과!
                                │
                                └──────────→  [cb] 들어감

button.addEventListener
  ('click', handler)
  → "클릭 이벤트를        → 이벤트 감지 스레드에서
     감시해줘"               대기 중
                                │
                           유저가 클릭!
                                │
                                └──────────→  [handler] 들어감
```

**콜백을 Task Queue에 넣는 주체는 런타임 환경(Web API)**이지, JS 엔진이 아닙니다. 이벤트 루프는 그저 **Queue에서 꺼내는 역할**만 합니다.

### Queue의 자료구조 — FIFO

```
들어오는 순서:  cb1 → cb2 → cb3

Task Queue:
  ┌──────┬──────┬──────┐
  │ cb1  │ cb2  │ cb3  │
  └──────┴──────┴──────┘
  ↑ 앞 (먼저 나감)        ↑ 뒤 (나중에 나감)

꺼내는 순서:  cb1 → cb2 → cb3  (먼저 들어온 것이 먼저 나감)
```

**FIFO (First In, First Out)** — Call Stack의 LIFO와 반대입니다.

### "1개씩" 꺼내는 이유

이벤트 루프가 Task Queue에서 **한 번에 1개만** 꺼내는 이유가 있습니다:

```
만약 Task를 전부 소진한다면?

Task Queue: [click-handler, setTimeout-cb, scroll-handler, ...]
  → 전부 실행하는 동안 Microtask도 못 처리하고
  → 렌더링도 못 하고
  → 화면이 멈춤!

실제 동작 (1개씩):

사이클 1: Task 1개 → Microtask 전부 → 렌더링 기회
사이클 2: Task 1개 → Microtask 전부 → 렌더링 기회
사이클 3: Task 1개 → Microtask 전부 → 렌더링 기회
  → 매 사이클마다 렌더링 기회가 있어서 화면이 부드러움
```

이것이 Microtask Queue와의 결정적 차이입니다:

```
Microtask Queue: 전부 소진 (새로 추가된 것까지)
Task Queue:      1개만 실행 → 다시 Microtask 확인 → 렌더링 기회
```

### 여러 개의 Task Queue

사실 브라우저에는 Task Queue가 **1개가 아니라 여러 개** 있을 수 있습니다.

```
┌─────────────────────────────────────┐
│  사용자 인터랙션 Task Queue           │  ← click, keydown (높은 우선순위)
├─────────────────────────────────────┤
│  타이머 Task Queue                   │  ← setTimeout, setInterval
├─────────────────────────────────────┤
│  네트워크 Task Queue                 │  ← I/O 완료 콜백
├─────────────────────────────────────┤
│  기타 Task Queue                    │  ← MessageChannel 등
└─────────────────────────────────────┘
```

브라우저는 **어떤 Queue에서 꺼낼지 자체적으로 우선순위를 판단**합니다. 예를 들어 사용자가 버튼을 클릭하면, setTimeout 콜백보다 click 이벤트 핸들러를 먼저 처리할 수 있습니다.

다만, HTML 명세에서는 이 우선순위를 구체적으로 정하지 않아서 **브라우저마다 다를 수 있습니다.** 확실한 것은:

> **Microtask는 항상 어떤 Task보다 먼저 처리된다**

이 규칙만큼은 모든 브라우저에서 동일합니다.

### setTimeout의 delay와 Task Queue의 관계

```js
setTimeout(cb1, 100);   // 100ms 후 Queue에 들어감
setTimeout(cb2, 50);    // 50ms 후 Queue에 들어감
setTimeout(cb3, 50);    // 50ms 후 Queue에 들어감
```

```
시간 →
0ms          50ms                    100ms
│             │                       │
│             ├─ cb2가 Queue에 도착    ├─ cb1이 Queue에 도착
│             ├─ cb3가 Queue에 도착    │
│             │                       │

50ms 시점 Task Queue: [cb2, cb3]     ← 같은 delay면 코드 순서대로
100ms 시점 Task Queue: [cb2, cb3, cb1]
```

**delay는 "Queue에 들어가는 시점"을 결정하는 것이지, "실행 시점"을 결정하는 것이 아닙니다.**

---

## Microtask Queue와의 비교 정리

```
                    Task Queue              Microtask Queue
─────────────────────────────────────────────────────────────
한 사이클에 처리      1개                     전부 (추가분 포함)
대표적 소스          setTimeout, 이벤트       Promise.then, queueMicrotask
Queue 개수          여러 개 가능             1개
렌더링과의 관계       Task 사이에 렌더링 가능    Microtask 중에는 렌더링 불가
우선순위             낮음                     높음
```

---

## 구체적인 예시

아래 코드의 출력 순서를 예측해보세요:

```js
setTimeout(() => {
  console.log('T1');
}, 0);

setTimeout(() => {
  console.log('T2');
  queueMicrotask(() => console.log('M1'));
  queueMicrotask(() => console.log('M2'));
}, 0);

setTimeout(() => {
  console.log('T3');
}, 0);

queueMicrotask(() => {
  console.log('M3');
});

console.log('S1');
```

**생각해볼 포인트**:

1. 동기 코드(`S1`)와 Microtask(`M3`) 중 누가 먼저인가?
2. 3개의 setTimeout이 등록한 Task(T1, T2, T3)는 Task Queue에 어떤 순서로 들어가는가?
3. T2 실행 중에 등록된 M1, M2는 — T3보다 먼저일까 나중일까? (이벤트 루프의 **"Task 1개 → Microtask 전부"** 규칙!)
4. 종이에 각 사이클별로 어떤 Queue에서 무엇이 나오는지 그려보세요

### 공부 전
TaskQueue가 뭘까 : 자바스크립트 엔진에서 사용하는 메인 스레드말고 다른 스레드에 등록된 작업들이 메인스레드로 이동하기전에 들어가는 큐일거같음.

코드 출력 순서 예측 :
S1 - M3 - T1 - T2 - T3 - M1 - M2
S1은 콜스택에서 바로 실행되고, queueMicrotask와 setTimeout을 0초로 설정한 것 중 뭐가 먼저 실행될지 모르겠으나 queueMicrotask가 먼저 실행된다고 가정.
M1과 M2는 setTimeout에서 다시 호출되는거니까 마지막.

생각해볼 포인트
1. S1
2. 순서대로 들어감.
3. T3보다 나중. setTimeout과 또 다른 스레드에 등록될거같음.

### 읽어보고 난 후
코드 출력 순서 예측 : S1 - M3 - T1 - T2 - M1 - M2 - T3 