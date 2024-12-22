from langchain_community.llms import Ollama
#from langchain_community.embeddings import OllamaEmbeddings
from langchain_core.output_parsers import StrOutputParser
#from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from .rag import get_retriever, format_docs
from dotenv import load_dotenv
import os

#from langchain.chains import create_retrieval_chain
#from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

class LlmChatHistory:

    #ollama = Ollama(base_url='http://localhost:11434', model="mistral")

    template = """You are a technical support specialist in an IT department who are specialized in resolve incidences, answer queries and provide assistance. /
        Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't /
        try to make up an answer. If you don't find any relevant information to the question, don't talk about it.
        {context}
        
        Answer: """    

    custom_rag_prompt = PromptTemplate.from_template(template)

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", template),
            ("human", "{input}"),
        ]
    )

    load_dotenv()
    openai_key = os.getenv('OPENAI_API_KEY')
    llm = ChatOpenAI(model="gpt-3.5-turbo-0125", temperature=0.2, api_key=openai_key)

    output_parser = StrOutputParser()
        
    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    
    def chain(self):

        retriever = get_retriever()

        rag_chain = (
            {"context": retriever}
            | self.prompt 
            | self.llm
            | self.output_parser
        )

        #question_answer_chain = create_stuff_documents_chain(self.llm, self.prompt)
        #rag_chain = create_retrieval_chain(retriever, question_answer_chain)

        #rag_chain = self.custom_rag_prompt | self.llm | self.output_parser
        
        respuesta = rag_chain.invoke({"input": "Responde únicamente con un hola"})
        print(respuesta)

        #return rag_chain