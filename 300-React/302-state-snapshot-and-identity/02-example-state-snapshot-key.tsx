import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increaseByThreeWrong = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  const increaseByThreeRight = () => {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  };

  return (
    <div>
      <p>{count}</p>
      <button onClick={increaseByThreeWrong}>+3 wrong</button>
      <button onClick={increaseByThreeRight}>+3 right</button>
    </div>
  );
}

function ResettableInput({ label }: { label: string }) {
  const [value, setValue] = useState('');
  return (
    <label>
      {label}
      <input value={value} onChange={(e) => setValue(e.target.value)} />
    </label>
  );
}

export default function SnapshotAndKeyDemo() {
  const [tab, setTab] = useState<'card' | 'cvc'>('card');
  const [forceResetKey, setForceResetKey] = useState(0);

  return (
    <div>
      <Counter />

      <button onClick={() => setTab((prev) => (prev === 'card' ? 'cvc' : 'card'))}>toggle tab</button>
      <button onClick={() => setForceResetKey((k) => k + 1)}>reset input by key</button>

      {tab === 'card' ? (
        <ResettableInput key={`card-${forceResetKey}`} label="Card Number" />
      ) : (
        <ResettableInput key={`cvc-${forceResetKey}`} label="CVC" />
      )}
    </div>
  );
}
