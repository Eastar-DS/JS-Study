import { Suspense, useDeferredValue, useMemo, useState, useTransition } from 'react';

function SlowList({ query }: { query: string }) {
  const items = useMemo(() => {
    const list = [];
    for (let i = 0; i < 2000; i += 1) {
      list.push(`${query}-${i}`);
    }
    return list;
  }, [query]);

  return (
    <ul>
      {items.slice(0, 50).map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function LazyCardGuide() {
  return <div>lazy loaded card guide</div>;
}

export default function AdvancedReactDemo() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => {
          const next = e.target.value;
          startTransition(() => {
            setQuery(next);
          });
        }}
      />
      {isPending ? <p>updating...</p> : null}
      <SlowList query={deferredQuery} />
      <Suspense fallback={<p>loading...</p>}>
        <LazyCardGuide />
      </Suspense>
    </div>
  );
}
