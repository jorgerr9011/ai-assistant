'use client'

import { useState, useEffect } from "react"
import { Incidencia } from '@/types/Incidence'
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export const useIncidences = ({ allIncidences } : { allIncidences: boolean }) => {

    const router = useRouter()
    const [isLoading, setisLoading] = useState(true)
    const [listIncidences, setIncidences] = useState<Incidencia[]>([])
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/");
        },
    });

    useEffect(() => {
    
        function modifyUrl() {
            let url = `http://localhost:3000/api/incidence`

            if (!allIncidences) {

                const email = session?.user?.email
                return url.concat(`?email=${email}`)
            }
            return url
        }

        async function getData() {
            
            const url = modifyUrl()
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const incidencias = await res.json()
            setIncidences(incidencias)
            setisLoading(false)
        }
        getData()

    }, [status])

    return {
        isLoading,
        listIncidences,
    }
}