[[05-Promise|Promise]]

## 자세한 설명

### fetch도 자바스크립트가 아니다

`setTimeout`과 마찬가지로, `fetch`는 **JS 엔진이 아닌 런타임 환경이 제공하는 API**입니다.

```
브라우저 → Web API로 fetch 제공
Node.js  → v18부터 내장 (그 전에는 node-fetch 패키지 필요)
```

### fetch가 하는 일

**네트워크를 통해 서버에 HTTP 요청을 보내고, 응답을 받아오는 것.**

```js
const response = await fetch("https://api.example.com/users");
```

이 한 줄이 실제로 하는 일:

```
브라우저                    인터넷                    서버
  │                                                  │
  │  "GET /users 데이터 주세요" ──────────────────→    │
  │                                                  │
  │                          ←────────────────────   │
  │              { 상태: 200, 데이터: [...] }         │
```

### fetch의 기본 문법

```js
fetch(url, options);
```

`fetch`는 **항상 Promise를 반환**합니다. 이것이 핵심입니다.

```js
// fetch의 반환값
const promise = fetch("https://api.example.com/users");
console.log(promise); // Promise { <pending> }
```

네트워크 요청은 언제 끝날지 모르기 때문에, 즉시 결과를 줄 수 없습니다. 대신 **"나중에 결과를 알려줄게"라는 약속(Promise)**을 반환하는 것이죠.

### fetch의 2단계 응답 구조

fetch에는 많은 사람이 헷갈리는 특징이 있습니다. **응답을 두 단계에 걸쳐 받는다**는 것입니다.

```js
// 1단계: HTTP 응답 헤더가 도착 → Response 객체 반환
const response = await fetch("https://api.example.com/users");
// 이 시점에서는 헤더(상태코드, Content-Type 등)만 도착한 상태
// 본문(body) 데이터는 아직 스트리밍 중일 수 있음

console.log(response.status); // 200
console.log(response.ok); // true (200-299면 true)
console.log(response.headers); // Headers 객체

// 2단계: 본문(body)을 원하는 형식으로 파싱
const data = await response.json(); // body를 JSON으로 파싱
// 이제야 실제 데이터를 사용할 수 있음
```

왜 2단계일까요?

```
서버 응답이 도착하는 과정:

────── 시간 ──────→

[헤더 도착]              [본문 도착 ........................완료]
 status: 200             { "users": [ ... 10MB 데이터 ... ] }
 content-type: json
                         ↑ 본문이 크면 시간이 걸림

 ↑ 1단계 완료             ↑ 2단계 완료
 response 반환            response.json() 완료
```

본문이 수십 MB일 수도 있기 때문에, 헤더가 도착한 시점에서 먼저 **상태코드를 확인하고 계속 진행할지 결정**할 수 있게 해주는 설계입니다.

```js
const response = await fetch("/api/large-file");

// 헤더만 보고 판단할 수 있음
if (!response.ok) {
  // 404, 500 등이면 본문을 읽을 필요 없이 바로 처리
  throw new Error(`HTTP ${response.status}`);
}

// 괜찮으면 그때 본문을 읽기 시작
const data = await response.json();
```

### 본문 파싱 메서드들

Response 객체는 본문을 다양한 형태로 읽을 수 있습니다. **모두 Promise를 반환**합니다.

```js
response.json(); // JSON → 자바스크립트 객체
response.text(); // 텍스트 문자열
response.blob(); // 이미지, 파일 등 바이너리 데이터
response.arrayBuffer(); // 로우 바이너리 버퍼
response.formData(); // FormData 객체
```

**주의: 본문은 한 번만 읽을 수 있습니다.**

```js
const response = await fetch("/api/data");
const json = await response.json(); // ✅ 첫 번째: 정상
const text = await response.text(); // ❌ TypeError: body already consumed
```

### HTTP 메서드별 사용법

