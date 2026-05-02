# Jotai Introduction | Jotai 소개 학습용 한국어 문서

원문:
- https://jotai.org/docs
- 보조 확인:
  - https://jotai.org/

## Jotai 소개

공식 문서는 Jotai를 "primitive and flexible state management for React"라고 설명합니다.

즉:
- primitive(원시적이고 기본적인)
- flexible(유연한)
- React용 상태 관리

를 지향합니다.

## 원자적 접근 atomic approach

Jotai는 global React state management에 대해 atomic approach(원자적 접근)를 취한다고 설명합니다.

핵심 개념:
- store 하나에 거대한 상태를 넣는 대신
- atom(아톰, 원자)이라는 작은 상태 단위를 조합해서 상태를 구성합니다.

공식 소개는 atom dependency(아톰 의존성)에 기반해 렌더링이 자동 최적화된다고 설명합니다.
이를 통해:
- React context의 불필요한 추가 리렌더링(extra re-render)
- 과도한 memoization 필요성

을 줄이는 방향을 강조합니다.

## Create atoms | atom 만들기

문서는 atom을 두 종류로 소개합니다.

### Primitive atom | 기본 atom

숫자, 문자열, 배열, 객체 같은 값을 바로 담는 atom입니다.

### Derived atom | 파생 atom

다른 atom을 읽어서(get) 자기 값을 계산하는 atom입니다.

즉 Jotai는 "작은 상태 조각 + 파생 상태" 모델이 강합니다.

## Use atoms | atom 사용하기

컴포넌트에서는 `useAtom` Hook으로 atom을 읽고 쓰게 됩니다.

공식 문서의 메시지:
- `useState`처럼 단순하게 쓸 수 있다
- 하지만 상태는 전역적으로 접근 가능하다
- 파생 상태(derived state)를 만들기 쉽다
- 불필요한 리렌더링은 자동으로 줄이는 방향을 가진다

## 학습 포인트

- Jotai는 "전역 store 하나"보다 "원자(atom)들의 조합" 관점이 강합니다.
- derived state를 모델의 중심에 두기 쉬운 도구입니다.
