'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from 'next/navigation';
import Loading from '@/components/loading'
import { useUser } from "@/app/hooks/useUser";
import { useIncidence } from "@/app/hooks/useIncidence";

export default function Incidence() {

    const router = useRouter()
    const { usuario, isLoading } = useUser()
    const params = useParams()
    const {incidencia, isloading} = useIncidence({params})

    const changeOpenIncident = () => {
        let user = usuario
        user.open_incidences_count = user.open_incidences_count - 1
        return user
    }

    const handleDelete = async () => {
        if (window.confirm("¿Estas seguro de querer borrar esta incidencia?")) {
            const res = await fetch(`/api/incidence/${params.incidenceId}`, {
                method: "DELETE",
            });

            if (res.status === 200) {

                const user = changeOpenIncident()
                const resUpdate = await fetch(`http://localhost:3000/api/auth/signup/${user.email}`, {
                    method: 'PUT',
                    body: JSON.stringify(user),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                router.push('/myIncidences')
                router.refresh()
            }
        }
    };

    return (
        <>
            {
                isLoading || isloading ? (
                    <Loading />
                ) : (
                    <div className="grid grid-cols-2">
                        <div className="flex flex-col">
                            <a href="#" className="my-24 mx-24 w-6/12 items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <div className="p-4 leading-normal">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{incidencia.name}</h5>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{incidencia.email}</p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{incidencia.description}</p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{incidencia.status}</p>
                                </div>
                            </a>
                            <div className="flex-flex-col mx-auto">
                                <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Eliminar</button>
                            </div>
                        </div>
                        <div className="flex flex-col my-24 w-full">
                            <a href="#" className="items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <div className="p-4 leading-normal">
                                    <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Solución:</h1>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{incidencia.solution}</p>
                                </div>
                            </a>
                            
                        </div>
                    </div>
                )
            }
        </>
    );
}
