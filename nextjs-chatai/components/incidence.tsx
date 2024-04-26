import User from '@/models/User';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ObjectId } from 'mongoose';
import Loading from './loading';

interface Usuario {
    _id: ObjectId; // Specify the _id property type
    email: string;
    username: string;
    open_incidences_count: number;
    completed_incidences_count: number;
}

export default function Incidencia({ incidencia, user}: { incidencia: any, user: Usuario}) {
    
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
            <td className="py-2 px-4">{user.open_incidences_count}</td>
            <td className="py-2 px-4">{user.completed_incidences_count}</td>
        </tr>
    );
}