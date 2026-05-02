# eslint-plugin-react-hooks rules-of-hooks | 훅 규칙 린트 학습용 한국어 문서

원문:
- https://react.dev/reference/eslint-plugin-react-hooks/lints/rules-of-hooks

## rules-of-hooks 린트(rule lint)

이 린트(lint)는 Hook 규칙을 위반하는 코드를 잡아내기 위한 것입니다.

## Rule Details | 규칙 세부 내용

이 린트는 Hook이 React 규칙에 맞지 않는 위치에서 호출되는 경우를 에러로 봅니다.

핵심 아이디어:
- Hook은 렌더마다 같은 순서로 호출되어야 합니다.
- 렌더마다 순서가 바뀌면 React가 state와 Effect를 올바르게 연결할 수 없습니다.

## Common Violations | 자주 나오는 위반 사례

아래 패턴은 Hook 규칙을 위반합니다.

- 조건문(condition) 안의 Hook
  - `if` / `else`
  - ternary(삼항 연산자)
  - `&&`, `||`
- 반복문(loop) 안의 Hook
  - `for`
  - `while`
  - `do-while`
- early return 이후의 Hook
- callback 또는 event handler 안의 Hook
- async 함수 안의 Hook
- class method 안의 Hook
- module level(모듈 최상위)에서의 Hook

## Invalid / Valid | 잘못된 예 / 올바른 예

잘못된 예:
- 조건에 따라 `useState`를 호출
- 버튼 클릭 핸들러 안에서 `useContext`를 호출
- `for` 문 안에서 `useMemo`를 호출

올바른 예:
- 컴포넌트 본문 최상위에서 Hook 호출
- 커스텀 훅 본문 최상위에서 Hook 호출

## Troubleshooting | 문제 해결

문서가 강조하는 핵심은 다음과 같습니다.

- 조건에 따라 다른 데이터를 가져오고 싶다면, Hook 호출 자체를 조건화하지 말고 Hook 내부 로직이나 렌더링 결과를 조건화합니다.
- 서로 다른 시나리오에 다른 state가 필요하다면 Hook 호출을 분기하지 말고 컴포넌트를 분리하는 쪽을 먼저 검토합니다.

## 학습 포인트

- lint는 단순한 스타일 검사기가 아니라 런타임 버그 예방 장치입니다.
- Hook 위반은 "가끔 되는 코드"가 아니라 "동작이 꼬일 수밖에 없는 코드"입니다.
