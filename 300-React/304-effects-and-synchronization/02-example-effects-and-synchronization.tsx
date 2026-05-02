import { useEffect, useMemo, useState } from 'react';

export default function EffectsAndSynchronizationDemo() {
  const [firstName, setFirstName] = useState('Eastar');
  const [lastName, setLastName] = useState('Kim');
  const [seconds, setSeconds] = useState(0);

  const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => {
      window.clearInterval(id);
    };
  }, []);

  return (
    <div>
      <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <p>full name: {fullName}</p>
      <p>seconds: {seconds}</p>
    </div>
  );
}
