import { Ollama } from "@langchain/community/llms/ollama";
import { Message as VercelChatMessage, StreamingTextResponse, streamToResponse } from 'ai';
import { PromptTemplate } from "@langchain/core/prompts";
import { BytesOutputParser } from '@langchain/core/output_parsers';
import { RemoteRunnable } from "@langchain/core/runnables/remote"
import { RunnableWithMessageHistory, RunnableConfig } from "langchain/runnables";
import { NextResponse } from 'next/server'

//export const runtime = 'edge';

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

export async function POST(req: Request) {

  try {
    
    const body = await req.json();
    const messages = body.messages ?? [];

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    console.log(formattedPreviousMessages)

    console.log(currentMessageContent)

    const chain = new RemoteRunnable({
      url: 'http://localhost:8000/chat',
      options: {
        timeout: 9000000000000000
      }
    })

    const result = await chain.stream({
      chat_history: formattedPreviousMessages.join('\n'),
      question: currentMessageContent,
    })
    //const result = await chain.stream(currentMessageContent)
    //const result = await chain.stream(formattedPreviousMessages.join('\n'), currentMessageContent)

    const decoder = new TextDecoder()
    const encoder = new TextEncoder()

    let first_entry_skipped = false

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        if (!first_entry_skipped) {
          first_entry_skipped = true
        } else {
          controller.enqueue(chunk.toString())
        }
      }
    })

    return new StreamingTextResponse(result.pipeThrough(transformStream))

  } catch (error: any) {
    console.log("Hubo un error en la petición")
    return NextResponse.json(error.message, {
      status: 400
    })
  }
}