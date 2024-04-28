import Link from 'next/link';
import { Usuario } from '@/types/User'

export default function Incidencia({ incidencia}: any) {
    
    return (
        <tr>
            <td className="py-2 px-4">
                <Link href={`/myIncidences/${incidencia._id}`}>
                    {incidencia.name}
                </Link>
            </td>
            <td className="py-2 px-4">{incidencia.description}</td>
            <td className="py-2 px-4">{incidencia.status}</td>
            <td className="py-2 px-4">{new Date(incidencia.createdAt).toLocaleString()}</td>
        </tr>
    );
}