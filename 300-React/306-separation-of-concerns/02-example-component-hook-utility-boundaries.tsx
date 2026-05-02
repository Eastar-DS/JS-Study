import { useState } from 'react';

function isDigitsOnly(value: string) {
  return /^\d*$/.test(value);
}

function validateCardChunk(value: string) {
  if (!isDigitsOnly(value)) return '숫자만 입력 가능합니다.';
  if (value.length > 4) return '4자리까지 입력 가능합니다.';
  return '';
}

function useFormField(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);

  const errorMessage = touched ? validateCardChunk(value) : '';

  return {
    value,
    touched,
    errorMessage,
    handleChange: (next: string) => setValue(next),
    handleBlur: () => setTouched(true),
  };
}

function CardFieldView({
  label,
  value,
  errorMessage,
  onChange,
  onBlur,
}: {
  label: string;
  value: string;
  errorMessage: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  return (
    <label>
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} />
      {errorMessage ? <p>{errorMessage}</p> : null}
    </label>
  );
}

export default function PaymentCardFieldDemo() {
  const field = useFormField('');

  return (
    <CardFieldView
      label="Card Number"
      value={field.value}
      errorMessage={field.errorMessage}
      onChange={field.handleChange}
      onBlur={field.handleBlur}
    />
  );
}
