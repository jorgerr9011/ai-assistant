import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Incidence({ incidence }: any) {
    
    const router = useRouter()

    const handleClick = () => {
        
        if (incidence.status === 'OPEN') {

            router.push('/myIncidences/modifyIncidence/'+incidence._id)
        }
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
            <td className="py-2 px-4"><a href='' onClick={handleClick}>editar</a></td>
        </tr>
    );
}