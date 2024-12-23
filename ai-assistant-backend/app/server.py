from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from .rag import rag
#from langserve import add_routes
from .qa_model import QaLlm
#from .incidence_model import Llm
#from .qa_history import LlmChatHistory

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
#from typing import List

app = FastAPI(
    title="Server chat",
    version="1.0",
    description="Simple api server to chat with a model"
)  

class Item(BaseModel):
    query: str
    chat_history: str
    #chat_history: List[str]

retriever = rag.get_retriever()

@app.get("/")
async def redirect_root_to_docs():
    return RedirectResponse("/docs")


@app.post("/solution/")
def create_solution(item: Item): 
    return QaLlm().chain(retriever, item.query, item.chat_history)

#llm = Llm()

# Pipeline que resolverá las incidencias automáticamente
#add_routes(
 #   app,
  #  llm.chain(),
  #  path="/incidence",
#)

#llmChat = LlmChatHistory().chain()


# Pipeline que procesará los mensajes del chat
# add_routes(
#     app, 
#     llmChat.chain(),
#     path="/chat"
# )

# Edit this to add the chain you want to add
#add_routes(app, NotImplemented)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
