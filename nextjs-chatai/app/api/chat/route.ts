import { Ollama } from "@langchain/community/llms/ollama";
import { Message as VercelChatMessage, StreamingTextResponse } from 'ai';
import { PromptTemplate } from "@langchain/core/prompts";
import { BytesOutputParser } from '@langchain/core/output_parsers';
import { JSONLoader } from "langchain/document_loaders/fs/json";
//import {getResponse} from './embeddings'

import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { AttributeInfo } from "langchain/schema/query_constructor";
import { SelfQueryRetriever } from "langchain/retrievers/self_query";
import { FunctionalTranslator } from "langchain/retrievers/self_query/functional";
import { Document } from "@langchain/core/documents";

const loader = new JSONLoader("../../confluence_spaces.json");

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

/*export const runtime = 'edge';

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a technical support specialist who are specialized in resolve issues, answer queries and provide assistance.
 
Current conversation:
{chat_history}
 
User: {input}
AI:`;*/

export async function POST(req:Request) {
  /*const body = await req.json();
  const messages = body.messages ?? [];
  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  const currentMessageContent = messages[messages.length - 1].content;

  const prompt = PromptTemplate.fromTemplate(TEMPLATE);

  const llm = new Ollama({
    baseUrl: "http://localhost:11434", // Default value
    model: "mistral",
  });
  
  const outputParser = new BytesOutputParser();

  const chain = prompt.pipe(llm).pipe(outputParser);

  const stream = await chain.stream({
    chat_history: formattedPreviousMessages.join('\n'),
    input: currentMessageContent,
  });
 
  return new StreamingTextResponse(stream);*/
  await getResponse()

  return new Response()
}

/*import { HfInference } from '@huggingface/inference';
import { HuggingFaceStream, StreamingTextResponse } from 'ai';
import { experimental_buildOpenAssistantPrompt } from 'ai/prompts';
 
// Create a new HuggingFace Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
 
export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();
 
  const response = Hf.textGenerationStream({
    model: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
    inputs: experimental_buildOpenAssistantPrompt(messages),
    parameters: {
      max_new_tokens: 200,
      // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
      typical_p: 0.2,
      repetition_penalty: 1,
      truncate: 1000,
      return_full_text: false,
    },
  });
 
  // Convert the response into a friendly text-stream
  const stream = HuggingFaceStream(response);
 
  // Respond with the stream
  return new StreamingTextResponse(stream);
}*/