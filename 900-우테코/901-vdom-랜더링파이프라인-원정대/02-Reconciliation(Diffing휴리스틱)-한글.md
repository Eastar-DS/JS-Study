---
title: Preserving and Resetting State (state 보존하기와 초기화하기)
---

<Intro>

state는 컴포넌트(component)들 사이에서 격리(isolated)되어 있습니다. React는 UI 트리(tree) 안에서 각 컴포넌트가 차지하는 위치(place)를 기준으로 어떤 state가 어느 컴포넌트에 속하는지를 추적합니다. 여러분은 리렌더링(re-render) 사이에서 언제 state를 보존(preserve)할지, 언제 초기화(reset)할지 제어할 수 있습니다.

</Intro>

<YouWillLearn>

* React가 언제 state를 보존하거나 초기화하기로 결정하는지
* 어떻게 React에게 컴포넌트의 state를 강제로 초기화하도록 만드는지
* key와 컴포넌트 타입(type)이 state 보존 여부에 어떤 영향을 주는지

</YouWillLearn>

## state는 렌더 트리(render tree) 안의 위치(position)에 묶여 있다 {/*state-is-tied-to-a-position-in-the-tree*/}

React는 여러분의 UI에 있는 컴포넌트 구조를 위해 [렌더 트리(render trees)](learn/understanding-your-ui-as-a-tree#the-render-tree)를 만듭니다.

컴포넌트에 state를 부여(give)할 때, 여러분은 state가 컴포넌트 "안에" 살고 있다고 생각할 수 있습니다. 하지만 실제로 state는 React 안에 보관됩니다. React는 자신이 보관하고 있는 각각의 state 조각을, 그 컴포넌트가 렌더 트리에서 자리잡고 있는 위치(where)를 기준으로 올바른 컴포넌트와 연결시킵니다.

여기, `<Counter />` JSX 태그는 단 하나뿐이지만, 두 개의 다른 위치(positions)에서 렌더링되고 있습니다.

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

이것을 트리(tree)로 보면 다음과 같이 생겼습니다.

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. Each of the children are labeled 'Counter' and both contain a state bubble labeled 'count' with value 0.">

React 트리(tree)

</Diagram>

</DiagramGroup>

**이 둘은 서로 별개의 카운터(counter) 두 개입니다. 각각이 트리 안의 자기 자신만의 위치(position)에서 렌더링되기 때문입니다.** 보통은 React를 사용하기 위해 이 위치들에 대해 의식적으로 생각할 필요는 없지만, 이것이 어떻게 동작하는지 이해해두면 유용할 수 있습니다.

React에서는 화면(screen) 위의 각 컴포넌트가 완전히 격리된(fully isolated) state를 갖습니다. 예를 들어, 두 개의 `Counter` 컴포넌트를 나란히(side by side) 렌더링하면, 각각은 자기 자신만의 독립적인(independent) `score`와 `hover` state를 가지게 됩니다.

두 카운터를 모두 클릭해 보고, 둘이 서로 영향을 주지 않는다는 것을 확인해 보세요.

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

보시는 것처럼, 한쪽 카운터가 갱신(update)되면, 그 컴포넌트의 state만 갱신됩니다.


<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 1. The state bubble of the right child is highlighted in yellow to indicate its value has updated.">

state 갱신하기 (Updating state)

</Diagram>

</DiagramGroup>


React는 여러분이 같은 컴포넌트(same component)를 트리 안의 같은 위치(same position)에서 렌더링하는 동안에는 그 state를 계속 유지(keep around)합니다. 이를 직접 보려면, 두 카운터를 모두 증가시킨 다음 "Render the second counter" 체크박스(checkbox)의 체크를 해제해서 두 번째 컴포넌트를 제거해 보고, 그 다음 다시 체크해서 추가해 보세요.

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />}
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Render the second counter
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

