# DevTools로 렌더링 관찰하기

## 한 문장으로

Chrome DevTools의 Performance 패널을 사용하면 JavaScript, Layout, Paint 같은 작업이 언제 얼마나 일어났는지 관찰할 수 있습니다.

## 왜 관찰이 필요할까?

렌더링 성능은 느낌만으로 판단하기 어렵습니다.

어떤 코드는 느려 보이지만 실제 병목이 아닐 수 있고, 어떤 코드는 작아 보여도 자주 실행되어 큰 비용을 만들 수 있습니다.

그래서 브라우저가 제공하는 도구로 실제 실행을 관찰해야 합니다.

## Performance 패널 기본 흐름

Chrome 기준으로 아래 순서로 확인할 수 있습니다.

```text
1. 개발자 도구를 연다.
2. Performance 탭으로 이동한다.
3. Record 버튼을 누른다.
4. 페이지에서 스크롤, 클릭, 애니메이션 같은 동작을 한다.
5. Stop을 누른다.
6. Main, Timings, Frames, Summary 영역을 살펴본다.
```

## 무엇을 보면 좋을까?

처음에는 모든 정보를 이해하려고 하지 않아도 됩니다.

아래 단어를 찾는 것부터 시작합니다.

```text
Scripting: JavaScript 실행
Rendering: 스타일 계산, Layout 등
Painting: Paint 작업
Composite Layers: 레이어 합성
```

만약 클릭 한 번에 Layout이 많이 반복된다면, DOM 변경이나 레이아웃 읽기 코드가 문제일 수 있습니다.

만약 Paint 시간이 길다면, 그림자, 필터, 큰 이미지, 복잡한 시각 효과가 원인일 수 있습니다.

## 작은 실험

아래 HTML 파일을 임시로 만들어 브라우저에서 열어볼 수 있습니다.

```html
<!doctype html>
<html>
  <head>
    <style>
      .box {
        width: 100px;
        height: 100px;
        background: royalblue;
        margin: 20px;
        transition: 0.3s;
      }

      .move-left {
        margin-left: 200px;
      }

      .move-transform {
        transform: translateX(200px);
      }
    </style>
  </head>
  <body>
    <button id="left">margin으로 이동</button>
    <button id="transform">transform으로 이동</button>
    <div class="box"></div>

    <script>
      const box = document.querySelector(".box");

      document.querySelector("#left").addEventListener("click", () => {
        box.className = "box move-left";
      });

      document.querySelector("#transform").addEventListener("click", () => {
        box.className = "box move-transform";
      });
    </script>
  </body>
</html>
```

관찰할 점:

```text
margin-left 변경은 Layout과 관련된 작업을 만들 가능성이 크다.
transform 변경은 Composite 쪽에서 처리될 가능성이 크다.
실제 결과는 DevTools Performance에서 확인한다.
```

## 주의할 점

DevTools 결과는 환경에 따라 달라질 수 있습니다.

브라우저 버전, 컴퓨터 성능, 페이지 복잡도, 동시에 실행 중인 프로그램에 따라 기록이 달라집니다.

따라서 중요한 것은 숫자 하나를 외우는 것이 아니라, 어떤 변경이 어떤 렌더링 단계를 건드리는지 추론하고 확인하는 습관입니다.

## 스스로 답해보기

1. 렌더링 성능을 느낌만으로 판단하면 왜 위험할까요?
2. Performance 패널에서 Scripting, Rendering, Painting은 각각 무엇을 뜻하나요?
3. `margin-left`와 `transform` 이동을 비교하면 어떤 차이를 관찰할 수 있을까요?

