from langchain_community.document_loaders.json_loader import JSONLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from .data import data
from langchain_chroma import Chroma
#from langchain_community.vectorstores import FAISS

#import getpass
import os
from dotenv import load_dotenv

class rag: 
    def get_retriever():
        
        #if not os.getenv("OPENAI_API_KEY"):
            #os.environ["OPENAI_API_KEY"] = getpass

        load_dotenv()
        openai_api_key = os.getenv("OPENAI_API_KEY")

        data.get_pages_data_and_save_to_file()
        
        loader = JSONLoader(
                file_path="./app/registros/confluence_pages_data.json",
                jq_schema='.[] | .content',
                is_content_key_jq_parsable=True,
                text_content=False
            ).load()

        #pprint(loader)

        text_splitter = CharacterTextSplitter(separator="\n\n", chunk_size=1000, chunk_overlap=200, length_function=len, is_separator_regex=False)
        texts = text_splitter.split_documents(loader)

        #embeddings = OllamaEmbeddings(base_url='http://localhost:11434', model="mistral")

        embeddings = OpenAIEmbeddings(model="text-embedding-3-small", api_key=openai_api_key)
        db = Chroma.from_documents(texts, embeddings)

        return db.as_retriever()

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)
