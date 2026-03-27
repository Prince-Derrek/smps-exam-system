import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Student Portal header', () => {
  render(<App />);
  const linkElement = screen.getByText(/Student Portal/i);
  expect(linkElement).toBeInTheDocument();
});