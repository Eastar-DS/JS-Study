# Layout

## 한 문장으로

Layout은 Render Tree에 있는 각 요소의 크기와 위치를 계산하는 단계입니다.

## 왜 Layout이 필요할까?

Render Tree는 실제로 그릴 요소를 알고 있습니다.

하지만 아직 각 요소가 화면 어디에 놓일지 모릅니다.

```html
<main>
  <h1>제목</h1>
  <p>본문입니다.</p>
</main>
```

```css
main {
  width: 400px;
}

h1 {
  font-size: 32px;
}

p {
  margin-top: 16px;
}
```

브라우저는 이런 정보를 계산해야 합니다.

```text
main의 x, y 위치는?
main의 너비와 높이는?
h1의 x, y 위치는?
h1의 높이는 글자 크기와 줄 높이를 고려하면 얼마인가?
p는 h1 아래에서 몇 px 떨어져 시작하는가?
```

이 계산이 Layout입니다.

## Layout은 주변 요소의 영향을 받는다

웹 페이지의 요소는 혼자 위치가 정해지지 않습니다.

```html
<p>첫 번째 문장</p>
<p>두 번째 문장</p>
```

첫 번째 문장의 높이가 바뀌면 두 번째 문장의 y 위치도 바뀝니다.

```css
p:first-child {
  font-size: 40px;
}
```

첫 번째 문장이 커지면 두 번째 문장은 아래로 밀립니다.

즉, 어떤 요소의 크기 변화가 다른 요소의 위치에도 영향을 줄 수 있습니다.

## 화면 크기도 Layout에 영향을 준다

아래 CSS를 봅시다.

```css
.card {
  width: 50%;
}
```

부모 너비가 1000px이면 card는 500px입니다.

부모 너비가 600px이면 card는 300px입니다.

같은 CSS라도 화면 크기나 부모 크기에 따라 실제 픽셀 값이 달라집니다. 그래서 Layout은 실제 환경을 기준으로 계산되어야 합니다.

## Layout 결과

Layout이 끝나면 브라우저는 각 요소의 박스 정보를 알게 됩니다.

```text
main: x=0, y=0, width=400, height=120
h1: x=0, y=0, width=400, height=40
p: x=0, y=56, width=400, height=24
```

이 숫자는 예시입니다. 실제 값은 브라우저 기본 스타일, 폰트, CSS, viewport 크기에 따라 달라집니다.

## 흔한 오해

### 오해. CSS에 width가 있으니 Layout은 단순하다

그렇지 않습니다.

`auto`, `%`, `em`, `rem`, `flex`, `grid`, 줄바꿈, 이미지 비율, 폰트 로딩, viewport 크기 등이 모두 Layout 계산에 영향을 줍니다.

## 스스로 답해보기

1. Layout 단계는 무엇을 계산하나요?
2. 어떤 요소의 높이가 바뀌면 왜 다른 요소의 위치도 바뀔 수 있나요?
3. `width: 50%`는 왜 Layout 단계에서 실제 px 값으로 계산되어야 하나요?

