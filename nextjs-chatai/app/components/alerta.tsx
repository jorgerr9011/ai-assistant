import React, { useState } from 'react';

export default function Alerta400() {
  const [visible, setVisible] = useState(true);

  const cerrarAlerta = () => {
    setVisible(false);
  };

  return (
    <div className='mx-auto max-h-1'>
      {visible && (
        <div id="alerta-400" className="bg-red-100 border-red-400 border-l-4 p-4 text-red-700 rounded-lg shadow-md" role="alert">
          <h3 className="font-bold text-lg">Error 400: Bad Request</h3>
          <p>Se ha producido un error al procesar su solicitud. Por favor, revise los datos enviados e inténtelo de nuevo.</p>
          <button type="button" className="mt-3 text-red-700 hover:text-red-900 focus:ring-red-400 focus:outline-none" onClick={cerrarAlerta}>
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};