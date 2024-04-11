'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from 'next/navigation'; // Usamos next/router en lugar de next/navigation


export default function Myincidence() {

    const [incidencia, setIncidencia] = useState({
        name: "",
        description: "",
        status: "OPEN"
    });

    const router = useRouter()
    const params = useParams()
    const incidenciaId = params.incidenceId

    const handleDelete = async () => {
        if (window.confirm("¿Estas seguro de querer borrar esta incidencia?")) {
            const res = await fetch(`/api/incidence/${incidenciaId}`, {
                method: "DELETE",
            });

            router.push('/dashboard/myIncidences')
            router.refresh()
        }
    };

    useEffect(() => {

        const getIncidencia = async () => {
            console.log(incidenciaId)

            const res = await fetch(`http://localhost:3000/api/incidence/${incidenciaId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const incidence = await res.json();

            console.log(incidence)
            setIncidencia({
                ['name']: incidence.name,
                ['description']: incidence.description,
                ['status']: incidence.status
            })
        };

        getIncidencia()

    }, []);

    /*if (!incidencia) {
        return <p>Loading...</p>;
    }*/               

    return (
        <div className="grid grid-cols-1">
            <div className="flex flex-col">
                <a href="#" className="flex flex-col my-24 mx-24 items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <div className="flex flex-col justify-between p-4 leading-normal">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{incidencia.name}</h5>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{incidencia.description}</p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{incidencia.status}</p>
                    </div>
                </a>
                <div className="flex-flex-col mx-auto">
                    <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Eliminar</button>
                </div>
            </div>
        </div>
    );
}
