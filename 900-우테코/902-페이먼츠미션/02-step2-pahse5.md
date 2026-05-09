# 결정 과정

## 



# 질문
1. forwardRef가 뭔지 몰라.



# Part 1 — ref가 뭔지 (질문 3 먼저)

## 동기 — 자동 포커스를 만들고 싶다

"카드번호 첫 칸 4자리 입력 → 두 번째 칸 자동 포커스" — 이걸 구현하려면 **JavaScript에서 `<input>` DOM 요소의 `.focus()` 메서드를 호출**해야 합니다.

일반 JS:

```js
const input = document.getElementById('myInput');
input.focus();
```

React에서는 이렇게 직접 못 합니다 — DOM은 React가 관리하니까. **React에게 "이 input의 DOM 노드를 나에게 알려줘"라고 부탁**해야 해요. 그게 **ref**.

## ref의 본질 — "박스"

ref = **렌더와 무관하게 값을 보관하는 박스**.

```ts
const box = { current: null };
box.current = '아무거나';  // 변경해도 리렌더 X
```

이 박스를 React에게 `<input ref={box} />` 식으로 주면, **input이 mount될 때 React가 박스에 DOM 노드를 넣어줍니다**.

```ts
// mount 후
box.current === <실제 input DOM 노드>
box.current.focus();  // ✅ 가능
```

## state vs ref — 결정적 차이

|       | state           | ref                         |
| ----- | --------------- | --------------------------- |
| 변경    | 리렌더 트리거         | 리렌더 X                       |
| 용도    | 화면에 반영되는 값      | 박스에 보관만 (DOM 노드, 타이머 ID 등)  |
| 접근    | `state`         | `ref.current`               |
| 변경 방법 | `setState(...)` | `ref.current = ...` (직접 대입) |

→ DOM 노드는 화면에 반영하는 값이 아니라 "필요할 때 메서드 호출"용 — **ref가 정답**.

## useRef — 박스를 만드는 hook

```ts
const inputBox = useRef<HTMLInputElement | null>(null);
//                                                 ^^^^
//                                     초기값. 박스는 빈 채로 시작

<input ref={inputBox} />
// mount 후 inputBox.current에 input DOM이 들어감
```

핵심: `useRef(initial)`은 **컴포넌트가 unmount될 때까지 같은 박스 객체를 유지**. 매 렌더마다 같은 `inputBox`를 받음 (새로 만들지 않음).

## ref의 두 가지 주요 용도

|용도|예시|
|---|---|
|**DOM 노드 보관**|input의 `.focus()`, scroll 위치 조작, 측정(`getBoundingClientRect`)|
|**렌더와 무관한 값 보관**|setTimeout ID, 이전 prop 값 추적, "처음 mount 여부" 같은 flag|

본 프로젝트는 **첫 번째 용도** — input DOM 노드 모아서 자동 포커스.

## 자동 포커스가 어떻게 동작하나 (전체 흐름)

```
[1] InputFieldForm이 inputRefs라는 박스 배열을 들고 있음 (useRef)
    inputRefs.current = [null, null, null, null]

[2] 각 FormField → InputField → <input>이 mount되면
    inputRefs.current = [<input DOM>, <input DOM>, <input DOM>, <input DOM>]

[3] 사용자가 첫 칸에 4자리 입력 (e.g. "1234")
    FormField onChange → InputFieldForm의 handleFieldChange 호출

[4] handleFieldChange에서:
    - 부모 onChange 호출 (PaymentForm으로 setState 트리거)
    - value.length === fieldMaxLengths[0] (4) 확인 → 다 찼다
    - inputRefs.current[1].focus() ← DOM 메서드 직접 호출

[5] 두 번째 칸에 포커스 들어감 (브라우저 동작)
```

## 왜 useEffect 안 쓰나

useEffect = "외부 시스템 동기화"용. 본 케이스는 사용자 인터랙션 직후의 즉시 동작이고, ref는 **이미 mount된 DOM**을 가리키므로 onChange 안에서 `.focus()` 호출이 즉시 됩니다. useEffect로 옮기면 리렌더 한 사이클을 기다리는 셈 → 불필요한 지연.

