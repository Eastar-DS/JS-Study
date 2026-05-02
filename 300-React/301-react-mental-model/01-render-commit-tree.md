# Step 1. Render, Commit, Tree | 렌더, 커밋, 트리

## 목표

- React가 화면을 갱신하는 최소 단위를 설명할 수 있다.
- render와 commit을 구분할 수 있다.
- 컴포넌트 트리 관점에서 UI를 볼 수 있다.

## 왜 먼저 필요한가

이 감각이 없으면 이후의 state, key, effect, 리렌더링 추적이 전부 흐릿해집니다.
React는 "이벤트가 발생하면 DOM을 바로 조작한다"보다 "새 UI를 계산하고 반영한다"에 가깝습니다.

## 읽을 것

- [Render and Commit - 영문](https://react.dev/learn/render-and-commit)
- [Render and Commit - 한글](https://ko.react.dev/learn/render-and-commit)
- [Understanding Your UI as a Tree - 영문](https://react.dev/learn/understanding-your-ui-as-a-tree)
- [트리로서 UI 이해하기 - 한글](https://ko.react.dev/learn/understanding-your-ui-as-a-tree)

## 예시 코드

- [02-example-render-commit-tree.tsx](./02-example-render-commit-tree.tsx)
- 추천 실행 방법: [docs/react/01-실행가이드.md](../01-실행가이드.md)를 따라 `StackBlitz React 템플릿`의 `App.tsx`에 붙여넣어 실행하는 방법을 가장 추천합니다.

## 학습 포인트

- 렌더 트리와 DOM 트리는 다르다.
- 리렌더링은 "컴포넌트 함수가 다시 호출됨"에 가깝다.
- 리렌더링이 항상 실제 DOM 변경을 의미하지는 않는다.
- 부모가 다시 렌더되면 자식도 다시 계산될 수 있다.

## 미션

1. 아주 작은 카운터 컴포넌트를 만든다.
2. 컴포넌트 본문에 `console.log('render')`를 넣는다.
3. 버튼 클릭으로 state를 바꾸고, 로그 횟수와 실제 DOM 변경을 관찰한다.
4. 부모 컴포넌트 state를 바꿨을 때 자식 로그가 어떻게 찍히는지 확인한다.

## 프로젝트 연결 연습

- 예시 코드의 `PaymentFormLike`, `CardPreviewLike`, `FieldGroupLike`, `InputFieldLike`에 각각 로그를 찍는다.
- 카드 번호 한 칸을 입력할 때 어떤 컴포넌트들이 다시 렌더되는지 기록한다.
- "리렌더링된 컴포넌트"와 "실제로 눈에 보이는 변화가 있었던 컴포넌트"를 분리해서 적는다.

## 완료 기준

- "왜 `PaymentForm` state 변경이 `CardPreview` 렌더에도 영향을 주는가"를 설명할 수 있다.
- "렌더링"과 "DOM 업데이트"를 같은 말로 쓰지 않는다.
