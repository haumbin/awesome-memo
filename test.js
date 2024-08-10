async function createMemo(value) {
  console.log(" 함수 handleSubmit에서 받아온 값은", value);
  const res = await fetch("/memos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: new Date().getTime(),
      content: value,
    }),
  });
  readMemo();
}
