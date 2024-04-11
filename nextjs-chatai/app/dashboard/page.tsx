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
            
        </div>
    )
};