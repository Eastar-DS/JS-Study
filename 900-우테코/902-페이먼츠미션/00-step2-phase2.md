# phase1

```tsx
export interface CardBrandRule {
  brand: CardBrand;
  totalLength: number;
  segmentLengths: number[];
  cvcLength: 3 | 4;
  label: string;
}
```

## 결정 과정
1. 카드번호 타입 어떻게 가져갈지.
2. 카드 브랜드 룰 어떻게 검사할지. 정규식 vs predicate 배열
=> predicate 함수 배열

장점:
모든 brand가 한 가지 메커니즘(PrefixMatcher 함수)
복잡한 매칭(UnionPay 범위)은 자기 함수 안에 자연스럽게 캡슐화
detectCardBrand 본체가 단순 for 루프 한 줄 — prefix 길이별 분기 사라짐
새 brand 추가 시 한 줄(matcher) 추가만
mission.md의 brand 규칙(자연어)을 코드로 표현하기 쉬움 — 정규식보다 가독성 ⬆

단점:
함수라 직렬화 불가 (JSON으로 못 옮김 — 우리 케이스엔 무관)
validPrefixes 같은 "표시용 prefix 목록"을 따로 갖고 싶으면 두 source 관리 필요

3. 카드 브랜드에 따라 인풋필드 개수가 달라질때 어떻게 할건지. 
4 → 3 (예: VISA → AMEX): 0,3번째는 그대로 0,2번째로. 1,2번째는 합쳐서 1번째로
3 → 4 (예: AMEX → VISA): 0,2번째는 그대로 0,3번째로. 1번째는 maxLength까지 1번째에, 넘치면 2번째로





## 리뷰 요청
1. 카드번호와 유효기간의 상태타입에 Type를 붙이는것이 권장되지 않아서 이름을 수정
2. 기존 벨류를 다른 것으로 변환하는 함수의 파라미터에 Source, Target 네이밍 추천.
3. 

## 의문
### 1. as const에 대해 좀더 파봐야할거같음. => readonly 붙여야한다 정도는 감잡음.
### 2. `useRef`와 `useEffect`가 여기서 반드시 필요한가

**둘 다 필요합니다.** v2 원칙의 "useEffect 지양"은 **state 동기화에 한정**, DOM 이벤트 등록은 정당. 이유 자세히:

### useRef 역할

**렌더에 영향 주지 않는 값 저장 + DOM 요소 참조**. 여기서는 **DOM 요소 참조**:

```tsx
const containerRef = useRef<HTMLDivElement>(null);
// ...
<DropdownContainer ref={containerRef}>  ← React가 DOM 노드를 ref.current에 저장
```

→ `containerRef.current`가 dropdown wrapper DOM 노드를 가리킴. 외부 클릭 판정에 사용:

```tsx
if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
//      ↑ DOM 노드        ↑ 클릭된 요소가 그 안에 있는가?
```

### useRef 없이?

|대안|평가|
|---|---|
|좌표로 판정 (clientX/Y)|복잡. 스크롤·resize 시 깨짐|
|`e.stopPropagation()`을 dropdown 내부에|option 클릭이 안 닫힘. 버그|
|CSS만 (`:focus-within`)|키보드/마우스 동작 미묘하게 다름|

→ **`useRef + contains()`가 표준 패턴**. 필요합니다.
### useEffect 역할

**렌더 후 부수 효과(side effect) 실행**. 여기서는 **외부 시스템(document)에 이벤트 리스너 등록/해제**:

```tsx
useEffect(() => {
  if (!isOpen) return;

  const handleMouseDown = (e) => { ... };
  document.addEventListener('mousedown', handleMouseDown);   // ← document 전역에 등록

  return () => {
    document.removeEventListener('mousedown', handleMouseDown);  // ← 정리
  };
}, [isOpen]);
```

→ dropdown이 열리면 document에 리스너 등록, 닫히면 해제. **외부 시스템(document) ↔ React state(isOpen)의 동기화**.

### "useEffect 가능한 한 쓰지 말라"의 진짜 의미

mission.md / v2 원칙은 정확히:

> "useEffect를 통한 **상태 동기화**를 지양한다."

핵심: **React state 간의 동기화에 쓰지 말라**. "useEffect 자체 금지"가 아님.

|케이스|useEffect 사용|평가|
|---|---|---|
|`useEffect(() => setX(y * 2), [y])` (state 동기화)|❌ 금지|파생값으로 (`const x = y * 2`)|
|`useEffect(() => setShowCompany(isCardNumbersComplete(cardNumbers)), [cardNumbers])`|❌ 금지|파생값|
|API 호출|✅ 정당|외부 시스템|
|DOM 이벤트 등록 (지금 케이스)|✅ 정당|외부 시스템|
|브라우저 API 호출 (localStorage 등)|✅ 정당|외부 시스템|
|ref·timer 같은 cleanup이 필요한 자원|✅ 정당|외부 자원|

