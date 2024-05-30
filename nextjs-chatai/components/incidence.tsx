import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Incidence({ incidence, onData }: any) {

    const router = useRouter()

    const handleClick = () => {

        if (incidence.status === 'OPEN') {

            router.push('/myIncidences/modifyIncidence/' + incidence._id)
        } else 
            onData(true)
    }

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
            <td className="py-2 px-4"><button onClick={handleClick}>editar</button></td>
        </tr>

    );
}