from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

class Memo(BaseModel): #Memo 형태는 이렇다 정의하기
    id:str # id는 문자열
    content:str # content는 문자열

memos = [] #memos라는 서버에 존재하는 배열
app = FastAPI()

@app.post("/memos") #/memos로 post요청을 받으면
def create_memo(memo:Memo): # Memo형식의 memo를 요청 파라미터로 받아서 동작하는함수
    memos.append(memo) # 파라미터로 받은 값을 서버의 배열에 추가한다.
    return '메모 추가에 성공했습니다.'    #'메모 추가에 성공했습니다.'라는 값을 응답해서 반환한다.

@app.get("/memos") # get방식으로 해당 루트로 요청이 오면
def read_memo(): # 해당 함수를 동작한다.
    return memos # 서버의 배열값을 반환하여 응답해준다.

@app.put("/memos/{memo_id}") # 해당 위치로 put 요청을 받을시
def put_memo(req_memo:Memo): # 동작하는 함수 받은 값을 Memo형태의 객체로 변환 시킴
    for memo in memos:  #memo라는 객체변수를 생성 그 객체변수를 memos배열 전체의 범위만큼 반복> memos의 기록된 메모들을 하나씩 체크
        # for memo in memos:는 memos 리스트의 각 Memo 객체를 하나씩 memo라는 변수에 할당하면서 루프를 돌립니다.
        if memo.id == req_memo.id: # 만약 객체memo의 id값이 요청받은 memo의 id와 같다면
            memo.content=req_memo.content # 기존의 내용을 새로운 내용으로 수정한다.
            return '메모 수정에 성공했습니다.'
    return '요청한 메모는 존재하지 않습니다.'

@app.delete("/memos/{memo_id}")
def delete_memo(memo_id):
    for index,memo in enumerate(memos): # enumerate(memos) : index값과 객체를 동시에 반환한다. (index, memo)의 형태로
        if memo.id == memo_id: # memos의 각체를 순회하며 아이디 값과 입력받은 아이디 값이 일치한다면
            memos.pop(index) # 순회 중  해당 객체의 인덱스번호를 가진 객체를 삭제한다 즉 대상을 삭제한다?
            
            return '메모 삭제에 성공했습니다.'
    return '요청한 메모는 존재하지 않습니다.'

app.mount("/", StaticFiles(directory='static', html=True), name='static')
# static 폴더에 있는 html파일을 호스팅을 요청한다.