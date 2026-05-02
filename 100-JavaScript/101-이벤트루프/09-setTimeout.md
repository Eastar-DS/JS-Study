[[08-콜백-함수]]

## 자세한 설명

### setTimeout은 자바스크립트가 아니다

이전에 배운 내용을 떠올려보세요. `setTimeout`은 **JS 엔진(V8)이 제공하는 것이 아니라, 런타임 환경이 제공하는 API**입니다.

```
브라우저 → Web API로 setTimeout 제공
Node.js  → libuv(타이머 모듈)로 setTimeout 제공
```

ECMAScript 명세서에 `setTimeout`은 없습니다. 그런데 어디서나 쓸 수 있는 이유는 **두 런타임 모두 같은 이름으로 제공**하기 때문입니다.

### 기본 문법

```js
const timerId = setTimeout(callback, delay, arg1, arg2, ...);
```

| 매개변수          | 설명                                                      |
| ----------------- | --------------------------------------------------------- |
| `callback`        | delay 후에 실행할 함수                                    |
| `delay`           | 밀리초 단위 지연 시간 (기본값: 0)                         |
| `arg1, arg2, ...` | 콜백에 전달할 인수 (선택)                                 |
| **반환값**        | 타이머 식별자 (숫자). `clearTimeout()`으로 취소할 때 사용 |

```js
// 기본 사용
setTimeout(() => {
  console.log("1초 뒤 실행");
}, 1000);

// 인수 전달
setTimeout(
  (name, age) => {
    console.log(`${name}은 ${age}살`); // "철수은 25살"
  },
  1000,
  "철수",
  25,
);

// 타이머 취소
const id = setTimeout(() => {
  console.log("이건 실행 안 됨");
}, 5000);
clearTimeout(id);
```

### setTimeout의 동작 과정 (이벤트 루프와 연결)

```js
console.log("1");
setTimeout(() => console.log("2"), 0);
console.log("3");
```

이 코드가 실행되는 전체 흐름입니다:

```
[Call Stack]              [Web API]           [Task Queue]       [출력]

1. console.log('1')                                               "1"
   → 실행 후 pop

2. setTimeout(cb, 0)
   → 엔진: "setTimeout은 내 관할 아님"
   → 런타임에 위임 ──────→ Timer 등록 (0ms)
   → setTimeout 자체는
     Stack에서 pop

3. console.log('3')                                               "3"
   → 실행 후 pop

4. Stack 비어있음          0ms 경과! ────→  cb가 Queue에 들어감
                                          [cb]

5. Event Loop 체크:
   "Stack 비었고,
    Queue에 cb 있네"  ←────────────────  cb 꺼냄

6. cb() 실행                                                      "2"
   console.log('2')
   → 실행 후 pop

출력 순서: "1" → "3" → "2"
```

### delay는 "보장 시간"이 아니라 "최소 대기 시간"

이것이 `setTimeout`을 이해하는 가장 중요한 포인트입니다.

```js
setTimeout(() => {
  console.log("나는 정확히 1초 뒤에 실행될까?");
}, 1000);
```

**아닙니다.** `delay`는 "최소 이 시간이 지난 후에 Task Queue에 넣겠다"는 의미이지, "정확히 이 시간에 실행하겠다"는 의미가 아닙니다.

```
시간 →
0ms        1000ms                    1350ms
│           │                         │
▼           ▼                         ▼
[setTimeout 호출]  [콜백이 Queue에 도착]    [콜백이 실제 실행됨]

            ├── 1000ms (delay) ──┤
                        ├── 350ms (대기) ──┤

                        이 대기 시간은 왜?
                        → Call Stack이 아직 비어있지 않아서!
                        → 또는 Queue에 먼저 들어온 작업이 있어서!
```

구체적으로 보겠습니다:

```js
setTimeout(() => {
  console.log("타이머 콜백");
}, 1000);

// 이 작업이 3초 걸린다면?
const start = Date.now();
while (Date.now() - start < 3000) {
  // 3초 동안 Call Stack을 점유하는 무거운 작업
}

console.log("무거운 작업 끝");

// 출력:
// (3초 후) "무거운 작업 끝"
// (바로 이어서) "타이머 콜백"  ← 1초가 아닌 3초 후에 실행!
```

