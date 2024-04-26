'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from 'next/navigation'; // Usamos next/router en lugar de next/navigation
import Loading from '@/components/loading'
import { useSession } from "next-auth/react";
import { Usuario } from '@/types/User'
import { ObjectId } from "mongoose";

export default function Myincidence() {

    const router = useRouter()
    const params = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [incidencia, setIncidencia] = useState({
        name: "",
        description: "",
        status: "",
        solution: "",
        email: ""
    });

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

    const incidenciaId = params.incidenceId

    const changeOpenIncident = () => {
        let user = usuario
        user.open_incidences_count = user.open_incidences_count-1
        setUsuario(user)
    } 

    const handleDelete = async () => {
        if (window.confirm("¿Estas seguro de querer borrar esta incidencia?")) {
            const res = await fetch(`/api/incidence/${incidenciaId}`, {
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

                router.push('/myIncidences')
                router.refresh()
            }
        }
    };

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

        const getIncidencia = async () => {

            const res = await fetch(`http://localhost:3000/api/incidence/${incidenciaId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const incidence = await res.json();
            setIncidencia({
                ['name']: incidence.name,
                ['description']: incidence.description,
                ['status']: incidence.status,
                ['solution']: incidence.solution,
                ['email']: incidence.email
            })
        };
        
        getUser()
        getIncidencia()
        setIsLoading(false)

    }, []);

    return (
        <div className="">
            {
                isLoading == true ? (
                    <Loading />
                ) : (
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
                )
            }
        </div>
    );
}
