import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Incidence({ incidence, onData }: any) {

    const router = useRouter()

    const handleClickEdit = () => {

        if (incidence.status === 'OPEN') {

            router.push('/myIncidences/modifyIncidence/' + incidence._id)
        } else
            onData(true)
    }

    const handleClickShow = () => {

        router.push(`/myIncidences/${incidence._id}`)
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
            <td className="py-2 px-4">
                <div className='flex flex-row gap-2'>
                    <button onClick={handleClickEdit}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                    </button>
                    <button onClick={handleClickShow}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                        </svg>
                    </button>
                </div>
            </td>
        </tr>

    );
}