# Box Model

## 한 문장으로

Box Model은 브라우저가 HTML 요소를 화면에 배치할 때 각 요소를 사각형 박스로 보고, 그 박스를 content, padding, border, margin으로 나누어 계산하는 모델입니다.

## 왜 Layout 전에 알아야 할까?

Layout은 요소의 크기와 위치를 계산하는 단계입니다.

그런데 초심자에게 "요소의 크기"라는 말은 생각보다 모호합니다.

```css
.card {
  width: 300px;
  padding: 20px;
  border: 1px solid black;
  margin: 16px;
}
```

이 요소의 실제 공간은 단순히 `width: 300px`만으로 끝나지 않습니다.

브라우저는 아래 네 영역을 함께 고려합니다.

```text
content: 실제 내용이 들어가는 영역
padding: content와 border 사이의 안쪽 여백
border: 테두리
margin: 다른 요소와의 바깥 여백
```

## 기본 구조

```text
margin
  border
    padding
      content
```

HTML 요소는 기본적으로 이런 사각형 박스로 계산됩니다.

```html
<div class="card">내용</div>
```

```css
.card {
  width: 300px;
  padding: 20px;
  border: 2px solid black;
  margin: 16px;
}
```

기본 `box-sizing: content-box`에서는 `width: 300px`이 content 영역의 너비입니다.

실제 border까지 포함한 너비는 아래처럼 계산됩니다.

```text
content 300px
+ left padding 20px
+ right padding 20px
+ left border 2px
+ right border 2px
= 344px
```

margin까지 주변 공간으로 보면 좌우 16px씩 더 필요합니다.

## box-sizing

실무에서는 아래 설정을 자주 봅니다.

```css
* {
  box-sizing: border-box;
}
```

`border-box`에서는 `width`가 content만이 아니라 padding과 border까지 포함합니다.

```css
.card {
  box-sizing: border-box;
  width: 300px;
  padding: 20px;
  border: 2px solid black;
}
```

이 경우 border까지 포함한 박스 너비가 300px입니다.

content 영역은 더 작아집니다.

```text
전체 너비 300px
- 좌우 padding 40px
- 좌우 border 4px
= content 너비 256px
```

## 렌더링과 연결

Box Model을 모르면 Layout에서 브라우저가 무엇을 계산하는지 이해하기 어렵습니다.

브라우저는 단순히 태그를 위에서 아래로 놓는 것이 아니라, 각 요소의 content, padding, border, margin을 고려해 위치와 크기를 계산합니다.

## 스스로 답해보기

1. Box Model의 네 영역은 무엇인가요?
2. `content-box`와 `border-box`의 차이는 무엇인가요?
3. Layout 단계에서 Box Model이 중요한 이유는 무엇인가요?

