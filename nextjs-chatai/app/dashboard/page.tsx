'use client'
import Link from 'next/link'
import Card from '../components/card'

export default function Dashboard() {
    return (
        <div className="grid grid-cols-2 gap-2">
            <div>
                <Card title="¿Para que sirve la plataforma AxudaIA?" text="Este es un portal para ayuda a los servicios telemáticos de la UDC.
		        Destinado para toda la comunidad universitaria y para los futuros miembros. Además, ¡cuenta con ayuda de una IA generativa!" />    
            </div>
            <div>
                <table className="border-collapse border bg-gray-400 border-slate-500 my-24">
                    <thead>
                        <tr>
                            <th className="border border-slate-600">Incidencia</th>
                            <th className="border border-slate-600">Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td className="border border-slate-700 ...">Indiana</td>
                        <td className="border border-slate-700 ...">Indianapolis</td>
                        </tr>
                        <tr>
                        <td className="border border-slate-700 ...">Ohio</td>
                        <td className="border border-slate-700 ...">Columbus</td>
                        </tr>
                        <tr>
                        <td className="border border-slate-700 ...">Michigan</td>
                        <td className="border border-slate-700 ...">Detroit</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
};