import Link from 'next/Link'

export default function Header() {

    return (
        <nav className="flex opacity-75 hover:opacity-100 max-h-12 my-6 items-center justify-between bg-blend-overlay p-1">
            <a href="/" className="px-8">
                <img className="w-32 h-32" src="/simbolo_udc.svg" alt="udc" />
            </a>
            <div className="flex flex-1 justify-center sm:items-stretch sm:justify-center">
                <Link href="/" className="text-black font-semibold px-4 py-2 rounded-lg mr-6 bg-pink-400">Home</Link>
                <Link href="/chat" className="text-black font-semibold px-4 py-2 transition-all rounded-lg hover:bg-pink-400">Chat</Link>
                <Link href="/dashboard" className="text-black font-semibold px-4 py-2 transition-all rounded-lg hover:bg-pink-400">Dashboard</Link>
            </div>

            <div className="flex justify-end sm:items-stretch sm:justify-end">
                <Link href="/login" className="text-black font-semibold px-4 py-2 transition-all rounded-lg mr-4 hover:bg-pink-400">Iniciar sesión</Link>
                <Link href="" className="text-black font-semibold px-4 py-2 transition-all rounded-lg mr-4 hover:bg-pink-400">Registrarse</Link>
            </div>
        </nav>
    );
}