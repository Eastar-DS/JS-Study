# 브라우저 렌더링 실험실

## 목적

문서로 읽은 내용을 직접 눈으로 보고 DevTools로 측정해보기 위한 폴더입니다.

각 HTML 파일은 단독 실행이 가능합니다. Finder/탐색기에서 더블클릭하거나, VS Code에서 Live Preview로 열어보세요.

## 실험 목록

| 파일 | 비교하는 것 | 어디 단계와 연결되나 |
| --- | --- | --- |
| `01-innerHTML-반복-vs-일괄.html` | DOM 변경을 1000번 vs 1번 | step5 / step6 |
| `02-margin-vs-transform.html` | `margin-left` 애니메이션 vs `transform` 애니메이션 | step4 / step4.5 |
| `03-이미지-Layout-Shift.html` | 이미지 크기 미지정 vs 지정 | step7 |

## 관찰 방법

1. 파일을 브라우저에서 연다.
2. F12 (또는 Cmd+Option+I)로 DevTools를 연다.
3. **Performance** 탭으로 이동한다.
4. 좌상단 동그라미(Record) 버튼을 누른다.
5. 페이지의 버튼을 누른다.
6. 다시 Record 버튼을 눌러 멈춘다.
7. 결과 그래프를 본다.

## 무엇을 볼 것인가

```text
Scripting (노랑) : JavaScript 실행에 쓴 시간
Rendering (보라) : 스타일 계산 + Layout
Painting (초록)  : Paint + Composite
```

각 실험에서 **두 버튼을 각각 누른 결과**를 비교하세요.

같은 결과를 만들지만 어느 단계에 더 시간이 쓰이는지 다르게 나옵니다.

## 주의

- 측정값은 컴퓨터 성능, 다른 탭 상태, 브라우저 버전에 따라 달라집니다.
- 한 번의 결과보다 **두 버튼의 상대 비교**가 중요합니다.
- 숫자를 외우는 게 아니라 "어느 단계가 다시 일어나는가"를 추론하는 게 목적입니다.
