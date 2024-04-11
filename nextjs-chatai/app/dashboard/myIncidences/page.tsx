import { connectDB } from '@/utils/db'
import Incidence from '@/models/Incidence'
import Incidencia from '@/app/components/incidence'

export default async function Myincidence() {

    async function getIncidences() {
        connectDB()
        const incidencias = await Incidence.find()

        return incidencias
    }

    const incidencias = await getIncidences()

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
                            <th className="py-2 px-4 text-left">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidencias.map((item : any) => (
                            <Incidencia key={item.id} incidencia={item}/>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
