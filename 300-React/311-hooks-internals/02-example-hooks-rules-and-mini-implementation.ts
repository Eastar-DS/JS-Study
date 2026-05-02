let hookStates: unknown[] = [];
let hookIndex = 0;

function miniUseState<T>(initialValue: T) {
  const currentIndex = hookIndex;
  hookStates[currentIndex] = hookStates[currentIndex] ?? initialValue;

  function setState(nextValue: T) {
    hookStates[currentIndex] = nextValue;
  }

  hookIndex += 1;
  return [hookStates[currentIndex] as T, setState] as const;
}

function render(Component: () => void) {
  hookIndex = 0;
  Component();
}

function Counter() {
  const [count, setCount] = miniUseState(0);
  const [name] = miniUseState('eastar');

  console.log({ count, name });
  setCount(count + 1);
}

render(Counter);
render(Counter);
