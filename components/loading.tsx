import React, { useState } from 'react';

export default function Loading() {
  const [visible, setVisible] = useState(true);

  const cerrarAlerta = () => {
    setVisible(false);
  };

  return (
    <div className='mx-48 max-h-1'>
      {visible && (
        <div id="alerta-400" className="bg-red-100 border-blue-400 border-l-4 p-4 text-blue-700 rounded-lg shadow-md" role="alert">
          <h3 className="font-bold text-lg">Loading</h3>
          <p>Cargando datos. Por favor, espere un momento.</p>
          <button type="button" className="mt-3 text-blue-700 hover:text-blue-900 focus:ring-blue-400 focus:outline-none" onClick={cerrarAlerta}>
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};