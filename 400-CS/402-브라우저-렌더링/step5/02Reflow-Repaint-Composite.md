# Reflow, Repaint, Composite

## 한 문장으로

Reflow는 Layout을 다시 계산하는 일, Repaint는 Paint를 다시 하는 일, Composite는 레이어를 다시 합성하는 일입니다.

## 왜 이 구분이 필요할까?

화면이 바뀐다고 해서 항상 렌더링 전체가 처음부터 다시 일어나는 것은 아닙니다.

브라우저는 필요한 단계만 다시 하려고 합니다.

```text
크기나 위치가 바뀜 -> Layout 다시 필요
색이나 그림자만 바뀜 -> Paint 다시 필요
레이어 위치나 투명도만 바뀜 -> Composite만으로 가능할 수 있음
```

이 구분을 알면 어떤 코드가 비싼지 판단할 수 있습니다.

## Reflow

Reflow는 Layout을 다시 계산하는 일입니다.

다음 변화는 Reflow를 만들 수 있습니다.

```css
width
height
padding
margin
font-size
display
position
top
left
```

예시:

```js
box.style.width = "500px";
```

너비가 바뀌면 해당 요소뿐 아니라 주변 요소의 위치도 바뀔 수 있습니다.

그래서 Layout 계산이 다시 필요할 수 있습니다.

## Repaint

Repaint는 Paint를 다시 하는 일입니다.

다음 변화는 Layout 없이 Paint만 다시 필요할 수 있습니다.

```css
color
background-color
visibility
box-shadow
text-shadow
```

예시:

```js
box.style.backgroundColor = "tomato";
```

배경색이 바뀌어도 요소의 크기와 위치는 그대로일 수 있습니다.

이 경우 Layout은 다시 하지 않아도 되지만, 색을 다시 칠해야 하므로 Paint는 필요합니다.

## Composite

Composite는 레이어를 다시 합성하는 일입니다.

다음 변화는 Composite만으로 처리될 수 있는 경우가 많습니다.

```css
transform
opacity
```

예시:

```js
box.style.transform = "translateX(100px)";
```

요소의 실제 레이아웃 위치를 다시 계산하지 않고, 그려진 레이어를 오른쪽으로 옮겨 합성할 수 있습니다.

## 비용 비교

대략적인 비용은 이렇게 이해하면 됩니다.

```text
Reflow: 비쌈. 위치와 크기를 다시 계산한다.
Repaint: 중간. 시각 정보를 다시 그린다.
Composite: 상대적으로 저렴. 레이어를 합친다.
```

정확한 비용은 페이지 구조, 브라우저, CSS, 기기 성능에 따라 다릅니다. 하지만 기본 판단 기준으로는 충분합니다.

## 스스로 답해보기

1. Reflow와 Repaint의 차이는 무엇인가요?
2. `width` 변경은 왜 `background-color` 변경보다 비쌀 수 있나요?
3. `transform`이 애니메이션에 자주 권장되는 이유는 무엇인가요?

