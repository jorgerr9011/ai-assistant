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
      return(tit1.concat(usuario?.username as string))
    } else {
      return(tit1)
    }
  })


  useEffect(() => {

    //console.log(isLoading)
    //console.log(usuario)
    if (!isLoading && usuario != undefined) {
      setTitulo1("Good afternoon "+usuario?.username)
    }

  }, [isLoading])

  return (
    <div className="grid grid-cols-1 gap-2">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-1">
            <div className=''>
              {usuario != undefined ? (
                <Card title={"Good afternoon "+usuario?.username} text="Hope you can resolve your incidences!" />
              ): (
                <Card title={titulo1} text="Hope you can resolve your incidences!" />
              )}
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
      )}
    </div>
  );
}
