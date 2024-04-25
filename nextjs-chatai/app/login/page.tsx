'use client'

import { FormEvent, useState } from 'react'
import User from '@/models/User'
import Alerta400 from "@/components/alerta";
import { signIn } from 'next-auth/react'
import { ObjectId } from 'mongoose';
import { useRouter } from 'next/navigation'

interface Usuario {
    email: string;
    password: string;
    username: string;
    _id: ObjectId; // Specify the _id property type
}

export default function Login() {

    const [error400, setError400] = useState(false);
    const router = useRouter()

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        // Una vez que estemos registrados, la intención es que se te loggee directamente
        // La siguiente respuesta va a ser de la api de NextAuth autenticando al usuario
        const resNextAuth = await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false,
        })

        //if (resNextAuth?.status === 400) {
        if (resNextAuth?.error) {
            setError400(true)
            setTimeout(() => {
                setError400(false);
            }, 5000); // Ocultar la alerta después de 5 segundos
        }

        // La interrogación es un gran recurso en caso de que queramos indicar
        // que el valor puede llegar o contrariamente, llega un undefined 
        if (resNextAuth?.ok) {
            return router.push('/')
        }
    }

    return (
        <div className="grid grid-cols-1 pe-48">

            {
                error400 && <Alerta400 />
            }

            <div className="flex items-center mt-32">
                <div className="container mx-auto">
                    <div className="max-w-md mx-auto my-10">
                        <div className="text-center">
                            <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-black-200">Sign in</h1>
                            <p className="text-gray-500 dark:text-black-400">Login with your account</p>
                        </div>
                        <div className="m-7">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label className="block mb-2 text-sm text-gray-600 light:text-gray-400">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="you@company.com"
                                        className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 light:bg-gray-700 dark:text-black dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                                    />
                                </div>
                                <div className="mb-6">
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm text-gray-600 light:text-gray-400">Password</label>
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="*********"
                                        className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 light:bg-gray-700 dark:text-black dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                                    />

                                    <p className="mt-4 text-sm text-center text-gray-400">Don&#x27;t have an account yet? <a href="#!" className="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-500 dark:focus:border-indigo-800">Sign up</a>.</p>

                                </div>
                                <div className="mb-6">
                                    <button type="submit" className="w-full px-3 py-4 text-white bg-indigo-400 rounded-md focus:bg-indigo-600 focus:outline-none">Sign in</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
