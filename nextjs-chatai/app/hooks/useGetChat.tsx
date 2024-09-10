import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Chat } from "@/types/Chat"

export const useGetChat = ({ params } : { params: any }) => {

    const [isloading, setIsLoading] = useState(true)
    const [chat, setChat] = useState<Chat>();

    useEffect(() => {

        const getData = async () => {

            try {
                const res = await fetch(`http://localhost:3000/api/chat/${params.chatId}`, {
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
                    ['user']: chat.user
                })

                setIsLoading(false)

            } catch (error: any) {

                console.log(error.message)
            }
        };
        getData()

    }, [])

    return {
        chat, 
        isloading
    }
}