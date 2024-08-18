'use client';

import { Message, useChat } from 'ai/react';
import { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';

export default function Chat() {

    const { usuario, isLoading } = useUser()
    const [loading, setIsLoading] = useState(false)

    const response = () => {
        setIsLoading(true)
    }

    const finish = async (message: Message) => {

        const resUpdate = await fetch(`http://localhost:3000/api/auth/signup/${usuario.email}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })

        let user = await resUpdate.json()
        user.chat_history.push(message)

        await fetch(`http://localhost:3000/api/auth/signup/${usuario.email}`, {
            method: 'PUT',
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        })
        setIsLoading(false)
    }

    const { setMessages, messages, input, handleInputChange, handleSubmit } = useChat({
        onResponse: response, onFinish: finish, body: {
            user: usuario
        },
    });

    const handleDelete = async () => {
        console.log("eliminar")

        if (window.confirm("¿Estas seguro de querer borrar esta incidencia?")) {
            await fetch(`http://localhost:3000/api/chat/${usuario.email}`, {
                method: 'PUT',
                body: JSON.stringify(usuario),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            setMessages([])
        }
    }

    useEffect(() => {

        if (usuario != undefined && !isLoading) {
            setMessages(usuario?.chat_history as Message[])
        }

    }, [isLoading, usuario?.chat_history])

    return (
        <>
            <div className="">
                <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Borrar conversación</button>
            </div>

            <div className="flex flex-col mx-auto w-full h-full min-h-full max-h-full max-w-5xl py-12 rounded">

                <>
                    {messages.map(m => (
                        <>
                            {m.role === 'user' ? (
                                <>
                                    <div className="flex flex-col items-end h-max rounded overflow-y-auto">
                                        <div key={m.id} className="text-dark p-3 mx-4 mb-2 rounded-xl bg-gray-400">
                                            {m.role === 'user' ? 'User: ' : 'AI: '}
                                            {m.content}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col items-end h-max rounded overflow-y-auto">
                                        <div key={m.id} className="text-dark p-3 mx-4 mb-2 rounded-xl bg-gray-400">
                                            {m.role === 'assistant' ? 'AI: ' : 'nada'}
                                            {m.content}
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    ))}
                </>
                <div className="justify-center items-center absolute bottom-0 my-8 w-2/3 max-w-5xl">
                    {loading || isLoading ? (
                        <>
                            <label className="sr-only">Your message</label>
                            <div className="flex items-center px-2 py-2 bg-gray-50 rounded-lg dark:bg-gray-400">
                                <input className="block mx-4 p-2.5 w-full text-sm text-dark bg-white rounded-lg border border-gray-300 focus:ring-blue-400 focus:border-blue-400 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-300" placeholder="Your message..."
                                    value={input}
                                    onChange={handleInputChange} />
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
                                <button type="submit" className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                                    <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div >
        </>
    );
}

