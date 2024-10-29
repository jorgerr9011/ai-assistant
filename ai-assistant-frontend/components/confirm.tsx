import React, { useState } from 'react';

export default function ConfirmDialog({ message, onConfirm, onCancel }: any) {

    const [visible, setVisible] = useState(true);

    return (
        <>
            {visible && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-gray-400 rounded-lg shadow-md p-8">
                        <p className='mb-6'>{message}</p>
                        <div className="flex justify-end">
                            <button onClick={onCancel} className="bg-gray-400 hover:bg-gray-500 rounded-md px-4 py-2 mr-2">
                                Cancelar
                            </button>
                            <button onClick={onConfirm} className="bg-blue-500 hover:bg-blue-700 text-black rounded-md px-4 py-2">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
