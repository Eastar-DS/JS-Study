# Layer와 Compositing

## 한 문장으로

브라우저는 일부 요소를 별도 레이어로 분리할 수 있고, Compositing은 이 레이어들을 합쳐 최종 화면을 만드는 과정입니다.

## 왜 Composite를 더 이해해야 할까?

Composite 단계는 "여러 레이어를 합친다"고 설명할 수 있습니다.

그런데 초심자 입장에서는 바로 질문이 생깁니다.

```text
레이어는 누가 만드는가?
모든 요소가 레이어인가?
왜 transform은 성능에 유리하다고 하는가?
```

이 파일은 그 질문에 답하기 위한 보강자료입니다.

## 모든 요소가 별도 레이어는 아니다

DOM 요소가 100개 있다고 해서 브라우저 레이어도 100개인 것은 아닙니다.

브라우저는 필요에 따라 일부 요소만 별도의 compositing layer로 분리할 수 있습니다.

예를 들어 아래 요소는 별도 레이어가 될 가능성이 있습니다.

```css
.modal {
  position: fixed;
}

.animated {
  transform: translateX(100px);
}

.fade {
  opacity: 0.5;
}
```

정확한 레이어 생성 조건은 브라우저 구현과 상황에 따라 달라질 수 있습니다.

중요한 것은 브라우저가 성능과 정확한 표현을 위해 일부 요소를 별도 레이어로 관리할 수 있다는 점입니다.

## transform과 opacity가 유리한 이유

아래 두 애니메이션을 비교해봅시다.

```css
/* Layout에 영향을 줄 수 있음 */
.box {
  left: 100px;
}
```

```css
/* Composite에서 처리될 수 있음 */
.box {
  transform: translateX(100px);
}
```

`left`는 요소의 레이아웃 위치를 바꾸는 속성입니다.

그래서 주변 요소와의 배치 계산이 다시 필요할 수 있습니다.

반면 `transform`은 이미 그려진 레이어를 시각적으로 이동시키는 방식으로 처리될 수 있습니다.

이 경우 Layout이나 Paint를 다시 하지 않고 Composite만으로 화면을 갱신할 수 있어 더 부드러울 가능성이 큽니다.

## will-change

`will-change`는 브라우저에게 "이 속성이 곧 바뀔 예정"이라고 알려주는 힌트입니다.

```css
.box {
  will-change: transform;
}
```

브라우저는 이 힌트를 보고 미리 최적화를 준비할 수 있습니다.

하지만 남용하면 오히려 메모리 사용량이 늘어날 수 있습니다.

```text
좋은 사용:
- 실제로 곧 애니메이션될 요소에 짧게 사용

나쁜 사용:
- 모든 요소에 will-change를 붙임
- 바뀌지 않는 요소에 계속 붙여둠
```

## DevTools에서 Layer 확인하기

Chrome DevTools에서는 Rendering, Layers, Performance 관련 도구로 레이어와 합성 비용을 관찰할 수 있습니다.

처음에는 아래만 기억해도 충분합니다.

```text
Performance 패널에서 Composite Layers를 찾는다.
애니메이션 중 Layout/Paint가 반복되는지 본다.
transform으로 바꿨을 때 Layout/Paint가 줄어드는지 비교한다.
```

## 렌더링과 연결

```text
Layout: 요소의 크기와 위치 계산
Paint: 요소의 시각 정보를 그림
Composite: 그려진 레이어들을 합성
```

브라우저가 뒤쪽 단계만 다시 처리할 수 있다면 성능에 유리합니다.

그래서 애니메이션에서는 Layout을 건드리는 속성보다 Composite에서 처리 가능한 속성을 우선 고려합니다.

## 스스로 답해보기

1. 모든 DOM 요소가 별도 레이어가 아닌 이유는 무엇인가요?
2. `transform`과 `opacity`가 애니메이션에 유리할 수 있는 이유는 무엇인가요?
3. `will-change`를 남용하면 왜 문제가 될 수 있나요?

