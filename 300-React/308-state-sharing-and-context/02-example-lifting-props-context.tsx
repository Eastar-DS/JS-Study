import { createContext, useContext, useState } from 'react';

const CardContext = createContext<{ brand: string; setBrand: (brand: string) => void } | null>(null);

function CardPreview({ brand }: { brand: string }) {
  return <div>Preview brand: {brand}</div>;
}

function CardInputByProps({ brand, setBrand }: { brand: string; setBrand: (brand: string) => void }) {
  return <input value={brand} onChange={(e) => setBrand(e.target.value)} />;
}

function CardInputByContext() {
  const context = useContext(CardContext);
  if (!context) throw new Error('CardContext is missing');
  return <input value={context.brand} onChange={(e) => context.setBrand(e.target.value)} />;
}

export default function StateSharingDemo() {
  const [brand, setBrand] = useState('VISA');

  return (
    <div>
      <CardPreview brand={brand} />
      <CardInputByProps brand={brand} setBrand={setBrand} />
      <CardContext.Provider value={{ brand, setBrand }}>
        <CardInputByContext />
      </CardContext.Provider>
    </div>
  );
}
