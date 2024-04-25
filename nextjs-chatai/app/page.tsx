'use client'

//import Image from "next/image";
import Card from '@/components/card'
import { ObjectId } from 'mongoose';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'

interface Usuario {
  _id: ObjectId; // Specify the _id property type
  email: string;
  password: string;
  username: string;
  open_incidences_count: number;
  completed_incidences_count: number;
}

export default function Home() {

  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });
  const [usuario, setUsuario] = useState<Usuario>(session?.user as Usuario)

  const title1 = "Good afternoon"

  console.log(usuario)
  if (session) {
    title1.concat(usuario?.username as string)
  }

  useEffect(() => {

    setUsuario(session?.user as Usuario)
  }, [])

  return (
    <main>
      <div className="grid grid-cols-1 gap-2">
        <div className="grid grid-cols-1">
          <div className=''>
            <Card title={title1} text="Hope you can resolve your incidences!" />
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
      </div>
    </main>
  );
}
