'use client'

import { useState, useEffect } from "react";
import { useRouter } from 'next/router';

export default function Myincidence() {
    const [incidencia, setIncidencia] = useState(null);
    const router = useRouter();
    const { incidenceId } = router.query;

    useEffect(() => {
        // Verificar si estamos en el cliente antes de usar useRouter
        if (typeof window !== 'undefined') {
            const getIncidencia = async () => {
                try {
                    const res = await fetch(`http://localhost:3000/api/incidence/${incidenceId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    if (!res.ok) {
                        throw new Error('Failed to fetch incidence');
                    }
                    const data = await res.json();
                    setIncidencia(data);
                } catch (error) {
                    console.error('Error fetching incidence:', error);
                }
            };
            
            if (incidenceId) {
                getIncidencia();
            }
        }
    }, [incidenceId]);

    const handleDelete = async () => {
        if (window.confirm("¿Estas seguro de querer borrar esta incidencia?")) {
            try {
                const res = await fetch(`/api/incidence/${incidenceId}`, {
                    method: "DELETE",
                });
                if (!res.ok) {
                    throw new Error('Failed to delete incidence');
                }
                // Aquí podrías redireccionar o hacer algo después de borrar la incidencia
            } catch (error) {
                console.error('Error deleting incidence:', error);
            }
        }
    };

    return (
        <div className="grid grid-cols-1">
            {incidencia && (
                <a href="#" className="flex flex-col my-24 mx-24 items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <div className="flex flex-col justify-between p-4 leading-normal">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{incidencia.name}</h5>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{incidencia.description}</p>
                    </div>
                </a>
            )}
        </div>
    );
}
