## 쉬운 설명부터

식당에서 **주문 번호표**를 상상해보세요.

```
1. 카운터에서 주문 → 번호표 받음 (아직 음식 없음)
2. 기다림... (주방에서 조리 중)
3-a. 번호 호출! → 음식 받음 (성공)
3-b. "재료 소진" 안내 → 환불 (실패)
```

- **번호표** = Promise 객체
- **음식 아직 안 나옴** = `pending` 상태
- **음식 받음** = `fulfilled` 상태
- **주문 실패** = `rejected` 상태

번호표가 없던 시절에는 카운터 앞에 서서 "다 되면 알려주세요, 그러면 제가 소스 뿌리고, 자리 잡고, 먹을게요"라고 말해야 했습니다. 이게 **콜백**입니다. Promise는 번호표를 들고 자리에 앉아서, **내가 원하는 시점에 결과를 확인**할 수 있게 해주는 것입니다.

---

## 자세한 설명

### Promise는 왜 필요한가 — 콜백의 한계

Promise가 없던 시절의 비동기 처리:

```js
// 콜백 패턴: 사용자 정보 → 주문 목록 → 주문 상세
getUser(userId, function(user) {
  getOrders(user.id, function(orders) {
    getOrderDetail(orders[0].id, function(detail) {
      getProduct(detail.productId, function(product) {
        console.log(product.name);
        // 에러 처리는? 각 단계마다 따로 해야 함...
      }, handleError);
    }, handleError);
  }, handleError);
}, handleError);
```

이것이 **콜백 지옥(Callback Hell)**입니다. 문제점:

1. 코드가 오른쪽으로 계속 들어감 (가독성 파괴)
2. 에러 처리를 매 단계마다 개별적으로 해야 함
3. 여러 비동기 작업의 동시 실행/순서 제어가 어려움

### Promise의 3가지 상태

```
                    resolve(value) 호출
          ┌──────────────────────────────────┐
          │                                  ▼
     ┌─────────┐                      ┌────────────┐
     │ pending  │                      │ fulfilled  │
     │ (대기중)  │                      │ (이행됨)    │
     └─────────┘                      └────────────┘
          │                                  
          │         reject(reason) 호출       
          └──────────────────────────────────┐
                                             ▼
                                       ┌───────────┐
                                       │ rejected  │
                                       │ (거부됨)   │
                                       └───────────┘

  ※ 한 번 fulfilled 또는 rejected가 되면 다시 바뀌지 않음 (불변)
```

### Promise 생성

```js
const promise = new Promise((resolve, reject) => {
  // 이 함수는 즉시 실행됨 (executor)
  
  // 비동기 작업 수행...
  const success = true;
  
  if (success) {
    resolve('성공 데이터');  // → fulfilled 상태로 변경
  } else {
    reject('실패 이유');     // → rejected 상태로 변경
  }
});
```

**중요: executor 함수는 동기적으로 즉시 실행됩니다.**

```js
console.log('A');

const promise = new Promise((resolve, reject) => {
  console.log('B');  // 즉시 실행됨!
  resolve('완료');
});

console.log('C');

// 출력: A → B → C
// "B"가 "C"보다 먼저! executor는 동기 실행이니까.
```

### .then(), .catch(), .finally()

Promise의 결과를 받아 처리하는 메서드들입니다. **모두 새로운 Promise를 반환**합니다.

```js
promise
  .then(value => {
    // fulfilled 되었을 때 실행
    // value = resolve()에 전달한 값
    return '다음 값';  // 다음 .then()에 전달됨
  })
  .catch(error => {
    // rejected 되었을 때 실행
    // error = reject()에 전달한 값
  })
  .finally(() => {
    // 성공이든 실패든 항상 실행
    // 인자를 받지 않음
  });
```

### Promise 체이닝 — 콜백 지옥의 해결

```js
// 콜백 지옥이었던 코드가:
getUser(userId)
  .then(user => getOrders(user.id))
  .then(orders => getOrderDetail(orders[0].id))
  .then(detail => getProduct(detail.productId))
  .then(product => console.log(product.name))
  .catch(error => {
    // 어느 단계에서 에러가 나든 여기서 한 번에 처리!
    console.error(error);
  });
```