두 번째 카운터를 렌더링하지 않는(stop rendering) 그 순간, 그 카운터의 state가 완전히 사라진다(disappears completely)는 점에 주목하세요. React가 컴포넌트를 제거(remove)할 때, 그 컴포넌트의 state도 파괴(destroy)하기 때문입니다.

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is missing, and in its place is a yellow 'poof' image, highlighting the component being deleted from the tree.">

컴포넌트 삭제하기 (Deleting a component)

</Diagram>

</DiagramGroup>

"Render the second counter"에 체크하면, 두 번째 `Counter`와 그 state가 처음부터(from scratch) 새로 초기화(`score = 0`)되어 DOM에 추가됩니다.

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The entire right child node is highlighted in yellow, indicating that it was just added to the tree.">

컴포넌트 추가하기 (Adding a component)

</Diagram>

</DiagramGroup>

**React는 컴포넌트가 UI 트리 안의 자기 위치에서 렌더링되고 있는 동안 그 컴포넌트의 state를 보존(preserve)합니다.** 만약 그 컴포넌트가 제거되거나, 같은 위치에 다른 컴포넌트가 렌더링되면, React는 그 state를 버립니다(discard).

## 같은 위치(same position)에 있는 같은 컴포넌트(same component)는 state를 보존한다 {/*same-component-at-the-same-position-preserves-state*/}

이 예제에는 서로 다른 두 개의 `<Counter />` 태그가 있습니다.

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} />
      ) : (
        <Counter isFancy={false} />
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

체크박스를 체크하거나 해제해도, 카운터의 state는 초기화(reset)되지 않습니다. `isFancy`가 `true`이든 `false`이든, 여러분은 항상 루트(root) `App` 컴포넌트가 반환하는 `div`의 첫 번째 자식(first child)으로 `<Counter />`를 갖고 있는 셈입니다.

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Diagram with two sections separated by an arrow transitioning between them. Each section contains a layout of components with a parent labeled 'App' containing a state bubble labeled isFancy. This component has one child labeled 'div', which leads to a prop bubble containing isFancy (highlighted in purple) passed down to the only child. The last child is labeled 'Counter' and contains a state bubble with label 'count' and value 3 in both diagrams. In the left section of the diagram, nothing is highlighted and the isFancy parent state value is false. In the right section of the diagram, the isFancy parent state value has changed to true and it is highlighted in yellow, and so is the props bubble below, which has also changed its isFancy value to true.">

`Counter`가 같은 위치에 머물러 있기 때문에, `App`의 state를 갱신해도 `Counter`는 초기화되지 않습니다.

</Diagram>

</DiagramGroup>


같은 위치에 있는 같은 컴포넌트이므로, React 입장에서 보면 이것은 같은 카운터입니다.

<Pitfall>

기억하세요. **React에게 중요한 것은 JSX 마크업(markup) 안에서의 위치가 아니라 UI 트리(UI tree) 안에서의 위치(position)입니다!** 아래 컴포넌트는 `if` 안과 밖에 서로 다른 `<Counter />` JSX 태그를 가진 두 개의 `return` 문(clauses)을 가지고 있습니다.

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

체크박스를 체크하면 state가 초기화될 거라고 예상할 수 있겠지만, 그렇지 않습니다! 그 이유는 **이 두 `<Counter />` 태그가 같은 위치에서 렌더링되기 때문**입니다. React는 여러분이 함수(function) 안 어디에 조건문(conditions)을 배치했는지 알지 못합니다. React가 "보는" 것은 여러분이 반환(return)하는 트리뿐입니다.

두 경우 모두 `App` 컴포넌트는 `<Counter />`를 첫 번째 자식으로 가진 `<div>`를 반환합니다. React에게 이 두 카운터는 같은 "주소(address)"를 가진 것입니다. 즉, 루트의 첫 번째 자식의 첫 번째 자식이라는 주소죠. 이렇게 React는, 여러분이 로직을 어떻게 구성했든 상관없이, 이전 렌더와 다음 렌더 사이에 두 카운터를 매칭(match up)시킵니다.

</Pitfall>

## 같은 위치(same position)에 있는 다른 컴포넌트(different components)는 state를 초기화한다 {/*different-components-at-the-same-position-reset-state*/}

이 예제에서, 체크박스를 체크하면 `<Counter>`가 `<p>`로 교체됩니다.

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>See you later!</p>
      ) : (
        <Counter />
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Take a break
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

여기서는 같은 위치에서 _서로 다른(different)_ 컴포넌트 타입(component types) 사이를 전환(switch)하고 있습니다. 처음에는 `<div>`의 첫 번째 자식이 `Counter`를 담고 있었습니다. 그런데 그 자리에 `p`를 끼워 넣으면, React는 UI 트리에서 `Counter`를 제거하고 그 state를 파괴합니다.

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'p', highlighted in yellow.">

`Counter`가 `p`로 바뀌면, `Counter`는 삭제되고 `p`가 추가됩니다.

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'p'. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, highlighted in yellow.">

다시 전환하면, `p`는 삭제되고 `Counter`가 추가됩니다.

</Diagram>

</DiagramGroup>

또한 **같은 위치에 다른 컴포넌트를 렌더링하면, 그 컴포넌트의 전체 서브트리(subtree)의 state가 초기화됩니다.** 어떻게 동작하는지 보려면, 카운터를 증가시킨 다음 체크박스를 체크해 보세요.

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} />
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

