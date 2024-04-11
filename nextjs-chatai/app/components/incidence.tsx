import Link from 'next/link';

export default function Incidencia({ incidencia }: any) {

    return (
        <tr>
            <td className="py-2 px-4">
                <Link href={`/dashboard/incidence/${incidencia._id}`}>
                    {incidencia.name}
                </Link>
            </td>
            <td className="py-2 px-4">{incidencia.description}</td>
            <td className="py-2 px-4">{incidencia.status}</td>
            <td className="py-2 px-4">{new Date(incidencia.createdAt).toLocaleString()}</td>
        </tr>
    );
}