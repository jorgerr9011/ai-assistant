import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


export const useIncidence = ({ params } : { params: any }) => {

    const [loading, setIsLoading] = useState(true)
    const [incidencia, setIncidencia] = useState({
        name: "",
        description: "",
        status: "",
        solution: "",
        email: ""
    });

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
                    ['name']: incidence.name,
                    ['description']: incidence.description,
                    ['status']: incidence.status,
                    ['solution']: incidence.solution,
                    ['email']: incidence.email
                })
            } catch (error: any) {

                console.log(error.message)
            }
        };
        getData()
        setIsLoading(false)

    }, [])

    return {
        incidencia, 
        loading
    }
}
