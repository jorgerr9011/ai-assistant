'use client'

import { ChangeEvent, FormEvent, useState, useEffect } from "react"
import { useRouter, useParams } from 'next/navigation'
import Alerta400 from "@/components/alerta";
import Incidence from "@/models/Incidence";
import { Date, ObjectId } from "mongoose";
import { useSession } from "next-auth/react";
import User from "@/models/User";

interface Incidencia {
    _id: ObjectId; // Specify the _id property type
    name: string;
    description: string;
    status: string;
    solution: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Usuario {
    _id: ObjectId; // Specify the _id property type
    email: string;
    password: string;
    username: string;
    open_incidences_count: number;
    completed_incidences_count: number;
}

export default function CreateIncidence() {

    const router = useRouter()

    // useState para la alerta
    const [error400, setError400] = useState(false);

    // Tiene que estar a true en required porque necesitamos
    // que el usuario esté autenticado para poder crear una 
    // nueva incidencia, y esta tenga asociada el email del 
    // user que la creo
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/");
        },
    });

    const getEmail = () => {
        if (session && status === "authenticated") {
            const user = session?.user as Usuario
            const userEmail = user?.email
            return userEmail
        }
    }

    const [usuario, setUsuario] = useState<Usuario>(session?.user as Usuario)
    const [newIncidence, setNewIncidence] = useState({
        name: "",
        description: "",
        status: "OPEN",
        solution: "",
        email: getEmail()
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewIncidence({ ...newIncidence, [e.target.name]: e.target.value })
    }

    const writeSolution = async (data: Incidencia) => {

        const id = data._id
        try {

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

        event.preventDefault()
        try {

            const res = await fetch('/api/incidence', {
                method: 'POST',
                body: JSON.stringify(newIncidence),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (res.status === 200) {

                const inc: Incidencia = await res.json();
                const userEmail = newIncidence.email
                let openIncidences = ++usuario.open_incidences_count
                openIncidences++

                setUsuario({ ...usuario, open_incidences_count: openIncidences })

                const resUpdate = await fetch(`http://localhost:3000/api/auth/signup/${userEmail}`, {
                    method: 'PUT',
                    body: JSON.stringify(usuario),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                //writeSolution(inc)

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

    return (
        <div className="grid grid-cols-1 pe-48">

            {error400 && <Alerta400 />}

            <div className="flex flex-col w-2/5 mx-auto my-48 gap-2">
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
