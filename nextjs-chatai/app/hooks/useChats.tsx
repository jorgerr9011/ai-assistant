'use client'

import { useState, useEffect } from "react"
import { Chat } from '@/types/Chat'
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Usuario } from "@/types/User"

export const useChats = () => {

    const router = useRouter()
    const [loading, setisLoading] = useState(true)
    const [listChats, setChats] = useState<Chat[]>([])
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/");
        },
    });

    useEffect(() => {
    
        async function getData(usuarioId: String) {

            const res = await fetch(`http://localhost:3000/api/chat?user=${usuarioId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const chats = await res.json()

            setChats(chats)
            setisLoading(false)
        }

        if (session?.user) {

            const usuario = session?.user as Usuario
            getData(String(usuario._id))
        }

    }, [status])

    return {
        listChats,
        loading,
    }
}