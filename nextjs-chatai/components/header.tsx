'use client'

import { ObjectId } from 'mongoose';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link'
import { useState } from 'react';

/*
Si quisiera ejecutar lo mismo que con useSession en el lado
del servidor, tendría que usar la siguiente función
import { getServerSession } from 'next-auth';
*/

interface Usuario {
    _id: ObjectId; // Specify the _id property type
    email: string;
    password: string;
    username: string;
}

export default function Header() {

    const { data: session, status } = useSession()
    const [usuario, setUser] = useState("")
    const user = session?.user as Usuario
    
    return (
        <nav className="flex opacity-75 rounded max-h-12 py-10 items-center justify-between bg-blue-200 bg-blend-overlay p-1">
            <a href="/" className="px-8">
                <img className="w-32 h-32" src="/simbolo_udc.svg" alt="udc" />
            </a>
            <div className="flex flex-1 justify-center sm:items-stretch sm:justify-center">
                <Link href="/" className="text-black font-semibold px-4 py-2 rounded-lg mr-6 bg-pink-400">Home</Link>
                <Link href="/chat" className="text-black font-semibold px-4 py-2 transition-all rounded-lg hover:bg-pink-400">Chat</Link>
            </div>

            <div className="flex justify-end sm:items-stretch sm:justify-end">
                {
                    session ? (
                        <button onClick={ () => {
                            signOut()
                        }}
                            className="text-black font-semibold px-4 py-2 transition-all rounded-lg mr-4 hover:bg-pink-400">Cerrar sesión</button>
                    ) : (
                        <div>
                            <Link href="/login" className="text-black font-semibold px-4 py-2 transition-all rounded-lg mr-4 hover:bg-pink-400">Iniciar sesión</Link>
                            <Link href="/signup" className="text-black font-semibold px-4 py-2 transition-all rounded-lg mr-4 hover:bg-pink-400">Registrarse</Link>
                        </div>
                    )
                }
            </div>
        </nav>
    );
}