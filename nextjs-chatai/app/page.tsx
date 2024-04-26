'use client'

//import Image from "next/image";
import Card from '@/components/card'
import { ObjectId } from 'mongoose';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import Loading from '@/components/loading';
import { Usuario } from '@/types/User'

export default function Home() {

  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });
  const [isLoading, setIsLoading] = useState(true)
  const [usuario, setUsuario] = useState<Usuario>({
    _id: 0 as unknown as ObjectId, // Specify the _id property type
    email: "",
    username: "",
    open_incidences_count: 0,
    completed_incidences_count: 0,
  })
  const [titulo1, setTitulo1] = useState("Good afternoon ")

  useEffect(() => {

    const getUser = async () => {

      const email = session?.user?.email
      const resUpdate = await fetch(`http://localhost:3000/api/auth/signup/${email}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        }
      })

      const user = await resUpdate.json()
      if (user != null) {
        setTitulo1("Good afternoon "+user.username)
        setUsuario(user)
      }
    }

    getUser()
    setIsLoading(false)
    //setUsuario(session?.user as Usuario)

  }, [status])

  return (
    <div className="grid grid-cols-1 gap-2">
      {isLoading === false ? (
        <>
          <div className="grid grid-cols-1">
            <div className=''>
              <Card title={titulo1} text="Hope you can resolve your incidences!" />
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className=''>
              <Card title="Open tickets" text={usuario?.open_incidences_count as unknown as string} />
            </div>

            <div className=''>
              <Card title="Completed tickets" text={usuario?.completed_incidences_count as unknown as string} />
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}
