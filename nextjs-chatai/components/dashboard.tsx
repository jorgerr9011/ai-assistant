'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useUser } from '@/app/hooks/useUser'
import { useChats } from '@/app/hooks/useChats'
import { Chat } from '@/types/Chat'
import Loading from '@/components/loading'
import { useRouter } from 'next/navigation'
import ShowChat from './chat'

export default function Dashboard() {

    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const { usuario, isLoading } = useUser()
    const { listChats, loading } = useChats()
    const [chats, setChats] = useState(listChats)

    const [load, setload] = useState(true)

    const [reload, setReload] = useState(false)

    const handleNewChat = async () => {

        const chat = {
            title: 'titulo',
            chat_history: [],
            user: usuario._id
        }

        if (window.confirm("¿Estas seguro de querer crear un nuevo chat?")) {

            const res = await fetch('http://localhost:3000/api/chat', {
                method: "POST",
                body: JSON.stringify(chat),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log("Creado nuevo chat!")

            setReload(true)
        }
    }

    useEffect(() => {

        setChats(listChats)
        setload(false)

    }, [loading, reload])

    return (
        <>
            {isLoading === false && loading === false && load === false ? (
                <div className="col-span-1 rounded gap-4 max-h-max h-screen opacity-75 bg-blue-200">

                    <div className="flex flex-col justify-center sm:justify-center my-24 h-32 gap-12">
                        <div className="flex flex-1 justify-center sm:justify-center h-16">
                            <Link href="/chat/#" onClick={handleNewChat} className="text-black font-semibold p-3 rounded-lg hover:bg-pink-400">Nuevo chat</Link>
                        </div>

                        <div className="relative flex flex-1 justify-center sm:justify-center align-center h-12">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-black font-semibold p-3 rounded-lg hover:bg-pink-400 flex items-center"
                            >
                                Mis chats
                                <svg className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" />
                                </svg>
                            </button>
                            {isOpen && (
                                <div className="absolute flex flex-col mx-auto ml-4 justify-center sm:justify-center align-center mt-16">
                                    <ul className='flex flex-col gap-4'>

                                        {chats.length > 0 && chats.map((item: Chat) => (
                                            <ShowChat key={item._id} chat={item}/>
                                        ))}
                                        
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/*<Loading />*/}
                </>
            )}
        </>
    )
};