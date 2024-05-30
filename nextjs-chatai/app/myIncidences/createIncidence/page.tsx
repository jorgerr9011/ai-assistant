'use client'

import { ChangeEvent, FormEvent, useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import Alerta400 from "@/components/alerta";
import Loading from "@/components/loading";
import { Incidencia } from '@/types/Incidence'
import { useUser } from "@/app/hooks/useUser";

export default function CreateIncidence() {

    const [error400, setError400] = useState(false);
    const {usuario, isLoading} = useUser()
    const router = useRouter()

    const [loading, setIsLoading] = useState(true)
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
        return user
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
        const user = changeOpenIncident()

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

                const inc = await res.json()
                const resUpdate = await fetch(`http://localhost:3000/api/auth/signup/${userEmail}`, {
                    method: 'PUT',
                    body: JSON.stringify(user),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                writeSolution(inc)

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

        setNewIncidence((newIncidence) => ({ ...newIncidence, email: usuario?.email as string }))
        setIsLoading(false)

    }, [isLoading])

    return (
        <div className="grid grid-cols-1 pe-48">
            {isLoading || loading ? (
                <Loading />
            ) : (
                <>
                    {error400 && <Alerta400 description={"Se ha producido un error al procesar su solicitud. Por favor, recuerde que son necesarios todos los campos del formulario."} />}

                    <div className="relative z-0 flex flex-col w-2/5 mx-auto my-48 gap-2">
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
            )}
        </div>
    )
}
