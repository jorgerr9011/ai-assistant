import React from 'react';
import { act, render, screen } from '@testing-library/react';
import Loading from '../../components/loading'; // Assuming your component path

test('renders loading alert initially', () => {
  render(<Loading />);

  const loadingText = screen.getByText('Loading');
  expect(loadingText).toBeInTheDocument();
});

test('renders loading message and close button', () => {
    render(<Loading />);
  
    const loadingMessage = screen.getByText('Cargando datos. Por favor, espere un momento.');
    const closeButton = screen.getByText('Cerrar');
  
    expect(loadingMessage).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

// This test requires modifying the component or mocking the function
test('hides loading alert when cerrarAlerta is called', () => {
    // Option 1: Mock setVisible (requires mocking library)
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    const { rerender } = render(<Loading />);
  
    const closeButton = screen.getByText('Cerrar');
    
    act(() => {
      closeButton.click();
    })
    
  
    // Simulate state update
    rerender(<Loading />);
  
    const loadingText = screen.queryByText('Loading'); // Use queryByText for potentially hidden elements
    expect(loadingText).toBeNull();
  
    // Option 2: Modify component to directly set visible to false
    // (would require adjusting the component itself)
    // render(<Loading visible={false} />);
    // ... assertions for hidden state
});
  