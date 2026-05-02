import { memo, useMemo, useState } from 'react';

const HeavyPreview = memo(function HeavyPreview({ cardNumber }: { cardNumber: string }) {
  let total = 0;
  for (let i = 0; i < 200000; i += 1) {
    total += i;
  }

  return (
    <div>
      {cardNumber} / {total}
    </div>
  );
});

export default function PerformanceDemo() {
  const [cardNumber, setCardNumber] = useState('');
  const [cvc, setCvc] = useState('');

  const normalizedCardNumber = useMemo(() => cardNumber.replace(/\s/g, ''), [cardNumber]);

  return (
    <div>
      <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="card number" />
      <input value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="cvc" />
      <HeavyPreview cardNumber={normalizedCardNumber} />
    </div>
  );
}
