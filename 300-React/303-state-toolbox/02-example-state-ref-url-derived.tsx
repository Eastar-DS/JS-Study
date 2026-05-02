import { useMemo, useRef, useState } from 'react';

export default function StateToolboxDemo() {
  let normalVariable = 0;
  const renderCountRef = useRef(0);
  const [query, setQuery] = useState('');
  const [cardNumbers, setCardNumbers] = useState(['4234', '1234', '5678', '9012']);

  renderCountRef.current += 1;
  normalVariable += 1;

  const cardBrand = useMemo(() => {
    const first = cardNumbers[0] ?? '';
    if (first.startsWith('4')) return 'VISA';
    const prefix = Number(first.slice(0, 2));
    if (prefix >= 51 && prefix <= 55) return 'MASTER';
    return 'NONE';
  }, [cardNumbers]);

  return (
    <div>
      <p>normal variable: {normalVariable}</p>
      <p>render count ref: {renderCountRef.current}</p>
      <p>derived brand: {cardBrand}</p>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="query param candidate" />
      <button
        onClick={() =>
          setCardNumbers((prev) => {
            const next = [...prev];
            next[0] = next[0].startsWith('4') ? '5134' : '4234';
            return next;
          })
        }
      >
        toggle brand
      </button>
    </div>
  );
}
