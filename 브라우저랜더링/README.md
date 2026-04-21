# 브라우저 렌더링 학습 지도

## 목표

브라우저 렌더링은 HTML, CSS, JavaScript가 어떻게 실제 화면의 픽셀로 바뀌는지 이해하는 공부입니다.

이 폴더의 목표는 아래 질문에 스스로 답할 수 있게 되는 것입니다.

- 브라우저는 왜 HTML을 받자마자 바로 화면에 그릴 수 없을까?
- DOM과 CSSOM은 왜 필요할까?
- Render Tree, Layout, Paint, Composite는 각각 무엇을 계산할까?
- JavaScript가 DOM이나 스타일을 바꾸면 왜 화면이 다시 계산될까?
- 어떤 코드는 왜 렌더링 성능을 나쁘게 만들까?

## 전체 목차

### step0. 왜 공부하는가

파일:
- `00왜-브라우저-렌더링을-공부하는가.md`

핵심:
- 브라우저 렌더링을 이해하면 실무에서 어떤 이득이 있는지 안다.
- 코드, CSS, DevTools를 볼 때 어떤 판단을 할 수 있는지 안다.
- 다른 사람에게 이 개념을 배워야 하는 이유를 설명할 수 있다.

### step1. 브라우저가 화면을 만들기 전 알아야 하는 것

파일:
- `step1/01브라우저가-하는-일.md`
- `step1/02HTML은-왜-바로-화면이-아닌가.md`

핵심:
- 브라우저는 문서 파일을 화면으로 바꾸는 프로그램이다.
- HTML은 화면 그 자체가 아니라 화면을 만들기 위한 설명서다.
- 픽셀을 찍으려면 구조, 스타일, 크기, 위치 계산이 필요하다.

### step2. HTML을 DOM으로 바꾸기

파일:
- `step2/01HTML-파싱.md`
- `step2/02DOM.md`

핵심:
- 파싱은 문자열을 의미 있는 구조로 해석하는 과정이다.
- DOM은 HTML을 JavaScript와 브라우저가 다룰 수 있는 객체 트리로 바꾼 결과다.

### step3. CSS를 CSSOM으로 바꾸기

파일:
- `step3/01CSS-파싱.md`
- `step3/02CSSOM.md`

핵심:
- CSS는 어떤 요소에 어떤 스타일을 적용할지 정하는 규칙이다.
- CSSOM은 CSS 규칙을 계산 가능한 객체 구조로 바꾼 결과다.
- 상속, 우선순위, 기본 스타일 때문에 CSS 계산은 단순하지 않다.

### step4. Render Tree부터 화면 계산까지

파일:
- `step4/01Render-Tree.md`
- `step4/02Layout.md`
- `step4/03Paint.md`
- `step4/04Composite.md`

핵심:
- Render Tree는 실제 화면에 보이는 노드만 모은 트리다.
- Layout은 각 요소의 크기와 위치를 계산한다.
- Paint는 색, 글자, 테두리, 그림자 같은 시각 정보를 그린다.
- Composite는 여러 레이어를 합쳐 최종 화면을 만든다.

### 보강자료 A. Layout을 위한 CSS 기초

파일:
- `step3.5-layout-css-기초/README.md`
- `step3.5-layout-css-기초/01Box-Model.md`
- `step3.5-layout-css-기초/02Normal-Flow.md`
- `step3.5-layout-css-기초/03display.md`
- `step3.5-layout-css-기초/04Computed-Style.md`

핵심:
- `step4/Layout`을 이해하기 위한 보강자료다.
- 요소의 크기, 기본 배치 흐름, `display`, 최종 스타일 계산을 다룬다.
- Layout에서 브라우저가 무엇을 계산하는지 더 구체적으로 이해할 수 있다.

### 보강자료 B. Paint와 Composite 심화

파일:
- `step4.5-paint-composite-심화/README.md`
- `step4.5-paint-composite-심화/01Stacking-Context.md`
- `step4.5-paint-composite-심화/02Layer와-Compositing.md`

핵심:
- `Paint`, `Composite`를 읽은 뒤 이해하면 좋은 보강자료다.
- 겹친 요소의 그리기 순서, `z-index`, 레이어, 합성 단계를 다룬다.
- 모달, 드롭다운, 애니메이션 성능을 설명할 때 도움이 된다.

### step5. JavaScript와 다시 렌더링

파일:
- `step5/01JavaScript가-렌더링에-끼어드는-방식.md`
- `step5/02Reflow-Repaint-Composite.md`

핵심:
- JavaScript는 DOM과 스타일을 바꿀 수 있다.
- DOM이나 스타일이 바뀌면 Render Tree, Layout, Paint, Composite 중 일부가 다시 필요할 수 있다.
- 모든 변경이 같은 비용을 만들지는 않는다.

### step6. 렌더링 성능과 관찰

파일:
- `step6/01렌더링-성능-기본.md`
- `step6/02DevTools로-관찰하기.md`

핵심:
- 성능 최적화는 무작정 빠르게 만드는 것이 아니라 어떤 단계가 다시 일어나는지 줄이는 일이다.
- DevTools Performance 패널로 렌더링 과정을 관찰할 수 있다.

### 보강자료 C. 실무 렌더링 이슈

파일:
- `step7-실무-렌더링-이슈/README.md`
- `step7-실무-렌더링-이슈/01Critical-Rendering-Path.md`
- `step7-실무-렌더링-이슈/02script-defer-async.md`
- `step7-실무-렌더링-이슈/03이미지-폰트와-Layout-Shift.md`

핵심:
- 기본 파이프라인을 실무 로딩 문제와 연결하는 보강자료다.
- 첫 화면 렌더링, 스크립트 로딩, 이미지와 폰트로 인한 화면 흔들림을 다룬다.
- DevTools 분석과 성능 개선의 배경지식이 된다.

## 학습 방법

1. 각 파일을 순서대로 읽습니다.
2. 파일 끝의 `스스로 답해보기` 질문에 답합니다.
3. 답을 못 하겠다면 같은 파일의 예시를 다시 읽습니다.
4. 답을 할 수 있으면 다음 파일로 넘어갑니다.

보강자료는 본편을 읽다가 막히는 지점에서 읽어도 되고, 본편을 한 바퀴 읽은 뒤 심화 복습으로 읽어도 됩니다.

처음부터 완벽하게 외우려고 하지 않아도 됩니다. 중요한 것은 각 단계가 "무엇을 계산하는지"와 "왜 필요한지"를 구분하는 것입니다.
