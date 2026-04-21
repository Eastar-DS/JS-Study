# Critical Rendering Path

## 한 문장으로

Critical Rendering Path는 브라우저가 HTML, CSS, JavaScript를 받아 첫 화면을 그리기까지 거치는 핵심 경로입니다.

## 왜 실무에서 중요할까?

사용자가 페이지에 들어왔을 때 가장 먼저 체감하는 것은 첫 화면이 얼마나 빨리 보이는가입니다.

브라우저 렌더링 파이프라인을 알면 "첫 화면이 늦게 뜨는 이유"를 더 구체적으로 볼 수 있습니다.

```text
HTML을 늦게 받았나?
CSS가 늦게 도착해서 렌더링이 막혔나?
JavaScript가 파싱을 막았나?
이미지나 폰트 때문에 화면이 흔들렸나?
```

## 기본 흐름

단순화하면 첫 렌더링까지의 흐름은 아래와 같습니다.

```text
1. HTML 다운로드
2. HTML 파싱
3. DOM 생성
4. CSS 다운로드
5. CSS 파싱
6. CSSOM 생성
7. DOM + CSSOM 결합
8. Render Tree 생성
9. Layout
10. Paint
11. Composite
```

이 경로에서 첫 화면을 그리는 데 꼭 필요한 자원은 critical resource라고 볼 수 있습니다.

## CSS는 렌더링을 막을 수 있다

브라우저는 CSS 없이 화면을 먼저 그리면, 나중에 CSS가 도착했을 때 화면이 크게 바뀔 수 있습니다.

그래서 CSS는 보통 렌더링을 막는 자원으로 다뤄집니다.

```html
<link rel="stylesheet" href="style.css">
```

CSS 파일이 크거나 늦게 도착하면 첫 화면이 늦어질 수 있습니다.

## JavaScript는 HTML 파싱을 막을 수 있다

```html
<script src="app.js"></script>
```

기본 script는 HTML 파싱 중간에 만나면 다운로드와 실행 때문에 파싱을 멈추게 할 수 있습니다.

JavaScript가 DOM을 변경할 수 있기 때문입니다.

브라우저는 script 실행 결과가 이후 문서 구조에 영향을 줄 수 있다고 봅니다.

## 최적화 방향

Critical Rendering Path를 줄이는 방향은 단순합니다.

```text
1. 첫 화면에 꼭 필요한 자원을 줄인다.
2. CSS를 작게 유지하고 빨리 로드한다.
3. 첫 렌더링에 필요 없는 JavaScript는 늦게 실행한다.
4. 이미지와 폰트가 Layout Shift를 만들지 않게 한다.
```

## 스스로 답해보기

1. Critical Rendering Path는 무엇인가요?
2. CSS가 렌더링을 막을 수 있는 이유는 무엇인가요?
3. 첫 화면 최적화에서 JavaScript를 늦게 실행하는 것이 도움이 되는 이유는 무엇인가요?

