# Built-in React Hooks | 내장 React 훅 학습용 한국어 문서

원문:
- https://react.dev/reference/react/hooks

이 문서는 공식 문서의 내용을 바탕으로 만든 비공식 한국어 학습용 문서입니다.

## Built-in React Hooks | 내장 React 훅

Hook(훅)은 컴포넌트(component) 안에서 다양한 React 기능(feature)을 사용할 수 있게 해줍니다.
내장 Hook(built-in Hook)을 직접 사용할 수도 있고, 여러 Hook을 조합해서 커스텀 훅(custom Hook)을 만들 수도 있습니다.
이 문서는 React에 내장된 Hook들을 분류해서 보여줍니다.

## State Hooks | 상태 훅

state(상태)는 컴포넌트가 사용자 입력(user input) 같은 정보를 "기억(remember)"하게 해줍니다.

예를 들어:
- form 컴포넌트는 입력값(input value)을 저장하기 위해 state를 사용할 수 있습니다.
- image gallery 컴포넌트는 현재 선택된 이미지 인덱스(index)를 저장하기 위해 state를 사용할 수 있습니다.

state를 추가하려면 주로 아래 Hook을 사용합니다.

- `useState`: 직접 갱신할 수 있는 state 변수를 선언합니다.
- `useReducer`: reducer 함수(reducer function) 안에 갱신 로직(update logic)을 넣는 방식의 state 변수를 선언합니다.

## Context Hooks | 컨텍스트 훅

context(컨텍스트)는 props를 중간 단계마다 전달하지 않고도, 멀리 떨어진 부모(distant parent)로부터 정보를 받을 수 있게 해줍니다.

예를 들어:
- 앱 최상위 컴포넌트(top-level component)가 현재 UI 테마(theme)를 아주 깊은 하위 컴포넌트까지 전달할 수 있습니다.

관련 Hook:
- `useContext`: context를 읽고(read), 그 context의 변경을 구독(subscribe)합니다.

## Ref Hooks | Ref 훅

ref(레프)는 렌더링(rendering)에 사용되지 않는 정보를 저장하게 해줍니다.

예를 들어:
- DOM 노드(node)
- timeout ID

state와 달리, ref를 갱신해도 컴포넌트는 다시 렌더링되지 않습니다.
공식 문서는 ref를 React 패러다임(paradigm)에서 벗어나는 탈출구(escape hatch)라고 설명합니다.
브라우저 내장 API처럼 React 바깥 시스템과 작업할 때 유용합니다.

관련 Hook:
- `useRef`: ref를 선언합니다. 어떤 값이든 담을 수 있지만 보통 DOM 노드를 담는 데 많이 씁니다.
- `useImperativeHandle`: 컴포넌트가 외부에 노출하는 ref를 사용자화(customize)합니다. 드물게 사용됩니다.

## Effect Hooks | 이펙트 훅

Effect(이펙트)는 컴포넌트를 외부 시스템(external system)과 연결(connect)하고 동기화(synchronize)하게 해줍니다.

예를 들어:
- 네트워크(network)
- 브라우저 DOM
- 애니메이션(animation)
- 다른 UI 라이브러리로 만든 위젯(widget)
- React가 아닌 코드

관련 Hook:
- `useEffect`: 외부 시스템과 연결합니다.

중요한 주의점:
- Effect는 React 패러다임의 탈출구(escape hatch)입니다.
- 애플리케이션의 데이터 흐름(data flow)을 조정(orchestrate)하려고 Effect를 남용하면 안 됩니다.
- 외부 시스템과 상호작용하지 않는다면 Effect가 필요 없을 수도 있습니다.

시간 차이가 있는 드문 변형:
- `useLayoutEffect`: 브라우저가 다시 그리기(repaint) 전에 실행됩니다. layout 측정에 사용됩니다.
- `useInsertionEffect`: React가 DOM을 바꾸기 전에 실행됩니다. 라이브러리가 동적 CSS를 넣을 때 사용됩니다.

이벤트(event)와 Effect를 분리하기 위한 Hook:
- `useEffectEvent`: Effect 안에서 호출할 수 있는 비반응형(non-reactive) 이벤트를 만듭니다.

## Performance Hooks | 성능 훅

리렌더링(re-render) 성능을 최적화하는 일반적인 방법은 불필요한 작업(unnecessary work)을 건너뛰는 것입니다.

예를 들어:
- 비싼 계산(expensive calculation)의 결과를 재사용
- 이전 렌더 이후 데이터가 바뀌지 않았다면 다시 렌더하지 않기

관련 Hook:
- `useMemo`: 비싼 계산의 결과를 캐시(cache)합니다.
- `useCallback`: 최적화된 컴포넌트에 함수를 내려줄 때 함수 정의(function definition)를 캐시합니다.

## 학습 포인트

- `useState`와 `useReducer`는 "기억해야 하는 값"에 사용합니다.
- `useContext`는 "멀리서 전달되는 값"을 읽습니다.
- `useRef`는 "렌더링에 쓰이지 않는 값"을 저장합니다.
- `useEffect`는 "외부 시스템 동기화"에 사용합니다.
- `useMemo`, `useCallback`은 "성능 최적화"를 위한 도구입니다.
