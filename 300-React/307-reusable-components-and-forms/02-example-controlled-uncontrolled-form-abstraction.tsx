import { useRef, useState } from 'react';

function ControlledInput() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="controlled" />;
}

function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <input ref={inputRef} defaultValue="" placeholder="uncontrolled" />
      <button onClick={() => alert(inputRef.current?.value ?? '')}>read value</button>
    </div>
  );
}

type FieldConfig = {
  key: string;
  label: string;
  value: string;
  placeholder: string;
};

function FieldGroup({
  fields,
  onChange,
}: {
  fields: FieldConfig[];
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div>
      {fields.map((field) => (
        <label key={field.key}>
          {field.label}
          <input
            value={field.value}
            placeholder={field.placeholder}
            onChange={(e) => onChange(field.key, e.target.value)}
          />
        </label>
      ))}
    </div>
  );
}

export default function ReusableFormDemo() {
  const [expiry, setExpiry] = useState({ month: '', year: '' });

  return (
    <div>
      <ControlledInput />
      <UncontrolledInput />
      <FieldGroup
        fields={[
          { key: 'month', label: 'Month', value: expiry.month, placeholder: 'MM' },
          { key: 'year', label: 'Year', value: expiry.year, placeholder: 'YY' },
        ]}
        onChange={(key, value) => setExpiry((prev) => ({ ...prev, [key]: value }))}
      />
    </div>
  );
}
