## 쉬운 설명부터

Promise 체이닝을 **동기 코드처럼 읽히게** 만들어주는 문법입니다.

```
Promise 체이닝:
  "주문하고 → .then(음식 받으면) → .then(소스 뿌리고) → .then(먹기)"

async/await:
  "주문하고
   음식 = await 기다리기
   소스 뿌리고
   먹기"
```

코드가 위에서 아래로 자연스럽게 읽힙니다. 하지만 내부적으로는 **Promise와 완전히 동일하게 동작**합니다.

---

## 자세한 설명

### async 함수

`async` 키워드를 함수 앞에 붙이면, 그 함수는 **항상 Promise를 반환**합니다.

```js
async function greet() {
  return "hello";
}

// 위는 아래와 완전히 동일:
function greet() {
  return Promise.resolve("hello");
}

greet().then((value) => console.log(value)); // 'hello'
```

명시적으로 return하지 않아도 Promise를 반환합니다:

```js
async function doSomething() {
  console.log("작업");
  // return 없음 → Promise.resolve(undefined) 반환
}
```

### await 키워드

`await`은 **async 함수 안에서만** 사용할 수 있고, Promise가 resolve될 때까지 **해당 함수의 실행을 일시 중단**합니다.

```js
async function fetchUser() {
  const response = await fetch("/api/user");
  //                     ↑ fetch가 반환한 Promise가 resolve될 때까지
  //                       이 함수의 실행이 여기서 멈춤
  //                       (메인 스레드는 멈추지 않음!)

  const data = await response.json();
  //                  ↑ json() Promise가 resolve될 때까지 또 멈춤

  return data;
}
```

핵심: **함수의 실행이 멈추는 것이지, 메인 스레드가 멈추는 것이 아닙니다.**

### async/await = Promise의 문법적 설탕

모든 async/await 코드는 Promise 체이닝으로 변환할 수 있습니다:

```js
// async/await 버전
async function getUser() {
  const response = await fetch("/api/user");
  const data = await response.json();
  console.log(data);
  return data;
}

// 위와 완전히 동일한 Promise 버전
function getUser() {
  return fetch("/api/user")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    });
}
```

### 에러 처리: try/catch

Promise의 `.catch()`가 `try/catch`로 바뀝니다:

```js
// Promise 버전
fetch("/api/user")
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));

// async/await 버전
async function getUser() {
  try {
    const res = await fetch("/api/user");
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

---

## 이벤트 루프 관점에서 async/await

이것이 이벤트 루프를 공부하는 맥락에서 가장 중요한 부분입니다.

### await 이후의 코드는 Microtask Queue를 경유한다

```js
async function example() {
  console.log("A"); // 동기 실행
  await Promise.resolve();
  console.log("B"); // ← 이 부분이 Microtask Queue를 경유
}
```

위 코드가 내부적으로 변환되는 형태:

```js
function example() {
  console.log("A"); // 동기 실행
  return Promise.resolve().then(() => {
    console.log("B"); // ← .then() 콜백 = Microtask
  });
}
```

**`await` 뒤의 코드는 `.then()` 안에 들어간다** — 따라서 Microtask Queue를 통해 실행됩니다.

### 실행 흐름을 자세히 추적

```js
console.log("1");

async function foo() {
  console.log("2");
  await Promise.resolve();
  console.log("3");
}

foo();
console.log("4");
```

```
[Call Stack]                    [Microtask Queue]

console.log('1')                                        → "1"

foo() 호출
  console.log('2')                                      → "2"
  await Promise.resolve()
    → Promise.resolve()가 즉시 fulfilled
    → await 이후 코드(console.log('3'))를
      Microtask Queue에 등록      [cb-3]
    → foo() 함수 실행을 여기서 일시 중단
    → foo()에서 빠져나옴 (호출자로 돌아감)

console.log('4')                                        → "4"

── Call Stack 비어짐 ──

Microtask 소진:
  cb-3 실행 → console.log('3')                          → "3"

출력: "1" → "2" → "4" → "3"
```

`await`을 만나면:

1. 오른쪽 표현식(Promise.resolve())을 평가
2. **함수 실행을 중단**하고 호출자에게 돌아감
3. await 이후 코드를 **Microtask Queue에 등록**
4. 나중에 이벤트 루프가 실행

### 여러 await이 있는 경우

```js
async function foo() {
  console.log("A");
  await Promise.resolve();
  console.log("B"); // 첫 번째 Microtask
  await Promise.resolve();
  console.log("C"); // 두 번째 Microtask (B가 끝난 후 등록됨)
}

foo();
console.log("D");
```

```
동기: 'A' → 'D'
첫 번째 await 이후 Microtask: 'B'
두 번째 await 이후 Microtask: 'C'

출력: "A" → "D" → "B" → "C"
```

각 `await`마다 함수가 중단되고, 재개 시점이 Microtask Queue를 경유합니다. `B`가 실행된 후에야 두 번째 `await` 이후의 `C`가 Microtask Queue에 등록됩니다.

---

## 구체적인 예시

아래 코드의 출력 순서를 예측해보세요:

```js
async function alpha() {
  console.log("A");
  await beta();
  console.log("B");
}

async function beta() {
  console.log("C");
  await Promise.resolve();
  console.log("D");
}

console.log("E");
alpha();
console.log("F");

setTimeout(() => console.log("G"), 0);
Promise.resolve().then(() => console.log("H"));
```

**생각해볼 포인트**:

1. `alpha()` 안에서 `await beta()`를 만나면 — 먼저 `beta()`를 호출한다. `beta()` 안의 동기 코드(`'C'`)는 언제 실행되는가?
2. `beta()` 안에서 `await Promise.resolve()`를 만나면 — `beta()`가 중단되고 `alpha()`로 돌아온다. 그런데 `alpha()`도 `await beta()`에서 기다리고 있다. 그러면 `alpha()`도 중단되어 호출자로 돌아간다.
3. `'F'`는 언제 출력되는가?
4. `beta()`의 `'D'`와 `alpha()`의 `'B'`와 외부의 `'H'` — 이 셋은 모두 Microtask인데, 어떤 순서로 Queue에 등록되는가?
5. `'G'`(Macrotask)는 어느 시점에 실행되는가?
