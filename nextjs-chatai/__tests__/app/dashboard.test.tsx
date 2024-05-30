import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../../components/dashboard';

test('renders three Link components with appropriate text and classes', () => {
  render(<Dashboard />);

  const links = screen.getAllByRole('link');
  expect(links.length).toBe(3);

  expect(links[0]).toHaveTextContent('Mis incidencias');
  expect(links[0]).toHaveClass('text-black font-semibold rounded-lg bg-pink-400');

  expect(links[1]).toHaveTextContent('Crear incidencia');
  expect(links[1]).toHaveClass('text-black font-semibold rounded-lg bg-pink-400');

  expect(links[2]).toHaveTextContent('Todas las incidencias');
  expect(links[2]).toHaveClass('text-black font-semibold rounded-lg bg-pink-400');
});

test('links have correct href attributes', () => {
  render(<Dashboard />);

  const links = screen.getAllByRole('link');

  expect(links[0].getAttribute('href')).toBe('/myIncidences');
  expect(links[1].getAttribute('href')).toBe('/myIncidences/createIncidence');
  expect(links[2].getAttribute('href')).toBe('/myIncidences');
});
