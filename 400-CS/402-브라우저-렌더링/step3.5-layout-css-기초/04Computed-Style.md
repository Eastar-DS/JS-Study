# Computed Style

## 한 문장으로

Computed Style은 브라우저가 CSS 규칙, 상속, 우선순위, 기본 스타일을 모두 계산해서 각 요소에 적용될 최종 스타일 값에 가깝게 정리한 결과입니다.

## 왜 CSSOM 다음에 알아야 할까?

CSSOM은 CSS 규칙을 브라우저가 다룰 수 있는 구조로 만든 것입니다.

하지만 화면을 그리려면 규칙 목록만으로는 부족합니다.

브라우저는 각 요소마다 실제로 어떤 스타일이 적용되는지 계산해야 합니다.

```html
<main>
  <p class="message">안녕하세요</p>
</main>
```

```css
main {
  color: blue;
}

p {
  font-size: 16px;
}

.message {
  font-weight: bold;
}
```

`p.message`의 최종 스타일은 여러 출처에서 모입니다.

```text
color: blue        -> main에서 상속
font-size: 16px    -> p 규칙에서 적용
font-weight: bold  -> .message 규칙에서 적용
display: block     -> 브라우저 기본 스타일
```

## CSS 값은 단계적으로 결정된다

처음에는 아래 세 단계만 이해하면 충분합니다.

```text
specified value: CSS에 명시된 값
computed value: 상속, 우선순위, 기본값 등을 고려해 계산된 값
used value: Layout에서 실제로 사용되는 값
```

예를 들어:

```css
.box {
  width: 50%;
}
```

`50%`는 CSS에 명시된 값입니다.

하지만 Layout 단계에서는 실제 px 값이 필요합니다.

부모 너비가 800px이면 실제 사용 너비는 400px입니다.

```text
specified value: 50%
used value: 400px
```

## DevTools에서 확인하기

Chrome DevTools의 Elements 패널에서 요소를 선택하면 `Styles`와 `Computed` 탭을 볼 수 있습니다.

```text
Styles: 어떤 CSS 규칙들이 적용 후보인지 보여준다.
Computed: 최종적으로 계산된 스타일 값을 보여준다.
```

브라우저 렌더링을 공부하면 DevTools의 Computed 탭이 단순한 속성 목록이 아니라 "브라우저가 스타일 계산을 끝낸 결과"로 보입니다.

## 렌더링과 연결

렌더링 흐름에서 Computed Style은 CSSOM과 Layout 사이를 연결합니다.

```text
DOM: 어떤 요소가 있는가?
CSSOM: 어떤 스타일 규칙이 있는가?
Computed Style: 각 요소의 최종 스타일은 무엇인가?
Layout: 그 스타일을 바탕으로 크기와 위치는 얼마인가?
```

## 스스로 답해보기

1. Computed Style은 무엇인가요?
2. `width: 50%`가 Layout에서 실제 px 값으로 바뀌어야 하는 이유는 무엇인가요?
3. DevTools의 `Styles`와 `Computed`는 어떻게 다르게 볼 수 있나요?

