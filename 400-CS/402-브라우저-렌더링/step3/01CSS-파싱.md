# CSS 파싱

## 한 문장으로

CSS 파싱은 CSS 문자열을 브라우저가 이해할 수 있는 스타일 규칙 구조로 해석하는 과정입니다.

## 왜 CSS도 파싱해야 할까?

HTML이 문자열로 도착하듯 CSS도 문자열로 도착합니다.

```css
button {
  color: white;
  background: blue;
}
```

브라우저는 이 문자열을 보고 아래 내용을 이해해야 합니다.

```text
선택자: button
속성: color
값: white
속성: background
값: blue
```

이렇게 CSS 문법을 의미 있는 규칙으로 해석하는 과정이 CSS 파싱입니다.

## CSS는 "누구에게 무엇을 적용할지"를 말한다

CSS 규칙은 크게 두 부분으로 볼 수 있습니다.

```css
.primary {
  color: white;
  background-color: blue;
}
```

```text
.primary: 어떤 요소에 적용할지 고르는 선택자
color/background-color: 어떤 스타일을 바꿀지 나타내는 속성
white/blue: 실제 적용할 값
```

브라우저는 이 규칙을 DOM의 요소들과 연결해야 합니다.

```html
<button class="primary">저장</button>
```

이 버튼은 `.primary` 선택자와 매칭됩니다. 그래서 글자색과 배경색이 적용됩니다.

## CSS 계산은 생각보다 복잡하다

CSS는 단순히 위에서 아래로 마지막 값을 고르는 일이 아닙니다.

아래 요소를 봅시다.

```html
<button id="save" class="primary">저장</button>
```

```css
button {
  color: black;
}

.primary {
  color: white;
}

#save {
  color: yellow;
}
```

세 규칙이 모두 같은 버튼에 적용될 수 있습니다.

이때 브라우저는 CSS 우선순위를 계산합니다.

```text
button 선택자보다 .primary가 더 강하다.
.primary보다 #save가 더 강하다.
최종 color는 yellow다.
```

이런 계산 때문에 CSS도 브라우저가 다룰 수 있는 구조로 정리되어야 합니다.

## 상속도 고려해야 한다

일부 CSS 속성은 부모 요소에서 자식 요소로 상속됩니다.

```html
<main>
  <p>안녕하세요</p>
</main>
```

```css
main {
  color: blue;
}
```

`p`에 직접 `color`를 지정하지 않았지만, 글자색은 파란색이 될 수 있습니다. `color`가 상속되는 속성이기 때문입니다.

반대로 `width`, `margin`, `border` 같은 속성은 일반적으로 그대로 상속되지 않습니다.

## 핵심 정리

CSS 파싱은 CSS 문자열을 규칙으로 해석하는 과정입니다.

브라우저는 선택자, 속성, 값을 이해하고, 나중에 DOM 요소마다 어떤 스타일을 적용할지 계산할 준비를 합니다.

## 스스로 답해보기

1. CSS 규칙에서 선택자, 속성, 값은 각각 무엇인가요?
2. 하나의 요소에 여러 CSS 규칙이 적용될 수 있다는 말은 무슨 뜻인가요?
3. CSS 우선순위와 상속 때문에 브라우저가 추가 계산을 해야 하는 이유는 무엇인가요?

