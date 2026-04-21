# Render Tree

## 한 문장으로

Render Tree는 DOM과 CSSOM을 합쳐서 실제 화면에 그릴 노드만 모아 만든 트리입니다.

## 왜 Render Tree가 필요할까?

DOM에는 화면에 보이지 않는 노드도 포함됩니다.

```html
<body>
  <head>
    <title>문서 제목</title>
  </head>
  <h1>안녕하세요</h1>
  <p style="display: none">숨겨진 문장</p>
</body>
```

DOM 관점에서는 `title`, `h1`, `p` 같은 노드가 존재합니다.

하지만 화면에 실제로 그릴 대상은 다릅니다.

```text
title은 브라우저 탭 제목이지 페이지 화면에 그리는 요소가 아니다.
p는 display: none이라 화면에 보이지 않는다.
h1은 화면에 보인다.
```

브라우저는 실제로 화면에 그릴 대상만 따로 정리해야 합니다. 그 결과가 Render Tree입니다.

## DOM + CSSOM

브라우저는 DOM으로 구조를 알고, CSSOM으로 스타일을 압니다.

```text
DOM: body 안에 h1과 p가 있다.
CSSOM: p는 display: none이다.
```

이 둘을 결합하면 실제로 그릴 노드를 고를 수 있습니다.

```text
Render Tree
  body
    h1
```

`p`는 DOM에는 있지만 Render Tree에는 들어가지 않습니다.

## display: none과 visibility: hidden

둘은 자주 헷갈립니다.

```html
<p class="a">A</p>
<p class="b">B</p>
```

```css
.a {
  display: none;
}

.b {
  visibility: hidden;
}
```

`display: none`은 레이아웃 공간도 차지하지 않고 화면에도 보이지 않습니다. Render Tree에서 빠진다고 이해하면 됩니다.

`visibility: hidden`은 보이지는 않지만 공간은 차지합니다. 그래서 레이아웃 계산에는 영향을 줍니다.

```text
display: none
- 화면에 안 보임
- 공간도 차지하지 않음
- Render Tree에서 제외

visibility: hidden
- 화면에 안 보임
- 공간은 차지함
- Render Tree에 남아 있을 수 있음
```

## Render Tree는 아직 화면이 아니다

Render Tree는 "무엇을 그릴지"를 정리한 것입니다.

하지만 아직 "어디에, 얼마나 크게" 그릴지는 계산하지 않았습니다.

그 다음 단계가 Layout입니다.

## 스스로 답해보기

1. DOM에 있지만 Render Tree에는 없을 수 있는 요소의 예시는 무엇인가요?
2. `display: none`과 `visibility: hidden`의 차이는 무엇인가요?
3. Render Tree가 만들어져도 아직 화면이 완성되지 않은 이유는 무엇인가요?

