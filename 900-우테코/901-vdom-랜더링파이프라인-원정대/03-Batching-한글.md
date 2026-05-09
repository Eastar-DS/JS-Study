## 개요 (Overview)

React 18은 기본적으로(by default) 더 많은 배칭(batching)을 수행함으로써 별도 설정 없이(out-of-the-box) 성능 개선을 추가했고, 이를 통해 애플리케이션이나 라이브러리(library) 코드에서 갱신(updates)을 수동으로 배치(batch)할 필요가 없어졌습니다. 이 글에서는 배칭이 무엇이고, 이전에는 어떻게 동작했으며, 무엇이 바뀌었는지를 설명합니다.

>참고(Note): 이것은 대부분의 사용자가 신경 쓸 필요는 없을 것으로 예상되는, 깊이 있는(in-depth) 기능입니다. 다만 교육자(educators)와 라이브러리 개발자(library developers)에게는 관련이 있을 수 있습니다.

## 배칭(Batching)이란 무엇인가?

배칭(Batching)이란 React가 더 나은 성능(better performance)을 위해 **여러 개의 state 갱신(state updates)을 하나의 리렌더링(single re-render)으로 묶는 것**을 말합니다.

예를 들어, 같은 클릭 이벤트(click event) 안에 두 개의 state 갱신이 있다면, React는 항상 이것들을 하나의 리렌더로 배치해 왔습니다. 다음 코드를 실행해 보면, 클릭할 때마다 state를 두 번 설정함에도 React가 단 한 번의 렌더만 수행하는 것을 볼 수 있습니다.

```js
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    setCount(c => c + 1); // Does not re-render yet
    setFlag(f => !f); // Does not re-render yet
    // React will only re-render once at the end (that's batching!)
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}
```

