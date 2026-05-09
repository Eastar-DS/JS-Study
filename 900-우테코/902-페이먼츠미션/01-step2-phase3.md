# 결정 과정
## 유효성검사에 클로저를 사용한 이유 
=> 페이먼트폼이 알아야할 파라미터와 전달해주는 인풋필드가 알아야 하는 파라미터가 다르다. 특히 인풋필드폼에서 사용하는 벨리데이터의 파라미터는 value, index로 고정하기위해.

## 블록 사용한 이유
사용자가 문자 입력했을때 상태업데이트는 안하는데 에러메세지는 바꾸고싶어서.

## 유효성검사가 있는데, is~Complete에서 다시한번 검사하는것처럼 보이는 이유

validator는 **"방금 친 키 한 번"**의 잘잘못만 봅니다. complete은 **"전체 상태"**의 완료 여부를 봐요. 두 가지 시나리오로 보면 분명:

#### 시나리오 A — 시점이 다름 (한 칸 비워두기)

1. 사용자가 월 `12` 입력 → validator 통과 (`error: false`)
2. 사용자가 월 `1`로 다시 바꿈 → validator 통과 (1자리, 길이 미달은 길이 초과 아니라 OK)
3. 사용자가 연도는 안 채움
4. 결과: `{ month: '1', year: '' }` — **validator는 매번 통과했지만 `isExpirationDateComplete`은 false**

→ validator는 "이번 키 입력"만 봐서, 다른 칸이 비어 있다는 사실을 모름.

#### 시나리오 B — 외부 의존이 바뀜 (Phase 5에서 자주 발생)

1. 사용자 카드번호 VISA 입력 → cvc validator의 `cvcLength = 3`
2. 사용자가 cvc `123` 입력 → validator 통과, `isCvcComplete(VISA, '123')` true
3. 사용자가 카드번호를 AMEX(15자리)로 바꿈 → cvc는 그대로 `'123'`
4. 결과: cvc validator는 과거에 통과했지만 **`isCvcComplete(AMEX, '123')` false** (AMEX는 4자리 필요)

→ validator 통과 시점의 brand와 현재 brand가 다를 수 있음. complete은 **현재 시점**의 전체 상태로 판단.

##  `cardNumbersValidator`
### 왜 비어 있나

|검증 항목|어디서 처리되나|
|---|---|
|숫자 외 입력 (NaN)|FormField가 자동 차단 ([FormField.tsx:36](vscode-webview://15mqrfes19fks2qihic2rjvah1lqavgs06frdkjlrm7bnisbs0u8/src/components/Common/Form/FormField.tsx#L36)) — 모든 InputFieldForm 공통|
|칸별 길이 초과|input의 `maxLength={fieldMaxLengths[index]}` (HTML 자체 차단)|
|카드 brand prefix 유효성|`detectCardBrand`가 자동 감지 — 일치 안 하면 `'NONE'`, Preview 로고만 비표시|
|전체 카드번호 완성 여부|`isCardNumbersComplete` (formStatus.ts) — 점진 노출 조건|

→ **칸 단위로 "잘못된 입력"이라고 판단할 게 없음**. 미선택 brand 같은 상태도 "에러"가 아니라 "아직 미완성"이라 검증 책임 X.

## 