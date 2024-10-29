import { Message as VercelChatMessage, StreamingTextResponse, streamToResponse, Message } from 'ai';
import { RemoteRunnable } from "@langchain/core/runnables/remote"
import { NextResponse } from 'next/server'
import {connectDB} from '@/utils/db'
import Chat from '@/models/Chat' 

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const addChatMessages = async (message: Message, conversation: any) => {

  try {

    await connectDB()
    let chat = await Chat.findById(conversation._id)

    chat.chat_history.push(message)

    const res2 = await fetch(`http://localhost:3000/api/chat/${chat._id}`, {
      method: 'PUT',
      body: JSON.stringify(chat),
      headers: {
        "Content-Type": "application/json"
      }
    })

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
    const chat = body.chat

    //console.log(formattedPreviousMessages)
    //console.log(typeof formattedPreviousMessages)

    addChatMessages(message, chat)

    const response = await fetch('http://localhost:8000/solution/', {
      method: 'POST',
      body: JSON.stringify(
        {
          "query": message.content,
          "chat_history": formattedPreviousMessages.join('\n')
        }),
      headers: {
        "Content-Type": "application/json"
      }
    })

    const solution = await response.json()

    // const chain = new RemoteRunnable({
    //   url: 'http://localhost:8000/chat',
    //   options: {
    //     timeout: 1000000000
    //   }
    // })

    /*const result = await chain.stream({
      chat_history: formattedPreviousMessages.join('\n'),
      input: currentMessageContent,
    })*/

    // const result = await chain.stream({
    //   input: currentMessageContent
    // })

    // console.log(result)

    // const decoder = new TextDecoder()
    // const encoder = new TextEncoder()

    // let first_entry_skipped = false

    // const transformStream = new TransformStream({
    //   transform(chunk, controller) {
    //     if (!first_entry_skipped) {
    //       first_entry_skipped = true
    //     } else {
    //       controller.enqueue(chunk.toString())
    //     }
    //   }
    // })

    return new StreamingTextResponse(solution)

  } catch (error: any) {
    console.log("Hubo un error en la petición")
    return NextResponse.json(error.message, {
      status: 400
    })
  }
}

export async function GET(req: Request, { params } : any) {

  try {
      await connectDB()

      const chat = await Chat.findById(params.chatId)

      if (!chat)
          return NextResponse.json({
              message: "Chat no encontrada"
          }, {
              status: 404
          })

      return NextResponse.json(chat)

  } catch (error : any) {
      return NextResponse.json(error.message, {
          status: 400
      })
  }
}

export async function DELETE(req: Request, {params}: any) {
    
  try {
      await connectDB()
      const chatDeleted = await Chat.findByIdAndDelete(params.chatId)

      if(!chatDeleted)
          return NextResponse.json({
              message: "Chat no encontrada",
          }, {
              status: 404
          })
      
      return NextResponse.json(chatDeleted)

  } catch (error : any) {
      return NextResponse.json(error.message, {
          status: 400
      })
  }
}

export async function PUT(req: Request, {params}: any) {
    
  try {
      await connectDB()
      
      const body = await req.json()

      const chatUpdated = await Chat.findByIdAndUpdate(params.chatId, body, {
          new: true
      })

      return NextResponse.json(chatUpdated)

  } catch (error : any) {
      return NextResponse.json(error.message, {
          status: 400
      })
  }
}