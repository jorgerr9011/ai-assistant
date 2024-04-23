'use client'

import { ChangeEvent, FormEvent, useState, useEffect } from "react"
import { useRouter, useParams } from 'next/navigation'
import Alerta400 from "@/app/components/alerta";
import Incidence from "@/models/Incidence";
import { Date, ObjectId } from "mongoose";

interface Incidencia {
    _id: ObjectId; // Specify the _id property type
    name: string;
    description: string;
    status: string;
    solution: string;
    createdAt: Date;
    updatedAt: Date;
}

export default function CreateIncidence() {

    // useState para la alerta
    const [error400, setError400] = useState(false);

    const router = useRouter()
    const params = useParams()

    const [newIncidence, setNewIncidence] = useState({
        name: "",
        description: "",
        status: "OPEN",
        solution: ""
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewIncidence({ ...newIncidence, [e.target.name]: e.target.value })
    }

    const writeSolution = async (data: Incidencia) => {

        try {
            const id= data._id

            const res2 = await fetch(`/api/solution/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            })
        } catch (error: any) {
            console.log("Error message: " + error.message)
        }
    }

    const handleSubmit = async (event: FormEvent) => {
        try {
            event.preventDefault()

            const res = await fetch('/api/incidence', {
                method: 'POST',
                body: JSON.stringify(newIncidence),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (res.status === 200) {

                const inc: Incidencia = await res.json();

                writeSolution(inc)

                router.push('/myIncidences')
                router.refresh()
            }

            if (res.status === 400) {
                setError400(true)
                setTimeout(() => {
                    setError400(false);
                }, 5000); // Ocultar la alerta después de 5 segundos
            }

        } catch (error: any) {
            console.log("Error message: " + error.message)
        }
    }

    useEffect(() => {
        console.log(params)
    }, [])

    return (
        <div className="grid grid-cols-1">
            {error400 && <Alerta400 />}

            {/*<h1 className="font-bold text-3xl">Crea una nueva incidencia</h1>*/}
            <div className="flex flex-col w-2/5 mx-auto my-48 gap-2">
                {/*<h1 className="font-bold text-3xl my-6">
                    {/*
                        !params.id ? "Crea una incidencia" : "Edita la incidencia"
                    */}
                {/*</h1>*/}
                <form onSubmit={handleSubmit}>
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-4 mb-4">Nombre</label>
                    <input onChange={handleChange} name="name" type="text" className="rounded-md flex-grow w-full border border-gray-400 focus:border-red-400" />
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-4 mb-4">Detalles</label>
                    <textarea onChange={handleChange} name="description" className=" no-resize appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-48 resize-none" id="message"></textarea>
                    <div className="flex justify-end">
                        <button type="submit" className="ml-4 px-4 rounded-black border-black border rounded-md bg-red-400 text-white hover:bg-red-600 transition-all ease-in-out">Send request</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
