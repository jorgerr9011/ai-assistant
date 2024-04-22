'use client'

//import Image from "next/image";
import Card from './components/card'

export default function Home() {

  return (
    <main>
      <div className="grid grid-cols-1 gap-2">
        <div className="grid grid-cols-1">
          <div className=''>
            <Card title="Good afternoon $user" text="Hope you can resolve your incidences!" />
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className=''>
            <Card title="Open tickets" text="10" />
          </div>

          <div className=''>
            <Card title="Completed tickets" text="10" />
          </div>
        </div>
      </div>
    </main>
  );
}
