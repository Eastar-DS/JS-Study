# JavaScript가 렌더링에 끼어드는 방식

## 한 문장으로

JavaScript는 DOM과 스타일을 읽고 바꿀 수 있기 때문에 브라우저 렌더링 과정에 직접 영향을 줍니다.

## 왜 이걸 알아야 할까?

웹 페이지는 처음 로드된 뒤 가만히 있지 않습니다.

사용자가 버튼을 누르면 내용이 추가되고, 메뉴가 열리고, 모달이 나타나고, 입력값에 따라 화면이 바뀝니다.

이런 변화의 상당수는 JavaScript가 DOM이나 스타일을 바꾸면서 일어납니다.

## DOM을 바꾸는 예시

```html
<ul id="list">
  <li>기존 항목</li>
</ul>
```

```js
const list = document.querySelector("#list");
const item = document.createElement("li");
item.textContent = "새 항목";
list.appendChild(item);
```

JavaScript 실행 후 DOM에는 `li`가 하나 더 생깁니다.

브라우저는 새 항목을 화면에 보여주기 위해 렌더링 정보를 다시 계산해야 합니다.

```text
DOM 변경
-> Render Tree 업데이트
-> Layout 필요 여부 확인
-> Paint 필요 여부 확인
-> Composite
```

## 스타일을 바꾸는 예시

```html
<div class="box">박스</div>
```

```js
const box = document.querySelector(".box");
box.style.width = "300px";
```

`width`가 바뀌면 요소의 크기가 바뀝니다.

크기가 바뀌면 주변 요소의 위치에도 영향을 줄 수 있습니다.

그래서 Layout부터 다시 필요할 가능성이 큽니다.

```js
box.style.backgroundColor = "red";
```

반면 배경색만 바뀌면 크기와 위치는 그대로입니다.

이 경우 Layout은 다시 하지 않고 Paint부터 다시 할 수 있습니다.

## 읽기와 쓰기를 섞으면 문제가 될 수 있다

JavaScript는 스타일을 바꿀 수도 있고, 레이아웃 정보를 읽을 수도 있습니다.

```js
box.style.width = "300px";
console.log(box.offsetWidth);
```

`offsetWidth`는 실제 레이아웃 결과를 알아야 반환할 수 있습니다.

그런데 바로 직전에 width를 바꿨다면 브라우저는 최신 값을 알려주기 위해 Layout을 즉시 계산해야 할 수 있습니다.

이런 상황을 강제 동기 레이아웃이라고 부릅니다.

처음에는 용어보다 흐름을 이해하면 됩니다.

```text
스타일을 바꿨다.
그 직후 레이아웃 값을 물어봤다.
브라우저는 미뤄둘 수 없어서 지금 바로 계산한다.
```

## 스스로 답해보기

1. JavaScript가 DOM에 요소를 추가하면 렌더링 과정에 어떤 영향이 생길까요?
2. `width` 변경과 `background-color` 변경은 왜 비용이 다를 수 있을까요?
3. 스타일을 바꾼 직후 `offsetWidth`를 읽으면 브라우저는 왜 곤란해질 수 있나요?

