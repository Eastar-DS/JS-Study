## 1️⃣ `isExpirationDateInFuture` — 조합 검증의 핵심

```ts
export const isExpirationDateInFuture = ({ month, year }: ExpirationDate): boolean => {
  if (month.length !== VALIDATION_RULE.EXPIRATION_DATE_LENGTH) return false;  // ①
  if (year.length !== VALIDATION_RULE.EXPIRATION_DATE_LENGTH) return false;   // ①
  const currentYY = new Date().getFullYear() % 100;                            // ②
  const currentMM = new Date().getMonth() + 1;                                 // ③
  const inputYY = Number(year);
  const inputMM = Number(month);
  if (Number.isNaN(inputYY) || Number.isNaN(inputMM)) return false;           // ④
  if (inputYY > currentYY) return true;                                        // ⑤
  if (inputYY === currentYY && inputMM >= currentMM) return true;             // ⑥
  return false;
};
```

### 핵심 짚어볼 곳

**① 길이 가드** — 이 함수는 "두 칸 모두 2자리일 때만 의미 있음". `'4', '26'`(월 한 자리)을 받으면 `Number('4') = 4`로는 정상이지만 사용자가 입력 _중_ 일 수 있어 검증 보류 → `false`. **불완전한 입력에 대해서는 일단 false** (검증 통과 안 시킴).

**② `getFullYear() % 100`** — 2026 → 26. 입력은 두 자리(`'26'`)니까 같은 두 자리 단위로 비교. 21세기 한정 가정.

**③ `getMonth() + 1`** — JS의 `getMonth()`는 **0-based** (1월=0, 12월=11). 흔히 실수하는 부분. `+1` 안 하면 1월에 12월처럼 보임.

**④ NaN 가드** — `Number('XX')` 같은 비정상 입력 방어. validator 단계에서 이미 NaN 걸러내지만, 이 함수가 다른 호출자(예: `formStatus.ts의 isExpirationDateComplete`)에서도 쓰이므로 **방어적**으로.

**⑤⑥ 비교 두 단계**:

- 연도 비교가 우선 — 다른 연도면 월은 볼 필요 없음
- 같은 연도일 때만 월 비교
- `>=`(이상) — 동월(예: 26-05에 `05/26` 입력) 통과. **정책 결정**: 이 달 안에 결제하면 만료 전이라 OK. 더 엄격하게 하려면 `> currentMM`로 변경 가능

### 이 함수의 책임 한 줄

> "주어진 month/year가 **현재 연-월 이상**인가" — 한 가지만. 길이/숫자/포맷 검증은 자기 책임 X (호출자가 보장 + 안전망 가드만).

---

## 2️⃣ `makeExpirationDateValidator` — 단일 칸 + 조합을 한 closure에서 조립

```ts
export const makeExpirationDateValidator =
  (currentDate: ExpirationDate) =>                                        // ① 외부 의존을 closure로 캡처
  (value: string, index: number): ValidatorResult => {
    if (validateNaN(value)) {                                             // ② 가드
      return { error: true, errorMessage: ERROR_MESSAGE.NAN };
    }
    if (value.length > VALIDATION_RULE.EXPIRATION_DATE_LENGTH) {          // ③ 가드
      return {
        error: true,
        errorMessage: ERROR_MESSAGE.MAX_LENGTH(VALIDATION_RULE.EXPIRATION_DATE_LENGTH),
      };
    }

    if (index === 0 && value.length === VALIDATION_RULE.EXPIRATION_DATE_LENGTH) {  // ④ 단일 칸: 월
      const m = Number(value);
      if (m < 1 || m > VALIDATION_RULE.MAX_MONTH) {
        return { error: true, errorMessage: ERROR_MESSAGE.INVALID_MONTH };
      }
    }

    const next: ExpirationDate =                                          // ⑤ 가상 다음 상태
      index === 0 ? { ...currentDate, month: value } : { ...currentDate, year: value };
    if (
      next.month.length === VALIDATION_RULE.EXPIRATION_DATE_LENGTH &&     // ⑥ 두 칸 다 차야
      next.year.length === VALIDATION_RULE.EXPIRATION_DATE_LENGTH
    ) {
      if (!isExpirationDateInFuture(next)) {                              // ⑦ 조합 검증
        return { error: true, errorMessage: ERROR_MESSAGE.INVALID_EXPIRATION_DATE };
      }
    }

    return { error: false, errorMessage: '' };
  };
```

