import React, { useState } from 'react';

export default function Alerta400({ description }: any) {
  const [visible, setVisible] = useState(true);

  const cerrarAlerta = () => {
    setVisible(false);
  };

  return (
    <>
      {visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div id="alerta-400" className="bg-red-100 border-red-400 border-l-4 p-4 text-red-700 rounded-lg shadow-md max-w-lg w-full mx-4" role="alert">
            <h3 className="font-bold text-lg">Error 400: Bad Request</h3>
            <p>{description}</p>
            <button type="button" className="mt-3 text-red-700 hover:text-red-900 focus:ring-red-400 focus:outline-none" onClick={cerrarAlerta}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
