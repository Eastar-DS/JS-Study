import { useState } from 'react';

export default function ClosureReferenceDemo() {
  const [count, setCount] = useState(0);
  const [cardInfo, setCardInfo] = useState({ brand: 'VISA', cvc: '123' });

  const alertLater = () => {
    const captured = count;
    setTimeout(() => {
      alert(`captured count: ${captured}`);
    }, 1000);
  };

  const recreateObject = { ...cardInfo };

  return (
    <div>
      <p>count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>increase</button>
      <button onClick={alertLater}>alert later</button>
      <button onClick={() => setCardInfo({ brand: 'MASTER', cvc: '999' })}>change object</button>
      <pre>{JSON.stringify(recreateObject, null, 2)}</pre>
    </div>
  );
}
