# DOM

## 한 문장으로

DOM은 HTML 문서를 브라우저와 JavaScript가 다룰 수 있는 객체 트리로 표현한 것입니다.

## 왜 DOM이 필요할까?

HTML 문자열만 있으면 JavaScript가 문서를 다루기 어렵습니다.

예를 들어 버튼의 글자를 바꾸고 싶다고 해봅시다.

```html
<button>저장</button>
```

문자열 상태라면 JavaScript는 직접 문자열을 찾아 바꿔야 합니다.

```text
"<button>저장</button>"에서 "저장"이라는 글자를 찾아 "완료"로 바꾼다
```

이 방식은 위험합니다. 같은 글자가 여러 곳에 있을 수도 있고, 구조를 정확히 알기 어렵습니다.

그래서 브라우저는 HTML을 DOM이라는 객체 구조로 바꿉니다.

```text
button 노드
  text 노드: "저장"
```

이제 JavaScript는 문자열이 아니라 객체를 대상으로 작업할 수 있습니다.

```js
const button = document.querySelector("button");
button.textContent = "완료";
```

## DOM은 트리다

HTML이 중첩 구조를 가지기 때문에 DOM도 트리 구조입니다.

```html
<body>
  <h1>제목</h1>
  <button>저장</button>
</body>
```

DOM을 단순화하면 아래처럼 볼 수 있습니다.

```text
document
  html
    body
      h1
        "제목"
      button
        "저장"
```

각 항목을 노드라고 부릅니다.

```text
document 노드
element 노드: html, body, h1, button
text 노드: "제목", "저장"
```

## DOM은 HTML과 완전히 같은 말이 아니다

HTML은 문서의 원본 텍스트입니다.

DOM은 브라우저가 HTML을 해석해서 만든 객체 구조입니다.

처음에는 둘이 비슷해 보이지만 JavaScript가 DOM을 바꾸면 달라질 수 있습니다.

```html
<body>
  <button>저장</button>
</body>
```

```js
const p = document.createElement("p");
p.textContent = "저장되었습니다.";
document.body.appendChild(p);
```

JavaScript 실행 후 DOM은 이런 구조가 됩니다.

```text
body
  button
    "저장"
  p
    "저장되었습니다."
```

하지만 서버에서 받은 원래 HTML 파일에는 `p`가 없었을 수 있습니다.

## DOM이 렌더링과 연결되는 지점

브라우저가 화면을 그리려면 먼저 무엇이 있는지 알아야 합니다.

그 "무엇"에 대한 구조가 DOM입니다.

하지만 DOM만으로는 부족합니다.

```text
DOM: 어떤 요소가 있는가?
CSSOM: 각 요소가 어떻게 보여야 하는가?
Layout: 각 요소가 어디에 얼마나 크게 놓이는가?
Paint: 실제로 어떻게 그릴 것인가?
```

DOM은 렌더링의 출발점이지, 렌더링 전체가 아닙니다.

## 스스로 답해보기

1. DOM은 HTML과 어떤 점이 다른가요?
2. JavaScript가 HTML 문자열 대신 DOM을 다루는 것이 왜 더 안전하고 편할까요?
3. DOM만으로는 화면을 완성할 수 없는 이유는 무엇인가요?

