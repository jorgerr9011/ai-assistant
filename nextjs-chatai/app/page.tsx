'use client'

//import Image from "next/image";
import Card from './components/card'

export default function Home() {

  return (
    <main>
      <div>
        <Card title="¿Para que sirve la plataforma AxudaIA?" text="Este es un portal para ayuda a los servicios telemáticos de la UDC. \
		    Destinado para toda la comunidad universitaria y para los futuros miembros. Además, ¡cuenta con ayuda de una IA generativa!" />
        <Card title="¿Como notifico una incidencia?" text="Para notificar una incidencia, tienes que dirigirte al apartado 'incidencias' y \
		    dentro añadir un nuevo 'ticket para gestionarla." />
      </div>
    </main >
  );
}
