# Stacking Context

## 한 문장으로

Stacking Context는 요소들이 z축 방향으로 어떤 순서로 쌓이고 그려질지 결정하는 독립적인 쌓임 영역입니다.

## 왜 Paint를 이해할 때 필요할까?

Paint는 요소를 화면에 그리는 단계입니다.

그런데 요소들이 겹치면 브라우저는 무엇을 먼저 그리고, 무엇을 나중에 그릴지 정해야 합니다.

```html
<div class="red"></div>
<div class="blue"></div>
```

```css
.red {
  position: absolute;
  width: 100px;
  height: 100px;
  background: red;
}

.blue {
  position: absolute;
  left: 40px;
  width: 100px;
  height: 100px;
  background: blue;
}
```

두 박스가 겹치면 어떤 박스가 위에 보일까요?

브라우저는 정해진 쌓임 규칙에 따라 그립니다.

## z-index의 기본

`z-index`는 요소의 쌓임 순서를 조정하는 속성입니다.

```css
.red {
  position: relative;
  z-index: 2;
}

.blue {
  position: relative;
  z-index: 1;
}
```

이 경우 `.red`가 `.blue`보다 위에 그려질 수 있습니다.

하지만 `z-index`는 아무 때나 동작하는 마법 숫자가 아닙니다.

일반적으로 positioned element, flex/grid item 등 특정 조건에서 의미를 가집니다.

## Stacking Context가 생기는 대표적인 경우

아래 조건들은 새로운 Stacking Context를 만들 수 있습니다.

```css
position: relative; z-index: 1;
position: absolute; z-index: 1;
position: fixed;
opacity: 0.9;
transform: translateX(10px);
filter: blur(4px);
isolation: isolate;
```

처음부터 모든 조건을 외울 필요는 없습니다.

중요한 것은 어떤 요소가 독립적인 쌓임 영역을 만들면, 그 안의 자식들은 바깥 요소와 단순히 숫자만 비교되지 않을 수 있다는 점입니다.

## z-index가 기대대로 안 되는 예시

```html
<div class="parent">
  <div class="child">child</div>
</div>
<div class="sibling">sibling</div>
```

```css
.parent {
  position: relative;
  z-index: 1;
}

.child {
  position: relative;
  z-index: 9999;
}

.sibling {
  position: relative;
  z-index: 2;
}
```

`child`의 z-index가 9999여도, `parent`가 만든 쌓임 영역 자체가 `sibling`보다 아래라면 `child`는 `sibling` 위로 올라가지 못할 수 있습니다.

```text
parent 영역 전체: z-index 1
sibling: z-index 2
parent 안의 child: parent 안에서는 9999지만, parent 바깥으로 탈출하지 못함
```

## 렌더링과 연결

Paint 단계는 단순히 요소를 하나씩 칠하는 것이 아닙니다.

브라우저는 쌓임 순서를 고려해서 어떤 요소를 먼저 그리고 나중에 그릴지 결정합니다.

Stacking Context를 이해하면 모달, 드롭다운, 툴팁, 오버레이가 왜 뒤에 깔리거나 앞으로 나오지 않는지 설명할 수 있습니다.

## 스스로 답해보기

1. Stacking Context는 무엇인가요?
2. `z-index: 9999`가 항상 모든 요소 위로 올라가지 않는 이유는 무엇인가요?
3. Paint 단계에서 쌓임 순서를 이해해야 하는 이유는 무엇인가요?