---

# Part 2 — forwardRef (질문 1)

## useRef vs forwardRef — 다른 역할

|        | useRef           | forwardRef                       |
| ------ | ---------------- | -------------------------------- |
| 누가 사용? | **사용자(부모 컴포넌트)** | **컴포넌트 정의자**                     |
| 무엇?    | ref 박스를 만드는 hook | 함수 컴포넌트가 ref를 받을 수 있게 하는 wrapper |
| 위치     | 컴포넌트 본문 안        | 컴포넌트 정의 자체를 감쌈                   |

→ **둘은 비슷한 게 아니라 같이 쓰는 짝**. useRef로 박스 만들고, forwardRef로 그 박스를 자식 컴포넌트의 DOM에 연결.

## 왜 forwardRef가 필요한가 — 함수 컴포넌트의 한계

함수 컴포넌트는 props를 객체로 받음:

```tsx
function MyInput(props) {
  return <input {...props} />;
}
```

그런데 **`ref`는 일반 prop이 아닙니다** — React가 reserved한 특수 prop.

```tsx
const box = useRef(null);
<MyInput ref={box} />  // ❌ React 경고: "Function components cannot be given refs."
```

→ ref가 함수 컴포넌트에 도달하지 못함. props 객체에도 안 들어감. 그냥 무시됨.

## forwardRef로 해결

`forwardRef`로 컴포넌트를 감싸면, **두 번째 인자**로 ref를 받을 수 있음:

```tsx
const MyInput = forwardRef<HTMLInputElement, Props>(
  (props, ref) => {                          // ← ref가 두 번째 인자!
    return <input ref={ref} {...props} />;   // 받은 ref를 안쪽 input에 연결
  }
);
```

타입 파라미터:

- 첫 번째 `HTMLInputElement` — ref가 가리키는 DOM 노드 타입
- 두 번째 `Props` — 일반 props 타입

이제 가능:

```tsx
const box = useRef<HTMLInputElement | null>(null);
<MyInput ref={box} />  // ✅
box.current.focus();   // ✅
```

## 본 프로젝트의 InputField

원래:

```tsx
function InputField({ isError, ...props }) {
  return <Input $isError={isError} {...props} />;
}
```

forwardRef 적용:

```tsx
const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ isError, ...props }, ref) => {
    return <Input ref={ref} $isError={isError} {...props} />;
  }
);
```

→ 이제 InputField에 ref를 줄 수 있음. 그 ref가 안쪽 styled `<Input>` (실제로는 `<input>`)의 DOM에 연결됨.

`displayName`은 React DevTools에서 컴포넌트 이름 표시용 — forwardRef는 anonymous라 명시 안 하면 "ForwardRef"로 보임.

---

# Part 3 — callback ref (질문 2)

## 문제 — 배열에 ref를 어떻게?

useRef 객체 한 개로는 인덱스별로 다른 DOM 노드 받기 어려움:

```tsx
{values.map((_, index) => (
  <input ref={???} />  // 어떻게 인덱스별로 다르게?
))}
```

## 해결 — callback ref

`ref` prop은 **객체**(`useRef`의 결과)뿐 아니라 **함수**도 받을 수 있음. 함수면 React가 mount 시 DOM 노드, unmount 시 null로 호출.

```tsx
const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

{values.map((_, index) => (
  <input
    ref={(el) => {
      inputRefs.current[index] = el;  // mount: DOM, unmount: null
    }}
  />
))}
```

- 박스 자체는 useRef로 한 개 (`inputRefs`)
- 박스 안에 배열을 들고, **callback이 인덱스별로 자기 자리에 DOM을 채움**
- `inputRefs.current[0]`, `inputRefs.current[1]` ... 인덱스별 DOM 노드

## FormField의 `inputRef` prop이란

