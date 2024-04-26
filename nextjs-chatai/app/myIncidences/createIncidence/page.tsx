'use client'

import { ChangeEvent, FormEvent, useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import Alerta400 from "@/components/alerta";
import { ObjectId } from "mongoose";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import { Incidencia } from '@/types/Incidence'
import { Usuario } from '@/types/User'

// un id tiene la siguiente pinta: "662a210392d0ccd9dd5eb5f8"

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
            router.refresh();
        },
    });

    const [isLoading, setIsLoading] = useState(true)
    const [usuario, setUsuario] = useState<Usuario>({
        _id: 0 as unknown as ObjectId, // Specify the _id property type
        email: "",
        username: "",
        open_incidences_count: 0,
        completed_incidences_count: 0,
    })
    const [newIncidence, setNewIncidence] = useState({
        name: "",
        description: "",
        status: "OPEN",
        solution: "",
        email: ""
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewIncidence({ ...newIncidence, [e.target.name]: e.target.value })
    }

    const changeOpenIncident = () => {
        let user = usuario
        user.open_incidences_count = ++user.open_incidences_count   
        setUsuario(user)
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

        const userEmail = usuario?.email
        changeOpenIncident()

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

                const resUpdate = await fetch(`http://localhost:3000/api/auth/signup/${userEmail}`, {
                    method: 'PUT',
                    body: JSON.stringify(usuario),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                //writeSolution(inc)

                if (resUpdate.status === 200) {
                    router.push('/myIncidences')
                    router.refresh()
                }
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

        const getUser = async () => {

            const email = session?.user?.email
            const resUpdate = await fetch(`http://localhost:3000/api/auth/signup/${email}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const user = await resUpdate.json()
            setUsuario(user)
        }
        getUser()
        setNewIncidence((newIncidence) => ({ ...newIncidence, email: session?.user?.email as string })) 
        setIsLoading(false)

    }, [status])

    return (
        <div className="grid grid-cols-1 pe-48">
            {isLoading === false ? (
                <>
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
                </>
            ) : (
                <Loading />
            )}
        </div>
    )
}