체이닝이 가능한 이유: **`.then()`이 항상 새로운 Promise를 반환**하기 때문입니다.

```js
// .then()의 반환값에 따라 다음 Promise가 결정됨

.then(value => {
  return '일반값';         // → Promise.resolve('일반값')으로 감싸짐
})

.then(value => {
  return Promise.resolve('명시적'); // → 그대로 Promise로 전달
})

.then(value => {
  return fetch('/api');    // → fetch가 반환한 Promise가 됨
})

.then(value => {
  throw new Error('실패'); // → Promise.reject(Error)가 됨
})
```

### 에러 전파의 흐름

```js
Promise.resolve('시작')
  .then(v => {
    console.log(1);
    throw new Error('여기서 에러!');
  })
  .then(v => {
    console.log(2);       // ← 실행 안 됨! 건너뜀
  })
  .then(v => {
    console.log(3);       // ← 실행 안 됨! 건너뜀
  })
  .catch(err => {
    console.log('잡음:', err.message);  // "잡음: 여기서 에러!"
    return '복구됨';      // catch에서 return하면 다시 fulfilled
  })
  .then(v => {
    console.log(4, v);    // "4 복구됨" ← 다시 정상 흐름
  });

// 출력: 1 → "잡음: 여기서 에러!" → 4 "복구됨"
```

```
에러 발생 시 흐름:

.then(1) ──에러!──→ .then(2) ──건너뜀──→ .then(3) ──건너뜀──→ .catch()
                                                                │
                                                          return '복구'
                                                                │
                                                                ▼
                                                            .then(4)
```

### 정적 메서드들

```js
// 즉시 fulfilled Promise 생성
Promise.resolve('값');

// 즉시 rejected Promise 생성
Promise.reject('에러');

// 모두 성공해야 성공 (하나라도 실패하면 즉시 실패)
Promise.all([p1, p2, p3])
  .then(([r1, r2, r3]) => { /* 모든 결과 배열 */ });

// 성공/실패 상관없이 모든 결과를 받음
Promise.allSettled([p1, p2, p3])
  .then(results => {
    // [{ status:'fulfilled', value:... }, { status:'rejected', reason:... }]
  });

// 가장 먼저 끝나는 것의 결과 (성공이든 실패든)
Promise.race([p1, p2, p3]);

// 가장 먼저 성공하는 것의 결과 (모두 실패하면 AggregateError)
Promise.any([p1, p2, p3]);
```

---

## 이벤트 루프 관점에서 Promise

이벤트 루프를 공부하는 맥락에서 **가장 중요한 부분**입니다.

### .then() 콜백은 Microtask Queue에 들어간다

```js
console.log('1');

setTimeout(() => console.log('2'), 0);    // Macrotask Queue

Promise.resolve()
  .then(() => console.log('3'));          // Microtask Queue

console.log('4');
```

```
실행 흐름:

[Call Stack]                [Microtask Queue]    [Macrotask Queue]

console.log('1')                                                   → "1"
setTimeout(cb) 등록                               [cb]
Promise.resolve()
  .then(cb2) 등록            [cb2]
console.log('4')                                                   → "4"

── Stack 비어짐 ──

Event Loop: Microtask 먼저!
  cb2 실행                                                         → "3"

Event Loop: Microtask 비었으니 Macrotask
  cb 실행                                                          → "2"

출력: "1" → "4" → "3" → "2"
```

### Microtask 안에서 Microtask가 생기면?

```js
Promise.resolve()
  .then(() => {
    console.log('A');
    Promise.resolve().then(() => console.log('B'));
  })
  .then(() => console.log('C'));

setTimeout(() => console.log('D'), 0);
```

```
[Microtask Queue]           [Macrotask Queue]

초기:  [then-1]              [setTimeout-cb]

── then-1 실행: console.log('A') ──                               → "A"
   → 내부에서 Promise.resolve().then(cbB) 등록
   → then-1 완료 → 체이닝된 then-2(cbC)도 등록

Queue: [cbB, cbC]            [setTimeout-cb]

── cbB 실행 ──                                                     → "B"
── cbC 실행 ──                                                     → "C"

── Microtask 전부 소진! 이제 Macrotask ──

── setTimeout-cb 실행 ──                                           → "D"

출력: "A" → "B" → "C" → "D"
```

