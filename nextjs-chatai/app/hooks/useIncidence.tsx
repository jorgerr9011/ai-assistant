import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Incidencia } from "@/types/Incidence"

export const useIncidence = ({ params } : { params: any }) => {

    const [isloading, setIsLoading] = useState(true)
    const [incidencia, setIncidencia] = useState<Incidencia>();

    useEffect(() => {

        const getData = async () => {

            try {
                const res = await fetch(`http://localhost:3000/api/incidence/${params.incidenceId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const incidence = await res.json();
                setIncidencia({
                    ['_id']: incidence._id,
                    ['name']: incidence.name,
                    ['description']: incidence.description,
                    ['status']: incidence.status,
                    ['solution']: incidence.solution,
                    ['email']: incidence.email,
                    ['createdAt']: incidence.createdAt,
                    ['updatedAt']: incidence.updatedAt
                })

                setIsLoading(false)

            } catch (error: any) {

                console.log(error.message)
            }
        };
        getData()

    }, [])

    return {
        incidencia, 
        isloading
    }
}
