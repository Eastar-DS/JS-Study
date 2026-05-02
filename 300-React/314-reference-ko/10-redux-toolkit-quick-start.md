# Redux Toolkit Quick Start | Redux Toolkit 빠른 시작 학습용 한국어 문서

원문:
- https://redux-toolkit.js.org/tutorials/quick-start

## 문서의 위치

이 문서는 Redux Toolkit을 React와 함께 빠르게 시작하는 튜토리얼입니다.

## 문서가 다루는 흐름

공식 튜토리얼은 대체로 아래 순서로 진행됩니다.

1. Redux Toolkit 설치
2. slice 생성
3. store 생성
4. React 앱에 provider 연결
5. 컴포넌트에서 state 읽기와 dispatch 사용

## Quick Start의 핵심 개념

### Store | 스토어

store는 애플리케이션 상태(application state)를 담는 중앙 저장소입니다.

### Slice | 슬라이스

slice는 상태의 한 조각과 그 상태를 바꾸는 reducer/action 로직을 함께 묶는 방식입니다.

### Reducer | 리듀서

reducer는 현재 state와 action을 받아 다음 state를 만드는 함수입니다.

### Dispatch | 디스패치

action을 store에 보내서 state 갱신을 요청하는 과정입니다.

## 문서가 전달하려는 방향

Redux Toolkit은 Redux를 더 적은 보일러플레이트(boilerplate)로 사용할 수 있게 해줍니다.

즉:
- store 설정을 단순화하고
- action/reducer 작성량을 줄이고
- 기본 권장 설정을 제공하는 도구입니다.

## 학습 포인트

- Context와 다르게, 중앙 store + action 기반 흐름을 제공합니다.
- "전역 상태를 어디서 어떻게 읽고 갱신할지"를 더 명시적으로 다루게 해줍니다.
- 상태 변화 흐름을 추적하기 좋습니다.