왜 이런 일이 벌어지는지 흐름을 보면:

```
0ms:    setTimeout 호출 → 런타임에 1000ms 타이머 등록
0ms:    while 루프 시작 (Call Stack 점유 중)
1000ms: 타이머 완료! 콜백이 Task Queue에 들어감
        하지만... Call Stack이 비어있지 않음 (while 루프 실행 중)
        Event Loop: "Stack이 안 비었네. 기다려야지."
2000ms: 여전히 while 루프 실행 중. 콜백은 Queue에서 대기.
3000ms: while 루프 끝 → console.log('무거운 작업 끝') → Stack 비어짐
3000ms: Event Loop: "Stack 비었다!" → 콜백을 Stack으로 → "타이머 콜백" 출력
```

### setTimeout(fn, 0)의 진짜 의미

delay가 0이면 즉시 실행될까요?

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");

// 출력: A → C → B (B가 마지막!)
```

`setTimeout(fn, 0)`은 **"가능한 빨리, 하지만 현재 실행 중인 코드가 다 끝난 후에"**라는 뜻입니다.

이것은 **"현재 Call Stack이 비워진 다음 차례에 실행해달라"**는 요청이며, 콜백을 **Task Queue를 경유**시키는 것이 핵심입니다.

```
동기 코드:  A ──→ setTimeout 호출 ──→ C ──→ (Stack 비어짐)
                    │                            │
                    └→ Queue에 cb 등록             └→ Event Loop가 cb 실행 → B
```

실무에서 이런 패턴을 쓰는 이유:

```js
// DOM 업데이트 후 실행을 보장하고 싶을 때
button.textContent = "로딩 중...";

setTimeout(() => {
  // 위의 DOM 변경이 렌더링된 후에 무거운 작업 시작
  heavyComputation();
}, 0);
```

### Microtask와의 우선순위 차이

`setTimeout`의 콜백은 **Task Queue(Macrotask Queue)**에 들어갑니다. 이것은 **Microtask Queue보다 우선순위가 낮습니다.**

```js
console.log("1");

setTimeout(() => {
  console.log("2 - Macrotask");
}, 0);

Promise.resolve().then(() => {
  console.log("3 - Microtask");
});

console.log("4");
```

```
실행 순서:

1. console.log('1')                          → "1" 출력
2. setTimeout(cb) → cb를 Macrotask Queue에
3. Promise.then(cb) → cb를 Microtask Queue에
4. console.log('4')                          → "4" 출력

── Call Stack 비어짐 ──

5. Event Loop: Microtask Queue 먼저 확인!
   → console.log('3 - Microtask')           → "3 - Microtask" 출력

6. Event Loop: Microtask Queue 비었으니, Macrotask Queue 확인
   → console.log('2 - Macrotask')           → "2 - Macrotask" 출력

출력: "1" → "4" → "3 - Microtask" → "2 - Macrotask"
```

---

## 구체적인 예시

아래 코드의 출력 순서를 예측해보세요:

```js
setTimeout(() => console.log("A"), 100);
setTimeout(() => console.log("B"), 0);

Promise.resolve()
  .then(() => {
    console.log("C");
    setTimeout(() => console.log("D"), 0);
  })
  .then(() => console.log("E"));

console.log("F");
```

**생각해볼 포인트**:

1. 동기 코드는 무조건 먼저 실행된다
2. Microtask(Promise.then)는 Macrotask(setTimeout)보다 먼저 소진된다
3. `.then()` 안에서 새로 등록한 `setTimeout`은 어느 시점에 Queue에 들어갈까?
4. 체이닝된 `.then(() => console.log('E'))`는 언제 Microtask Queue에 들어갈까?

이 문제를 직접 종이에 Call Stack, Microtask Queue, Macrotask Queue를 그려가며 풀어보면, 이벤트 루프의 실행 순서가 체화될 것입니다.
