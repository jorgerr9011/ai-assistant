import { Message as VercelChatMessage, StreamingTextResponse, streamToResponse, Message } from 'ai';
import { RemoteRunnable } from "@langchain/core/runnables/remote"
import { NextResponse } from 'next/server'
import User from "@/models/User";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const addChatMessages = async (message: Message, email: string) => {

  try {

    let user = await User.findOne({ email })
    user.chat_history.push(message)

    const res2 = await fetch(`http://localhost:3000/api/auth/signup/${email}`, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const prueba = await res2.json()

  } catch (error: any) {
    console.log("Error message: " + error.message)
  }
}

export async function POST(req: Request) {

  try {

    const body = await req.json();
    const messages = body.messages ?? [];

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const message = messages[messages.length - 1]
    const usuario = body.user

    addChatMessages(message, usuario.email)

    const chain = new RemoteRunnable({
      url: 'http://localhost:8000/chat',
      options: {
        timeout: 1000000000
      }
    })

    const result = await chain.stream({
      chat_history: formattedPreviousMessages.join('\n'),
      input: currentMessageContent,
    })

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