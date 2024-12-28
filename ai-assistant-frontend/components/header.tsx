"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Usuario } from "@/types/User";
import { DarkThemeIcon } from "./icons/themes/DarkThemeIcon";
import { LightThemeIcon } from "./icons/themes/LightThemeIcon";

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
              <DarkThemeIcon />
            ) : (
              <LightThemeIcon />
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
