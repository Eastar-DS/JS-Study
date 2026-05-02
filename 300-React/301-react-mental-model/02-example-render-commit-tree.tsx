import { useState } from 'react';

function InputFieldLike({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  console.log('InputFieldLike render:', label);
  return (
    <label>
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function FieldGroupLike({
  cardNumbers,
  onChange,
}: {
  cardNumbers: [string, string, string, string];
  onChange: (index: number, value: string) => void;
}) {
  console.log('FieldGroupLike render');
  return (
    <div>
      {cardNumbers.map((value, index) => (
        <InputFieldLike
          key={index}
          label={`Card ${index + 1}`}
          value={value}
          onChange={(next) => onChange(index, next)}
        />
      ))}
    </div>
  );
}

function CardPreviewLike({ cardNumbers }: { cardNumbers: [string, string, string, string] }) {
  console.log('CardPreviewLike render');
  return <div>Preview: {cardNumbers.join(' - ')}</div>;
}

export default function PaymentFormLike() {
  console.log('PaymentFormLike render');
  const [cardNumbers, setCardNumbers] = useState<[string, string, string, string]>(['', '', '', '']);

  const handleChange = (index: number, value: string) => {
    setCardNumbers((prev) => {
      const next = [...prev] as [string, string, string, string];
      next[index] = value;
      return next;
    });
  };

  return (
    <div>
      <CardPreviewLike cardNumbers={cardNumbers} />
      <FieldGroupLike cardNumbers={cardNumbers} onChange={handleChange} />
    </div>
  );
}
