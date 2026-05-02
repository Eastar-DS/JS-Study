import { useState } from 'react';

type Item = { id: number; label: string };

function EditableList({ useIndexKey }: { useIndexKey: boolean }) {
  const [items, setItems] = useState<Item[]>([
    { id: 1, label: 'Visa' },
    { id: 2, label: 'Master' },
    { id: 3, label: 'Amex' },
  ]);

  return (
    <div>
      <button
        onClick={() => setItems((prev) => [{ id: Date.now(), label: 'New Card' }, ...prev])}
      >
        prepend
      </button>

      {items.map((item, index) => (
        <input
          key={useIndexKey ? index : item.id}
          defaultValue={item.label}
          style={{ display: 'block', marginBottom: 8 }}
        />
      ))}
    </div>
  );
}

export default function DiffingKeyDemo() {
  return (
    <div>
      <h2>stable key</h2>
      <EditableList useIndexKey={false} />
      <h2>index key</h2>
      <EditableList useIndexKey />
    </div>
  );
}
