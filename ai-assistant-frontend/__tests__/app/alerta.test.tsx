import React from 'react';
import { act, render, screen } from '@testing-library/react';
import Alerta400 from '../../components/alerta'; 

test('renders alert content when visible is true', () => {
  render(<Alerta400 />);

  const alertTitle = screen.getByText('Error 400: Bad Request');
  expect(alertTitle).toBeInTheDocument();
});

test('renders error message and close button', () => {
  render(<Alerta400 />);

  const errorMessage = screen.getByText('Se ha producido un error al procesar su solicitud. Por favor, revise los datos enviados e inténtelo de nuevo.');
  const closeButton = screen.getByText('Cerrar');

  expect(errorMessage).toBeInTheDocument();
  expect(closeButton).toBeInTheDocument();
});

// Este test requiere modificar el componente
test('hides alert when cerrarAlerta is called', () => {

  jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
  const { rerender } = render(<Alerta400 />);

  const closeButton = screen.getByText('Cerrar');
  
  act(() => {
    closeButton.click();
  })

  rerender(<Alerta400 />);

  const errorText = screen.queryByText('Error 400: Bad Request'); 
  expect(errorText).toBeNull();
});