### 핵심 짚어볼 곳

**① `make`-prefix curry 형태** — validator 시그니처는 `(value, index) => Result`로 통일돼 있음(`InputFieldForm`이 그렇게 호출). 그런데 조합 검증에는 **다른 칸의 현재 값**(`currentDate`)이 필요. 이 외부 의존을 **closure로 캡처**해서 시그니처는 그대로 유지. 호출부:

```tsx
validator={makeExpirationDateValidator(expirationDate)}  // 매 렌더 새 함수 — 한 칸 단위라 무시 가능
```

**② NaN 먼저** — 가장 가벼운 검증부터. 빈 문자열은 `Number('') = 0` → NaN 아님 → 통과 (사용자가 지우는 중일 수 있음).

**③ 길이 초과** — 5자리 이상 입력 차단. (입력 칸 maxLength도 있지만 validator도 안전망)

**④ 단일 칸 검증 — 월(index 0)이 두 자리 다 찼을 때만**:

- `13`, `00` 같은 잘못된 월 차단
- "두 자리 다 찼을 때만" 검증 — 사용자가 `1` 입력 중일 때 "1은 잘못된 월"이라고 즉시 에러 띄우면 짜증남
- index 1(연)은 1~~12 같은 범위 검증 X — 26~~99 같은 범위는 사실상 의미 없음(year 범위는 future 검증으로 흡수)

**⑤ 가상 다음 상태 만들기** — 핵심 트릭:

- 사용자가 방금 입력한 `value`는 아직 `setExpirationDate` 전 → state(`currentDate`)에는 반영 안 됨
- 그래서 "이번 입력이 반영된 가상 객체" `next`를 만들어서 검증
- `index === 0` → 월 입력 → `next = { month: value, year: currentDate.year }`
- `index === 1` → 연 입력 → `next = { month: currentDate.month, year: value }`

**⑥ 두 칸 다 차야 조합 검증** — `isExpirationDateInFuture`의 길이 가드와 같은 의도. 사용자 입력 중에는 검증 안 함.

**⑦ `!isExpirationDateInFuture(next)`** — false면 과거 → 에러. 통합 검증 결과는 `INVALID_EXPIRATION_DATE` 메시지로.
### 검증 우선순위 (위에서 아래)

```
NaN → 길이초과 → 월 범위(단일 칸) → 조합 future
```

가장 가벼운 가드부터 → 통과해야 다음 검증으로 → **early return 패턴**.


## 3️⃣ `makeCvcValidator` — brand 의존을 closure로

```ts
export const makeCvcValidator =
  (cardBrand: CardBrandOrNone) =>                                          // ① brand 캡처
  (value: string): ValidatorResult => {
    if (validateNaN(value)) {
      return { error: true, errorMessage: ERROR_MESSAGE.NAN };
    }
    const cvcLength = getCvcLength(cardBrand);                             // ② brand별 길이
    if (value.length > cvcLength) {                                        // ③ brand에 따라 다른 maxLength
      return { error: true, errorMessage: ERROR_MESSAGE.MAX_LENGTH(cvcLength) };
    }
    return { error: false, errorMessage: '' };
  };
```

### 핵심 짚어볼 곳

**① `cardBrand` closure 캡처** — `makeExpirationDateValidator`와 같은 패턴. 외부 의존(`cardBrand`)을 캡처해서 validator 시그니처는 표준 `(value) => Result` 유지.

**② `getCvcLength(cardBrand)`** — 룰 테이블 기반. AMEX → 4, 그 외 → 3. **분기 없음** → 새 brand 추가 시 룰 테이블만 수정. validator 코드는 무변경.

**③ `value.length > cvcLength`** — 길이 초과만 검증. "정확히 length와 같음"은 **`isCvcComplete`(formStatus.ts)의 책임** — 입력 도중에 `value.length < 3`이라고 에러 띄우면 사용자 짜증.