체크박스를 클릭하면 카운터의 state가 초기화됩니다. 비록 `Counter`를 렌더링하긴 하지만, `div`의 첫 번째 자식이 `section`에서 `div`로 바뀌었기 때문입니다. 자식 `section`이 DOM에서 제거될 때, 그 아래에 있는 트리 전체(`Counter`와 그 state를 포함)도 함께 파괴됩니다.

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'section', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'div', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

`section`이 `div`로 바뀌면, `section`은 삭제되고 새로운 `div`가 추가됩니다.

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'div', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 0. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'section', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

다시 전환하면, `div`는 삭제되고 새로운 `section`이 추가됩니다.

</Diagram>

</DiagramGroup>

경험칙(rule of thumb)으로, **리렌더링 사이에서 state를 보존하고 싶다면, 트리의 구조(structure)가 한 렌더와 다음 렌더 사이에서 "맞아떨어져야"** 합니다. 만약 구조가 다르다면, 트리에서 컴포넌트가 제거될 때 React가 그 state를 파괴하기 때문에, state도 함께 파괴됩니다.

<Pitfall>

이것이 바로 컴포넌트 함수 정의(component function definitions)를 중첩(nest)해서는 안 되는 이유입니다.

여기서는 `MyTextField` 컴포넌트 함수가 `MyComponent` *안에서* 정의되고 있습니다.

<Sandpack>

```js {expectedErrors: {'react-compiler': [7]}}
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Clicked {counter} times</button>
    </>
  );
}
```

</Sandpack>


버튼(button)을 클릭할 때마다, input의 state가 사라집니다! 이것은 `MyComponent`가 렌더링될 때마다 *서로 다른(different)* `MyTextField` 함수가 만들어지기 때문입니다. 즉, 같은 위치에 *서로 다른(different)* 컴포넌트를 렌더링하고 있는 셈이고, React는 그 아래의 모든 state를 초기화합니다. 이것은 버그(bugs)와 성능 문제(performance problems)로 이어집니다. 이 문제를 피하려면, **항상 컴포넌트 함수를 최상위(top level)에서 선언하고, 정의를 중첩하지 마세요.**

</Pitfall>

## 같은 위치(same position)에서 state를 초기화하기 {/*resetting-state-at-the-same-position*/}

기본적으로 React는 컴포넌트가 같은 위치에 머물러 있는 동안에는 그 state를 보존합니다. 보통은 이것이 바로 여러분이 원하는 것이므로, 기본 동작(default behavior)으로서 합리적입니다. 하지만 때로는 컴포넌트의 state를 초기화하고 싶을 수 있습니다. 두 명의 플레이어(players)가 각 턴(turn)마다 자신의 점수를 기록할 수 있게 해주는 다음 앱을 살펴보세요.

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

