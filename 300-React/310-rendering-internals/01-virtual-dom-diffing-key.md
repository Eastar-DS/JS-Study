# Step 10. Virtual DOM, Diffing, Reconciliation | 가상 DOM, 디핑, 재조정

## 목표

- virtual DOM을 과장 없이 설명할 수 있다.
- diffing과 reconciliation이 key와 어떤 관계가 있는지 이해한다.

## 읽을 것

- [Render and Commit - 영문](https://react.dev/learn/render-and-commit)
- [Render and Commit - 한글](https://ko.react.dev/learn/render-and-commit)
- [Preserving and Resetting State - 영문](https://react.dev/learn/preserving-and-resetting-state)
- [State를 보존하고 초기화하기 - 한글](https://ko.react.dev/learn/preserving-and-resetting-state)

## 예시 코드

- [02-example-virtual-dom-diffing-key.tsx](./02-example-virtual-dom-diffing-key.tsx)
- 추천 실행 방법: [docs/react/01-실행가이드.md](../01-실행가이드.md)를 따라 `StackBlitz React 템플릿`의 `App.tsx`에 붙여넣어 실행하는 방법을 가장 추천합니다.

## 학습 포인트

- React element, render result, DOM node를 같은 것으로 보면 안 된다.
- React는 새 UI 설명을 만들고 이전 설명과 비교해 필요한 변경만 적용한다.
- key는 리스트 정렬 안정성뿐 아니라 state 연결에도 영향을 준다.

## 미션

1. index key와 stable key를 비교하는 리스트 예제를 만든다.
2. 중간 삽입/삭제 시 어떤 input 값이 섞이는지 관찰한다.
3. 같은 JSX 위치에 다른 타입 컴포넌트를 두어 reconciliation 차이를 본다.

## 프로젝트 연결 연습

- 카드번호 4칸 input이 순서 변경되거나 동적으로 추가되는 상황을 가정하고 key 전략을 설계한다.
- `InputFieldForm`이 index에 많이 의존할 때 생길 수 있는 문제를 적는다.

## 완료 기준

- "virtual DOM이 빠르다"보다 "React가 선언된 UI를 비교 가능한 구조로 다룬다"라고 설명할 수 있다.
