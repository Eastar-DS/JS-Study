# requestAnimationFrame

## 한 문장으로

`requestAnimationFrame`은 브라우저가 다음 프레임을 그리기 직전에 콜백을 실행해주도록 예약하는 API입니다.

## 왜 이걸 알아야 할까?

JavaScript로 화면을 부드럽게 움직이려면, "지금이 화면을 갱신할 적절한 시점인가"를 알아야 합니다.

그런데 우리가 평소에 쓰는 `setTimeout`이나 `setInterval`은 이 시점을 알지 못합니다.

```js
function move() {
  box.style.left = box.offsetLeft + 1 + "px";
  setTimeout(move, 16);
}
move();
```

겉보기에는 16ms마다 1px씩 움직이니 부드럽게 보일 것 같습니다.

하지만 실제로는 끊기거나 의도와 다른 속도로 움직이는 경우가 많습니다.

## 왜 setTimeout 애니메이션은 끊길 수 있을까?

`setTimeout`은 Task Queue에 콜백을 예약합니다.

```text
브라우저 프레임 시점: ████|████|████|████|
setTimeout 실행 시점:   △  △  △   △
```

`setTimeout`은 브라우저가 화면을 그리는 시점과 무관하게 실행됩니다.

그래서 다음 문제가 생길 수 있습니다.

1. 콜백이 프레임과 어긋나서 한 프레임에 두 번 실행되거나, 한 프레임에 한 번도 실행되지 않을 수 있습니다.
2. 메인 스레드가 바쁘면 16ms 후가 아니라 더 늦게 실행될 수 있습니다.
3. 화면이 보이지 않는 탭에서도 계속 실행되어 자원을 낭비할 수 있습니다.

## requestAnimationFrame은 다르다

`requestAnimationFrame`은 브라우저가 다음 프레임을 그리기 직전에 콜백을 실행하도록 예약합니다.

```js
function move() {
  box.style.left = box.offsetLeft + 1 + "px";
  requestAnimationFrame(move);
}
requestAnimationFrame(move);
```

흐름:

```text
브라우저: "이제 다음 프레임을 그릴 준비를 하자."
-> 예약된 rAF 콜백 실행
-> 콜백 안에서 DOM/스타일 변경
-> 스타일 계산, Layout, Paint, Composite
-> 화면 갱신
```

콜백이 화면 갱신과 같은 박자로 실행되기 때문에 애니메이션이 부드러워집니다.

## 한 프레임 안에서의 위치

`step5.5/01`에서 본 한 프레임 흐름에 `requestAnimationFrame`을 끼워 넣으면 이렇습니다.

```text
1. Task 실행 (JS, 이벤트 핸들러 등)
2. Microtask Queue 비우기
3. (렌더 기회가 오면)
   3-1. requestAnimationFrame 콜백들 실행  ← 여기
   3-2. 스타일 계산
   3-3. Layout
   3-4. Paint
   3-5. Composite
4. 다음 Task로
```

즉 `requestAnimationFrame` 콜백은 **이번 프레임의 렌더링 단계가 시작되기 직전**에 실행됩니다.

이 시점에 DOM이나 스타일을 바꾸면 이번 프레임에 그대로 반영될 수 있습니다.

## 비교 정리

```text
setTimeout(fn, 16):
- Task Queue에 예약
- 화면 갱신 시점과 어긋날 수 있음
- 보이지 않는 탭에서도 동작
- 정확한 16ms를 보장하지 않음

requestAnimationFrame(fn):
- 다음 프레임 직전에 실행
- 화면 갱신과 박자가 맞음
- 보이지 않는 탭에서는 보통 멈춤 (자원 절약)
- 모니터 주사율에 따라 60fps, 120fps 등으로 자동 조정
```

## 흔한 오해

### 오해 1. requestAnimationFrame은 정확히 16.7ms마다 실행된다

아닙니다.

브라우저가 다음 프레임을 그릴 수 있을 때 콜백을 실행합니다. 모니터 주사율이 120Hz면 약 8.3ms마다, 60Hz면 약 16.7ms마다 호출될 수 있습니다.

또한 메인 스레드가 바쁘면 한 프레임을 건너뛰어 더 늦게 호출될 수도 있습니다.

### 오해 2. requestAnimationFrame을 쓰면 무조건 부드럽다

아닙니다.

콜백 안에서 무거운 Layout이나 Paint를 유발하는 작업을 하면 한 프레임 시간을 넘겨 결국 끊깁니다.

`requestAnimationFrame`은 "언제 실행할지"를 잡아줄 뿐, "얼마나 빠르게 실행되는지"는 콜백 안의 코드에 달려 있습니다.

### 오해 3. requestAnimationFrame은 setTimeout의 상위 호환이다

아닙니다.

용도가 다릅니다.

```text
requestAnimationFrame: 화면 갱신과 동기화된 작업 (애니메이션, 시각적 변경)
setTimeout: 일정 시간 뒤 실행해야 하는 일반 작업
```

화면을 갱신할 일이 아닌데 `requestAnimationFrame`을 쓰면 오히려 의미가 흐려집니다.

## 가상 DOM, Fiber로의 복선

`step5.5/01`에서 우리는 한 가지 문장을 기억하기로 했습니다.

> "JS Task 하나가 길어지면 그 동안 화면은 멈춘다."

`requestAnimationFrame`은 그 문제를 부분적으로 해결합니다.

- 작업을 매 프레임에 한 조각씩 나눠 실행한다.
- 각 프레임 사이에 브라우저가 화면을 그릴 시간을 양보한다.

```js
function chunkedWork(items, index = 0) {
  const start = performance.now();

  while (index < items.length && performance.now() - start < 5) {
    process(items[index]);
    index++;
  }

  if (index < items.length) {
    requestAnimationFrame(() => chunkedWork(items, index));
  }
}

requestAnimationFrame(() => chunkedWork(bigList));
```

이 패턴은 React Fiber의 핵심 아이디어와 같은 방향입니다.

Fiber는 가상 DOM 비교 작업을 작은 단위(fiber 노드)로 쪼개고, 한 프레임 안에서 시간이 부족하면 다음 프레임으로 넘기는 방식으로 동작합니다.

지금은 "한 번에 다 처리하지 말고, 프레임 단위로 양보하면서 처리한다"는 패턴이 존재한다는 것만 알면 됩니다.

## 스스로 답해보기

1. `setTimeout(fn, 16)` 기반 애니메이션이 끊길 수 있는 이유는 무엇인가요?
2. `requestAnimationFrame` 콜백은 한 프레임 흐름에서 정확히 어느 시점에 실행되나요?
3. `requestAnimationFrame`을 써도 끊기는 애니메이션이 생길 수 있는 이유는 무엇인가요?
4. 무거운 작업을 `requestAnimationFrame`으로 쪼개서 처리하는 방식이 React Fiber의 아이디어와 어떻게 닮았나요?
