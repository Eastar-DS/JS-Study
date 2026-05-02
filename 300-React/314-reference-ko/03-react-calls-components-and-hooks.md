# React calls Components and Hooks | React가 컴포넌트와 훅을 호출한다

원문:
- https://react.dev/reference/rules/react-calls-components-and-hooks

## React calls Components and Hooks | React가 컴포넌트와 훅을 호출한다

React는 사용자 경험(user experience)을 최적화하기 위해, 언제 컴포넌트(component)와 Hook(훅)을 렌더링(render)해야 하는지 스스로 결정합니다.
React는 선언형(declarative)입니다.
즉 개발자는 "무엇을 렌더할지"를 컴포넌트 로직 안에서 설명하고, "어떻게 보여줄지"는 React가 결정합니다.

핵심 원칙은 다음과 같습니다.

1. 컴포넌트 함수를 직접 호출하지 않습니다.
2. Hook을 일반 값처럼 여기거나 전달하지 않습니다.

## Never call component functions directly | 컴포넌트 함수를 직접 호출하지 않기

컴포넌트는 JSX 안에서만 사용해야 합니다.
일반 함수처럼 직접 호출하면 안 됩니다.
컴포넌트는 React가 호출해야 합니다.

왜 그런가:
- React가 렌더링 중에 언제 컴포넌트 함수를 호출할지 결정해야 하기 때문입니다.
- 개발자가 직접 호출하면 React가 트리(tree), state, Hook 연결, 우선순위 같은 정보를 제대로 관리할 수 없습니다.

좋은 예:

- `<Article />`

좋지 않은 예:

- `Article()`

## Never pass around Hooks as regular values | Hook을 일반 값처럼 전달하지 않기

Hook은 컴포넌트 안이나 다른 Hook 안에서만 호출해야 합니다.
Hook 자체를 일반 값처럼 전달(pass around)하면 안 됩니다.

왜 그런가:
- Hook은 컴포넌트에 React 기능(feature)을 덧붙이는 역할을 합니다.
- Hook은 항상 함수 호출(function call) 형태로 사용되어야 하며, 일반 값처럼 전달되면 안 됩니다.
- 그래야 local reasoning(로컬 추론)이 가능해집니다.

local reasoning이란:
- 개발자가 어떤 컴포넌트를 단독으로 봐도
- 그 컴포넌트가 무엇을 하는지
- 어떤 Hook을 쓰는지
- 어떤 side effect나 state를 가지는지

를 파악할 수 있는 성질입니다.

## Don’t dynamically mutate a Hook | Hook을 동적으로 바꾸지 않기

Hook 자체를 상황에 따라 다른 구현으로 바꾸거나, 런타임에 교체하는 식으로 사용하면 코드의 예측 가능성(predictability)이 크게 떨어집니다.

## Don’t dynamically use Hooks | Hook을 동적으로 사용하지 않기

어떤 Hook을 쓸지 조건에 따라 결정하거나, 배열/객체에서 꺼내 호출하는 방식은 Hook 규칙과 React의 추론 모델을 약하게 만듭니다.

## 학습 포인트

- 컴포넌트는 JSX로 선언하고 React가 호출하게 둡니다.
- Hook은 "값"이 아니라 "React 로직을 붙이는 호출"로 생각해야 합니다.
- React가 호출 주도권(control)을 가져야 state와 Hook 연결이 안정적입니다.
