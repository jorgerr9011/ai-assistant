from pprint import pprint
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.document_loaders.json_loader import JSONLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from data import get_pages_data_and_save_to_file
from langchain_chroma import Chroma
#from langchain_community.vectorstores import FAISS

import getpass
import os

def get_retriever():
    
    #if not os.getenv("OPENAI_API_KEY"):
    #    os.environ["OPENAI_API_KEY"] = getpass

    get_pages_data_and_save_to_file()
    
    loader = JSONLoader(
            file_path="./registros/confluence_pages_data.json",
            jq_schema='.[] | .content',
            is_content_key_jq_parsable=True,
            text_content=False
        ).load()

    #pprint(loader)

    text_splitter = CharacterTextSplitter(separator="\n\n", chunk_size=1000, chunk_overlap=200, length_function=len, is_separator_regex=False)
    texts = text_splitter.split_documents(loader)

    #embeddings = OllamaEmbeddings(base_url='http://localhost:11434', model="mistral")

    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    db = Chroma.from_documents(texts, embeddings)

    return db.as_retriever()

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)
