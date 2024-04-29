'use client'

import Card from '@/components/card'
import { useEffect, useState } from 'react';
import Loading from '@/components/loading';
import { useUser } from '@/app/hooks/useUser'

export default function Home() {

  const { usuario, isLoading } = useUser()
  const [titulo1, setTitulo1] = useState<string>(() => {

    const tit1 = ("Good afternoon ")

    if (!isLoading) {
      console.log("entro en algun momento?")
      return (tit1.concat(usuario?.username as string))
    } else {
      return (tit1)
    }
  })

  useEffect(() => {

    if (usuario != undefined) {
      setTitulo1("Good afternoon " + usuario?.username)
    }

  }, [isLoading, usuario?.username])

  return (
    <div className="grid grid-cols-1 gap-2">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-1">
              <Card title={titulo1} text="Hope you can resolve your incidences!" /> 
          </div>
          <div className="grid grid-cols-2">
              <Card title="Open tickets" text={usuario?.open_incidences_count as unknown as string} />      
              <Card title="Closed tickets" text={usuario?.closed_incidences_count as unknown as string} />
          </div>
        </>
      )}
    </div>
  );
}
