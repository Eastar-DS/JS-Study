# step3.5

### 정리
#### box-sizing
Box Model은 브라우저가 HTML 요소를 화면에 배치할 때 각 요소를 사각형 박스로 보고, 그 박스를 content, padding, border, margin으로 나누어 계산하는 모델

```css
* {
  box-sizing: border-box;
}
```

#### Normal Flow
별도의 위치 지정이나 레이아웃 도구를 쓰지 않았을 때, 브라우저가 요소를 기본 규칙에 따라 배치하는 흐름

`div`, `p`, `h1`, `section` 같은 요소는 기본적으로 block 성격을 가집니다.
`span`, `a`, `strong` 같은 요소는 기본적으로 inline 성격을 가집니다.

#### CSS 값은 단계적으로 결정된다
```text
specified value: CSS에 명시된 값 (ex: 50%)
computed value: 상속, 우선순위, 기본값 등을 고려해 계산된 값
used value: Layout에서 실제로 사용되는 값 (ex: 400px)
```


### 질문
1. Computed Style은 무엇인가요?
=> CSSOM과 레이아웃사이를 이어주는 css value들

2. `width: 50%`가 Layout에서 실제 px 값으로 바뀌어야 하는 이유는 무엇인가요?
=> 실제 픽셀값을 넣어주어야하는데, 부모너비의 50%니까 부모너비의 50%를 계산해서 넣어줘야함. 

3. DevTools의 `Styles`와 `Computed`는 어떻게 다르게 볼 수 있나요?
=> styles는 cssom, computed는 계산된 used value

Q1. specified value / computed value / used value 세 단계가 왜 필요한가요?
    (CSS에 적힌 값 그대로 쓰면 안 되는 이유는?)
=> 위의 예시처럼 50%가 specified value라면 해당 값을 px로 변환시켜주어야함.

Q2. <div style="width: 50%">이 div의 specified value와 used value는 각각 무엇인가요?
    (specified는 CSS 그대로, used는 실제 px 값. 부모 너비를 가정해서 답해도 됨)
=> 50%, 400px (부모 800px)

Q3. 이번 챕터에서 본 내용이 이스타가 던진 자가 질문
    "왜 레이아웃이 자원을 많이 소모하는가"의 일부 답이 됩니다.
    어느 부분이 답의 단서인지 한 줄 적어보세요.
=> 잘 모르겠음 ㅠㅠ 레이아웃에 넣을 px를 계산하는 과정이 오래걸리나?

내 질문 : 
1. specified value, computed value, used value를 차례대로 볼 수 있는 구체적인 예시가 있어?
2. Computed-Style은 CSSOM에서 랜더트리를 만들때 사용하는거야? 아니면 랜더트리가 만들어지고 레이아웃과정을 시작하는 사이에 사용되는거야?
3. width: 50%로 적어두면 부모너비에 따라 계속해서 레이아웃이 달라질텐데, 그럼 사용자가 브라우저의 크기를 조절할때마다 다시 레이아웃을 계산하는 과정이 반복되는건가?

# 보완 노트

