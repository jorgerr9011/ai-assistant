import Link from 'next/link';

export default function Incidence({ incidence }: any) {
    
    return (
        <tr>
            <td className="py-2 px-4">
                <Link href={`/myIncidences/${incidence._id}`}>
                    {incidence.name}
                </Link>
            </td>
            <td className="py-2 px-4">{incidence.description}</td>
            <td className="py-2 px-4">{incidence.status}</td>
            <td className="py-2 px-4">{new Date(incidence.createdAt).toLocaleString()}</td>
            <td className="py-2 px-4"><Link href="/myIncidences/modifyIncidence">editar</Link></td>
        </tr>
    );
}