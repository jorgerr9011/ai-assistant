'use client'
import Link from 'next/link'

export default function Dashboard() {
    return (
        <div className="col-span-1 rounded gap-4 max-h-max h-screen opacity-75 bg-blue-200">

            <div className="flex flex-col justify-center sm:justify-center my-24 h-32 gap-12">
                <div className="flex flex-1 justify-center sm:justify-center h-16">
                    <Link href="/chat/#" className="text-black font-semibold rounded-lg hover:bg-pink-400">Nuevo chat</Link>
                </div>
                <div className="flex flex-1 justify-center sm:justify-center align-center h-12">
                    <Link href="/chat/#" className="text-black font-semibold rounded-lg hover:bg-pink-400">Mis chats</Link>
                </div>
            </div>
        </div>
    )
};