React 공식 문서도 같은 입장: **["You Might Not Need an Effect"](https://react.dev/learn/you-might-not-need-an-effect)** — 데이터 변환·이벤트 처리는 effect 불필요. **하지만 외부 시스템과의 동기화는 effect로**.

### 우리 케이스 점검

|항목|분류|판정|
|---|---|---|
|`document.addEventListener`|외부 시스템(브라우저 DOM)|✅ effect 정당|
|`document.removeEventListener` (cleanup)|외부 자원 정리|✅ effect 정당|
|`[isOpen]` 의존성|"isOpen 상태 변할 때마다 등록/해제" 필요|✅ effect 정당|

→ v2 원칙에 어긋나지 않습니다. **state 동기화가 아니라 DOM 동기화**.

### useEffect 없이 가능?

|안|평가|
|---|---|
|ref callback에서 등록|한 번 등록 후 cleanup 어려움|
|onMouseDown 핸들러를 root에|React 합성 이벤트 시스템 — outside click 감지 어려움|
|라이브러리 (`react-aria`, `useClickOutside` 등)|내부적으로 useEffect 사용. 추상화일 뿐|

→ **document 전역 이벤트 등록은 useEffect가 표준**. 필요.

# 질문
useEffect와 useRef를 이용해 만든 CardCompanyFieldForm 컴포넌트를 이해하고싶어. 일단 아래 질문에 답변해주고, 내가 무엇을 더 이해해야하는지도 제시해주면 좋겠어.
- SelectButton을 보면 button인데, 드롭다운을 원래 버튼(선택한 카드사를 보여주는 영역)과 ul(카드사 목록을 보여주는 영역)을 이용해서 만드는거야?
- mousedown, keydown 이벤트가 뭔지 간단하게 알려줘. 그리고 내가 써본 onChange나 onFocus같은 이벤트는 e.target.value를 썻었는데 mousedown과 keydown 이벤트에서는 보통 어떤 프로퍼티들을 사용해?
- e.target as Node라는 코드가 있는데 이 Node 타입도 뭔지 알려줘.
- document에 이벤트리스너를 등록하는데 이러면 그냥 웹사이트 전역에 이벤트리스너를 등록하는건가?
- Input태그가 없는데 버튼에 id를 라벨과 같게 설정하면 라벨을 클릭하면 버튼이 클릭되도록 설정되는건가?
- aria-haspopup, aria-expanded가 뭔지 알려주고, 실무에서도 쓰는건지 알려주고, 반드시 써야하는건지도 알려줘.

- DropdownContainer에 position: relative;는 어떤 역할이야? 원래 안적으면 포지션이 뭔데 왜이렇게 바꾼거야?
- border: 1.015px 이렇게 픽셀값이 1단위가 아니여도 상관없는거야? 픽셀은 모니터에서 표시하는 최소단위라고 생각했는데...
- &:focus { outline: none; 이렇게 되어있는데, outline이 뭐길래 포커스되면 없애는거야?
- Caret 뜻이 뭐야?(발음도) 방향표시하는 글자가 상태에따라 180도 회전하도록 구현되어있는데, 그냥 문자 두개써서 isOpen ? 아래 : 위; 이런식으로 안한 이유도 궁금해. 단순히 돌아가는 애니메이션을 구현하기 위함인지 아니면 내가말한 코드보다 브라우저 랜더링에 부담을 덜주는건지 등.
- ul의 role 속성은 뭐가있고 각각 어떨때 사용하는거야?
- Option은 버튼이던데, ul 아래에 li뿐만 아니라 button도 나열할 수 있는거야? ul아래에 나열할 수 있는 종류는 이 두가지뿐인가?
- 버튼의 아래 두 속성에 대해 알려줘.
role="option"
aria-selected={value === key}

- `const containerRef = useRef<HTMLDivElement>(null);` 이렇게 useRef를 이용한다고 선언해두고, `<DropdownContainer ref={containerRef}>` ref로 이렇게 등록해두면 자동으로 이 div를 ref로 기억해둔다는건가?
- useEffect 코드가 잘 이해가 안가는데, useEffect안에서 document에 이벤트리스너를 등록했다가 바로 이벤트리스너를 해제하는거야? return문 이후는 바로 동작하는게 아니라 발동 조건이 따로 있는건가? 위에서 질문한거 답변 보니까 unmount 되었을때 return문을 발동하는건가 싶은데, 마운트랑 언마운트가 어떤 개념인지도 이해해야할거같아. 컴포넌트가 사라지는걸 말하는건가..?

### 컴포넌트 생애 주기
- **Mount**: 컴포넌트가 DOM에 처음 추가됨 (첫 렌더)
- **Update**: prop·state 변화로 다시 렌더 (mount 후 여러 번)
- **Unmount**: 컴포넌트가 DOM에서 제거됨