* ✅ [데모: React 17은 이벤트 핸들러(event handlers) 안에서 배칭한다](https://codesandbox.io/s/spring-water-929i6?file=/src/index.js). (콘솔에서 클릭당 한 번의 렌더가 발생하는 것을 확인하세요.)

이것은 불필요한 리렌더링을 피하기 때문에 성능에 좋습니다. 또한 state 변수 중 하나만 갱신된 "절반만 끝난(half-finished)" 상태로 컴포넌트가 렌더링되는 것을 막아주어, 그로 인해 발생할 수 있는 버그(bugs)를 예방합니다. 이것은 식당 종업원이 첫 번째 요리를 고르자마자 주방으로 달려가지 않고, 주문을 마칠 때까지 기다리는 것과 비슷하다고 할 수 있습니다.

하지만 React는 언제 갱신을 배치할지에 대해 일관적이지 않았습니다. 예를 들어, 데이터를 가져온(fetch) 다음 위의 `handleClick`에서 state를 갱신해야 한다면, React는 그 갱신들을 배치 *하지 않고(would not batch)*, 두 번의 독립적인 갱신을 수행했습니다.

이것은 React가 예전에는 브라우저 이벤트(browser event)(클릭 같은) *동안에만(during)* 갱신을 배치했기 때문입니다. 하지만 위의 예에서는 우리가 이벤트가 이미 처리된 *이후(after)*(fetch 콜백(callback) 안에서) state를 갱신하고 있습니다.

```js
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    fetchSomething().then(() => {
      // React 17 and earlier does NOT batch these because
      // they run *after* the event in a callback, not *during* it
      setCount(c => c + 1); // Causes a re-render
      setFlag(f => !f); // Causes a re-render
    });
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}
```

* 🟡 [데모: React 17은 이벤트 핸들러 바깥(outside)에서는 배칭하지 않는다](https://codesandbox.io/s/trusting-khayyam-cn5ct?file=/src/index.js). (콘솔에서 클릭당 두 번의 렌더가 발생하는 것을 확인하세요.)

React 18 이전까지, 우리는 React 이벤트 핸들러 동안에만(only during) 갱신을 배칭했습니다. promise, setTimeout, 네이티브 이벤트 핸들러(native event handlers), 또는 그 외 어떤 이벤트 안에서의 갱신은 React에서 기본적으로 배치되지 않았습니다.

## 자동 배칭(automatic batching)이란 무엇인가?

[`createRoot`](https://github.com/reactwg/react-18/discussions/5)을 사용하는 React 18부터, 갱신이 어디에서 시작되었든 상관없이 모든 갱신이 자동으로 배치됩니다.

이것은 timeouts, promises, 네이티브 이벤트 핸들러 또는 그 외 어떤 이벤트 안에서의 갱신도, React 이벤트 안에서의 갱신과 같은 방식으로 배치된다는 의미입니다. 우리는 이것이 렌더링 작업(work rendering)을 줄여주고, 따라서 여러분의 애플리케이션 성능을 향상시킬 것이라고 기대합니다.

```js
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    fetchSomething().then(() => {
      // React 18 and later DOES batch these:
      setCount(c => c + 1);
      setFlag(f => !f);
      // React will only re-render once at the end (that's batching!)
    });
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}
```

* ✅ [데모: `createRoot`를 사용하는 React 18은 이벤트 핸들러 바깥에서도 배칭한다!](https://codesandbox.io/s/morning-sun-lgz88?file=/src/index.js) (콘솔에서 클릭당 한 번의 렌더가 발생하는 것을 확인하세요!)
* 🟡 [데모: 레거시(legacy) `render`를 사용하는 React 18은 기존 동작을 유지한다](https://codesandbox.io/s/jolly-benz-hb1zx?file=/src/index.js) (콘솔에서 클릭당 두 번의 렌더가 발생하는 것을 확인하세요.)

>참고(Note): React 18을 도입하는 일환으로 [`createRoot`로 업그레이드](https://github.com/reactwg/react-18/discussions/5)할 것을 예상합니다. `render`를 사용하는 기존 동작은, 두 버전 모두에서 프로덕션(production) 실험을 더 쉽게 할 수 있도록 남겨둔 것입니다.

React는 갱신이 어디에서 발생하든 자동으로 배치하므로, 다음 코드는

```js
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}
```

다음과 동일하게 동작하며,

```js
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}, 1000);

```

다음과도 동일하게 동작하며,

```js
fetch(/*...*/).then(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
})
```

다음과도 동일하게 동작합니다.

```js
elm.addEventListener('click', () => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
});
```

>참고(Note): React는 일반적으로 안전할(safe) 때만 갱신을 배칭합니다. 예를 들어, React는 **클릭이나 키 입력(keypress) 같은 사용자 시작 이벤트(user-initiated event)마다, 다음 이벤트가 일어나기 전에 DOM이 완전히 갱신되도록(fully updated)** 보장합니다. 이렇게 함으로써, 예를 들어 제출(submit) 시 비활성화되는 폼이 두 번 제출되지 않도록 보장합니다.

## 배칭을 원하지 않는다면?

보통 배칭은 안전하지만, 어떤 코드는 state 변경 직후 즉시 DOM에서 무언가를 읽는 것에 의존할 수 있습니다. 그런 사용 사례(use cases)에서는 `ReactDOM.flushSync()`를 사용해 배칭을 거부(opt out)할 수 있습니다.

```js
import { flushSync } from 'react-dom'; // Note: react-dom, not react

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // React has updated the DOM by now
  flushSync(() => {
    setFlag(f => !f);
  });
  // React has updated the DOM by now
}
```

이것이 흔한 경우가 될 거라고는 예상하지 않습니다.

## Hooks에 영향을 주는 점이 있나요?

여러분이 Hooks를 사용 중이라면, 자동 배칭은 대부분의 경우에서 "그냥 동작(just work)"할 것이라고 예상합니다. (만약 그렇지 않다면 알려주세요!)

## Class에 영향을 주는 점이 있나요?

React 이벤트 핸들러 *동안(during)* 의 갱신은 항상 배치되어 왔다는 점을 기억하세요. 그래서 그러한 갱신에 대해서는 변화가 없습니다.

class 컴포넌트에는 이것이 문제가 될 수 있는 엣지 케이스(edge case)가 하나 있습니다.

class 컴포넌트는 이벤트 안에서 동기적으로(synchronously) state 갱신을 읽을 수 있는 구현상의 특이점(implementation quirk)을 갖고 있었습니다. 이것은 `setState` 호출들 사이에서 `this.state`를 읽을 수 있다는 의미입니다.

```js
handleClick = () => {
  setTimeout(() => {
    this.setState(({ count }) => ({ count: count + 1 }));

    // { count: 1, flag: false }
    console.log(this.state);

    this.setState(({ flag }) => ({ flag: !flag }));
  });
};
```

React 18에서는 더 이상 그렇지 않습니다. `setTimeout` 안에서의 갱신조차도 모두 배치되므로, React는 첫 번째 `setState`의 결과를 동기적으로 렌더링하지 않습니다. 렌더는 다음 브라우저 틱(next browser tick)에 일어납니다. 그래서 렌더는 아직 일어나지 않았습니다.

```js
handleClick = () => {
  setTimeout(() => {
    this.setState(({ count }) => ({ count: count + 1 }));

    // { count: 0, flag: false }
    console.log(this.state);

    this.setState(({ flag }) => ({ flag: !flag }));
  });
};
```

[샌드박스(sandbox)](https://codesandbox.io/s/interesting-rain-hkjqw?file=/src/App.js)를 참고하세요.

만약 이것이 React 18로 업그레이드하는 데 걸림돌(blocker)이 된다면, `ReactDOM.flushSync`를 사용해 갱신을 강제할 수 있지만, 이것은 아껴서(sparingly) 사용할 것을 권장합니다.

```js
handleClick = () => {
  setTimeout(() => {
    ReactDOM.flushSync(() => {
      this.setState(({ count }) => ({ count: count + 1 }));
    });

    // { count: 1, flag: false }
    console.log(this.state);

    this.setState(({ flag }) => ({ flag: !flag }));
  });
};
```

[샌드박스(sandbox)](https://codesandbox.io/s/hopeful-minsky-99m7u?file=/src/App.js)를 참고하세요.


이 문제는 Hooks를 사용하는 함수 컴포넌트(function components)에는 영향을 주지 않습니다. state를 설정해도 `useState`로 만든 기존 변수가 갱신되지는 않기 때문입니다.

```js
function handleClick() {
  setTimeout(() => {
    console.log(count); // 0
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1);
    console.log(count); // 0
  }, 1000)
```

여러분이 Hooks를 도입했을 때 이 동작이 놀라웠을 수 있지만, 이것이 자동 배칭(automated batching)으로 가는 길을 닦아주었습니다.

## `unstable_batchedUpdates`는 어떻게 되나요?

일부 React 라이브러리는 이벤트 핸들러 바깥에서의 `setState`를 강제로 배치하기 위해, 문서화되지 않은(undocumented) 이 API를 사용합니다.

```js
import { unstable_batchedUpdates } from 'react-dom';

unstable_batchedUpdates(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
});
```

이 API는 18에서도 여전히 존재하지만, 배칭이 자동으로 일어나기 때문에 더 이상 필요하지 않습니다. 18에서는 제거하지 않지만, 인기 있는 라이브러리들이 더 이상 이것의 존재에 의존하지 않게 되면, 이후의 메이저 버전(major version)에서 제거될 수도 있습니다.