```js
// GET (기본값) — 데이터 조회
const response = await fetch("/api/users");

// POST — 데이터 생성
const response = await fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "김개발",
    email: "dev@example.com",
  }),
});

// PUT — 데이터 전체 수정
const response = await fetch("/api/users/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "박개발", email: "park@example.com" }),
});

// DELETE — 데이터 삭제
const response = await fetch("/api/users/1", {
  method: "DELETE",
});
```

### fetch의 에러 처리 — 가장 흔한 실수

**fetch는 HTTP 에러(404, 500 등)에서 reject되지 않습니다.**

```js
// ❌ 흔한 실수: catch에서 404를 잡으려고 함
try {
  const response = await fetch("/api/없는경로");
  const data = await response.json(); // 404인데도 여기까지 옴!
} catch (error) {
  // 404, 500 등은 여기로 오지 않음
  // 오직 네트워크 장애(서버 다운, 인터넷 끊김)만 여기로 옴
}
```

```js
// ✅ 올바른 에러 처리
try {
  const response = await fetch("/api/users");

  if (!response.ok) {
    // 4xx, 5xx 에러는 여기서 직접 처리
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
} catch (error) {
  // 네트워크 장애 + 위에서 throw한 HTTP 에러 모두 처리
  console.error(error.message);
}
```

fetch가 **reject(에러)**되는 경우는 오직:

- 네트워크 연결 실패 (인터넷 끊김, DNS 실패)
- CORS 오류
- 요청이 abort된 경우

서버가 응답을 준 이상(404든 500이든), fetch 입장에서는 **"요청-응답 통신 자체는 성공"**이기 때문입니다.

---

## 이벤트 루프 관점에서 fetch

이벤트 루프를 공부하는 맥락에서 가장 중요한 부분입니다.

```js
console.log("1");

fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then((response) => response.json())
  .then((data) => console.log("2:", data.title));

console.log("3");
```

```
[Call Stack]                [Web API]              [Microtask Queue]

1. console.log('1')                                                  → "1"

2. fetch() 호출
   → 런타임에 위임 ──────→  네트워크 스레드에서
   → Promise(pending) 반환    HTTP 요청 처리 중...
   → .then(cb1) 등록           (수백ms 소요)
   → .then(cb2) 등록

3. console.log('3')                                                  → "3"

── Call Stack 비어짐 ──

   ... (네트워크 응답 대기 중) ...

                              응답 도착!
                              → Promise가 fulfilled됨
                              → cb1이 Microtask Queue에 ────→ [cb1]

── Event Loop: cb1 실행 ──
   response.json() 호출
   → 또 Promise 반환 → 파싱 완료 후
   → cb2가 Microtask Queue에 ────────────→ [cb2]

── Event Loop: cb2 실행 ──
   console.log('2:', data.title)                                     → "2: ..."
```

핵심: fetch의 `.then()` 콜백은 **Microtask Queue**에 들어갑니다. setTimeout의 콜백이 Macrotask Queue에 들어가는 것과 다릅니다.

---

## 구체적인 예시

아래 코드의 출력 순서를 예측해보세요:

```js
console.log("A");

setTimeout(() => console.log("B"), 0);

fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then((response) => {
    console.log("C");
    return response.json();
  })
  .then((data) => {
    console.log("D");
  });

Promise.resolve().then(() => console.log("E"));

console.log("F");
```

**생각해볼 포인트**:

1. `A`와 `F`는 동기 코드 — 언제 출력될까?
2. `E`는 `Promise.resolve()`이니 즉시 fulfilled — Microtask Queue에 바로 들어감
3. `B`는 `setTimeout(fn, 0)` — Macrotask Queue에 들어감
4. `C`와 `D`는 fetch 응답이 와야 실행됨 — **네트워크 시간이 필요**
5. Event Loop는 Microtask를 Macrotask보다 먼저 처리함

`E`와 `B` 중 누가 먼저일지, `C/D`와 `B` 중 누가 먼저일지를 생각해보면 — 특히 `C/D`는 **네트워크 속도에 따라 달라질 수 있다**는 점이 핵심입니다. 항상 같은 순서가 보장되는 것과 그렇지 않은 것을 구분할 수 있어야 합니다.
