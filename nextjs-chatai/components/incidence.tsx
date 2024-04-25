import User from '@/models/User';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ObjectId } from 'mongoose';

interface Usuario {
    _id: ObjectId; // Specify the _id property type
    email: string;
    password: string;
    username: string;
    open_incidences_count: number;
    completed_incidences_count: number;
}

export default function Incidencia({ incidencia }: any ) {

    const router = useRouter()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/");
        },
    });

    const [usuario, setUsuario] = useState<Usuario>(session?.user as Usuario)

    /*useEffect(() => {

        if (session?.user != undefined) {
            setUsuario(session?.user as typeof User)
            console.log(usuario)
        }
    }, [])*/

    return (
        <tr>
            <td className="py-2 px-4">
                <Link href={`/incidence/${incidencia._id}`}>
                    {incidencia.name}
                </Link>
            </td>
            <td className="py-2 px-4">{incidencia.description}</td>
            <td className="py-2 px-4">{incidencia.status}</td>
            <td className="py-2 px-4">{new Date(incidencia.createdAt).toLocaleString()}</td>
            <td className="py-2 px-4">{usuario.open_incidences_count}</td>
        </tr>
    );
}