> **validator vs formStatus 책임 분리**:
> 
> - **validator**: "사용자가 입력 중인 값이 **잘못된** 값인가?" — early reject
> - **formStatus**: "사용자가 입력을 **완료**했나?" — completion check
> - 둘 다 길이를 보지만 의미가 다름


## 분리된 형태

```ts
// src/utils/validate.ts

import { ERROR_MESSAGE, VALIDATION_RULE } from '../constants';
import { getCvcLength } from './cardBrand';
import type { CardBrandOrNone, ExpirationDate, ValidatorResult } from '../types';

// ─── 빌딩 블록 ─────────────────────────────────────────────

/**
 * 단일 칸(월 또는 연) 자체의 형식·값 범위 검증.
 * 다른 칸 값에 의존하지 않음 — 그래서 currentDate 안 받음.
 */
const validateExpirationField = (value: string, index: number): ValidatorResult => {
  if (validateNaN(value)) {
    return { error: true, errorMessage: ERROR_MESSAGE.NAN };
  }
  if (value.length > VALIDATION_RULE.EXPIRATION_DATE_LENGTH) {
    return {
      error: true,
      errorMessage: ERROR_MESSAGE.MAX_LENGTH(VALIDATION_RULE.EXPIRATION_DATE_LENGTH),
    };
  }
  // 월(index 0)이 두 자리 다 차면 1~12 범위 검증
  if (index === 0 && value.length === VALIDATION_RULE.EXPIRATION_DATE_LENGTH) {
    const m = Number(value);
    if (m < 1 || m > VALIDATION_RULE.MAX_MONTH) {
      return { error: true, errorMessage: ERROR_MESSAGE.INVALID_MONTH };
    }
  }
  return { error: false, errorMessage: '' };
};

/**
 * 두 칸 조합(월+연)이 현재 이후인지.
 * 이미 분리되어 있던 함수 — formStatus.ts의 isExpirationDateComplete에서도 호출.
 */
export const isExpirationDateInFuture = ({ month, year }: ExpirationDate): boolean => {
  if (month.length !== VALIDATION_RULE.EXPIRATION_DATE_LENGTH) return false;
  if (year.length !== VALIDATION_RULE.EXPIRATION_DATE_LENGTH) return false;
  const currentYY = new Date().getFullYear() % 100;
  const currentMM = new Date().getMonth() + 1;
  const inputYY = Number(year);
  const inputMM = Number(month);
  if (Number.isNaN(inputYY) || Number.isNaN(inputMM)) return false;
  if (inputYY > currentYY) return true;
  if (inputYY === currentYY && inputMM >= currentMM) return true;
  return false;
};

// ─── 조립자 ────────────────────────────────────────────────

/**
 * 단일 칸 검증과 조합 검증을 차례로 호출.
 * make-prefix curry로 currentDate 캡처는 그대로 유지 — 호출부 시그니처 변화 X.
 */
export const makeExpirationDateValidator =
  (currentDate: ExpirationDate) =>
  (value: string, index: number): ValidatorResult => {
    // 1) 단일 칸 검증 — 실패하면 즉시 반환
    const fieldResult = validateExpirationField(value, index);
    if (fieldResult.error) return fieldResult;

    // 2) 조합 검증 — 두 칸 다 차야 의미 있음
    const next: ExpirationDate =
      index === 0 ? { ...currentDate, month: value } : { ...currentDate, year: value };
    const bothFilled =
      next.month.length === VALIDATION_RULE.EXPIRATION_DATE_LENGTH &&
      next.year.length === VALIDATION_RULE.EXPIRATION_DATE_LENGTH;
    if (bothFilled && !isExpirationDateInFuture(next)) {
      return { error: true, errorMessage: ERROR_MESSAGE.INVALID_EXPIRATION_DATE };
    }

    return { error: false, errorMessage: '' };
  };
```


## 질문
- 통합
1. 페이먼트폼에서 유효성검사를하면 클로저를 사용하지않고 인덱스도없이 검사할 수 있는데 이렇게 작성하는 이유가 있는지 궁금해.
2. 페이먼트폼에서하면 사용자인풋이동시에 두개가 달라질 수 없는데 같은 유효성검사(불필요한)를 반복하게돼서 그런가?
3. 아니면 함수도 자원이라 리랜더링될때 최소화하기위해 자식컴포넌트에넣는게 좋은건가?