현재로서는, 플레이어를 바꾸어도 점수가 보존됩니다. 두 `Counter`가 같은 위치에 나타나기 때문에, React는 둘을 *동일한(the same)* `Counter`로 보고 단지 `person` prop이 바뀐 것으로 인식합니다.

하지만 개념적으로(conceptually), 이 앱에서 둘은 별개의 두 카운터여야 합니다. UI에서 같은 자리에 보일 수는 있어도, 하나는 Taylor의 카운터이고 다른 하나는 Sarah의 카운터이니까요.

이 둘 사이를 전환할 때 state를 초기화하는 방법에는 두 가지가 있습니다.

1. 컴포넌트들을 서로 다른 위치(different positions)에서 렌더링한다
2. 각 컴포넌트에 `key`로 명시적인 정체성(explicit identity)을 부여한다


### 옵션 1: 컴포넌트를 서로 다른 위치(different positions)에서 렌더링하기 {/*option-1-rendering-a-component-in-different-positions*/}

이 두 `Counter`가 독립적이기를 원한다면, 둘을 서로 다른 두 위치에서 렌더링하면 됩니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* 처음에는 `isPlayerA`가 `true`입니다. 그래서 첫 번째 위치에 `Counter`의 state가 있고, 두 번째 위치는 비어 있습니다.
* "Next player" 버튼을 클릭하면 첫 번째 위치는 비워지고, 이제 두 번째 위치에 `Counter`가 들어갑니다.

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The only child, arranged to the left, is labeled Counter with a state bubble labeled 'count' and value 0. All of the left child is highlighted in yellow, indicating it was added.">

초기 state (Initial state)

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'false'. The state bubble is highlighted in yellow, indicating that it has changed. The left child is replaced with a yellow 'poof' image indicating that it has been deleted and there is a new child on the right, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0.">

"next" 클릭하기 (Clicking "next")

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The state bubble is highlighted in yellow, indicating that it has changed. There is a new child on the left, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is replaced with a yellow 'poof' image indicating that it has been deleted.">

"next"를 다시 클릭하기 (Clicking "next" again)

</Diagram>

</DiagramGroup>

각 `Counter`의 state는 DOM에서 제거될 때마다 파괴됩니다. 이것이 버튼을 누를 때마다 state가 초기화되는 이유입니다.

이 해결책(solution)은 같은 자리에서 렌더링되는 독립적인 컴포넌트가 몇 개 안 될 때 편리합니다. 이 예제에서는 두 개뿐이라, JSX에서 둘을 따로 렌더링해도 번거롭지 않습니다.

### 옵션 2: `key`로 state 초기화하기 {/*option-2-resetting-state-with-a-key*/}

컴포넌트의 state를 초기화하는, 또 다른 더 일반적인(more generic) 방법이 있습니다.

