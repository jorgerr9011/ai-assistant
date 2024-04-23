'use client'

import Loading from '@/app/components/loading'
import Incidence from '@/models/Incidence'
import Incidencia from '@/app/components/incidence'
import React, { useState } from 'react'
import { fetchIncidences } from './fetchIncidences'

export default function Myincidence() {

    const { isLoading, listIncidences } = fetchIncidences()
    const [listaFiltrada, setListaFiltrada] = useState(listIncidences)
    const [currentPage, setCurrentPage] = useState(0)
    const [search, setSearch] = useState('')

    const nextPage = () => {
        if (search.length != 0 && listaFiltrada.length > currentPage + 5) {
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

        const filter = listIncidences.filter((inci: typeof Incidence) => inci.name.includes(search))
        setListaFiltrada(filter.slice(currentPage, currentPage + 5))

        return listaFiltrada
    }

    const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPage(0)
        setSearch(event.target.value)
    }

    return (
        <div className="grid grid-cols-1">
            {isLoading == false ? (
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

                        <tbody>
                            {filteredIncidences().map((item: any) => (
                                <Incidencia key={item._id} incidencia={item} />
                            ))}
                        </tbody>

                    </table>

                    <button onClick={previousPage} className="button button-primary rounded-xl m-4 bg-slate-500">Anterior</button>
                    <label> {currentPage} </label>
                    <button onClick={nextPage} className="button button-primary rounded-xl m-4 bg-slate-500">Siguiente</button>
                </div>
            ) : (
                <Loading />
            )
            }
        </div >
    )
}
