import Link from 'next/link';
import { Usuario } from '@/types/User'

export default function Incidencia({ incidencia, user}: { incidencia: any, user: Usuario}) {
    
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
            <td className="py-2 px-4">{user.open_incidences_count}</td>
            <td className="py-2 px-4">{user.completed_incidences_count}</td>
        </tr>
    );
}