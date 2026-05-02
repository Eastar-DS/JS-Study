# Step 2. State Snapshot, Batching, Key | 상태 스냅샷, 배칭, 키

## 목표

- state가 일반 변수처럼 즉시 바뀌지 않는 이유를 설명할 수 있다.
- 함수형 업데이트가 왜 필요한지 이해한다.
- key와 컴포넌트 위치가 state 보존에 어떤 영향을 주는지 설명할 수 있다.

## 읽을 것

- [State as a Snapshot - 영문](https://react.dev/learn/state-as-a-snapshot)
- [State as a Snapshot - 한글](https://ko.react.dev/learn/state-as-a-snapshot)
- [Queueing a Series of State Updates - 영문](https://react.dev/learn/queueing-a-series-of-state-updates)
- [Queueing a Series of State Updates - 한글](https://ko.react.dev/learn/queueing-a-series-of-state-updates)
- [Preserving and Resetting State - 영문](https://react.dev/learn/preserving-and-resetting-state)
- [State를 보존하고 초기화하기 - 한글](https://ko.react.dev/learn/preserving-and-resetting-state)

## 예시 코드

- [02-example-state-snapshot-key.tsx](./02-example-state-snapshot-key.tsx)
- 추천 실행 방법: [docs/react/01-실행가이드.md](../01-실행가이드.md)를 따라 `StackBlitz React 템플릿`의 `App.tsx`에 붙여넣어 실행하는 방법을 가장 추천합니다.

## 학습 포인트

- 현재 이벤트 핸들러는 "그 렌더의 state"를 본다.
- `setState(next)`는 즉시 변수 값을 바꾸는 것이 아니라 다음 렌더를 예약한다.
- 같은 state를 여러 번 갱신할 때는 함수형 업데이트가 더 안전하다.
- state는 컴포넌트 함수 안이 아니라 React가 트리 위치 기준으로 관리한다.
- key는 리스트용 경고 제거 도구가 아니라 identity 제어 장치다.

## 미션

1. `+3` 버튼 예제를 만들어 `setCount(count + 1)`과 `setCount(c => c + 1)`을 비교한다.
2. 조건부 렌더링으로 같은 위치에 다른 컴포넌트를 렌더해 state 초기화를 관찰한다.
3. `key`를 바꿔가며 강제 초기화를 실험한다.

## 프로젝트 연결 연습

- 예시 코드의 카드 입력 컴포넌트에 `key`를 바꿔서 입력값이 초기화되는 순간을 확인한다.
- 카드 브랜드를 별도 state로 저장하지 않고, 카드 번호 첫 칸에서 계산하도록 바꿔보는 설계를 글로 정리한다.
- `expirationDate`와 `cardNumbers` 중 어떤 값이 "저장해야 하는 state"이고 어떤 값이 "계산 가능한 값"인지 분류한다.

## 완료 기준

- "왜 `setState` 직후 콘솔에 이전 값이 보이는가"를 설명할 수 있다.
- "왜 잘못된 key가 input 버그를 만들 수 있는가"를 설명할 수 있다.
