'use client'

import Loading from '@/components/loading'
import { Incidencia } from '@/types/Incidence'
import Incidence from '@/components/incidence'
import React, { useEffect, useState } from 'react'
import { useIncidences } from '../app/hooks/useIncidences'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ObjectId } from 'mongoose'
import { Usuario } from '@/types/User'
import Select from 'react-select'
import { getOrder } from '@/lib/order'

export default function ShowIncidences({ allIncidences }: { allIncidences: boolean }) {

    const router = useRouter()
    const { isLoading, listIncidences } = useIncidences({ allIncidences })
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
    const [elementOrder, setElementOrder] = useState<string>("createdAt")
    const [order, setOrder] = useState<string>("ascendente")
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
        closed_incidences_count: 0,
        chat_history: []
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

    const filteredIncidences = (): Incidencia[] => {

        let listInc: Incidencia[] = listIncidences
        listInc = getOrder(listInc, order, elementOrder)

        if (selectedStatus !== "null") {
            listInc = listInc.filter((inci: Incidencia) => inci.status.includes(selectedStatus ? selectedStatus : ""))
        }

        if (search.length === 0) {
            return listInc.slice(currentPage, currentPage + 5)
        }

        listInc = listInc.filter((inci) => inci.name.includes(search))
        return listInc.slice(currentPage, currentPage + 5)
    }

    const handleStatusFilterChange = (selectedOption: { value: string } | any) => {
        setCurrentPage(0)
        setSelectedStatus(selectedOption.value)
    }

    const handleElementFilterChange = (selectedOption: { value: string } | any) => {
        setCurrentPage(0)
        setElementOrder(selectedOption.value)
    }

    const handleOrderFilter = (selectedOption: { value: string } | any) => {
        setCurrentPage(0)
        setOrder(selectedOption.value)
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

    const statusOptions = [
        { value: null, label: 'Cualquier incidencia' },
        { value: 'OPEN', label: 'Abiertas' },
        { value: 'CLOSED', label: 'Cerradas' },
    ]

    const orderOptions = [
        { value: 'createdAt', label: 'Fecha creación' },
        { value: 'name', label: 'Nombre incidencia' },
        { value: 'status', label: 'Estado' },
    ]

    return (
        <div className="grid grid-cols-1">
            {isLoading === false && loading === false ? (
                <div className="container mx-auto">
                    <div className='flex flex-col gap-2 py-2'>
                        <input
                            type="text"
                            className="pl-4 form-control rounded-md text-black flex-grow w-5/12 border border-gray-400 focus:border-red-400"
                            placeholder='Búsqueda de incidencia'
                            value={search}
                            onChange={onSearchChange} />

                        <div className='flex flex-row items-start'>

                            <div className='flex flex-col w-3/12'>
                                <label className='px-2'>Ordenación:</label>
                                <select className='pl-4 py-2' id="ordenamiento" onChange={handleOrderFilter}>
                                    <option value="ascendente">Ascendente</option>
                                    <option value="descendente">Descendente</option>
                                </select>
                            </div>

                            <div className='flex flex-col w-4/12 pl-4'>
                                <label className='px-2'>Filtrar por:</label>
                                <Select
                                    id="orderFilter"
                                    className="block text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    options={orderOptions}
                                    onChange={handleElementFilterChange}
                                    defaultValue={orderOptions[0]}
                                />
                            </div>

                            <div className='flex flex-col w-4/12 pl-4'>
                                <label className='px-2'>Filtrar por estado:</label>
                                <Select
                                    id="statusFilter"
                                    className="block text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    options={statusOptions}
                                    onChange={handleStatusFilterChange}
                                    defaultValue={statusOptions[0]}
                                />
                            </div>
                        </div>
                    </div>

                    <table className="my-4 min-w-full bg-white shadow-md rounded-lg overflow-hidden">
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
                                {filteredIncidences().map((item: Incidencia) => (
                                    <Incidence key={item._id} incidence={item} />
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