[리스트 렌더링(rendering lists)](/learn/rendering-lists#keeping-list-items-in-order-with-key)에서 `key`를 본 적이 있을 겁니다. 키(key)는 리스트만을 위한 것이 아닙니다! 키를 사용해 React가 어떤 컴포넌트들이든 구별하게 만들 수 있습니다. 기본적으로 React는 부모(parent) 안에서의 순서("첫 번째 카운터", "두 번째 카운터")를 사용해 컴포넌트들을 구분합니다. 하지만 키를 쓰면, 이것이 단순히 *첫 번째* 카운터나 *두 번째* 카운터가 아니라, 특정한 카운터, 예를 들어 *Taylor의* 카운터라고 React에게 말해줄 수 있습니다. 이렇게 하면, React는 트리 어디에 나타나든 *Taylor의* 카운터를 알아볼 수 있게 됩니다!

이 예제에서는, 두 `<Counter />`가 JSX에서 같은 자리에 나타나는데도 state를 공유하지 않습니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Taylor와 Sarah 사이를 전환해도 state가 보존되지 않습니다. **여러분이 둘에게 서로 다른 `key`를 부여했기 때문입니다.**

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

`key`를 지정하면, 부모 안에서의 순서 대신 `key` 그 자체를 위치(position)의 일부로 사용하라고 React에게 말해주는 것입니다. 그래서 JSX에서 같은 자리에 렌더링하더라도, React는 둘을 서로 다른 두 카운터로 보게 되고, 따라서 둘은 결코 state를 공유하지 않게 됩니다. 카운터가 화면에 나타날 때마다 그 state가 생성됩니다(created). 제거될 때마다 그 state가 파괴됩니다(destroyed). 둘 사이를 토글(toggle)할 때마다 state가 계속해서 초기화됩니다.

<Note>

키는 전역적으로 고유(globally unique)할 필요가 없다는 것을 기억하세요. 키는 *부모 안에서의(within the parent)* 위치만 지정합니다.

</Note>

### `key`로 폼(form) 초기화하기 {/*resetting-a-form-with-a-key*/}

`key`로 state를 초기화하는 것은 특히 폼(forms)을 다룰 때 유용합니다.

이 채팅 앱(chat app)에서, `<Chat>` 컴포넌트는 텍스트 입력(text input) state를 가지고 있습니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

input에 무언가를 입력한 다음, "Alice"나 "Bob"을 눌러 다른 수신자(recipient)를 선택해 보세요. `<Chat>`이 트리에서 같은 위치에 렌더링되기 때문에 input의 state가 보존된다는 것을 확인할 수 있습니다.

**많은 앱에서는 이것이 의도된 동작일 수 있지만, 채팅 앱에서는 그렇지 않습니다!** 사용자가 실수로 클릭해서, 이미 입력해둔 메시지를 잘못된 사람에게 보내게 되는 것을 원하지 않을 것입니다. 이를 고치려면, `key`를 추가하세요.

```js
<Chat key={to.id} contact={to} />
```

이렇게 하면 다른 수신자를 선택할 때, `Chat` 컴포넌트가 그 아래의 트리에 있는 모든 state를 포함해 처음부터 새로 만들어집니다(re-created from scratch). React는 또한 DOM 요소(elements)도 재사용하지 않고 새로 만듭니다(re-create).

이제 수신자를 바꿀 때마다 텍스트 필드가 항상 비워집니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<DeepDive>

#### 제거된 컴포넌트(removed components)의 state 보존하기 {/*preserving-state-for-removed-components*/}

실제 채팅 앱이라면, 사용자가 이전 수신자를 다시 선택했을 때 input의 state를 복구(recover)하고 싶을 것입니다. 더 이상 보이지 않는 컴포넌트의 state를 "살아있게(alive)" 유지하는 방법에는 몇 가지가 있습니다.

- 현재 채팅만 렌더링하지 말고 _모든(all)_ 채팅을 렌더링하되, 나머지는 CSS로 숨기는 방법이 있습니다. 채팅들이 트리에서 제거되지 않으므로, 각 채팅의 로컬 state(local state)는 보존됩니다. 이 해결책은 단순한 UI에서는 잘 동작합니다. 하지만 숨겨진 트리들이 크고 DOM 노드(nodes)를 많이 포함한다면 매우 느려질 수 있습니다.
- [state를 끌어올려서(lift the state up)](/learn/sharing-state-between-components) 각 수신자에 대해 보류된(pending) 메시지를 부모 컴포넌트에 보관할 수 있습니다. 이렇게 하면 자식 컴포넌트들이 제거되어도 상관없습니다. 중요한 정보를 부모가 가지고 있기 때문입니다. 이것이 가장 일반적인 해결책입니다.
- React state 외에 다른 출처(source)를 함께 사용할 수도 있습니다. 예를 들어, 사용자가 실수로 페이지를 닫더라도 메시지 초안(draft)이 유지되기를 원할 수 있습니다. 이를 구현하려면, `Chat` 컴포넌트가 [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)에서 읽어와 자신의 state를 초기화하고, 초안도 거기에 저장하게 만들면 됩니다.

어떤 전략(strategy)을 선택하든, _Alice와의_ 채팅은 _Bob과의_ 채팅과 개념적으로 구분되므로, 현재 수신자(recipient)를 기반으로 `<Chat>` 트리에 `key`를 부여하는 것이 합리적입니다.

</DeepDive>

<Recap>

- React는 같은 컴포넌트가 같은 위치에서 렌더링되는 동안 state를 유지합니다.
- state는 JSX 태그 안에 보관되지 않습니다. 그것은 여러분이 그 JSX를 둔 트리 위치(tree position)와 연관되어 있습니다.
- 서브트리에 다른 key를 부여해서 강제로 state를 초기화시킬 수 있습니다.
- 컴포넌트 정의를 중첩하지 마세요. 그렇지 않으면 실수로 state가 초기화될 수 있습니다.

</Recap>



<Challenges>

#### 사라지는 input 텍스트 고치기 {/*fix-disappearing-input-text*/}

이 예제는 버튼을 누르면 메시지를 보여줍니다. 하지만 버튼을 누르면 의도치 않게 input도 초기화됩니다. 왜 이런 일이 발생하나요? 버튼을 눌러도 input 텍스트가 초기화되지 않도록 고쳐 보세요.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

문제는 `Form`이 서로 다른 위치에 렌더링되고 있다는 점입니다. `if` 분기에서 `Form`은 `<div>`의 두 번째 자식이지만, `else` 분기에서는 첫 번째 자식입니다. 따라서 각 위치에서 컴포넌트 타입이 바뀝니다. 첫 번째 위치는 `p`와 `Form` 사이에서 바뀌고, 두 번째 위치는 `Form`과 `button` 사이에서 바뀝니다. 컴포넌트 타입이 바뀔 때마다 React는 state를 초기화합니다.

가장 쉬운 해결책은 분기를 통합해서 `Form`이 항상 같은 위치에서 렌더링되게 만드는 것입니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>Hint: Your favorite city?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>Show hint</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>


기술적으로는, `else` 분기에서 `<Form />` 앞에 `null`을 추가해서 `if` 분기의 구조와 맞추는 방법도 있습니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

이렇게 하면 `Form`은 항상 두 번째 자식이 되어, 같은 위치에 머물고 state를 유지합니다. 하지만 이 접근법(approach)은 훨씬 덜 명확하고, 다른 누군가가 그 `null`을 제거할 위험이 있습니다.

</Solution>

#### 두 폼 필드(form fields) 위치 바꾸기 {/*swap-two-form-fields*/}

이 폼은 이름과 성을 입력할 수 있게 해줍니다. 어떤 필드가 먼저 올지 제어하는 체크박스도 있습니다. 체크박스를 체크하면 "Last name" 필드가 "First name" 필드보다 먼저 나타납니다.

거의 동작하지만, 버그가 하나 있습니다. "First name" input을 채우고 체크박스를 체크하면, 그 텍스트는 첫 번째 input(지금은 "Last name"인)에 그대로 남아 있습니다. 순서를 뒤집을 때 input 텍스트도 *함께* 따라 움직이도록 고쳐 보세요.

<Hint>

이 필드들에서는 부모 안에서의 위치만으로는 충분하지 않은 것 같습니다. 리렌더링 사이에서 state를 어떻게 매칭(match up)할지 React에게 알려줄 방법이 없을까요?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="Last name" />
        <Field label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="First name" />
        <Field label="Last name" />
        {checkbox}
      </>
    );
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

