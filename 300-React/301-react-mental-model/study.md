미션 (Output First):

답을 보지 말고, 이스타의 언어로 먼저 답해봐요. 두 문장이면 충분해요.

다음 코드에서 setCount(1)을 호출했어요. 이미 count === 1인 상태였다면, 화면(DOM)이 다시 그려질까요? 그리고 Counter 함수는 다시 호출될까요? 각각 Yes/No로 답하고, 한 줄 이유를 적어보세요.


function Counter() {
  const [count, setCount] = useState(1);
  console.log('Counter called');
  return <div>{count}</div>;
}

=> DOM은 다시 안그려짐. 카운터 함수는 호출됨. setCount로 상태를 변경했지만 상태가 이전상태와 똑같기때문에 DOM트리를 변경할필요가 없지만 함수는 호출.

점검 질문 (스스로): "함수가 호출되는 일"과 "DOM이 바뀌는 일"을 같은 사건으로 보고 있진 않은가?

=> 위 질문에 답하면서 다른 사건이라고 인식함.