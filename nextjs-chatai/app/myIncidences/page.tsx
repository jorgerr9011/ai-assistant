'use client'

import Incidence from '@/models/Incidence'
import Incidencia from '@/app/components/incidence'
import { useEffect, useState } from 'react'
import next from 'next'
import { fetchIncidences } from './fetchIncidences'


export default function Myincidence() {

    const { isLoading, listIncidences } = fetchIncidences()
    const [currentPage, setCurrentPage] = useState(0)
    const [inc, setIncidencias] = useState<typeof Incidence[]>(listIncidences)

    const nextPage = () => {
        setCurrentPage(currentPage + 5)
    }

    const previousPage = () => {
        if (currentPage > 0)
            setCurrentPage(currentPage - 5)
    }

    const filteredIncidences = (): typeof Incidence[] => {
        return listIncidences.slice(currentPage, currentPage + 5)
    }

    return (
        <div className="grid grid-cols-1">
            <div className="container mx-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-2 px-4 text-left">Nombre</th>
                            <th className="py-2 px-4 text-left">Descripción</th>
                            <th className="py-2 px-4 text-left">Estado</th>
                            <th className="py-2 px-4 text-left">Fecha creación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredIncidences().map((item: any) => (
                                <Incidencia key={item._id} incidencia={item} />
                            ))
                        }
                    </tbody>
                    {/*inc?.length > 0 ? (
                        <tbody>
                            {inc.map((item: any) => (
                                <Incidencia key={item.id} incidencia={item} />
                            ))}

                            {/*
                                incidencias.map( item => (
                                    <tr key={ item.id }>
                                        <td> {item.name} </td>
                                    </tr>
                                ))
                            */}
                    {/*</tbody>
                    ) : (
                        <p>Loading incidences...</p>
                    )}*/}
                </table>
                <p> {currentPage} </p>

                <button onClick={previousPage} className="button button-primary rounded-xl m-4 bg-slate-500">Anterior</button>

                <button onClick={nextPage} className="button button-primary rounded-xl m-4 bg-slate-500">Siguiente</button>
            </div>
        </div>
    )
}
