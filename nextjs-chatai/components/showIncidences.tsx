'use client'

import Loading from '@/components/loading'
import Incidence from '@/models/Incidence'
import Incidencia from '@/components/incidence'
import React, { useEffect, useState } from 'react'
import { useIncidences } from '../app/hooks/useIncidences'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ObjectId } from 'mongoose'
import { Usuario } from '@/types/User'

export default function ShowIncidences({allIncidences}: {allIncidences: boolean}) {

    const router = useRouter()
    const { isLoading, listIncidences } = useIncidences({allIncidences})
    const [currentPage, setCurrentPage] = useState(0)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/");
        },
    });
    const [usuario, setUsuario] = useState<Usuario>({
        _id: 0 as unknown as ObjectId, // Specify the _id property type
        email: "",
        username: "",
        open_incidences_count: 0,
        completed_incidences_count: 0,
    })

    const changeOpenIncident = () => {
        let user = usuario
        user.open_incidences_count = 0
        setUsuario(user)
    } 

    const handleDelete = async () => {
        if (window.confirm("¿Estas seguro de querer borrar esta incidencia?")) {
            const res = await fetch('/api/incidence', {
                method: "DELETE",
            });

            if (res.status === 200) {
                changeOpenIncident()
                const resUpdate = await fetch(`http://localhost:3000/api/auth/signup/${usuario.email}`, {
                    method: 'PUT',
                    body: JSON.stringify(usuario),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                router.push('/')
                router.refresh()
            }
        }
    }

    const nextPage = () => {
        if (search.length != 0 && listIncidences.length > currentPage + 5) {
            setCurrentPage(currentPage + 5)
        } else if (listIncidences.length > currentPage + 5) {
            setCurrentPage(currentPage + 5)
        }
    }

    const previousPage = () => {
        if (currentPage > 0)
            setCurrentPage(currentPage - 5)
    }

    const filteredIncidences = (): typeof Incidence[] => {
        if (search.length === 0) {
            return listIncidences.slice(currentPage, currentPage + 5)
        }

        return listIncidences.filter((inci: typeof Incidence) => inci.name.includes(search))
    }

    const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPage(0)
        setSearch(event.target.value)
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
            setUsuario(user as Usuario)
        }
        getUser()
        setLoading(false)

    }, [status])

    return (
        <div className="grid grid-cols-1">
            {isLoading === false && loading === false ? (
                <div className="container mx-auto">
                    <input
                        type="text"
                        className="mb-5 form-control rounded-md text-black flex-grow w-5/12 border border-gray-400 focus:border-red-400"
                        placeholder='Búsqueda de incidencia'
                        value={search}
                        onChange={onSearchChange} /><table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="py-2 px-4 text-left">Nombre</th>
                                <th className="py-2 px-4 text-left">Descripción</th>
                                <th className="py-2 px-4 text-left">Estado</th>
                                <th className="py-2 px-4 text-left">Fecha creación</th>
                            </tr>
                        </thead>

                        {usuario != undefined ? (
                            <tbody>
                                {filteredIncidences().map((item: any) => (
                                    <Incidencia key={item._id} incidencia={item}/>
                                ))}
                            </tbody>
                        ) : (
                            <></>
                        )}

                    </table>

                    <button onClick={previousPage} className="button button-primary rounded-xl m-4 bg-slate-500">Anterior</button>
                    <label> {currentPage} </label>
                    <button onClick={nextPage} className="button button-primary rounded-xl m-4 bg-slate-500">Siguiente</button>

                    <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Eliminar</button>

                </div>
            ) : (
                <Loading />
            )
            }
        </div >
    )
}