`if`와 `else` 분기의 두 `<Field>` 컴포넌트 모두에 `key`를 부여하세요. 이렇게 하면 부모 안에서의 순서가 바뀌더라도, React에게 어떤 `<Field>`에 어떤 state를 "매칭(match up)"시켜야 하는지 알려줄 수 있습니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="Last name" />
        <Field key="firstName" label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="First name" />
        <Field key="lastName" label="Last name" />
        {checkbox}
      </>
    );
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

</Solution>

#### 상세 폼(detail form) 초기화하기 {/*reset-a-detail-form*/}

이것은 편집 가능한 연락처(contact) 목록입니다. 선택한 연락처의 상세 정보를 편집한 다음, "Save"를 눌러 갱신하거나 "Reset"을 눌러 변경 사항을 되돌릴 수 있습니다.

다른 연락처를 선택할 때(예: Alice), state는 갱신되지만 폼은 여전히 이전 연락처의 상세 정보를 보여줍니다. 선택된 연락처가 바뀌면 폼이 초기화되도록 고쳐 보세요.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

`EditContact` 컴포넌트에 `key={selectedId}`를 부여하세요. 이렇게 하면 서로 다른 연락처들 사이를 전환할 때 폼이 초기화됩니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### 이미지가 로딩되는 동안 이전 이미지 지우기 {/*clear-an-image-while-its-loading*/}

