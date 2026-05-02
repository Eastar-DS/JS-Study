# Composite

## 한 문장으로

Composite는 여러 레이어를 최종 화면으로 합성하는 단계입니다.

## 왜 Composite가 필요할까?

브라우저는 모든 것을 하나의 평면에 한 번에 그리지 않을 수 있습니다.

일부 요소는 별도의 레이어로 분리될 수 있습니다.

```css
.modal {
  position: fixed;
  transform: translateY(0);
}
```

```css
.moving {
  transform: translateX(100px);
}
```

브라우저는 특정 요소를 별도 레이어로 다루면, 전체 페이지를 다시 그리지 않고 레이어 위치만 합성해서 화면을 갱신할 수 있습니다.

## 레이어를 합친다는 뜻

아래 화면을 상상해봅시다.

```text
레이어 1: 문서 본문
레이어 2: 어두운 오버레이
레이어 3: 모달
```

Composite 단계는 이 레이어들을 순서대로 합쳐 최종 화면을 만듭니다.

```text
본문 위에 오버레이를 올리고,
오버레이 위에 모달을 올린다.
```

## transform과 opacity가 자주 언급되는 이유

애니메이션을 만들 때 `top`, `left`, `width`, `height`보다 `transform`, `opacity`가 자주 권장됩니다.

이유는 `transform`과 `opacity` 변경이 Layout이나 Paint를 다시 하지 않고 Composite 단계에서 처리될 수 있는 경우가 많기 때문입니다.

```css
/* 위치 재계산이 필요할 수 있음 */
.box {
  left: 100px;
}

/* 합성 단계에서 처리될 수 있음 */
.box {
  transform: translateX(100px);
}
```

항상 무조건 Composite만 일어난다고 단정하면 안 됩니다. 하지만 기본 방향은 맞습니다.

```text
width/height/top/left 변경: Layout부터 다시 필요할 가능성이 큼
color/background 변경: Paint부터 다시 필요할 가능성이 큼
transform/opacity 변경: Composite만으로 끝날 가능성이 있음
```

## 핵심 정리

Composite는 이미 그려진 레이어들을 최종 화면으로 합치는 단계입니다.

이 단계를 이해하면 왜 어떤 애니메이션은 부드럽고, 어떤 애니메이션은 버벅이는지 설명할 수 있습니다.

## 스스로 답해보기

1. Composite는 무엇을 하는 단계인가요?
2. `transform` 애니메이션이 `left` 애니메이션보다 유리할 수 있는 이유는 무엇인가요?
3. Layout, Paint, Composite 중 가장 뒤쪽 단계만 다시 일어나는 것이 왜 성능에 유리할까요?