상황: InputFieldForm이 input DOM 노드들을 갖고 싶음. 근데 input은 FormField 안에 있고, FormField 안에 또 InputField가 있음:

```
InputFieldForm → FormField → InputField → <input>
```

InputFieldForm이 가장 안쪽 `<input>` DOM을 가지려면 ref가 두 단계 내려가야 함.

방법 1 — 모든 단계에 forwardRef:

```tsx
const FormField = forwardRef(...)
const InputField = forwardRef(...)
```

복잡 + 두 번 forward.

방법 2 — FormField는 일반 prop으로 ref-like를 받음:

```tsx
// FormField props
inputRef?: (el: HTMLInputElement | null) => void;

// FormField 내부
<InputField ref={inputRef} />  // 받은 callback을 InputField의 ref로 그대로
```

이름을 `inputRef`로 하는 이유 — `ref`라는 이름은 React reserved라 일반 prop으로 쓸 수 없음. 그래서 다른 이름.

본 프로젝트는 방법 2 사용 — FormField는 forwardRef X, 일반 prop으로 callback 받기.

## 전체 ref 흐름 (그림으로)

```
InputFieldForm:
  const inputRefs = useRef([])  ← 박스
  
  <FormField                                                ┐
    inputRef={(el) => { inputRefs.current[0] = el; }}     ─ │ callback
  />                                                        ┘
       ↓ (FormField가 받은 callback을 InputField의 ref로)
  
  FormField:
    <InputField ref={inputRef} />                          ┐
       ↓ (InputField는 forwardRef로 ref를 받아 안쪽으로)    │ forward
                                                            ┘
  InputField:
    <Input ref={ref} ... />  (styled.input)
       ↓ (실제 <input>의 DOM이 callback의 el로 들어감)
  
  결과: inputRefs.current[0] === <input DOM 노드>
```

→ **InputFieldForm은 useRef 박스를 만들고, callback prop으로 자식에 내려보내고, 자식은 forwardRef로 받아 안쪽 DOM에 연결**.

---

# Part 4 — focusedIndex (질문 4)

## 동기 — 에러 파생값화

