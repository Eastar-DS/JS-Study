# script, defer, async

## 한 문장으로

`script`, `defer`, `async`는 JavaScript 파일을 언제 다운로드하고 언제 실행할지 조절해서 HTML 파싱과 렌더링 타이밍에 영향을 줍니다.

## 왜 브라우저 렌더링에서 중요할까?

JavaScript는 DOM을 읽고 바꿀 수 있습니다.

그래서 브라우저는 JavaScript 실행 타이밍을 신중하게 다룹니다.

```html
<script src="app.js"></script>
```

이런 기본 script를 HTML 파싱 중간에서 만나면 브라우저는 파싱을 멈추고 script를 다운로드하고 실행할 수 있습니다.

그 결과 DOM 생성과 첫 렌더링이 늦어질 수 있습니다.

## 기본 script

```html
<script src="app.js"></script>
```

흐름:

```text
HTML 파싱
-> script 만남
-> HTML 파싱 멈춤
-> JS 다운로드
-> JS 실행
-> HTML 파싱 재개
```

특징:

```text
DOM 생성이 지연될 수 있다.
첫 렌더링이 늦어질 수 있다.
스크립트 실행 순서는 HTML에 등장한 순서와 관련이 깊다.
```

## defer

```html
<script defer src="app.js"></script>
```

흐름:

```text
HTML 파싱과 JS 다운로드를 병렬로 진행
-> HTML 파싱 완료
-> JS 실행
```

특징:

```text
HTML 파싱을 막지 않는다.
DOM이 준비된 뒤 실행된다.
여러 defer script는 보통 문서에 등장한 순서대로 실행된다.
초기 렌더링에 필요한 경우가 아니라면 기본 script보다 유리한 경우가 많다.
```

## async

```html
<script async src="analytics.js"></script>
```

흐름:

```text
HTML 파싱과 JS 다운로드를 병렬로 진행
-> JS 다운로드 완료 시점에 HTML 파싱을 잠시 멈추고 실행
-> HTML 파싱 재개
```

특징:

```text
다운로드 완료 즉시 실행된다.
실행 순서가 보장되지 않을 수 있다.
다른 script에 의존하지 않는 독립적인 코드에 적합하다.
예: analytics, 광고, 외부 위젯
```

## 비교 정리

```text
기본 script:
- 파싱을 막을 수 있음
- 다운로드 후 즉시 실행

defer:
- 파싱을 막지 않고 다운로드
- DOM 파싱 완료 후 실행
- 실행 순서 예측이 쉬움

async:
- 파싱을 막지 않고 다운로드
- 다운로드 완료 즉시 실행
- 실행 순서 예측이 어려움
```

## 실무 판단 기준

```text
페이지 초기 동작에 꼭 필요하고 순서가 중요한 JS -> defer 우선 고려
다른 코드와 독립적인 외부 스크립트 -> async 고려
HTML 중간에서 즉시 실행되어야 하는 특수한 코드 -> 기본 script 가능
```

처음에는 "defer는 DOM 준비 후, async는 준비되는 대로"라고 기억하면 좋습니다.

## 스스로 답해보기

1. 기본 script가 HTML 파싱을 막을 수 있는 이유는 무엇인가요?
2. `defer`와 `async`의 가장 큰 차이는 무엇인가요?
3. analytics 같은 독립적인 외부 스크립트에 `async`가 어울리는 이유는 무엇인가요?

