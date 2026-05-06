## Overview 

React 18 adds out-of-the-box performance improvements by doing more batching by default, removing the need to manually batch updates in application or library code. This post will explain what batching is, how it previously worked, and what has changed.

>Note: this is an in-depth feature that we don’t expect most users to need to think about. However, it may be relevant to educators and library developers.

## What is batching?

Batching is when React **groups multiple state updates into a single re-render** for better performance.

For example, if you have two state updates inside of the same click event, React has always batched these into one re-render. If you run the following code, you’ll see that every time you click, React only performs a single render although you set the state twice:

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

* ✅ [Demo: React 17 batches inside event handlers](https://codesandbox.io/s/spring-water-929i6?file=/src/index.js). (Notice one render per click in the console.)

This is great for performance because it avoids unnecessary re-renders. It also prevents your component from rendering “half-finished” states where only one state variable was updated, which may cause bugs. This might remind you of how a restaurant waiter doesn’t run to the kitchen when you choose the first dish, but waits for you to finish your order.

However, React wasn’t consistent about when it batches updates. For example, if you need to fetch data, and then update the state in the `handleClick` above, then React would *not* batch the updates, and perform two independent updates.

This is because React used to only batch updates *during* a browser event (like click), but here we’re updating the state *after* the event has already been handled (in fetch callback):

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

* 🟡 [Demo: React 17 does NOT batch outside event handlers](https://codesandbox.io/s/trusting-khayyam-cn5ct?file=/src/index.js). (Notice two renders per click in the console.)

Until React 18, we only batched updates during the React event handlers. Updates inside of promises, setTimeout, native event handlers, or any other event were not batched in React by default.

## What is automatic batching?

Starting in React 18 with [`createRoot`](https://github.com/reactwg/react-18/discussions/5), all updates will be automatically batched, no matter where they originate from.

This means that updates inside of timeouts, promises, native event handlers or any other event will batch the same way as updates inside of React events. We expect this to result in less work rendering, and therefore better performance in your applications:

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

* ✅ [Demo: React 18 with `createRoot` batches even outside event handlers!](https://codesandbox.io/s/morning-sun-lgz88?file=/src/index.js) (Notice one render per click in the console!)
* 🟡 [Demo: React 18 with legacy `render` keeps the old behavior](https://codesandbox.io/s/jolly-benz-hb1zx?file=/src/index.js) (Notice two renders per click in the console.)

>Note: It is expected that you will [upgrade to `createRoot`](https://github.com/reactwg/react-18/discussions/5) as part of adopting React 18. The old behavior with `render` only exists to make it easier to do production experiments with both versions.

React will batch updates automatically, no matter where the updates happen, so this:

```js
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}
```

behaves the same as this:

```js
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}, 1000);

```

behaves the same as this:

```js
fetch(/*...*/).then(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
})
```

behaves the same as this:

```js
elm.addEventListener('click', () => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
});
```

>Note: React only batches updates when it’s generally safe to do. For example, React ensures that **for each user-initiated event like a click or a keypress, the DOM is fully updated before the next event**. This ensures, for example, that a form that disables on submit can’t be submitted twice.

## What if I don’t want to batch?

Usually, batching is safe, but some code may depend on reading something from the DOM immediately after a state change. For those use cases, you can use `ReactDOM.flushSync()` to opt out of batching:

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

We don't expect this to be common.

## Does this break anything for Hooks?

If you’re using Hooks, we expect automatic batching to "just work" in the vast majority of cases. (Tell us if it doesn't!)

## Does this break anything for Classes?

Keep in mind that updates _during_ React event handlers have always been batched, so for those updates there are no changes.

There is an edge cases in class components where this can be an issue.

Class components had an implementation quirk where it was possible to synchronously read state updates inside of events. This means you would be able to read `this.state` between the calls to `setState`:

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

In React 18, this is no longer the case. Since all of the updates even in `setTimeout` are batched, React doesn’t render the result of the first `setState` synchronously—the render occurs during the next browser tick. So the render hasn’t happened yet:

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

See [sandbox](https://codesandbox.io/s/interesting-rain-hkjqw?file=/src/App.js).

If this is a blocker to upgrading to React 18, you can use `ReactDOM.flushSync` to force an update, but we recommend using this sparingly:

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

See [sandbox](https://codesandbox.io/s/hopeful-minsky-99m7u?file=/src/App.js).


This issue doesn't affect function components with Hooks because setting state doesn't update the existing variable from `useState`:

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

While this behavior may have been surprising when you adopted Hooks, it paved the way for automated batching.

## What about `unstable_batchedUpdates`?

Some React libraries use this undocumented API to force `setState` outside of event handlers to be batched:

```js
import { unstable_batchedUpdates } from 'react-dom';

unstable_batchedUpdates(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
});
```

This API still exists in 18, but it isn't necessary anymore because batching happens automatically. We are not removing it in 18, although it might get removed in a future major version after popular libraries no longer depend on its existence.