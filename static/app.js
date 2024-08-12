// 메모 내용을 편집하는 함수
async function editMemo(event) {
  // console.log(event.target.dataset.id); // 이벤트가 실제로 발생한 HTML 요소를 확인
  const id = event.target.dataset.id; //변수에 이벤트 발생시 대상 태그의 dataset-id 값을 받아 변수에 담는다.
  const editInput = prompt("수정할 값을 입력하세요~!"); // 값을 입력할 수 있는 창을 띄어 해당 창에 입력한 값을 변수에 담는다.
  const res = await fetch(`/memos/${id}`, {
    // 서버로 양식대로 요청 후 응답 받은 값을 res에 담는다.
    method: "PUT", // 값을 특정 값으로 변경할 때 사용하는 전송방식
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // json형식을 문자열 형식으로 바꿔 전송한다.
      id: id, // id양식에는 변수 id에 담긴 값을 보냄
      content: editInput, // editInput에서 작성해서 담은 값을 내용으로 보낸다.
    }),
  });
  readMemo(); // 메모를 수정한 뒤 자연스럽게 다시 서버에 메모를 읽어오게 마지막에 동작시킨다.)
}
// html 화면에 받아온 메모 내용을 출력하는 함수
function displayMemo(memo) {
  const ul = document.querySelector("#memo-ul"); // ul 영역을 변수에 담는다.

  const li = document.createElement("li"); // 해당 태그를 만드는 기능 창조해서 변수에 담는다.
  li.innerText = `[id:${memo.id}] ${memo.content}`; //li태그 안에 내용을 삽입하는데 해당 형식의 값을 넣는다.

  const editBtn = document.createElement("button"); // 버튼을 생성해 변수에 담는다.
  editBtn.innerText = "수정하기";
  editBtn.addEventListener("click", editMemo); // 해당 버튼을 클릭했을 때 편집하는 함수 동작
  editBtn.dataset.id = memo.id; // js에서 dataset이라는 속성에 id값을 memo.id값으로 넣는다.

  ul.appendChild(li); // ul영역에 자식요소로 li태그를 더해준다? 삽입한다? 추가한다.
  li.appendChild(editBtn); // li영역에 자식요소로 버튼을 더해준다? 삽입한다? 추가한다.
}

readMemo();
// 서버에 담긴 메모 내용을 읽어오는 과정
// 서버의 메모를 읽는 비동기방식함수
async function readMemo() {
  const res = await fetch("/memos");
  // get방식으로 /memos에서의 원하는 값을 기다려서 받은 뒤 res에 담는다.
  const jsonRes = await res.json(); // 받아온 값을 json형식으로 변경후 기다려서 받는다.
  const ul = document.querySelector("#memo-ul");
  ul.innerHTML = ""; // ul 내부에 있는 html들을 초기화 시켜준다.
  //[{id:123, content:'내용의 형식'}]의 형태
  // console.log(jsonRes);
  // ["a", "b", "c"].forEach(func);  해당 배열의 각 값에 대해 반복해서 ()안의 함수를 시행한다.
  jsonRes.forEach(displayMemo); // 키 값의 형태의 배열에 대해 각각 해당 함수를 시행한다.
}

// 만든 텍스트를 서버로 보내서 메모를 생성하는 과정
//메모를 만드는 비동기 함수
async function createMemo(value) {
  console.log(" 함수 handleSubmit에서 받아온 값은", value);
  const res = await fetch("/memos", {
    // memos 경로에 서버에 값을 응답하기를 요청하고 기다린 후 응답받은 값을 res에 담는다.
    method: "POST", // 전송 방식 포스트
    headers: {
      // requestBody를 보낼 때 필수적으로 넣어야하는 값
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: new Date().getTime().toString(),
      content: value,
    }), // 전송을 할 때는 문자열만 전송할 수 있다. 문자열로 전송하면 받는쪽이 JSON형태로 변환해서 받고 처리하고
    // 다시 문자열로 변환해서 전송하는 과정을 거친다. 내가 보낼 때의 형태를 보여준다.
  });
  // const jsonRes = await res.json(); //서버에서 요청해서 받은 값을 json값으로 변경해 변수에 담는다.
  // 왜 json 값이 필요없을까? 추측: 해당  값을 문자열로 변경해 서버에 보내기까지만 하면 거기서 알아서 해결하는거고 요청은 별도의 함수로 진행하기 때문에
  // 해당 값을 json으로 변경해도 여기서는 사용하지 않아서
  // console.log(jsonRes); // 해당 값이 잘 왔는지 체크한다.
  readMemo(); // 메모를 만든 뒤 자연스럽게 다시 서버에 메모를 읽어오게 마지막에 동작시킨다.
}

// app.js:52
// POST http://127.0.0.1:8000/memos 422 (Unprocessable Entity) 에러를 낸다.
// 해석결과 : 전송되는 값이 문자열이여야했다. 그래서 확실하게 toString()으로 문자열로 변환시키자 작동하였다.

//submit 전송이 일어났을때 작동할 함수
function handleSubmit(event) {
  event.preventDefault(); // form의 submit 이벤트는 제출하자마자 redirect(새로고침)라는 이벤트가 발생한다.
  // 해당 동작을 막기위해 해당 함수를 사용한다.
  const input = document.querySelector("#memo-input"); // 해당 영역을 변수로 담음
  console.log("input에서 받아온 값", input.value); // 입력된 값이 잘 들어오는지 체크하는 로그
  createMemo(input.value); // 전송받은 값을 가지고 메모를 만드는 함수를 동작시킴
  input.value = ""; // 전송후 해당 영역의 값을 공백으로 변경또는 입력해 초기화한다
}

readMemo();

const form = document.querySelector("#memo-form"); // 아이디 값을 가진 영역을 변수에 담는다.
form.addEventListener("submit", handleSubmit); // 해당 영역에 값이 submint 됐을 때 handleSubmit가 작동하게한다. 이벤트를 추가한다.
