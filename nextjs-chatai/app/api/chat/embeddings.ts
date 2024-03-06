import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { AttributeInfo } from "langchain/schema/query_constructor";
import { SelfQueryRetriever } from "langchain/retrievers/self_query";
import { FunctionalTranslator } from "langchain/retrievers/self_query/functional";
import { Document } from "@langchain/core/documents";
import { Ollama } from "@langchain/community/llms/ollama";

const docs = [
    new Document({
        pageContent: "Si no te funciona el wifi, pruebe a reiniciarlo desde su ordenador",
        metadata: {title: "Problema con wifi"}
    }),
    new Document({
        pageContent: "Si no te funciona el bluetooth, pruebe a reiniciarlo desde su ordenador",
        metadata: {title: "Problema con bluetooth"}
    }),
]

const attributeInfo: AttributeInfo[] = [
    {
        name: "title",
        description: "The title of the incidence",
        type: "string",
    },
]

export async function getResponse() {
    const embeddings = new OllamaEmbeddings({
        model: "mistral", // default value
        baseUrl: "http://localhost:11434", // default value
    });
    const llm = new Ollama({
        baseUrl: "http://localhost:11434", // Default value
        model: "mistral",
    });
    const documentContents = "Brief summary of a movie";
    const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
    const selfQueryRetriever = await SelfQueryRetriever.fromLLM({
    llm,
    vectorStore,
    documentContents,
    attributeInfo,
    structuredQueryTranslator: new FunctionalTranslator(),
    })

    const query1 = await selfQueryRetriever.getRelevantDocuments(
        "Which movies are less than 90 minutes?"
    );
    console.log(query1)
}

/*
async function getData() {
    const res = await fetch('../../confluence_spaces.json')

    return await res.json()
}

function getEmbedding () {
    const embeddings = new OllamaEmbeddings({
        model: "mistral", // default value
        baseUrl: "http://localhost:11434", // default value
    });

    const loader = getData()
    const documento = JSON.parse(JSON.stringify(loader)) // Intenta convertir a JSON y volver a parsear

    const documentEmbeddings = embeddings.embedDocuments(documento)

}
*/