**Microtask Queue가 완전히 비워질 때까지 Macrotask는 실행되지 않습니다.** Microtask 안에서 새로운 Microtask가 생겨도 그것까지 모두 처리한 후에야 다음 Macrotask로 넘어갑니다.

---

## 구체적인 예시

아래 코드의 출력 순서를 예측해보세요:

```js
console.log('1');

const p = new Promise((resolve, reject) => {
  console.log('2');
  resolve('ok');
  console.log('3');  // resolve 이후에도 실행될까?
});

p.then(value => {
  console.log('4:', value);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('inner');
      console.log('5');
    }, 0);
  });
}).then(value => {
  console.log('6:', value);
});

setTimeout(() => console.log('7'), 0);

Promise.resolve().then(() => console.log('8'));

console.log('9');
```

**생각해볼 포인트**:

1. `new Promise(executor)` 안의 코드는 동기 실행 — `'2'`와 `'3'`은 언제?
2. `resolve()` 호출 후에도 executor의 나머지 코드는 실행될까?
3. `.then()` 안에서 `new Promise`를 return하면, 다음 `.then()`은 언제 실행될까?
4. 그 안의 `setTimeout`이 `resolve`를 호출하면, `'6'`은 Microtask일까 Macrotask일까?
5. 바깥의 `setTimeout(() => '7')`과 안쪽의 `setTimeout(() => '5')` 중 누가 먼저일까?

종이에 Call Stack, Microtask Queue, Macrotask Queue 세 칸을 그려놓고 한 줄씩 따라가보세요.


### 공부 전
Promise : 코드를 비동기로 실행시키고 싶을때 사용한다는 정도로만 알고있음. Promise 객체로 만들면 무슨일이 일어나는건지는 전혀 모름.
then() 에서 value 라는 파라미터를 사용하는데 갑자기 웬 value인가 싶음.

코드 출력 순서 예측 : 너무 헷갈린다. 잘 모르겠음.
1 - 9 - 2 - 4 - 6 - 7 - 8

생각해볼 포인트 : 
1. 갑자기 웬 executor?
2. resolve()가 완료표시라고 가정하면 나머지 코드는 실행 안될거같음.
3. 어쨋든 먼저 실행시킨 then이 모두 실행되어야 다음 then이 실행되도록 구현해놨을거같음.
4. then 안에 있는건 다 Microtask인거 아닌가?
5. then을 사용하면 Microtask니까 5가 먼저이려나?

### 공부 후
코드 출력 순서 예측 : 
1 - 2 - 3 - 9 - 4 - 6 - 8 - 5 - 7

생각해볼 포인트 : 
1. 2,3 모두 동기실행. 차례대로나옴.
2. 실행됨.
3. then 안에서 프로미스를 리턴한다는게 중요해보이지 않음. 그냥 then 다음에 그다음 then 아닌가?
4. then 안은 무조건 Microtask. 하지만 setTimeout이 실행될때 microtask로 등록하겠지.
5. 매크로태스크에 등록할 순서가 어쨋든 5가 먼저니까 5.

### 피드백 후
코드 출력 순서 예측 : 너무 이해가 안가서 콘솔에 출력해봤음.
출력 결과
```
VM16:1 1
VM16:4 2
VM16:6 3
VM16:25 9
VM16:10 4: ok
VM16:23 8
undefined
VM16:21 7
VM16:14 5
VM16:18 6: inner
```
1 - 2 - 3 - 9 - 4 - 8 - 7 - 5 - 6 
답을 보고 생각한건데,
1,2,3,9,4까지는 맞췄었고.
5의 경우 then 안에서 Promise를 반환하는데 그 안에서 setTimeout이 있으므로 태스크 큐에 등록됨. setTimeout 안의 내용은 일단 확인 안함.
따라서 5다음에 일어나는 6도 일단 후순위.
7도 태스크 큐에 등록.
8이 마이크로 태스트 큐에 등록되므로 4 다음에는 8이 실행.
8이 실행되었으므로 태스크 큐에 등록되어있는 두개의 setTimeout이 실행되어야함.
내 생각에는 value가 inner가 되고 5,6 출력 후 7이 출력되어야할 거 같았음.