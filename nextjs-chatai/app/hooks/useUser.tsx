'use client'

import { Usuario } from '@/types/User'
import { ObjectId } from 'mongoose';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const useUser = () => {

    const router = useRouter()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/");
        },
    });
    const [usuario, setUsuario] = useState<Usuario>({
        _id: 0 as unknown as ObjectId, // Specify the _id property type
        email: "",
        username: "",
        open_incidences_count: 0,
        completed_incidences_count: 0,
    })
    const [isLoading, setIsLoading] = useState(true)
    //const [usuario, setUsuario] = useState<Usuario>()

    useEffect(() => {

        const getUser = async () => {

            const email = session?.user?.email
            const resUpdate = await fetch(`http://localhost:3000/api/auth/signup/${email}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            })
    
            const user = await resUpdate.json()
            setUsuario(user as Usuario)
            setIsLoading(false)
        }
        getUser()

    }, [status])

    return {
        usuario,
        isLoading
    }
}

