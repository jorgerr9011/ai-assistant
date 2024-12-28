'use client';

import { Message, useChat } from 'ai/react';
import { useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';
//import { useGetChat } from '../../hooks/useGetChat';
import { useParams } from 'next/navigation';
import type { Chat } from '@/types/Chat'
import { SendMessageIcon } from '@/components/icons/chat/SendMessageIcon';
import { DeleteConversationIcon } from '@/components/icons/chat/DeleteConversationIcon';


export default function Chat() {

    const params = useParams()
    const { usuario, isLoading } = useUser()
    const [loading, setIsLoading] = useState(false)
    //const { chat, isloading } = useGetChat({ params })

    const [isloading, setisloading] = useState(false)

    const [conversation, setChat] = useState<Chat>()

    const response = () => {
        setIsLoading(true)
    }

    const finish = async (message: Message) => {

        const resUpdate = await fetch(`/api/chat/${params.chatId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })

        let chatUpdated = await resUpdate.json()
        chatUpdated.chat_history.push(message)

        await fetch(`/api/chat/${params.chatId}`, {
            method: 'PUT',
            body: JSON.stringify(chatUpdated),
            headers: {
                "Content-Type": "application/json"
            }
        })

        setIsLoading(false)
    }

    const { setMessages, messages, input, handleInputChange, handleSubmit } = useChat({
        onResponse: response, onFinish: finish, api: `/api/chat/${params.chatId}`, body: {
            chat: conversation
        },
    });

    const handleDelete = async () => {

        let deleteConversation = conversation
        if (deleteConversation) {
            deleteConversation.chat_history = []
        }

        if (window.confirm("¿Estas seguro de querer borrar esta conversación?")) {
            await fetch(`/api/chat/${params.chatId}`, {
                method: 'PUT',
                body: JSON.stringify(deleteConversation),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            setMessages([])
        }
    }

    useEffect(() => {

        const getData = async () => {

            try {
                const res = await fetch(`/api/chat/${params.chatId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const chat = await res.json();

                setChat({
                    ['_id']: chat._id,
                    ['title']: chat.title,
                    ['chat_history']: chat.chat_history,
                    ['user']: chat.user,
                    ['createdAt']: chat.createdAt,
                    ['updatedAt']: chat.updatedAt,
                    ['__v']: chat.__v
                })

                setisloading(false)

            } catch (error: any) {
                console.log(error.message)
            }
        };
        getData()

    }, [])

    useEffect(() => {

        if (!isloading && conversation != undefined && !isLoading) {            
            setMessages(conversation?.chat_history as Message[])

            console.log(messages)
        }

    }, [isloading, conversation?.chat_history])

    useEffect(() => {
        console.log(messages)
    }, [messages])

    return (

        <div className="flex flex-col mx-auto w-full h-2/5 max-h-screen max-w-5xl py-12 rounded">

            <div className='container items-end mb-40 h-2/5 overflow-y-auto'>
                {messages.length > 0 && messages.map((m, index) => (
                        <div className="flex flex-col items-end rounded" key={index}>
                            <div className="text-dark p-3 mx-4 mb-2 rounded-xl bg-gray-400">
                                {m.role === 'user' ? 'User: ' : 'AI: '}
                                {m.content}
                            </div>
                        </div>
                ))}
            </div>

            <div className="justify-center items-center absolute bottom-0 my-8 w-2/3 max-w-5xl">
                {loading || isLoading ? (
                    <>
                        <label className="sr-only">Your message</label>
                        <div className="flex items-center px-2 py-2 bg-gray-50 rounded-lg dark:bg-gray-400">
                            <input className="block mx-4 p-2.5 w-full text-sm text-dark bg-white rounded-lg border border-gray-300 focus:ring-blue-400 focus:border-blue-400 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-300" placeholder="Your message..."
                                value={input}
                                onChange={handleInputChange} />

                            <svg onClick={handleDelete} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7 mr-2 ml-2 rounded-full cursor-pointer hover:bg-blue-100 dark:text-red-500 dark:hover:bg-gray-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>


                            <button type='button' className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                                <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                            </button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <label className="sr-only">Your message</label>
                        <div className="flex items-center px-2 py-2 bg-gray-50 rounded-lg dark:bg-gray-400">
                            <input className="block mx-4 p-2.5 w-full text-sm text-dark bg-white rounded-lg border border-gray-300 focus:ring-blue-400 focus:border-blue-400 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-300" placeholder="Your message..."
                                value={input}
                                onChange={handleInputChange} />

                            <button onClick={handleDelete} className="inline-flex p-2 mr-2 ml-2 rounded-full cursor-pointer hover:bg-blue-100 dark:text-red-500 dark:hover:bg-gray-600">
                                <DeleteConversationIcon />
                            </button>

                            <button type="submit" className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                                <SendMessageIcon />
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div >
    );
}
