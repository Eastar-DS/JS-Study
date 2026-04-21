# display

## 한 문장으로

`display`는 요소가 어떤 종류의 박스로 배치될지, 그리고 자식 요소를 어떤 레이아웃 방식으로 배치할지 정하는 CSS 속성입니다.

## 왜 Render Tree와 Layout 사이에서 중요할까?

`display`는 렌더링에 직접적인 영향을 줍니다.

```css
.hidden {
  display: none;
}
```

`display: none`인 요소는 DOM에는 있어도 화면에 보이지 않고, Layout 공간도 차지하지 않습니다.

그래서 Render Tree에서 제외된다고 이해할 수 있습니다.

반대로 `display: block`, `inline`, `flex`, `grid`는 요소가 화면에 어떤 방식으로 배치될지 결정합니다.

## display: block

block 요소는 보통 새 줄에서 시작하고, 가능한 가로 공간을 차지합니다.

```html
<div>첫 번째</div>
<div>두 번째</div>
```

```text
첫 번째
두 번째
```

## display: inline

inline 요소는 줄 안에서 흐릅니다.

```html
<span>첫 번째</span>
<span>두 번째</span>
```

```text
첫 번째두 번째
```

inline 요소는 일반적인 block 요소처럼 width, height가 기대대로 적용되지 않을 수 있습니다.

## display: inline-block

inline처럼 한 줄에 흐르지만, block처럼 width와 height를 가질 수 있습니다.

```css
.badge {
  display: inline-block;
  width: 80px;
  height: 24px;
}
```

작은 라벨, 배지, 버튼 같은 UI에서 볼 수 있습니다.

## display: flex와 grid

`flex`와 `grid`는 자식 요소 배치 방식을 바꿉니다.

```css
.toolbar {
  display: flex;
  gap: 8px;
}
```

이 경우 `.toolbar`의 자식들은 Normal Flow의 단순한 위아래 배치가 아니라 flex formatting context 안에서 배치됩니다.

처음에는 flex/grid 세부 규칙까지 외울 필요는 없습니다.

중요한 것은 `display`가 Layout 계산 방식을 바꾼다는 점입니다.

## display: none과 visibility: hidden

```css
.a {
  display: none;
}

.b {
  visibility: hidden;
}
```

```text
display: none
- 화면에 보이지 않음
- Layout 공간도 차지하지 않음
- Render Tree에서 제외될 수 있음

visibility: hidden
- 화면에 보이지 않음
- Layout 공간은 차지함
- Paint에서 보이지 않게 처리된다고 이해할 수 있음
```

## 스스로 답해보기

1. `display`는 렌더링 과정에서 어떤 역할을 하나요?
2. `block`, `inline`, `inline-block`의 차이는 무엇인가요?
3. `display: none`과 `visibility: hidden`의 차이는 무엇인가요?

