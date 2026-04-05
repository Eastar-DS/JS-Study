## 자세한 설명

### Microtask Queue란?

> **현재 실행 중인 작업이 끝난 직후, 다른 어떤 것보다 먼저 처리되어야 하는 작업들이 대기하는 큐**

Task Queue가 "일반 대기열"이라면, Microtask Queue는 **"현재 작업의 후속 처리"**에 가깝습니다. "이 일이 끝나면 바로 다음에 이것부터 해줘"라는 요청을 담는 곳입니다.

### Microtask Queue에 들어가는 것들

```
┌─────────────────────────────────────────────────────────┐
│  Microtask Queue                                        │
│                                                         │
│  • Promise.then() / .catch() / .finally() 콜백          │
│  • queueMicrotask()                                     │
│  • MutationObserver 콜백                                 │
│  • async/await (await 이후 재개 지점)                     │
└─────────────────────────────────────────────────────────┘
```

대부분은 **Promise 관련**입니다. 사실상 Microtask Queue는 "Promise 후속 처리 큐"라고 이해해도 무방합니다.

### 왜 Microtask라는 별도의 큐가 필요한가?

Promise가 도입되기 전에는 Task Queue 하나로 충분했습니다. 그런데 Promise의 등장으로 새로운 요구가 생겼습니다:

```js
// 상황: 데이터를 가져온 후 즉시 DOM을 업데이트하고 싶다
fetch('/api/user')
  .then(res => res.json())
  .then(user => {
    // 이 업데이트가 다음 렌더링 전에 반영되어야 함!
    document.getElementById('name').textContent = user.name;
    document.getElementById('email').textContent = user.email;
  });
```

만약 `.then()` 콜백이 Task Queue에 들어간다면:

```
Task Queue에 들어간 경우 (가상):

[fetch 완료 콜백]  →  [렌더링]  →  [.then 콜백 (DOM 업데이트)]  →  [렌더링]
                       ↑                                          ↑
                   아직 이전 데이터로 렌더링됨         두 번째 렌더링 (낭비!)
```

Microtask Queue에 들어가면:

```
실제 동작:

[fetch 완료]  →  [.then 콜백 (DOM 업데이트)]  →  [렌더링]
                  ↑ Microtask로 즉시 실행          ↑
                                             업데이트된 데이터로 한 번만 렌더링
```

**Promise의 후속 처리는 렌더링 전에, 가능한 빨리 실행되어야** 의미가 있습니다. 이것이 Microtask Queue가 존재하는 이유입니다.

### Microtask Queue의 핵심 규칙: "전부 소진"

Task Queue와의 결정적 차이입니다.

```
Task Queue:     1개 실행 → 멈춤 → Microtask 확인 → 렌더링 기회
Microtask Queue: 전부 소진 (실행 중 추가된 것까지 포함)
```

이것을 코드로 보면:

```js
// Microtask가 Microtask를 생성하는 경우

queueMicrotask(() => {
  console.log('M1');
  queueMicrotask(() => {
    console.log('M2');
    queueMicrotask(() => {
      console.log('M3');
    });
  });
});

setTimeout(() => console.log('T1'), 0);
```

```
── 동기 코드 끝 ──

Microtask Queue: [M1]
Task Queue:      [T1]

── Microtask 소진 시작 ──

M1 실행 → "M1"
  → M2가 Microtask Queue에 추가됨
  Microtask Queue: [M2]     ← 아직 빈 게 아님! 계속 소진

M2 실행 → "M2"
  → M3가 Microtask Queue에 추가됨
  Microtask Queue: [M3]     ← 또 추가됨! 계속 소진

M3 실행 → "M3"
  Microtask Queue: []       ← 이제야 비어짐

── Microtask 소진 완료 ──

T1 실행 → "T1"

출력: "M1" → "M2" → "M3" → "T1"
```

### 기아 현상 (Starvation)

"전부 소진" 규칙 때문에 위험한 상황이 발생할 수 있습니다:

```js
// ⚠️ 절대 하면 안 되는 코드
function infiniteMicrotask() {
  queueMicrotask(() => {
    console.log('실행');
    infiniteMicrotask();  // Microtask가 또 Microtask를 생성
  });
}

infiniteMicrotask();

setTimeout(() => {
  console.log('이건 영원히 실행 안 됨');
}, 0);
```

```
Microtask Queue가 영원히 비지 않음!

[실행] → M 추가 → [실행] → M 추가 → [실행] → M 추가 → ...
                                                    ↑
                               Task Queue의 setTimeout 콜백은
                               영원히 차례가 오지 않음

렌더링도 불가 → 화면 완전히 멈춤 (프리징)
```

이것이 keyword.md 6단계에 나온 **기아 상태(Starvation)**입니다. Microtask가 무한히 생성되면 Task Queue의 작업이 영원히 실행되지 못하고, 렌더링도 차단됩니다.

### queueMicrotask() — 명시적 Microtask 등록

Promise 없이도 직접 Microtask를 등록할 수 있습니다:

```js
// Promise를 만들어서 Microtask를 등록하는 우회 방법 (옛날 방식)
Promise.resolve().then(() => {
  console.log('Microtask');
});

// 명시적으로 Microtask를 등록 (권장 방식)
queueMicrotask(() => {
  console.log('Microtask');
});
```

둘은 동일하게 Microtask Queue에 들어갑니다. 하지만 `queueMicrotask`가 의도를 더 명확하게 표현합니다.

