#from langchain_community.llms import Ollama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder, PromptTemplate
#from langchain_core.runnables import RunnablePassthrough
#from langchain_community.llms import Ollama
#from langchain_core.runnables import RunnablePassthrough
#from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder, PromptTemplate
from langchain_core.output_parsers import StrOutputParser
#from .rag import get_retriever, format_docs

#from langchain.prompts.chat import ChatPromptTemplate
#from langchain.schema import HumanMessage, SystemMessage

#from langchain_community.document_loaders.json_loader import JSONLoader
#from langchain_text_splitters import CharacterTextSplitter
#from langchain_openai import OpenAIEmbeddings
#from data import get_pages_data_and_save_to_file
#from langchain_chroma import Chroma
#from langchain_core.messages import SystemMessage
#from langchain_core.prompts import HumanMessagePromptTemplate

import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
#from langchain.chains import LLMChain

class QaLlm: 

    def create_prompt(self, retriever, query, chat_history):
        
        """Crea un prompt personalizado con contexto obtenido de un retriever.

        Args:
            retriever: Un objeto Retriever para obtener el contexto.
            query: La consulta del usuario.
            chat_history: Historial de la conversación.

        Returns:
            ChatPromptTemplate: Un objeto ChatPromptTemplate personalizado.
        """

        prompt_template = PromptTemplate.from_template(
            """You are a technical support specialist in an IT department who are specialized in resolve incidences, answer queries and provide assistance. /
            Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't /
            try to make up an answer. If you don't find any relevant information to the question, don't talk about it.
            {context}
            
            {chat_history}
            Answer: 
            """   
        )
        
        # Obtener el contexto del retriever
        docs = retriever.invoke(query)
        context = "\n".join([doc.page_content for doc in docs])

        prompt = prompt_template.format(context=context, chat_history=chat_history)
        prompt_def = PromptTemplate.from_template(prompt+" {input}")

        return prompt_def


    def chain(self, retriever, query, chat_history):
        
        output_parser = StrOutputParser()

        #query = "Como puedo recuperar los datos de mi cuenta de Servizos?"

        prompt = self.create_prompt(retriever, query, chat_history)
        #print(prompt)

        load_dotenv()
        openai_key = os.getenv("OPENAI_API_KEY")
        llm = ChatOpenAI(model="gpt-3.5-turbo-0125", temperature=0.2, api_key=openai_key)

        chain = prompt | llm | output_parser

        response = chain.invoke(query)
        
        print(response)

        return response
        