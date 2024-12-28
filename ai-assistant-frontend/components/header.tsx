"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Usuario } from "@/types/User";

export default function Header() {
  const { data: session, status } = useSession();
  //const [usuario, setUser] = useState("")
  const user = session?.user as Usuario;

  const light =
    "absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]";
  const dark =
    "absolute top-0 z-[-2] h-screen w-screen bg-slate-600 bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]";
  const [theme, setTheme] = useState<string>(light);

  const handleTheme = () => {
    setTheme(theme === light ? dark : light);
  };

  return (
    <>
      <div className={theme}></div>
      <nav className="flex opacity-75 rounded max-h-12 py-10 items-center justify-between bg-blue-200 bg-blend-overlay p-1">
        <a href="/" className="px-8">
          <img className="w-32 h-32" src="/simbolo_udc.svg" alt="udc" />
        </a>
        <div className="flex flex-1 justify-center sm:items-stretch sm:justify-center">
          <Link
            href="/"
            className="text-black font-semibold px-4 py-2 rounded-lg mr-6 bg-pink-400"
          >
            Home
          </Link>
          <Link
            href="/chat"
            className="text-black font-semibold px-4 py-2 transition-all rounded-lg hover:bg-pink-400"
          >
            Chat
          </Link>
          <button onClick={handleTheme} className="px-4 py-2 transition hover:scale-110">
            {theme === light ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="flex justify-end sm:items-stretch sm:justify-end">
          {session ? (
            <button
              onClick={() => {
                signOut();
              }}
              className="text-black font-semibold px-4 py-2 transition-all rounded-lg mr-4 hover:bg-pink-400"
            >
              Cerrar sesión
            </button>
          ) : (
            <div>
              <Link
                href="/login"
                className="text-black font-semibold px-4 py-2 transition-all rounded-lg mr-4 hover:bg-pink-400"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/signup"
                className="text-black font-semibold px-4 py-2 transition-all rounded-lg mr-4 hover:bg-pink-400"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