"Next"를 누르면, 브라우저(browser)는 다음 이미지를 로딩(loading)하기 시작합니다. 하지만 같은 `<img>` 태그에서 이미지가 표시되기 때문에, 기본적으로는 다음 이미지가 로딩될 때까지 이전 이미지가 그대로 보입니다. 텍스트가 항상 이미지와 일치해야 한다면 이것은 바람직하지 않을 수 있습니다. "Next"를 누르는 순간 즉시 이전 이미지가 지워지도록 변경해 보세요.

<Hint>

React에게 DOM을 재사용하지 말고 다시 만들도록(re-create) 알려줄 방법이 있을까요?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://react.dev/images/docs/scientists/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://react.dev/images/docs/scientists/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://react.dev/images/docs/scientists/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://react.dev/images/docs/scientists/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://react.dev/images/docs/scientists/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://react.dev/images/docs/scientists/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://react.dev/images/docs/scientists/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

`<img>` 태그에 `key`를 부여할 수 있습니다. 그 `key`가 바뀌면, React는 `<img>` DOM 노드를 처음부터 다시 만듭니다(re-create). 이로 인해 각 이미지가 로딩될 때 잠깐의 깜빡임(brief flash)이 발생하므로, 앱의 모든 이미지에 적용하고 싶지는 않을 것입니다. 하지만 이미지가 항상 텍스트와 일치하도록 보장하고 싶을 때는 합리적입니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://react.dev/images/docs/scientists/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://react.dev/images/docs/scientists/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://react.dev/images/docs/scientists/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://react.dev/images/docs/scientists/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://react.dev/images/docs/scientists/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://react.dev/images/docs/scientists/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://react.dev/images/docs/scientists/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

#### 리스트(list) 안의 잘못된 자리에 있는 state 고치기 {/*fix-misplaced-state-in-the-list*/}

이 리스트에서, 각 `Contact`는 자신에 대해 "Show email"이 눌렸는지 여부를 결정하는 state를 가지고 있습니다. Alice에 대해 "Show email"을 누른 다음, "Show in reverse order" 체크박스를 체크하세요. 그러면 이제 _Taylor의_ 이메일이 펼쳐져(expanded) 있고, 맨 아래로 옮겨진 Alice는 접혀있는(collapsed) 것을 보게 될 것입니다.

선택한 정렬과 상관없이, 펼침(expanded) state가 각 연락처와 함께 연관되도록 고쳐 보세요.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

문제는 이 예제가 인덱스(index)를 `key`로 사용하고 있다는 점입니다.

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

하지만 여러분이 원하는 것은 state가 _각각의 특정한 연락처(each particular contact)_ 와 연관되는 것입니다.

대신 연락처 ID를 `key`로 사용하면 문제가 해결됩니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

state는 트리 위치(tree position)와 연관됩니다. `key`는 순서에 의존하는 대신 이름붙여진 위치(named position)를 지정할 수 있게 해줍니다.

</Solution>

</Challenges>

---

## 사이트맵 (Sitemap)

[모든 문서 페이지의 개요(Overview of all docs pages)](/llms.txt)
