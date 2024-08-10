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

app.mount("/", StaticFiles(directory='static', html=True), name='static')
# static 폴더에 있는 html파일을 호스팅을 요청한다.