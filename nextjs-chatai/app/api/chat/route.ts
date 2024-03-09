import { Ollama } from "@langchain/community/llms/ollama";
import { Message as VercelChatMessage, StreamingTextResponse, streamToResponse } from 'ai';
import { PromptTemplate } from "@langchain/core/prompts";
import { BytesOutputParser } from '@langchain/core/output_parsers';
import { RemoteRunnable } from "@langchain/core/runnables/remote"

//export const runtime = 'edge';

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a technical support specialist who are specialized in resolve issues, answer queries and provide assistance.
 
Current conversation:
{chat_history}
 
User: {input}
AI:`;

export async function POST(req:Request) {

  const body = await req.json();
  const messages = body.messages ?? [];

  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  const currentMessageContent = messages[messages.length - 1].content;

/*
  const result = await fetch("http://localhost:8000/chat/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
          })
                              
  const data = await result.json()*/

  const chain = new RemoteRunnable({
    url: 'http://localhost:8000/chat',
    options: {
      timeout: 10000000
    }
  })

  /*const outputParser = new BytesOutputParser();
  const prompt = PromptTemplate.fromTemplate(TEMPLATE)
  const chain2 = prompt.pipe(chain).pipe(outputParser)*/

  const result = await chain.stream({
    chat_history: formattedPreviousMessages.join('\n'),
    input: currentMessageContent,
  })

  const decoder = new TextDecoder()
  const encoder = new TextEncoder()

  let first_entry_skipped = false

  const transformStream = new TransformStream({
    transform(chunk, controller) {
      if(!first_entry_skipped) {
        first_entry_skipped = true
      } else {
        controller.enqueue(chunk.toString())
      }
    }
  })

  return new StreamingTextResponse(result.pipeThrough(transformStream))
}