4. 클로저는 외부함수에 선언된 변수뿐만아니라 파라미터도 기억하고있는거구나?
5. 지금은 인풋필드폼에서 map을 이용해 필드폼마다 유효성검사를 넣어주는건가?

- 분리
1. 월, 년, 월+년 검증이 따로따로 있는데 결국 조립자를 통해 조립하는 이유가 따로 있나? 이건 위의 통합 질문과 겹치는거같기도하고.

## 답변
### 진짜 이유 — 4가지

**(1) 에러 표시 위치 = input 옆** 검증 결과(`errorMessage`)는 그 input 옆에 떠야 자연스러움. PaymentForm에서 검증하면:

- 검증 결과를 어딘가의 state에 넣고
- 그 state를 InputFieldForm에 prop으로 내려보내고
- InputFieldForm이 그걸 받아서 표시

→ 결국 표시 책임은 InputFieldForm이 가져갈 수밖에 없음. 그러면 검증도 같이 InputFieldForm 가까이 두는 게 응집.

**(2) `block` 패턴 — setState 자체를 차단** [InputFieldForm.tsx:35](vscode-webview://15mqrfes19fks2qihic2rjvah1lqavgs06frdkjlrm7bnisbs0u8/src/components/Form/InputFieldForm.tsx#L35) `if (!validation.block) onChange(...)`. NaN 같은 값은 PaymentForm에 **도달조차 안 시킴**. PaymentForm에서 검증한다면 이미 setState된 후 되돌려야 함 — 깜빡임 + 복잡.

**(3) `InputFieldForm`을 generic 입력 컴포넌트로 유지** InputFieldForm은 카드번호·유효기간·CVC·비밀번호에 모두 재사용. PaymentForm이 검증을 안고 있으면 input 종류별 분기가 PaymentForm에 모임 → InputFieldForm이 dumb해지는 대신 PaymentForm이 비대해짐. 검증을 prop(`validator`)으로 주입받는 현재 형태가 **각자의 책임이 깔끔**.

**(4) PaymentForm은 도메인 로직(state·파생값)에 집중** PaymentForm onChange는 valid한 값만 받으므로 `setCardNumbers(adjusted)` 같은 도메인 변환에 집중. 입력 layer 잡음 없음.

### 그래서 closure가 필요한 이유 (별개 질문)

- InputFieldForm은 `(value, index) => Result` 시그니처만 앎 (generic)
- 외부 의존(`currentDate`, `cardBrand`)은 PaymentForm만 앎
- PaymentForm이 closure로 캡처해서 표준 시그니처 함수를 만든 후 prop으로 내려보냄
- 만약 외부 의존을 prop으로 따로 내려보내면 → InputFieldForm이 "currentDate가 뭔지" 알아야 함 → generic 깨짐

closure는 **컴포넌트 경계를 넘어가는 의존을 봉인하는 수단**.




## 질문


## 답변

1. 010-Inbox, 020-Index, 100-Daily, 200-Projects, 300~600 학습, 700~800 예비, 900-Personal. 이렇게 하고싶어.
2. 근데 inbox에 raw파일 만들때 내가 알아서 파일 이름 앞에 연 월 일등을 붙여서 만들어줘야해? 맘대로 막 넣으면 안되고? 규칙을 정하고 그에 맞게 작성해야 하는건가 싶어서.
3. 근데 시간이 오래걸려도 좋으니 아래 내용들을 다시한번 확인해줘. 고민들이 좀있어.
4. 일단 나의 학습과정을 다시한번 살펴보고 고려해야할 부분이 있는지 생각해줘. 대부분은 AI와 대화하는데 쓰일거야. 그 내용을 살펴보면 다음과 같아.
- 학습을 위한(예를들면 브라우저 렌더링) 가이드 문서를 생성(현재 100~400번대 폴더안에 작성된 파일들처럼.)
- 작성된 가이드 문서를 따라가면서 AI(혹은 사람들)와 질의응답한 내용
- 학습을 완료하고 정리한 내용(내용 예시를 들면 브라우저 렌더링은 공부해보니 이런 것이다)

1. **Inbox에는 무조건 `YYYY-MM-DD-` prefix** 작성하는걸로 할게. 근데 여기서 궁금한게 있는데, inbox폴더에는 정말 많은 파일들이 들어갈거잖아. 그럼 데일리노트처럼 연, 월, 일 폴더를 만들어서 안에 넣어놓는게 좋은건 아니야? 그냥 한폴더안에 파일이 수천개가 쌓여도 그냥 넣어두는게 좋아? 아니면 어쨋건 인박스에 있는건 정리 후 모두 다른폴더로 옮길거야? raw데이터를 그대로 남겨둘 공간도 있어야하는건 아닌가? raw데이터도 그때그때 각 폴더의 raw폴더에 넣어두겠다는건가? 그렇게되면 ai에게 질문했을때 raw데이터를 찾는게 너무 어렵진 않나?
2. Inbox에 내가 넣어줄 파일을 바탕으로 
---
1. 데일리노트 자동생성을 이용하면 raw파일 작성할 때 오늘 언젠지 고민하지 않고 작성할 수 있는거 아니야? 그냥 데일리노트 폴더에 로우파일도 관리하도록 하는건 안좋다고생각해? 그럼 데일리폴더를 맨위로 올리면 돼서 편의성도 좋아지는거같은데.
2. Index 카테고리를 020으로 두면 000번대에 둘 폴더들이 거의 없어서 하나의 큰 카테고리를 낭비하게 되는건 아닌가라는 걱정이드는데 아닌가?
3. 내 대부분이 주제기반 검색을 요구한다면 시간기반 검색보다 주제기반 검색에 특화된 폴더구조를 잡아야하는건 아닌가?
---
1. 현재 폴더에서는 옵시디언 포맷터 사용을 안하고있잖아. 근데 포맷터를 사용하면 AI를 이용해서 검색한다거나 했을때 토큰이 적게소모된다거나 더 용이하게 찾을 수 있거나 하는 장점이 있어? 만약 포맷터를 사용하는게 장점이 분명하게 있다면 필요한 파일들에는 작성하는게 좋을 것 같다는 생각도 들어서.
2. 이 문서를 작성한 이후에는 클로드 스킬들을 좀 만들어야 할 것 같아.(이건 자주쓰는 AI 쿼리랑 연결되겠다.) 일단 간략하게 어떤 스킬을 만들고싶은지 아래에 나열할게. 필요한 스킬들은 더 있을 수 있을 것 같아. 이 스킬들을 만드는 과정은 마이그레이션이 끝난 이후에 새로운 플랜모드에서 시작할게.
   - 질의응답한 내용을 raw 파일 형식에 맞게 작성해주는 스킬(이 스킬은 데일리노트 자동생성이 어디까지 지원해주는지에 따라 필요없을 것 같음)
   - raw파일내용이나 학습관련 내용을 확인하고 필요한 내용이 있다면 다른 폴더로 해당 내용을 옮겨주거나, 관련이 있는 파일들을 찾아 백링크를 연결할 준비를 하고, 데일리노트를 만들어주는 스킬(필요하다면 나눠서)
   - AI에게 질문했을때 진입점을 담당할 곳이 있을텐데 내가 raw파일들을 쌓고, 데일리노트나 학습내용관련 파일들이 들어올때 자동으로 index를 수정해주는 스킬
3. 데일리 노트 템플릿을 지금 생각해두는게 좋을까? 한줄요약이나 오늘 만든 것은 반드시 필요할거 같은데, 미정리 raw나 내일 할 것 등을 작성해두는게 과연 좋을까 라는 생각이 들기도하고... 가장 좋은 데일리 노트 템플릿을 지금 생각해봐야하는건 아닌가 싶네.
4. 현재 사용해야하는 플러그인이 좀 있는거같은데, 데일리노트나 캘린더, 템플레이터 등. 이거 사용법들 플랜모드 끝나면 알려줄 준비도 해야할듯. 데일리노트를 이용해서 자동으로 raw파일 작성하는법이나, 템플레이터는 왜 쓰는건지 등.
---
