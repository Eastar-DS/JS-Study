# Paint

## 한 문장으로

Paint는 Layout에서 계산된 위치와 크기를 바탕으로 글자, 색, 이미지, 테두리, 그림자 같은 시각 정보를 그리는 단계입니다.

## 왜 Paint가 필요할까?

Layout이 끝나면 브라우저는 요소의 크기와 위치를 압니다.

하지만 위치와 크기만으로는 화면이 보이지 않습니다.

```text
버튼이 x=20, y=20, width=100, height=40이라는 것은 알았다.
그런데 배경색은?
글자색은?
테두리는?
그림자는?
```

이 시각 정보를 실제로 그리는 과정이 Paint입니다.

## 예시

```html
<button>저장</button>
```

```css
button {
  width: 100px;
  height: 40px;
  color: white;
  background-color: royalblue;
  border: 1px solid navy;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
```

Layout은 주로 이런 정보를 계산합니다.

```text
button의 위치와 크기
x=20, y=20, width=100, height=40
```

Paint는 이런 정보를 그립니다.

```text
royalblue 배경
navy 테두리
white 글자
그림자
```

## Paint는 픽셀을 칠하는 일에 가깝다

Paint를 아주 단순화하면 "어떤 위치의 픽셀을 어떤 색으로 칠할지 정하는 일"입니다.

실제로는 브라우저 내부 구현이 더 복잡하지만, 처음에는 아래처럼 이해하면 충분합니다.

```text
Layout: 어디에 놓을지 계산
Paint: 어떻게 보이게 칠할지 계산
```

## Paint 비용이 큰 스타일

일부 스타일은 그리는 비용이 큽니다.

예를 들어 다음 속성들은 Paint 비용을 늘릴 수 있습니다.

```css
box-shadow
text-shadow
filter
border-radius가 큰 복잡한 요소
큰 배경 이미지
```

이 속성들이 나쁘다는 뜻은 아닙니다. 다만 화면에서 자주 바뀌는 요소에 무겁게 쓰면 렌더링 비용이 커질 수 있습니다.

## 스스로 답해보기

1. Layout과 Paint의 차이는 무엇인가요?
2. 버튼의 `width`, `height`, `background-color`, `box-shadow` 중 Layout과 더 관련 있는 것은 무엇이고 Paint와 더 관련 있는 것은 무엇인가요?
3. Paint 비용이 커질 수 있는 CSS 속성에는 어떤 것들이 있나요?

