import { useState, useEffect } from "react"
import { connectDB } from '@/utils/db'
import Incidence from '@/models/Incidence'

export const fetchIncidences = (): any => {

    const [isLoading, setisLoading] = useState(true)
    const [listIncidences, setIncidences] = useState<typeof Incidence[]>([])

    useEffect(() => {

        async function getData() {
            
            const res = await fetch('/api/incidence', {
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
    }, [])

    return {
        isLoading,
        listIncidences
    }
}