현재 [InputFieldForm.tsx:27](vscode-webview://15mqrfes19fks2qihic2rjvah1lqavgs06frdkjlrm7bnisbs0u8/src/components/Form/InputFieldForm.tsx#L27):

```ts
const [errorMessage, setErrorMessage] = useState<string>('');
```

`errorMessage`는 무엇으로 결정되는가?

- 마지막으로 사용자가 만진 칸의 validator 결과

→ **입력값(values) + validator 함수 + 어떤 칸을 보고 있는가** 세 가지로 100% 결정됨. **파생값으로 도출 가능**.

## v2 원칙 위반?

```ts
const errorMessage = validator(values[??], ??).errorMessage;
//                                       ^^
//                                       어떤 칸?
```

→ "어떤 칸을 보고 있나?"만 추적하면 errorMessage는 매 렌더 도출 가능.

## focusedIndex — "지금 보고 있는 칸"

`focusedIndex` = 현재 포커스(또는 마지막으로 만진) 칸의 인덱스.

```ts
const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

// errorMessage는 파생값
const errorMessage = focusedIndex !== null
  ? validator(values[focusedIndex], focusedIndex).errorMessage
  : '';
```

`focusedIndex` 갱신은 FormField의 onFocus/onBlur에서:

```tsx
<FormField
  onFocus={() => setFocusedIndex(index)}
  onBlur={() => setFocusedIndex(null)}
/>
```

## 동작 흐름

```
1. 사용자가 카드번호 첫 칸 클릭 → focus → setFocusedIndex(0)
2. errorMessage = validator(values[0], 0).errorMessage
3. 사용자가 입력 → values 갱신 → 자동 리렌더 → errorMessage 자동 재계산 (파생값)
4. 사용자가 두 번째 칸 클릭 → setFocusedIndex(1)
5. errorMessage = validator(values[1], 1).errorMessage  (다른 칸 결과로 자동 갱신)
6. 다른 곳 클릭 (blur) → setFocusedIndex(null) → errorMessage = ''
```

## 비교 (현재 vs focusedIndex)

|측면|useState (현재)|focusedIndex (파생값)|
|---|---|---|
|useState 개수|`errorMessage` 1개|`focusedIndex` 1개 (사실상 동수)|
|errorMessage 갱신 책임|`setErrorMessage` 호출 (handleFieldChange + handleFocus + handleBlur 3곳)|자동 (입력 변경 시 자동 재계산)|
|**사용자가 입력 후 다른 곳 클릭하지 않고 있어도**|errorMessage 그대로|focusedIndex 그대로 → errorMessage 그대로|
|**values가 다른 이유로 변경되면 (예: 외부에서)**|묵은 errorMessage 표시 위험|자동으로 새 결과 반영|
|코드 양|적음 (직관적)|focus 추적 추가|

→ **focusedIndex가 v2 원칙에 더 부합**. 단점은 focus 추적 로직 추가.

## isError도 같은 패턴 (FormField)

FormField의 `isError`도 useState로 들고 있음:

```ts
const [isError, setIsError] = useState<boolean>(false);
```

이것도 파생값화 가능:

```ts
// 자기 칸의 검증 결과가 곧 isError
const { error: isError } = validator(numbers, index);
```

근데 이러면 입력값이 빈 문자열일 때도 검증해서 false 같은 결과 — 사용자 입력 전부터 에러 표시 위험. 그래서 보통:

```ts
const isError = numbers.length > 0 && validator(numbers, index).error;
```

또는 focusedIndex와 동일한 패턴으로 InputFieldForm에서 일괄.

## 안 A vs 안 B 결정

| |안 A (현재 useState)|안 B (focusedIndex 파생값화)|
|---|---|---|
|단순함|✅|⚠️ focus 추적 추가|
|v2 원칙 부합도|⚠️ 부분|✅|
|묵은 errorMessage 위험|⚠️ 미세|✅ 자동 갱신|
|본 프로젝트 규모|충분|약간 과|

본인이 "가능한 한 파생값으로" 의지가 강하면 **안 B 추천**. 단순함 우선이면 안 A.

---

# 정리

|개념|한 줄 정의|
|---|---|
|**ref**|렌더와 무관한 값(특히 DOM 노드)을 담는 박스|
|**useRef**|박스를 만드는 hook (사용자 입장)|
|**forwardRef**|함수 컴포넌트가 ref를 받을 수 있게 하는 wrapper (정의자 입장)|
|**callback ref**|`ref`에 함수를 주는 패턴. 배열 인덱스에 저장할 때 유용|
|**inputRef prop**|callback ref를 일반 prop으로 한 단계 내려보내는 패턴 (이름이 `ref`가 아니라 `inputRef`)|
|**focusedIndex**|"지금 보고 있는 칸"을 state로 추적해 검증 결과를 파생값으로|



### Step 1 — `InputField`에 `forwardRef` 적용
```tsx
import { ComponentProps, forwardRef } from 'react';
import styled from '@emotion/styled';

interface InputFieldProps extends ComponentProps<'input'> {
  isError: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ isError, ...props }, ref) => {
    return <Input ref={ref} $isError={isError} {...props} />;
  }
);

InputField.displayName = 'InputField';

export default InputField;

const Input = styled.input<{ $isError: boolean }>`
  width: clamp(72px, 100%, 100%);
  height: 32px;
  padding: 8px;
  border: 1px solid ${({ $isError }) => ($isError ? '#FF3D3D' : '#ACACAC')};
  border-radius: 2px;
  font-size: 11px;
  font-weight: 400;
  color: black;

  &:focus {
    outline: none;
    border-color: ${({ $isError }) => ($isError ? '#FF3D3D' : '#000')};
  }
`;
```
#### 학습 포인트 ✅

- 함수 컴포넌트는 기본적으로 `ref` prop을 못 받음 (props 객체 X) → React 경고
- `forwardRef<RefType, PropsType>(({ props }, ref) => ...)`로 두 번째 인자에 ref 받음
- `displayName`은 React DevTools에서 컴포넌트 이름 표시용 (forwardRef는 anonymous라 명시)
- 호출자: `<InputField ref={someRef} ... />` — 실제 `<input>` DOM이 ref에 들어감

### Step 2 — `FormField`에 `inputRef` callback prop

[FormField.tsx](vscode-webview://15mqrfes19fks2qihic2rjvah1lqavgs06frdkjlrm7bnisbs0u8/src/components/Common/Form/FormField.tsx) 변경:

```tsx
  interface FormFieldProps {
    // ...
    inputType?: 'text' | 'password';
+   inputRef?: (el: HTMLInputElement | null) => void;
    validator: (value: string, index: number) => ValidatorResult;
    // ...
  }

  export default function FormField({
    // ...
    inputType = 'text',
+   inputRef,
    validator,
    onChange,
    onFocus,
    onBlur,
  }: FormFieldProps) {
    // ... 기존 로직 ...
    return (
      <FormFieldContainer>
        <InputField
+         ref={inputRef}
          isError={isError}
          ...
```

#### 학습 포인트 ✅

- **callback ref 패턴** — `(el) => void` 형태. el은 mount 시 DOM 노드, unmount 시 null
- 부모가 `ref={(el) => { refs.current[i] = el; }}` 식으로 배열에 저장 가능
- `useRef`보다 callback ref가 **배열 인덱스에 저장**할 때 유연

### Step 3 — `InputFieldForm`에 자동 포커스 이동

[InputFieldForm.tsx](vscode-webview://15mqrfes19fks2qihic2rjvah1lqavgs06frdkjlrm7bnisbs0u8/src/components/Form/InputFieldForm.tsx) 변경:

```tsx
- import { useState } from 'react';
+ import { useRef, useState } from 'react';

  export default function InputFieldForm({
    id, label, placeholderArr, fieldMaxLengths, values, validator, onChange, inputType,
  }: InputFieldFormProps) {
    const [errorMessage, setErrorMessage] = useState<string>('');
+   const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const handleFieldChange = (
      value: string,
      index: number,
      validation: { error: boolean; errorMessage: string; block: boolean }
    ) => {
      setErrorMessage(validation.errorMessage);
      if (!validation.block) {
        onChange(value, index);
+
+       // 자동 포커스 — 한 칸 다 차면 다음 칸으로
+       const isFilled = value.length === fieldMaxLengths[index];
+       const hasNext = index < values.length - 1;
+       if (isFilled && hasNext) {
+         inputRefs.current[index + 1]?.focus();
+       }
      }
    };

    // ... 나머지 (handleFocus, handleBlur 그대로) ...

    return (
      <FormContainer>
        <Label htmlFor={id}>{label}</Label>
        <InputFieldWrapper>
          {values.map((numbers, index) => (
            <FormField
              key={`${label}-${index}`}
              // ... 기존 props ...
              inputType={inputType}
+             inputRef={(el) => { inputRefs.current[index] = el; }}
            />
          ))}
        </InputFieldWrapper>
        ...
```

#### 학습 포인트 ✅

- **왜 `useEffect` 안 쓰는가** — onChange 시점에 이미 DOM이 mount되어 있으므로 `ref.focus()` 즉시 호출 가능. useEffect는 "외부 시스템 동기화"용 — 여기는 사용자 인터랙션 직후 DOM 직접 조작이라 onChange가 정당
- **`isFilled = value.length === fieldMaxLengths[index]`** — 다 차야 다음으로. 마지막 칸은 `hasNext` false라 포커스 유지
- **`useRef<Array<...>>([])`** — `.current`에 배열을 들고 있고, 각 칸의 callback ref가 자기 인덱스에 DOM 노드를 저장
- **block 케이스에서 자동 포커스 X** — NaN 같은 거부된 입력은 `setState` 호출도 안 하고 포커스 이동도 안 함 (block 패턴 일관)