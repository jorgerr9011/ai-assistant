'use client'

import { useRouter } from 'next/router'; // Usamos next/router en lugar de next/navigation

export default function Myincidence() {
    const router = useRouter();
    const { incidenceId } = router.query;

    const getIncidencia = async () => {
        const res = await fetch(`http://localhost:3000/api/incidence/${incidenceId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        return await res.json();
    };

    const handleDelete = async () => {
        if (window.confirm("¿Estas seguro de querer borrar esta incidencia?")) {
            const res = await fetch(`/api/incidence/${incidenceId}`, {
                method: "DELETE",
            });
        }
    };

    const [incidencia, setIncidencia] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getIncidencia();
            setIncidencia(data);
        };

        if (incidenceId) {
            fetchData();
        }
    }, [incidenceId]);

    if (!incidencia) {
        return <p>Loading...</p>;
    }

    return (
        <div className="grid grid-cols-1">
            <a href="#" className="flex flex-col my-24 mx-24 items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
                <div className="flex flex-col justify-between p-4 leading-normal">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{incidencia.name}</h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{incidencia.description}</p>
                </div>
            </a>
        </div>
    );
}