### async/await과 Microtask Queue

`async/await`은 Promise의 문법적 설탕입니다. `await` 이후의 코드는 `.then()` 콜백으로 변환되므로 **Microtask Queue를 통해 실행**됩니다.

```js
async function example() {
  console.log('A');
  await Promise.resolve();
  console.log('B');       // ← 이 부분이 Microtask Queue를 경유
}

// 위는 아래와 동일:
function example() {
  console.log('A');
  return Promise.resolve().then(() => {
    console.log('B');     // ← .then() 콜백 = Microtask
  });
}
```

```js
console.log('1');

async function foo() {
  console.log('2');
  await Promise.resolve();
  console.log('3');       // Microtask
}

foo();
console.log('4');

// 출력: "1" → "2" → "4" → "3"
//                           ↑ await 이후는 Microtask로 나중에 실행
```

### MutationObserver — DOM 감시 Microtask

```js
const observer = new MutationObserver((mutations) => {
  // DOM 변경 감지 시 Microtask로 실행됨
  console.log('DOM 변경 감지!');
});

observer.observe(document.body, { childList: true });

// DOM 변경
document.body.appendChild(document.createElement('div'));

// MutationObserver 콜백은 Microtask Queue에 들어감
// → 현재 동기 코드가 끝난 직후, 렌더링 전에 실행
```

MutationObserver가 Microtask인 이유: DOM 변경을 감지하고 **렌더링 전에 추가 처리**(예: 변경 취소, 추가 조작)를 해야 하기 때문입니다.

---

## 이벤트 루프 사이클에서 Microtask의 위치

```
한 사이클:

┌──────────────────┐
│ Macrotask 1개 실행 │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Microtask Queue   │ ◄── 실행 중 새로 추가된 Microtask도
│ 전부 소진          │      여기서 즉시 처리됨
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 렌더링 기회        │     Microtask가 전부 끝나야 렌더링 가능
│ (rAF → 렌더링)    │     → Microtask가 오래 걸리면 화면 멈춤
└────────┬─────────┘
         │
         └──→ 다음 사이클
```

---

## 구체적인 예시

아래 코드의 출력 순서를 예측해보세요:

```js
setTimeout(() => console.log('T1'), 0);

const p = new Promise(resolve => {
  console.log('P1');
  resolve();
});

p.then(() => {
  console.log('M1');
  queueMicrotask(() => console.log('M2'));
  return Promise.resolve();
}).then(() => {
  console.log('M3');
});

p.then(() => {
  console.log('M4');
});

queueMicrotask(() => {
  console.log('M5');
  setTimeout(() => console.log('T2'), 0);
});

console.log('S1');
```

**생각해볼 포인트**:

1. `new Promise(executor)` 안의 `P1`은 동기 실행 — `S1`과의 순서는?
2. 같은 Promise `p`에 `.then()`을 두 번 붙였다 — `M1`과 `M4`는 어떤 순서로 Microtask Queue에 등록될까?
3. `M1` 실행 중 `queueMicrotask(M2)`가 추가되고, `return Promise.resolve()`가 반환됨 — `M3`은 즉시 Microtask Queue에 들어갈까, 아니면 한 턴 뒤에 들어갈까?
4. `M5` 안에서 등록한 `setTimeout(T2)`은 어느 시점에 Task Queue에 들어가는가?
5. `T1`과 `T2`의 순서는 보장되는가?


### 공부 전(Promise를 먼저 공부하고 다시 보는 걸로 결정)
MicrotaskQueue : 테스크 큐에 있는 작업을 메인스레드로 보내려고할 때 우선적으로 확인하는 곳. MicrotaskQueue에 작업이 있으면 항상 태스크큐보다 앞서서 메인스레드에 우선적으로 보냄.

Promise를 코드에 적으니까 뭔지 모르겠음. 그냥 비동기라는 것만 생각이남. resolve()는 또 뭐여.
p 변수에 프로미스 객체를 생성하면 어떻게 되는건지 모르겠다. p.then에 M1이라고 적은거보니까 프로미스가 완료되면 마이크로 태스크에 등록하는 것 같다. 

코드 출력 순서 예측 : 
S1 - T1 - P1 - M1 - M2 - M3 - M4 - M5 - T2

생각해볼 포인트 : 
1. 말이 이해가 안감. P1은 동기실행이라는건가?
2. 모르겠다. then 안에서 queueMicrotask를 사용하면 뭐가 어떻게 되는거지. 
3. 바로 들어가는거 아닌가?
4. M5가 완료되고 들어가는건가...? 그냥 M5 수행하면서 태스크 큐에 들어갈거같다.
5. 안될 것 같다. T2는 queueMicrotask 안에 있어서 우선적으로 들어가지나...?

Promise를 먼저 공부하고 MicrotaskQueue를 공부하는게 좋으려나..?

### 공부 전(Promise를 공부하고 나서)
코드 출력 순서 예측
P1 - S1 - M1 - M4 - M5 - M2 - M3 - T1 - T2
1. 동기 코드가 바로 실행될때 P1, S1 나옴. T1은 태스크큐에 등록. M1, M4, M5가 나오도록 마이크로 태스크큐에 등록.
2. M1이 출력되고 마이크로 태스크 큐에 M2 추가. 이후 M3 출력도 마이크로 태스크 큐에 추가. 
3. 마이크로 태스크큐 비우고 태스크 큐에 있던 T1, T2 실행.