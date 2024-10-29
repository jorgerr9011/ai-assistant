import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from '../../components/card'; 

test('renders title and text props correctly', () => {
  const title = 'My Card Title';
  const text = 'This is some card content.';

  render(<Card title={title} text={text} />);

  const cardTitle = screen.getByText(title);
  const cardText = screen.getByText(text);

  expect(cardTitle).toBeInTheDocument();
  expect(cardText).toBeInTheDocument();
});

test('renders with appropriate classes', () => {
  const title = 'My Card Title';
  const text = 'This is some card content.';

  render(<Card title={title} text={text} />);

  const card = screen.getByRole('link');

  expect(card).toHaveClass('flex flex-col my-24 mx-24 items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700');
});
