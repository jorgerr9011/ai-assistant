'use client'

import { useState, useEffect } from "react"
import { connectDB } from '@/utils/db'
import Incidence from '@/models/Incidence'
import { getServerSession } from "next-auth"
import { useRouter } from "next/navigation"
import { ObjectId } from "mongoose"
import User from "@/models/User"
import { useSession } from "next-auth/react"
//import { authOptions } from "../api/auth/[...nextauth]"

interface Usuario {
    _id: ObjectId; // Specify the _id property type
    email: string;
    password: string;
    username: string;
    open_incidences_count: number;
    completed_incidences_count: number;
}

export const fetchIncidences = () => {

    const router = useRouter()
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
        listIncidences,
    }
}