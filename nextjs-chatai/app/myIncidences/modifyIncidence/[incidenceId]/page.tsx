'use client'

import { useUser } from "@/app/hooks/useUser";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Alerta400 from "@/components/alerta";
import Loading from "@/components/loading";
import { useIncidence } from "@/app/hooks/useIncidence";

export default function ModifyIncidence() {

    const [error400, setError400] = useState(false);
    const {usuario, isLoading} = useUser()
    //const [loading, setIsLoading] = useState(true)
    const params = useParams()
    const router = useRouter()

    const {incidencia, isloading} = useIncidence({params})
    const [modifiedIncidence, setModifiedIncidence] = useState({
        name: incidencia.name,
        description: incidencia.description,
        status: incidencia.status,
        solution: incidencia.solution,
        email: incidencia.email
    })

    const handleSubmit = async (event: FormEvent) => {

        event.preventDefault()

        try {
            const res = await fetch('/api/incidence/'+params.incidenceId, {
                method: 'PUT',
                body: JSON.stringify(modifiedIncidence),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (res.status === 200) {

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

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setModifiedIncidence({ ...modifiedIncidence, [e.target.name]: e.target.value })
    }

    return (
        <div className="grid grid-cols-1 pe-48">
            {/*{isLoading || loading ? (*/}
            { isLoading ? (
                <Loading />
            ) : (
                <>
                    {error400 && <Alerta400 />}
                    <div className="flex flex-col w-2/5 mx-auto my-48 gap-2">
                        <form onSubmit={handleSubmit}>
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-4 mb-4">Nombre</label>
                            <input 
                                defaultValue={incidencia.name} 
                                onChange={handleChange} 
                                name="name" 
                                type="text" 
                                className="pl-4 rounded-md flex-grow w-full border border-gray-400 focus:border-red-400"
                            />
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-4 mb-4">Detalles</label>
                            <textarea 
                                defaultValue={incidencia.description} 
                                onChange={handleChange} 
                                name="description" 
                                className=" no-resize appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-48 resize-none" id="message"
                            />
                            <div className="flex flex-row justify-end">
                                <div className="flex justify-end">
                                    <button type="reset" className="ml-4 px-4 rounded-black border-black border rounded-md bg-red-400 text-white hover:bg-red-600 transition-all ease-in-out">Restore values</button>
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" className="ml-4 px-4 rounded-black border-black border rounded-md bg-red-400 text-white hover:bg-red-600 transition-all ease-in-out">Send request</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    )
}
